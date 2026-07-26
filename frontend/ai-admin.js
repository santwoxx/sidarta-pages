/**
 * ai-admin.js
 * Gerencia a aba 'Motores de IA' no Painel Admin, 
 * lendo e salvando as credenciais no chrome.storage.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnSaveAiKeys = document.getElementById('btn-save-ai-keys');
  const providerSelect = document.getElementById('ai-default-provider');
  const modelInput = document.getElementById('ai-default-model');
  const keyAnthropic = document.getElementById('api-key-anthropic');
  const keyOpenAI = document.getElementById('api-key-openai');
  const keyGemini = document.getElementById('api-key-gemini');

  // Carregar dados salvos ao abrir
  if (providerSelect && btnSaveAiKeys) {
    chrome.storage.local.get(['aiKeys', 'aiDefaultProvider', 'aiDefaultModel'], (result) => {
      if (result.aiDefaultProvider) providerSelect.value = result.aiDefaultProvider;
      if (result.aiDefaultModel) modelInput.value = result.aiDefaultModel;
      
      if (result.aiKeys) {
        keyAnthropic.value = result.aiKeys.anthropic || '';
        keyOpenAI.value = result.aiKeys.openai || '';
        keyGemini.value = result.aiKeys.gemini || '';
      }
    });

    // Salvar novos dados
    btnSaveAiKeys.addEventListener('click', () => {
      const keys = {
        anthropic: keyAnthropic.value.trim(),
        openai: keyOpenAI.value.trim(),
        gemini: keyGemini.value.trim()
      };
      const provider = providerSelect.value;
      const model = modelInput.value.trim();

      chrome.storage.local.set({
        aiKeys: keys,
        aiDefaultProvider: provider,
        aiDefaultModel: model
      }, () => {
        // Inicializar serviço no background, caso exista
        if (window.aiService) {
          window.aiService.keys = keys;
          window.aiService.defaultProvider = provider;
          window.aiService.defaultModel = model;
        }

        const originalText = btnSaveAiKeys.innerText;
        btnSaveAiKeys.innerText = 'Salvo com sucesso!';
        btnSaveAiKeys.style.background = '#28a745';
        setTimeout(() => {
          btnSaveAiKeys.innerText = originalText;
          btnSaveAiKeys.style.background = '';
        }, 2000);
      });
    });
  }

  // Evento para abrir o construtor independente (Builder)
  const btnOpenBuilder = document.getElementById('tool-open-builder');
  if (btnOpenBuilder) {
    btnOpenBuilder.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('builder/workspace.html') });
    });
  }
});
