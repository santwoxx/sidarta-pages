/**
 * ai-service.js
 * Serviço responsável por comunicar EXCLUSIVAMENTE com o Backend Render.
 * A chave de API NUNCA é armazenada ou enviada pelo frontend.
 * Toda autenticação com provedores de IA é feita server-side via process.env.
 */

// URL padrão do backend — já configurada para produção
const DEFAULT_BACKEND_URL = 'https://sidarta-pages.onrender.com';

class AIService {
  constructor() {
    // Prioridade: window.BACKEND_URL > localStorage > DEFAULT_BACKEND_URL
    this.backendUrl = (typeof window !== 'undefined' && window.BACKEND_URL)
      ? window.BACKEND_URL
      : DEFAULT_BACKEND_URL;
    this.defaultProvider = 'gemini';
    this.defaultModel = 'gemini-flash-latest';
    this._initialized = false;
  }

  /**
   * Carrega APENAS a URL do backend e preferências de provider/modelo.
   * Nunca carrega chaves de API do localStorage.
   */
  async init() {
    if (this._initialized) return;
    this._initialized = true;

    if (typeof localStorage !== 'undefined') {
      try {
        const sidartaConfig = JSON.parse(localStorage.getItem('sidarta_ai_config') || '{}');
        if (sidartaConfig.provider) this.defaultProvider = sidartaConfig.provider;
        if (sidartaConfig.model)    this.defaultModel    = sidartaConfig.model;
        if (sidartaConfig.backendUrl) this.backendUrl    = sidartaConfig.backendUrl;
      } catch (e) { /* ignora */ }

      // Retrocompatibilidade: lê backendUrl do formato antigo se existir, mas NÃO lê as chaves
      try {
        const oldKeys = JSON.parse(localStorage.getItem('sidarta_ai_keys') || '{}');
        if (oldKeys.backendUrl && !this.backendUrl) this.backendUrl = oldKeys.backendUrl;
        if (oldKeys.provider   && !this.defaultProvider) this.defaultProvider = oldKeys.provider;
        // Remove qualquer chave de API que possa estar no localStorage por segurança
        if (oldKeys.gemini || oldKeys.openai || oldKeys.anthropic) {
          delete oldKeys.gemini;
          delete oldKeys.openai;
          delete oldKeys.anthropic;
          localStorage.setItem('sidarta_ai_keys', JSON.stringify(oldKeys));
          console.info('[AI Service] Chaves de API removidas do localStorage por segurança. Use variáveis de ambiente no backend.');
        }
      } catch (e) { /* ignora */ }
    }

    // Garante que sempre há um backend configurado
    if (!this.backendUrl) this.backendUrl = DEFAULT_BACKEND_URL;
  }

  /**
   * Salva APENAS configurações não-sensíveis (URL do backend, provedor, modelo).
   * Nunca salva chaves de API no localStorage.
   */
  async saveConfig({ provider, model, backendUrl }) {
    if (provider)    this.defaultProvider = provider;
    if (model)       this.defaultModel    = model;
    if (backendUrl !== undefined) this.backendUrl = backendUrl;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sidarta_ai_config', JSON.stringify({
        provider:   this.defaultProvider,
        model:      this.defaultModel,
        backendUrl: this.backendUrl
      }));
    }
  }

  /**
   * Envia o prompt para o Backend Render.
   * A chave de API fica 100% no servidor (process.env).
   * Se o backend não estiver configurado, lança um erro claro.
   */
  async generateCompletion(prompt, systemPrompt = '') {
    await this.init();

    // Resolve a URL do backend: usa configuração ou localhost em dev
    let targetBackend = (this.backendUrl || '').trim();
    if (targetBackend && !targetBackend.startsWith('http://') && !targetBackend.startsWith('https://')) {
      targetBackend = '';
    }

    const isLocalhost = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!targetBackend && isLocalhost) {
      targetBackend = 'http://localhost:5000';
    }

    if (!targetBackend) {
      throw new Error(
        'Backend não configurado. Acesse o Painel Admin e insira a URL do seu backend Render no campo "URL do Backend".'
      );
    }

    let response;
    try {
      response = await fetch(`${targetBackend}/api/ai/generate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prompt,
          systemPrompt,
          provider: this.defaultProvider,
          model:    this.defaultModel
        })
      });
    } catch (networkErr) {
      throw new Error(
        `Não foi possível conectar ao backend (${targetBackend}). ` +
        'Verifique se o serviço Render está ativo e a URL está correta no Painel Admin.'
      );
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.result) {
      return data.result;
    }

    // Erros retornados pelo backend
    const backendMsg = data.error || `Erro HTTP ${response.status}`;
    throw new Error(backendMsg);
  }
}

if (typeof window !== 'undefined') {
  window.aiService = new AIService();
}
