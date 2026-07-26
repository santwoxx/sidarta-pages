/**
 * workspace.js
 * Lógica da interface do Sature AI Builder (Independente).
 */

document.addEventListener('DOMContentLoaded', async () => {
  const chat = document.getElementById('chat');
  const promptInput = document.getElementById('prompt-input');
  const btnSend = document.getElementById('btn-send');
  const previewFrame = document.getElementById('preview-frame');

  // Inicializa o serviço de IA com as credenciais salvas
  if (window.aiService) {
    await window.aiService.init();
  }

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'msg-user' : 'msg-ai'}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  async function handleSend() {
    const text = promptInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    promptInput.value = '';
    promptInput.disabled = true;
    btnSend.disabled = true;

    addMessage('Pensando...', false);
    const thinkingNode = chat.lastChild;

    try {
      if (!window.aiService) throw new Error('Serviço de IA não carregado.');
      
      const systemPrompt = `Você é um Engenheiro de Front-end Sênior e UI/UX Designer Mestre, especializado em criar sites de tirar o fôlego.
Você deve agir aplicando TODAS as seguintes "Premium Skills": 
- Site Premium Completo & Design Responsivo Perfeito
- UI Redesign Moderno & Dark Mode Elegante
- Glassmorphism & Efeitos Neon (quando aplicável)
- Animações fluidas (em CSS Puro) e Micro-Interações
- Tipografia Impecável & Acessibilidade

Regras OBRIGATÓRIAS:
1. Retorne APENAS o código HTML completo (CSS e JS embutidos) válido. NADA MAIS. Sem markdown.
2. É ESTRITAMENTE PROIBIDO usar Scripts Externos (ex: CDN de JS do Tailwind, GSAP).
3. Para Tailwind, use EXCLUSIVAMENTE via CSS: <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
4. Ícones: FontAwesome CSS ou SVG inline.
5. Imagens: Imagens Unsplash de altíssima qualidade (ex: https://source.unsplash.com/random/1200x800/?fashion,luxury).
6. Entregue a MAIOR QUALIDADE VISUAL POSSÍVEL. Sombras, contrastes, gradientes premium e layouts criativos.`;
      
      const response = await window.aiService.generateCompletion(text, systemPrompt);
      
      thinkingNode.textContent = 'Site gerado com sucesso! Atualizando preview...';
      
      const cleanResponse = response.replace(/^```html\n?/, '').replace(/```$/, '');
      
      let iframe = document.getElementById('preview-sandbox');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'preview-sandbox';
        // Aponta para a nossa página de sandbox oficial registrada no manifest
        iframe.src = 'sandbox.html';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        previewFrame.innerHTML = '';
        previewFrame.appendChild(iframe);
        
        // Espera carregar a primeira vez antes de postar a mensagem
        iframe.onload = () => {
          iframe.contentWindow.postMessage({ type: 'RENDER', html: cleanResponse }, '*');
        };
      } else {
        iframe.contentWindow.postMessage({ type: 'RENDER', html: cleanResponse }, '*');
      }

    } catch (error) {
      thinkingNode.textContent = `Erro: ${error.message}`;
    } finally {
      promptInput.disabled = false;
      btnSend.disabled = false;
      promptInput.focus();
    }
  }

  btnSend.addEventListener('click', handleSend);
  promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
});
