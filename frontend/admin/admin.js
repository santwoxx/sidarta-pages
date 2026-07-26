import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verificação de Segurança (Opcional, exige que o Admin faça login)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '../login.html';
  }

  // 2. Navegação da Sidebar
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const sections = document.querySelectorAll('.section-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 3. Botão Voltar ao Dashboard
  document.getElementById('btn-back-dashboard').addEventListener('click', () => {
    window.location.href = '../dashboard/index.html';
  });

  // 4. Lógica de AI Keys (Salvar e Carregar)
  const providerSelect = document.getElementById('provider');
  const backendUrlInput = document.getElementById('backend-url');
  const keyGemini = document.getElementById('key-gemini');
  const keyOpenai = document.getElementById('key-openai');
  const keyAnthropic = document.getElementById('key-anthropic');
  const formAi = document.getElementById('ai-keys-form');
  const toast = document.getElementById('toast');

  // Carregar dados salvos
  const savedKeys = JSON.parse(localStorage.getItem('sidarta_ai_keys') || '{}');
  if (savedKeys.provider) providerSelect.value = savedKeys.provider;
  if (savedKeys.backendUrl) backendUrlInput.value = savedKeys.backendUrl;
  if (savedKeys.gemini) keyGemini.value = savedKeys.gemini;
  if (savedKeys.openai) keyOpenai.value = savedKeys.openai;
  if (savedKeys.anthropic) keyAnthropic.value = savedKeys.anthropic;

  // Salvar novos dados
  formAi.addEventListener('submit', (e) => {
    e.preventDefault();
    const newKeys = {
      provider: providerSelect.value,
      backendUrl: backendUrlInput.value.trim(),
      gemini: keyGemini.value.trim(),
      openai: keyOpenai.value.trim(),
      anthropic: keyAnthropic.value.trim()
    };
    
    localStorage.setItem('sidarta_ai_keys', JSON.stringify(newKeys));
    if (window.aiService) {
      window.aiService.saveConfig(
        { gemini: newKeys.gemini, openai: newKeys.openai, anthropic: newKeys.anthropic },
        newKeys.provider,
        'gemini-1.5-flash',
        newKeys.backendUrl
      );
    }
    
    // Mostrar Toast de sucesso
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  });
});
