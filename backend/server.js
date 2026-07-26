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
 * Utiliza o alias oficial ativo 'gemini-flash-latest' e 'gemini-2.0-flash' com retries em 429
 * Aceita tanto chaves clássicas (AIzaSy...) quanto novas (AQ...) do Google AI Studio.
 */
async function callGeminiResilient({ apiKey, prompt, systemPrompt, requestedModel }) {
  // Modelos ativos verificados via GET /v1beta/models
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
    requestedModel
  ].filter((m, i, self) => Boolean(m) && m !== 'gemini-1.5-flash' && self.indexOf(m) === i);

  const apiVersions = ['v1beta', 'v1'];
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

      for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
        try {
          console.log(`[Backend Gemini API] Requisitando modelo: ${modelName} (${apiVer}) | Tentativa ${attempt + 1}`);

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const statusCode = response.status;
          const data = await response.json().catch(() => ({}));

          // HTTP 200 OK -> Retorno de Sucesso
          if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            console.log(`[Backend Gemini Success] HTTP 200 OK com modelo: ${modelName}`);
            return {
              text: data.candidates[0].content.parts[0].text,
              usedModel: modelName,
              apiVersion: apiVer,
              data
            };
          }

          const errorMsg = data.error?.message || data.error?.status || `HTTP ${statusCode}`;
          lastErrorDetails = {
            statusCode,
            message: errorMsg,
            model: modelName,
            apiVersion: apiVer,
            data
          };

          // 429 - Rate Limit (Exponential Backoff)
          if (statusCode === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
            if (attempt < retryDelays.length) {
              const delay = retryDelays[attempt];
              console.warn(`[Gemini API 429] Aguardando ${delay / 1000}s para tentativa ${attempt + 2}...`);
              await sleep(delay);
              continue;
            }
          }

          // 404 - Modelo não suportado nesta versão, passa para o próximo modelo candidato
          if (statusCode === 404) {
            console.warn(`[Gemini API 404] Modelo '${modelName}' não suportado na versão ${apiVer}.`);
            break;
          }

          // 401 / 403 - Erro de Autenticação / Chave Inválida
          if (statusCode === 401 || statusCode === 403) {
            throw { status: statusCode, userMessage: `Autenticação falhou (${errorMsg}). Verifique a chave configurada.` };
          }

          break;

        } catch (fetchErr) {
          if (fetchErr.status) throw fetchErr;
          lastErrorDetails = { statusCode: 500, message: fetchErr.message, model: modelName, apiVersion: apiVer };
          break;
        }
      }
    }
  }

  if (lastErrorDetails) {
    if (lastErrorDetails.statusCode === 429) {
      throw { status: 429, userMessage: 'Limite de cota de requisições excedido no Google Gemini (Erro 429 - Rate Limit). Tente novamente em 1 minuto.' };
    }
    if (lastErrorDetails.statusCode === 404) {
      throw { status: 404, userMessage: `Modelo da API do Gemini não encontrado (${lastErrorDetails.message}).` };
    }
    throw { status: lastErrorDetails.statusCode || 500, userMessage: `Erro na API do Gemini: ${lastErrorDetails.message}`, details: lastErrorDetails };
  }

  throw { status: 500, userMessage: 'Erro interno ao processar requisição com Google Gemini.' };
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
        return res.status(response.status).json({ error: data.error?.message || `Erro OpenAI (${response.status})` });
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
        return res.status(response.status).json({ error: data.error?.message || `Erro Anthropic (${response.status})` });
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

      console.log(`[Gemini Success] ${geminiResult.usedModel} (${geminiResult.apiVersion}) respondido em ${Date.now() - startTime}ms`);
      return res.json({ result: geminiResult.text });

    } else {
      return res.status(400).json({ error: `Provedor inválido: ${provider}` });
    }

  } catch (error) {
    const statusCode = error.status || 500;
    const errorMessage = error.userMessage || error.message || 'Erro interno no processamento da Inteligência Artificial.';
    
    console.error(`[API /api/ai/generate Erro ${statusCode}]`, {
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
