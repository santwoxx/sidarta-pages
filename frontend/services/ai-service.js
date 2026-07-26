/**
 * ai-service.js
 * Serviço responsável por comunicar com a API Backend (Render) ou diretamente com provedores de IA.
 * Suporta chaves clássicas (AIzaSy...) e novas (AQ...) do Google AI Studio / Google Cloud.
 */

class AIService {
  constructor() {
    this.backendUrl = (typeof window !== 'undefined' && window.BACKEND_URL) ? window.BACKEND_URL : '';
    this.useBackend = true;
    this.keys = {
      openai: '',
      anthropic: '',
      gemini: ''
    };
    this.defaultProvider = 'gemini'; // 'openai', 'anthropic', 'gemini'
    this.defaultModel = 'gemini-flash-latest';
  }

  // Carrega as configurações (com suporte a chrome.storage ou localStorage)
  async init() {
    return new Promise((resolve) => {
      // 1. Tentar ler do localStorage (Web Environment)
      if (typeof localStorage !== 'undefined') {
        const sidartaKeys = localStorage.getItem('sidarta_ai_keys');
        if (sidartaKeys) {
          try {
            const parsed = JSON.parse(sidartaKeys);
            if (parsed.provider) this.defaultProvider = parsed.provider;
            if (parsed.gemini) this.keys.gemini = parsed.gemini;
            if (parsed.openai) this.keys.openai = parsed.openai;
            if (parsed.anthropic) this.keys.anthropic = parsed.anthropic;
            if (parsed.backendUrl) this.backendUrl = parsed.backendUrl;
          } catch (e) {}
        }

        const storedKeys = localStorage.getItem('aiKeys');
        if (storedKeys) {
          try {
            const parsed = JSON.parse(storedKeys);
            this.keys = { ...this.keys, ...parsed };
          } catch (e) {}
        }

        const storedProvider = localStorage.getItem('aiDefaultProvider');
        if (storedProvider) this.defaultProvider = storedProvider;

        const storedModel = localStorage.getItem('aiDefaultModel');
        if (storedModel) this.defaultModel = storedModel;

        const storedBackendUrl = localStorage.getItem('backendUrl');
        if (storedBackendUrl) this.backendUrl = storedBackendUrl;
      }

      // 2. Tentar ler do chrome.storage.local (Extension Environment)
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['aiKeys', 'aiDefaultProvider', 'aiDefaultModel', 'backendUrl'], (result) => {
          if (result.aiKeys) this.keys = { ...this.keys, ...result.aiKeys };
          if (result.aiDefaultProvider) this.defaultProvider = result.aiDefaultProvider;
          if (result.aiDefaultModel) this.defaultModel = result.aiDefaultModel;
          if (result.backendUrl) this.backendUrl = result.backendUrl;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async saveConfig(keys, provider, model, backendUrl) {
    this.keys = keys;
    this.defaultProvider = provider;
    if (model) this.defaultModel = model;
    if (backendUrl !== undefined) this.backendUrl = backendUrl;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sidarta_ai_keys', JSON.stringify({
        provider: this.defaultProvider,
        gemini: this.keys.gemini,
        openai: this.keys.openai,
        anthropic: this.keys.anthropic,
        backendUrl: this.backendUrl
      }));
    }

    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          aiKeys: this.keys,
          aiDefaultProvider: this.defaultProvider,
          aiDefaultModel: this.defaultModel,
          backendUrl: this.backendUrl
        }, resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Envia o prompt para a IA (Tenta primeiramente via Backend Render se configurado, com fallback para Direct Browser Calls)
   */
  async generateCompletion(prompt, systemPrompt = '') {
    await this.init();

    const isLocalhostHost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Validar URL do backend (deve ser uma URL válida http:// ou https://)
    let targetBackend = this.backendUrl ? this.backendUrl.trim() : '';
    if (targetBackend && !targetBackend.startsWith('http://') && !targetBackend.startsWith('https://')) {
      targetBackend = '';
    }

    if (!targetBackend && isLocalhostHost) {
      targetBackend = 'http://localhost:5000';
    }

    // 1. Tentar chamada via Backend (Render / Local) apenas se houver uma URL de backend válida
    if (this.useBackend && targetBackend) {
      try {
        const response = await fetch(`${targetBackend}/api/ai/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            systemPrompt,
            provider: this.defaultProvider,
            model: this.defaultModel
          })
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok && data.result) {
          return data.result;
        }

        if (data.error) {
          throw new Error(data.error);
        }
      } catch (backendError) {
        if (backendError.message && !backendError.message.includes('Failed to fetch') && !backendError.message.includes('NetworkError')) {
          throw backendError;
        }
        console.warn('Backend Render não respondeu. Alternando para chamada direta de IA:', backendError);
      }
    }

    // 2. Fallback: Chamada direta no browser caso haja chave configurada
    const currentKey = this.keys[this.defaultProvider];
    if (!currentKey) {
      throw new Error(`Chave de API não configurada para o provedor: ${this.defaultProvider}. Por favor, insira sua chave no Painel Admin.`);
    }

    if (this.defaultProvider === 'openai') {
      return await this._callOpenAI(prompt, systemPrompt);
    } else if (this.defaultProvider === 'anthropic') {
      return await this._callAnthropic(prompt, systemPrompt);
    } else if (this.defaultProvider === 'gemini') {
      return await this._callGeminiResilient(prompt, systemPrompt);
    } else {
      throw new Error('Provedor de IA desconhecido.');
    }
  }

  async _callOpenAI(prompt, systemPrompt) {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.keys.openai}`
      },
      body: JSON.stringify({
        model: this.defaultModel || 'gpt-4o',
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Erro OpenAI (${response.status})`);
    return data.choices[0].message.content;
  }

  async _callAnthropic(prompt, systemPrompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.keys.anthropic,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: this.defaultModel || 'claude-3-5-sonnet-20240620',
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Erro Anthropic (${response.status})`);
    return data.content[0].text;
  }

  /**
   * Chamada direta ao Google Gemini com suporte a qualquer chave (AIzaSy... e AQ...), 
   * retries automáticos com backoff para 429 e fallback de modelos ativos (gemini-flash-latest, gemini-2.0-flash).
   */
  async _callGeminiResilient(prompt, systemPrompt) {
    const apiKey = this.keys.gemini ? this.keys.gemini.trim() : '';
    if (!apiKey) {
      throw new Error('Chave de API do Gemini não configurada. Insira sua chave no Painel Admin.');
    }

    const candidateModels = [
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro'
    ];

    const apiVersions = ['v1beta', 'v1'];
    const retryDelays = [2000, 5000, 10000];

    let lastErrorMsg = '';

    for (const modelName of candidateModels) {
      for (const apiVer of apiVersions) {
        const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${modelName}:generateContent?key=${apiKey}`;
        
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        if (systemPrompt && apiVer === 'v1beta') {
          payload.systemInstruction = { parts: [{ text: systemPrompt }] };
        }

        for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const statusCode = response.status;
            const data = await response.json().catch(() => ({}));

            if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
              return data.candidates[0].content.parts[0].text;
            }

            const errorMsg = data.error?.message || `HTTP ${statusCode}`;
            lastErrorMsg = errorMsg;

            // 401 / 403: Chave de API inválida ou sem permissão
            if (statusCode === 401 || statusCode === 403) {
              throw new Error(`Chave de API inválida ou sem permissão (${errorMsg}). Verifique a chave inserida no Admin.`);
            }

            // 429: Rate limit com retry automático
            if (statusCode === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
              if (attempt < retryDelays.length) {
                const delay = retryDelays[attempt];
                console.warn(`[Gemini Direct 429] Aguardando ${delay / 1000}s para tentativa ${attempt + 2}...`);
                await new Promise(r => setTimeout(r, delay));
                continue;
              }
            }

            // 404: Modelo não suportado nesta versão, testar próxima alternativa
            if (statusCode === 404) {
              break;
            }

            break;
          } catch (err) {
            if (err.message.includes('Chave de API inválida')) throw err;
            lastErrorMsg = err.message;
            break;
          }
        }
      }
    }

    if (lastErrorMsg.includes('429') || lastErrorMsg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Limite de cota excedido no Google Gemini (Erro 429 - Rate Limit). As tentativas de reconexão automática falharam. Aguarde 1 minuto e tente novamente.');
    }

    throw new Error(lastErrorMsg || 'Não foi possível obter resposta do Google Gemini. Verifique a chave inserida no Admin.');
  }
}

if (typeof window !== 'undefined') {
  window.aiService = new AIService();
}
