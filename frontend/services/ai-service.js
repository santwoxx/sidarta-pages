/**
 * ai-service.js
 * Serviço responsável por comunicar com a API Backend (Render) ou diretamente com provedores de IA.
 */

class AIService {
  constructor() {
    this.backendUrl = window.BACKEND_URL || 'http://localhost:5000';
    this.useBackend = true;
    this.keys = {
      openai: '',
      anthropic: '',
      gemini: ''
    };
    this.defaultProvider = 'gemini'; // 'openai', 'anthropic', 'gemini'
    this.defaultModel = 'gemini-1.5-flash';
  }

  // Carrega as configurações (com suporte a chrome.storage ou localStorage)
  async init() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['aiKeys', 'aiDefaultProvider', 'aiDefaultModel', 'backendUrl'], (result) => {
          if (result.aiKeys) this.keys = { ...this.keys, ...result.aiKeys };
          if (result.aiDefaultProvider) this.defaultProvider = result.aiDefaultProvider;
          if (result.aiDefaultModel) this.defaultModel = result.aiDefaultModel;
          if (result.backendUrl) this.backendUrl = result.backendUrl;
          resolve();
        });
      } else if (typeof localStorage !== 'undefined') {
        const storedKeys = localStorage.getItem('aiKeys');
        const storedProvider = localStorage.getItem('aiDefaultProvider');
        const storedModel = localStorage.getItem('aiDefaultModel');
        const storedBackendUrl = localStorage.getItem('backendUrl');

        if (storedKeys) this.keys = JSON.parse(storedKeys);
        if (storedProvider) this.defaultProvider = storedProvider;
        if (storedModel) this.defaultModel = storedModel;
        if (storedBackendUrl) this.backendUrl = storedBackendUrl;
        resolve();
      } else {
        resolve();
      }
    });
  }

  async saveConfig(keys, provider, model, backendUrl) {
    this.keys = keys;
    this.defaultProvider = provider;
    this.defaultModel = model;
    if (backendUrl) this.backendUrl = backendUrl;

    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          aiKeys: this.keys,
          aiDefaultProvider: this.defaultProvider,
          aiDefaultModel: this.defaultModel,
          backendUrl: this.backendUrl
        }, resolve);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('aiKeys', JSON.stringify(this.keys));
        localStorage.setItem('aiDefaultProvider', this.defaultProvider);
        localStorage.setItem('aiDefaultModel', this.defaultModel);
        localStorage.setItem('backendUrl', this.backendUrl);
        resolve();
      } else {
        resolve();
      }
    });
  }

  /**
   * Envia o prompt para a IA (Tenta primeiramente via Backend Render, com fallback para Direct Browser Calls se houver API key configurada no cliente)
   */
  async generateCompletion(prompt, systemPrompt = '') {
    // 1. Tentar chamada via Backend Render se habilitado
    if (this.useBackend && this.backendUrl) {
      try {
        const response = await fetch(`${this.backendUrl}/api/ai/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            systemPrompt,
            provider: this.defaultProvider,
            model: this.defaultModel
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result) return data.result;
        }
      } catch (backendError) {
        console.warn('Backend Render indisponível ou em fallback. Tentando chamadas diretas:', backendError);
      }
    }

    // 2. Fallback: Chamada direta no browser caso haja chave configurada
    if (!this.keys[this.defaultProvider]) {
      throw new Error(`Chave de API não configurada para ${this.defaultProvider} e Backend indisponível.`);
    }

    if (this.defaultProvider === 'openai') {
      return await this._callOpenAI(prompt, systemPrompt);
    } else if (this.defaultProvider === 'anthropic') {
      return await this._callAnthropic(prompt, systemPrompt);
    } else if (this.defaultProvider === 'gemini') {
      return await this._callGemini(prompt, systemPrompt);
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
    if (data.error) throw new Error(data.error.message);
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
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }

  async _callGemini(prompt, systemPrompt) {
    const apiKey = this.keys.gemini;
    const model = this.defaultModel || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const bodyData = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (systemPrompt) {
      bodyData.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  }
}

if (typeof window !== 'undefined') {
  window.aiService = new AIService();
}
