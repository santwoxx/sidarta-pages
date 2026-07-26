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
      
      const systemPrompt = `Você é um Engenheiro de Front-end Sênior e UI/UX Designer Mestre, especializado em criar sites modernos e de alta conversão.

REGRAS DE DESIGN & PALETA DE CORES CONTEXTUAL:
1. ADAPTE A PALETA DE CORES AO NICHO DO PROMPT:
   - Para Petshop, Cachorros, Animais, Saúde ou Cuidados: Use design claro, acolhedor e minimalista com fundos claros (Branco/Cinza suave #f8fafc), azul limpo (#0284c7 / #38bdf8), verde (#10b981) e acentos amigáveis. NUNCA use fundo preto/dourado para petshop ou cachorros!
   - Para Restaurante / Comida / Pizza: Use cores quentes (Vermelho, Laranja, Dourado, Bege).
   - Para Tecnologia / SaaS / Crypto: Use tom escuro ou gradientes modernos.

2. ESTRUTURA DO SITE:
   - Navbar, Hero Section com imagem de alta qualidade do Unsplash, Seção de Serviços/Cards, Depoimentos e Rodapé completo.

3. REGRAS OBRIGATÓRIAS:
   1. Retorne APENAS o código HTML completo (CSS e JS embutidos) válido. NADA MAIS. Sem markdown.
   2. É ESTRITAMENTE PROIBIDO usar Scripts Externos (ex: CDN de JS do Tailwind, GSAP).
   3. Ícones: FontAwesome CSS ou SVG inline.
   4. Imagens: Imagens Unsplash de altíssima qualidade.
   5. Entregue a MAIOR QUALIDADE VISUAL POSSÍVEL. Sombras suaves, contrastes limpos, gradientes leves e layout responsivo.`;
      
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
