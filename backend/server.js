const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper de Sleep para Backoff Exponencial
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Sidarta Pages Backend API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Função utilitária para chamada resiliente ao Google Gemini API
 * Trata chaves AIzaSy e AQ..., retries em 429, fallbacks de modelos e mapeamento de erros HTTP.
 */
async function callGeminiResilient({ apiKey, prompt, systemPrompt, requestedModel }) {
  // Lista dos modelos mantidos e ativos pelo Google AI Studio (ordenados por eficiência e suporte)
  const candidateModels = [
    requestedModel,
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
    'gemini-1.5-pro'
  ].filter((m, i, self) => Boolean(m) && self.indexOf(m) === i);

  // Tentativas de API endpoint (v1beta e v1)
  const apiVersions = ['v1beta', 'v1'];
  
  // Configuração do Backoff Exponencial para Erro 429
  const retryDelays = [2000, 5000, 10000]; 

  let lastErrorDetails = null;

  for (const modelName of candidateModels) {
    for (const apiVer of apiVersions) {
      const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${modelName}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (systemPrompt && apiVer === 'v1beta') {
        payload.systemInstruction = { parts: [{ text: systemPrompt }] };
      }

      // Loop de Retries para 429 Rate Limit (até 3 tentativas por combinação)
      for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
        try {
          console.log(`[Gemini API] Tentativa ${attempt + 1} -> Modelo: ${modelName} (${apiVer})`);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json().catch(() => ({}));

          if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return {
              text: data.candidates[0].content.parts[0].text,
              usedModel: modelName,
              apiVersion: apiVer
            };
          }

          // Mapeamento e Tratamento de Erros HTTP
          const statusCode = response.status;
          const errorMsg = data.error?.message || data.error?.status || `HTTP ${statusCode}`;

          lastErrorDetails = {
            statusCode,
            message: errorMsg,
            model: modelName,
            apiVersion: apiVer,
            data
          };

          // 429 - Rate Limit (Executar Backoff Exponencial)
          if (statusCode === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
            if (attempt < retryDelays.length) {
              const delay = retryDelays[attempt];
              console.warn(`[Gemini API 429 Rate Limit] Aguardando ${delay / 1000}s antes da tentativa ${attempt + 2}...`);
              await sleep(delay);
              continue; // Tenta a próxima tentativa do mesmo modelo
            }
          }

          // Se for 404 (Modelo inexistente ou inválido nesta versão da API), sai do loop de retries e testa o próximo modelo
          if (statusCode === 404) {
            console.warn(`[Gemini API 404] Modelo '${modelName}' não suportado na API ${apiVer}. Tentando alternativa...`);
            break; 
          }

          // Se for 401 ou 403 (Chave inválida / Sem permissão), encerra imediatamente e relata erro de autenticação
          if (statusCode === 401 || statusCode === 403) {
            throw { status: statusCode, userMessage: `Chave de API inválida ou sem permissão (${errorMsg}). Verifique a chave inserida no Admin.` };
          }

          // Se for outro erro, interrompe o retry desse modelo
          break;

        } catch (fetchErr) {
          if (fetchErr.status) throw fetchErr; // Re-throw erro amigável de auth
          console.error(`[Gemini API Exception]`, fetchErr);
          lastErrorDetails = { statusCode: 500, message: fetchErr.message, model: modelName, apiVersion: apiVer };
          break;
        }
      }
    }
  }

  // Se esgotou todas as combinações sem sucesso
  if (lastErrorDetails) {
    if (lastErrorDetails.statusCode === 429) {
      throw { status: 429, userMessage: 'Limite de cota de requisições excedido no Google Gemini (Erro 429 - Rate Limit). Todas as tentativas automáticas com o servidor falharam. Aguarde 1 minuto.' };
    }
    if (lastErrorDetails.statusCode === 404) {
      throw { status: 404, userMessage: `Modelos da API do Gemini indisponíveis ou não encontrados (${lastErrorDetails.message}).` };
    }
    throw { status: lastErrorDetails.statusCode || 500, userMessage: `Erro na comunicação com a API do Gemini: ${lastErrorDetails.message}`, details: lastErrorDetails };
  }

  throw { status: 500, userMessage: 'Erro desconhecido ao processar requisição com Google Gemini.' };
}

// Proxy endpoint for AI completions
app.post('/api/ai/generate', async (req, res) => {
  const startTime = Date.now();
  try {
    const { prompt, systemPrompt, provider = 'gemini', model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório.' });
    }

    const selectedProvider = provider.toLowerCase();

    if (selectedProvider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY não configurada no servidor.' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const status = response.status;
        console.error(`[OpenAI Error ${status}]`, data);
        return res.status(status).json({ error: data.error?.message || `Erro na requisição OpenAI (${status})` });
      }

      return res.json({ result: data.choices[0].message.content });

    } else if (selectedProvider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20240620',
          system: systemPrompt || '',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const status = response.status;
        console.error(`[Anthropic Error ${status}]`, data);
        return res.status(status).json({ error: data.error?.message || `Erro na requisição Anthropic (${status})` });
      }

      return res.json({ result: data.content[0].text });

    } else if (selectedProvider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY não configurada nas variáveis de ambiente do servidor Render.' });
      }

      const geminiResult = await callGeminiResilient({
        apiKey,
        prompt,
        systemPrompt,
        requestedModel: model
      });

      console.log(`[Gemini Success] Modelo utilizado: ${geminiResult.usedModel} em ${Date.now() - startTime}ms`);
      return res.json({ result: geminiResult.text });

    } else {
      return res.status(400).json({ error: `Provedor inválido: ${provider}` });
    }

  } catch (error) {
    const statusCode = error.status || 500;
    const errorMessage = error.userMessage || error.message || 'Erro interno no processamento da Inteligência Artificial.';
    
    console.error(`[API /api/ai/generate Status ${statusCode}]`, {
      stack: error.stack,
      details: error.details || error,
      timestamp: new Date().toISOString()
    });

    res.status(statusCode).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
