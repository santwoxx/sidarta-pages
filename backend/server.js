const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Sidarta Pages Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Proxy endpoint for AI completions
app.post('/api/ai/generate', async (req, res) => {
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
        throw new Error(data.error?.message || 'Erro na requisição OpenAI');
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
        throw new Error(data.error?.message || 'Erro na requisição Anthropic');
      }

      return res.json({ result: data.content[0].text });

    } else if (selectedProvider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
      }

      const modelsToTry = [
        model,
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-pro'
      ].filter(Boolean);

      let lastError = null;
      let resultText = '';

      for (const mName of modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${apiKey}`;
          const bodyData = { contents: [{ parts: [{ text: prompt }] }] };
          if (systemPrompt) bodyData.systemInstruction = { parts: [{ text: systemPrompt }] };

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
          });

          const data = await response.json();
          if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            resultText = data.candidates[0].content.parts[0].text;
            break;
          }
          if (data.error) lastError = data.error.message;
        } catch (e) {
          lastError = e.message;
        }
      }

      if (!resultText) {
        throw new Error(lastError || 'Erro na requisição Gemini API');
      }

      return res.json({ result: resultText });

    } else {
      return res.status(400).json({ error: `Provedor inválido: ${provider}` });
    }

  } catch (error) {
    console.error('Erro em /api/ai/generate:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
