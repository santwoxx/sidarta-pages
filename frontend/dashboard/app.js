document.addEventListener('DOMContentLoaded', () => {
  const localUser = JSON.parse(localStorage.getItem('sidarta_user') || '{}');
  if (!localUser.email) {
    window.location.href = '/login.html';
    return;
  }

  if (localUser.status === 'blocked') {
    alert('Sua conta foi bloqueada pelo Administrador. Entre em contato com o suporte.');
    window.location.href = '/login.html';
    return;
  }

  if (localUser.role !== 'admin' && !localUser.plan) {
    window.location.href = '/pricing.html';
    return;
  }

  // Atualizar dados do usuário na sidebar (novo design)
  if (localUser.email) {
    const emailDisplay = document.getElementById('user-email-display');
    const avatarDisplay = document.getElementById('user-avatar');
    if (emailDisplay) emailDisplay.textContent = localUser.email;
    if (avatarDisplay) avatarDisplay.textContent = localUser.email.substring(0, 2).toUpperCase();
  }

  // --- Lógica de Abas do Dashboard ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover active de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.add('hidden'));
      
      // Adicionar no atual
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }
    });
  });

  const btnSend = document.getElementById('btn-send-prompt');
  const input = document.getElementById('prompt-input');
  const chatMessages = document.getElementById('chat-messages');
  const mainView = document.getElementById('main-view');
  const previewView = document.getElementById('preview-view');
  const editorView = document.getElementById('editor-view');
  const btnBack = document.getElementById('btn-back-dashboard');
  const loadingIndicator = document.getElementById('loading-indicator');
  const previewIframe = document.getElementById('preview-iframe');
  const btnBackEditor = document.getElementById('btn-back-from-editor');
  const createView = document.getElementById('create-view');
  
  const templateCards = document.querySelectorAll('.template-card, .template-card-modern');
  
  const navDashboard = document.getElementById('nav-dashboard');
  const navCreate = document.getElementById('nav-create');
  const navTools = document.getElementById('nav-tools');
  const toolsView = document.getElementById('tools-view');
  const navProfile = document.getElementById('nav-profile');
  const profileView = document.getElementById('profile-view');
  // --- Navegação Lateral ---
  if (navDashboard && navCreate) {
    navDashboard.addEventListener('click', (e) => {
      e.preventDefault();
      navDashboard.classList.add('active');
      navCreate.classList.remove('active');
      if (navTools) navTools.classList.remove('active');
      if (navProfile) navProfile.classList.remove('active');
      if (createView) createView.classList.add('hidden');
      switchView(mainView);
    });

    navCreate.addEventListener('click', (e) => {
      e.preventDefault();
      navCreate.classList.add('active');
      navDashboard.classList.remove('active');
      if (navTools) navTools.classList.remove('active');
      if (navProfile) navProfile.classList.remove('active');
      [mainView, previewView, editorView, toolsView, profileView].forEach(v => { if(v) v.classList.add('hidden') });
      if (createView) createView.classList.remove('hidden');
    });
  }

  if (navTools && toolsView) {
    navTools.addEventListener('click', async (e) => {
      e.preventDefault();
      navTools.classList.add('active');
      if (navDashboard) navDashboard.classList.remove('active');
      if (navCreate) navCreate.classList.remove('active');
      if (navProfile) navProfile.classList.remove('active');
      if (createView) createView.classList.add('hidden');
      switchView(toolsView);
      
      // Carregar e popular as skills no grid
      const toolsGrid = document.getElementById('tools-grid');
      if (toolsGrid && toolsGrid.children.length === 0) {
        toolsGrid.innerHTML = '<p style="color:var(--text-secondary)">Carregando ferramentas...</p>';
        try {
          const { sidartaSkills } = await import('../services/skills.js');
          let html = '';
          for (const key in sidartaSkills) {
            const s = sidartaSkills[key];
            html += `
              <div class="tool-card" data-skill="${key}">
                <div class="tool-icon">${s.icon}</div>
                <div class="tool-name">${s.name}</div>
                <div class="tool-desc">${s.desc}</div>
              </div>
            `;
          }
          toolsGrid.innerHTML = html;
          
          toolsGrid.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
              const skillId = card.getAttribute('data-skill');
              activeSkillId = skillId;
              input.value = `Gere o site utilizando a skill: ${sidartaSkills[skillId].name}`;
              input.dispatchEvent(new Event('input'));
              // Retornar para a view principal para o usuário enviar o prompt se quiser
              navDashboard.click();
            });
          });
        } catch (err) {
          toolsGrid.innerHTML = '<p style="color:red">Erro ao carregar as ferramentas.</p>';
        }
      }
    });
  }

  if (navProfile && profileView) {
    navProfile.addEventListener('click', (e) => {
      e.preventDefault();
      navProfile.classList.add('active');
      if (navDashboard) navDashboard.classList.remove('active');
      if (navCreate) navCreate.classList.remove('active');
      if (navTools) navTools.classList.remove('active');
      if (createView) createView.classList.add('hidden');
      switchView(profileView);

      // Preencher dados
      const emailEl = document.getElementById('profile-email');
      const roleEl = document.getElementById('profile-role');
      const planEl = document.getElementById('profile-plan');
      
      if (emailEl) emailEl.textContent = localUser.email || 'N/A';
      if (roleEl) roleEl.textContent = localUser.role || 'user';
      if (planEl) planEl.textContent = localUser.plan || (localUser.role === 'admin' ? 'Acesso Total (Admin)' : 'Nenhum');
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        const { auth, signOut } = await import('../firebase-config.js');
        await signOut(auth);
      } catch (err) {
        console.error("Erro ao deslogar do Firebase:", err);
      }
      localStorage.removeItem('sidarta_user');
      window.location.href = '/login.html';
    });
  }

  const TEMPLATES = {
    pizza: { name: 'Pizzaria Premium', path: '../modelos/pizza/index.html' },
    clinica: { name: 'Clínica Médica', path: '../modelos/clinica medica/index.html' },
    cosmeticos: { name: 'Cosméticos Premium', path: '../modelos/cosmeticos femininos/index.html' },
    dentista: { name: 'Clínica Odontológica', path: '../modelos/clinica dentista/index.html' }
  };

  // ─── VIEW SWITCHING ───
  function switchView(view) {
    [mainView, previewView, editorView, toolsView, profileView].forEach(v => { if(v) v.classList.add('hidden') });
    if (view) view.classList.remove('hidden');
  }

  btnBack.addEventListener('click', () => switchView(mainView));
  btnBackEditor.addEventListener('click', () => switchView(mainView));

  let activeSkillId = null;

  const btnApplySkills = document.getElementById('btn-apply-skills');
  if (btnApplySkills) {
    btnApplySkills.addEventListener('click', async () => {
      const wrapper = document.createElement('div');
      wrapper.className = 'message ai-message';
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.innerHTML = '<strong>Skills Disponíveis:</strong><br><small>Escolha uma para aplicar ao seu site.</small><div id="skills-list-container" style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">Carregando...</div>';
      wrapper.appendChild(bubble);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const { sidartaSkills } = await import('../services/skills.js');
        let html = '';
        for (const key in sidartaSkills) {
          const s = sidartaSkills[key];
          html += `<button class="btn-outline skill-btn" data-skill="${key}" style="text-align: left; padding: 8px; font-size: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
            ${s.icon} <span><strong>${s.name}</strong><br>${s.desc}</span>
          </button>`;
        }
        const container = bubble.querySelector('#skills-list-container');
        container.innerHTML = html;
        container.querySelectorAll('.skill-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const skillId = btn.getAttribute('data-skill');
            activeSkillId = skillId;
            input.value = `Gere o site utilizando a skill: ${sidartaSkills[skillId].name}`;
            input.dispatchEvent(new Event('input'));
            btnSend.click();
          });
        });
      } catch (err) {
        bubble.querySelector('#skills-list-container').innerHTML = 'Erro ao carregar skills.';
      }
    });
  }

  // ─── TEXTAREA AUTO-RESIZE ───
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    btnSend.disabled = this.value.trim() === '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!btnSend.disabled) btnSend.click();
    }
  });

  // ─── CHAT MESSAGES ───
  function addMessage(text, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ─── TEMPLATE CARD CLICKS ───
  templateCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      const templateKey = card.dataset.template;

      if (!templateKey || !TEMPLATES[templateKey]) {
        const h3 = card.querySelector('h3');
        if (h3) {
          input.value = `Gostaria de usar o modelo "${h3.textContent}" como base.`;
          btnSend.disabled = false;
          btnSend.click();
        }
        return;
      }

      if (actionBtn && actionBtn.dataset.action === 'preview') {
        openPreview(templateKey);
      } else {
        openEditor(templateKey);
      }
    });
  });

  function openPreview(templateKey) {
    const tpl = TEMPLATES[templateKey];
    if (!tpl) return;
    switchView(previewView);
    previewIframe.src = tpl.path;
  }

  function openEditor(templateKey) {
    const tpl = TEMPLATES[templateKey];
    if (!tpl) return;
    switchView(editorView);
    document.getElementById('editor-template-name').textContent = tpl.name;
    const iframe = document.getElementById('editor-iframe');
    iframe.src = tpl.path;
    iframe.onload = () => initEditor(iframe, tpl);
  }

  // ─── EDITOR STATE ───
  const state = {
    tool: 'select',
    selectedEl: null,
    undoStack: [],
    redoStack: [],
    drag: {
      active: false,
      dragging: false,
      ghost: null,
      indicator: null,
      badge: null,
      source: null,
      offsetX: 0,
      offsetY: 0,
      dropTarget: null,
      dropPos: null
    }
  };

  // Single iframe reference, kept across the session
  let currentIframe = null;
  let currentTpl = null;

  // ─── INIT EDITOR ───
  function initEditor(iframe, tpl) {
    currentIframe = iframe;
    currentTpl = tpl;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    state.undoStack = [];
    state.redoStack = [];
    state.selectedEl = null;
    state.tool = 'select';

    // Reset toolbar UI
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
    document.querySelector('.tool-btn[data-tool="select"]').classList.add('active');

    // Inject styles ONCE into iframe
    injectEditorStyles(doc);

    // Bind all interactions via delegation (ONE handler for everything)
    bindIframeInteractions(iframe, doc);

    // Parent-side handlers (toolbar, tree, colors, etc.) — only once
    bindToolbar(iframe);
    bindElementTree(iframe);
    bindColorEditors(iframe);
    bindExport(iframe, tpl);
    bindFullscreen(iframe);
    bindSidebarToggle();
    bindKeyboard(iframe, doc);
    bindDragAndDrop(iframe, doc);

    deselectAll();
  }

  function injectEditorStyles(doc) {
    // Remove old injected styles if any
    const old = doc.querySelector('#editor-styles-injected');
    if (old) old.remove();

    const style = doc.createElement('style');
    style.id = 'editor-styles-injected';
    style.textContent = `
      [data-ed-hover] { outline: 2px dashed rgba(13,110,253,0.5) !important; outline-offset: 2px; }
      [data-ed-selected] { outline: 2px solid #0d6efd !important; outline-offset: 2px; }
      [data-ed-dragging] { opacity: 0.2 !important; }
      .ed-drop-line {
        position: absolute; left: 0; right: 0; height: 3px;
        background: #0d6efd; border-radius: 2px; z-index: 999998;
        pointer-events: none; box-shadow: 0 0 10px rgba(13,110,253,0.6);
      }
      .ed-drop-line::before, .ed-drop-line::after {
        content: ''; position: absolute; width: 10px; height: 10px;
        background: #0d6efd; border-radius: 50%; top: 50%; transform: translateY(-50%);
      }
      .ed-drop-line::before { left: -5px; }
      .ed-drop-line::after { right: -5px; }
    `;
    doc.head.appendChild(style);
  }

  // ─── IFRAME INTERACTIONS (delegated) ───
  function bindIframeInteractions(iframe, doc) {
    // Remove old listeners by replacing body content later re-will rebind via reinit
    // Use a namespaced approach — store handlers on a data attribute

    // Hover
    doc.addEventListener('mouseover', (e) => {
      if (state.drag.dragging) return;
      const el = e.target;
      if (el && el.nodeType === 1 && el !== doc.body && el !== doc.documentElement) {
        el.setAttribute('data-ed-hover', '');
      }
    }, true);

    doc.addEventListener('mouseout', (e) => {
      const el = e.target;
      if (el && el.nodeType === 1) {
        el.removeAttribute('data-ed-hover');
      }
    }, true);

    // Click to select
    doc.addEventListener('click', (e) => {
      if (state.drag.dragging) return;
      if (state.tool === 'move') return;

      const el = e.target;
      if (!el || el === doc.body || el === doc.documentElement) {
        deselectAll();
        return;
      }

      // Find a meaningful element to select
      const target = findSelectableParent(el);
      if (target && target !== doc.body) {
        e.preventDefault();
        e.stopPropagation();
        selectElement(target, iframe);
      }
    }, true);
  }

  function findSelectableParent(el) {
    // Walk up to find a block-level or named element
    let current = el;
    while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
      const tag = current.tagName;
      if (['SECTION', 'NAV', 'FOOTER', 'HEADER', 'MAIN', 'ARTICLE', 'ASIDE'].includes(tag)) {
        return current;
      }
      if (current.id) return current;
      if (current.className && typeof current.className === 'string') {
        const cls = current.className;
        if (cls.match(/card|hero|banner|configurator|featured|stat|pizza|story|craft|menu|reserve/i)) {
          return current;
        }
      }
      // If it's a heading, link, button, image, paragraph — select it directly
      if (['H1','H2','H3','H4','H5','H6','A','BUTTON','IMG','P'].includes(tag)) {
        return current;
      }
      current = current.parentElement;
    }
    return el;
  }

  // ─── SELECT / DESELECT ───
  function selectElement(el, iframe) {
    deselectAll();
    const doc = iframe.contentDocument;
    state.selectedEl = el;
    el.setAttribute('data-ed-selected', '');

    // Highlight tree item
    document.querySelectorAll('.tree-item').forEach(ti => ti.classList.remove('active'));
    let parent = el;
    let selector = null;
    while (parent && parent !== doc.body) {
      if (parent.id) { selector = '#' + parent.id; break; }
      if (parent.tagName === 'NAV') { selector = 'nav'; break; }
      if (parent.tagName === 'FOOTER') { selector = 'footer'; break; }
      parent = parent.parentElement;
    }
    if (selector) {
      const ti = document.querySelector(`.tree-item[data-selector="${selector}"]`);
      if (ti) ti.classList.add('active');
    }

    document.getElementById('selected-element-label').textContent = getElementLabel(el);
    buildPropertiesPanel(el, iframe);
  }

  function deselectAll() {
    if (currentIframe) {
      const doc = currentIframe.contentDocument;
      if (doc) {
        doc.querySelectorAll('[data-ed-selected]').forEach(e => e.removeAttribute('data-ed-selected'));
      }
    }
    state.selectedEl = null;
    document.getElementById('selected-element-label').textContent = 'Nenhum elemento selecionado';
    document.getElementById('properties-panel').innerHTML = '<p class="properties-hint">Clique em um elemento no preview para editá-lo.</p>';
  }

  function getElementLabel(el) {
    if (el.id) return el.tagName + '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      return el.tagName + '.' + el.className.split(' ')[0];
    }
    return el.tagName;
  }

  // ─── PROPERTIES PANEL ───
  function buildPropertiesPanel(el, iframe) {
    const panel = document.getElementById('properties-panel');
    panel.innerHTML = '';
    const doc = iframe.contentDocument;

    // Tag
    addPropGroup(panel, 'Elemento', `<input class="prop-input" value="${el.tagName.toLowerCase()}" readonly style="opacity:0.6">`);

    // Text
    const isTextual = el.children.length === 0 || ['A','BUTTON','H1','H2','H3','H4','H5','H6'].includes(el.tagName);
    if (isTextual && el.textContent.trim()) {
      const g = document.createElement('div');
      g.className = 'prop-group';
      g.innerHTML = `
        <label class="prop-label">Texto</label>
        <textarea class="prop-input prop-textarea" id="prop-text">${escapeHtml(el.textContent.trim())}</textarea>
        <button class="prop-btn" id="prop-apply-text" style="margin-top:8px">Aplicar Texto</button>
      `;
      panel.appendChild(g);
      g.querySelector('#prop-apply-text').addEventListener('click', () => {
        if (state.selectedEl) {
          pushUndo(iframe);
          state.selectedEl.textContent = g.querySelector('#prop-text').value;
        }
      });
    }

    // BG Color
    const currentBg = iframe.contentWindow.getComputedStyle(el).backgroundColor;
    addColorProp(panel, 'Cor de Fundo', rgbToHex(currentBg), (val) => {
      if (state.selectedEl) state.selectedEl.style.backgroundColor = val;
    }, () => pushUndo(iframe));

    // Font size
    addInputProp(panel, 'Tamanho da Fonte', iframe.contentWindow.getComputedStyle(el).fontSize, (val) => {
      if (state.selectedEl) { pushUndo(iframe); state.selectedEl.style.fontSize = val; }
    }, 'change');

    // Padding
    addInputProp(panel, 'Padding', iframe.contentWindow.getComputedStyle(el).padding, (val) => {
      if (state.selectedEl) { pushUndo(iframe); state.selectedEl.style.padding = val; }
    }, 'change');

    // Text Color
    const currentColor = iframe.contentWindow.getComputedStyle(el).color;
    addColorProp(panel, 'Cor do Texto', rgbToHex(currentColor), (val) => {
      if (state.selectedEl) state.selectedEl.style.color = val;
    }, () => pushUndo(iframe));

    // Image
    if (el.tagName === 'IMG') {
      addPropGroup(panel, 'URL da Imagem', `
        <input class="prop-input" type="text" id="prop-img-src" value="${el.src}">
        <button class="prop-btn" id="prop-apply-img" style="margin-top:8px">Trocar Imagem</button>
      `, (g) => {
        g.querySelector('#prop-apply-img').addEventListener('click', () => {
          const v = g.querySelector('#prop-img-src').value;
          if (state.selectedEl) { pushUndo(iframe); state.selectedEl.src = v; }
        });
      });
    }

    // Link
    if (el.tagName === 'A') {
      addPropGroup(panel, 'Link (href)', `
        <input class="prop-input" type="text" id="prop-href" value="${el.href || ''}">
        <button class="prop-btn" id="prop-apply-href" style="margin-top:8px">Aplicar Link</button>
      `, (g) => {
        g.querySelector('#prop-apply-href').addEventListener('click', () => {
          const v = g.querySelector('#prop-href').value;
          if (state.selectedEl) { pushUndo(iframe); state.selectedEl.href = v; }
        });
      });
    }

    // WhatsApp
    if (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.href && el.href.includes('wa.me'))) {
      addPropGroup(panel, 'WhatsApp (numero)', `
        <input class="prop-input" type="text" id="prop-wa-number" placeholder="5511999999999">
        <button class="prop-btn" id="prop-apply-wa" style="margin-top:8px">Aplicar WhatsApp</button>
      `, (g) => {
        g.querySelector('#prop-apply-wa').addEventListener('click', () => {
          const v = g.querySelector('#prop-wa-number').value;
          if (v && state.selectedEl) {
            pushUndo(iframe);
            const url = `https://wa.me/${v.replace(/\D/g, '')}`;
            if (state.selectedEl.tagName === 'A') {
              state.selectedEl.href = url;
              state.selectedEl.target = '_blank';
            } else {
              state.selectedEl.onclick = () => window.open(url, '_blank');
            }
          }
        });
      });
    }

    // Delete
    const del = document.createElement('div');
    del.className = 'prop-group';
    del.style.marginTop = '16px';
    del.innerHTML = '<button class="prop-btn" style="background:#dc3545">Excluir Elemento</button>';
    panel.appendChild(del);
    del.querySelector('button').addEventListener('click', () => {
      if (state.selectedEl) {
        pushUndo(iframe);
        state.selectedEl.remove();
        deselectAll();
      }
    });
  }

  function addPropGroup(panel, label, html, afterAppend) {
    const g = document.createElement('div');
    g.className = 'prop-group';
    g.innerHTML = `<label class="prop-label">${label}</label>${html}`;
    panel.appendChild(g);
    if (afterAppend) afterAppend(g);
  }

  function addInputProp(panel, label, value, onChange, event) {
    const g = document.createElement('div');
    g.className = 'prop-group';
    g.innerHTML = `<label class="prop-label">${label}</label><input class="prop-input" type="text" value="${value}">`;
    panel.appendChild(g);
    g.querySelector('input').addEventListener(event, (e) => onChange(e.target.value));
  }

  function addColorProp(panel, label, value, onInput, onChange) {
    const g = document.createElement('div');
    g.className = 'prop-group';
    g.innerHTML = `
      <label class="prop-label">${label}</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="color" value="${value}" style="width:36px;height:36px;border:2px solid var(--border-color);border-radius:6px;cursor:pointer">
        <span style="font-size:12px;color:var(--text-secondary)">${value}</span>
      </div>
    `;
    panel.appendChild(g);
    const input = g.querySelector('input[type="color"]');
    const span = g.querySelector('span');
    input.addEventListener('input', () => { span.textContent = input.value; onInput(input.value); });
    input.addEventListener('change', () => onChange());
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── UNDO / REDO ───
  function pushUndo(iframe) {
    const doc = iframe.contentDocument;
    state.undoStack.push(doc.body.innerHTML);
    state.redoStack = [];
    if (state.undoStack.length > 50) state.undoStack.shift();
  }

  function undo() {
    if (!currentIframe || state.undoStack.length === 0) return;
    const doc = currentIframe.contentDocument;
    state.redoStack.push(doc.body.innerHTML);
    doc.body.innerHTML = state.undoStack.pop();
    reinitAfterMutation(currentIframe);
  }

  function redo() {
    if (!currentIframe || state.redoStack.length === 0) return;
    const doc = currentIframe.contentDocument;
    state.undoStack.push(doc.body.innerHTML);
    doc.body.innerHTML = state.redoStack.pop();
    reinitAfterMutation(currentIframe);
  }

  function reinitAfterMutation(iframe) {
    const doc = iframe.contentDocument;
    injectEditorStyles(doc);
    // Re-create the drop indicator if in move mode
    if (state.drag.active) {
      createDropIndicator(doc);
      markDraggableElements(doc);
    }
  }

  // ─── TOOLBAR ───
  function bindToolbar(iframe) {
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prevTool = state.tool;
        document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.tool = btn.dataset.tool;

        if (state.tool === 'move') {
          deselectAll();
          enableDragMode(iframe);
        } else if (prevTool === 'move') {
          disableDragMode(iframe);
        }
      });
    });

    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);
  }

  // ─── ELEMENT TREE ───
  function bindElementTree(iframe) {
    document.querySelectorAll('.tree-item').forEach(item => {
      item.addEventListener('click', () => {
        const doc = iframe.contentDocument;
        const target = doc.querySelector(item.dataset.selector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          selectElement(target, iframe);
        }
      });
    });
  }

  // ─── COLOR EDITORS ───
  function bindColorEditors(iframe) {
    const p = document.getElementById('color-primary');
    const b = document.getElementById('color-bg');
    const t = document.getElementById('color-text');

    p.addEventListener('input', () => {
      iframe.contentDocument.documentElement.style.setProperty('--ember', p.value);
      document.getElementById('color-primary-hex').textContent = p.value;
    });

    b.addEventListener('input', () => {
      iframe.contentDocument.documentElement.style.setProperty('--dark', b.value);
      iframe.contentDocument.body.style.background = b.value;
      document.getElementById('color-bg-hex').textContent = b.value;
    });

    t.addEventListener('input', () => {
      iframe.contentDocument.documentElement.style.setProperty('--cream', t.value);
      iframe.contentDocument.body.style.color = t.value;
      document.getElementById('color-text-hex').textContent = t.value;
    });
  }

  // ─── EXPORT ───
  function bindExport(iframe, tpl) {
    document.getElementById('btn-export-html').addEventListener('click', () => {
      const doc = iframe.contentDocument;
      const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tpl.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ─── FULLSCREEN ───
  function bindFullscreen(iframe) {
    document.getElementById('btn-preview-fullscreen').addEventListener('click', () => {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
    });
  }

  // ─── SIDEBAR TOGGLE ───
  function bindSidebarToggle() {
    document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
      document.getElementById('editor-sidebar').classList.toggle('collapsed');
    });
  }

  // ─── KEYBOARD ───
  function bindKeyboard(iframe, doc) {
    const handler = (e) => {
      if (e.key === 'Escape' && state.tool === 'move') {
        document.querySelector('.tool-btn[data-tool="select"]').click();
      }
      // Ctrl+Z / Ctrl+Y
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
      }
    };
    doc.addEventListener('keydown', handler);
    document.addEventListener('keydown', handler);
  }

  // ─────────────────────────────────────────────
  // ─── DRAG & DROP SYSTEM ──────────────────────
  // ─────────────────────────────────────────────

  const DRAG_SELECTOR = 'section, nav, footer, .pizza-card, .story-card, .stat-card, .craft-card';

  function getDraggableElements(doc) {
    return Array.from(doc.querySelectorAll(DRAG_SELECTOR)).filter(el => {
      const r = el.getBoundingClientRect();
      return r.height > 30 && r.width > 30;
    });
  }

  function markDraggableElements(doc) {
    doc.querySelectorAll('[data-ed-draggable]').forEach(el => el.removeAttribute('data-ed-draggable'));
    getDraggableElements(doc).forEach(el => el.setAttribute('data-ed-draggable', 'true'));
  }

  function createDropIndicator(doc) {
    let ind = doc.querySelector('.ed-drop-line');
    if (!ind) {
      ind = doc.createElement('div');
      ind.className = 'ed-drop-line';
      ind.style.display = 'none';
      doc.body.appendChild(ind);
    }
    state.drag.indicator = ind;
    return ind;
  }

  function enableDragMode(iframe) {
    const doc = iframe.contentDocument;
    if (!doc) return;
    state.drag.active = true;

    markDraggableElements(doc);
    createDropIndicator(doc);
    showMoveBadge();

    document.querySelector('.editor-canvas').classList.add('is-move-mode');

    // Bind iframe mousedown
    doc.addEventListener('mousedown', onDragMouseDown, true);
    doc.addEventListener('mousemove', onDragMouseMove, true);
    doc.addEventListener('mouseup', onDragMouseUp, true);

    // Bind parent mousemove/mouseup for ghost tracking outside iframe
    document.addEventListener('mousemove', onParentMouseMove);
    document.addEventListener('mouseup', onParentMouseUp);
  }

  function disableDragMode(iframe) {
    const doc = iframe.contentDocument;
    state.drag.active = false;
    state.drag.dragging = false;

    if (doc) {
      doc.removeEventListener('mousedown', onDragMouseDown, true);
      doc.removeEventListener('mousemove', onDragMouseMove, true);
      doc.removeEventListener('mouseup', onDragMouseUp, true);
      doc.querySelectorAll('[data-ed-draggable]').forEach(el => {
        el.removeAttribute('data-ed-draggable');
        el.removeAttribute('data-ed-dragging');
      });
      const ind = doc.querySelector('.ed-drop-line');
      if (ind) ind.remove();
    }

    document.removeEventListener('mousemove', onParentMouseMove);
    document.removeEventListener('mouseup', onParentMouseUp);
    document.querySelector('.editor-canvas').classList.remove('is-move-mode');

    removeGhost();
    hideMoveBadge();
  }

  function showMoveBadge() {
    hideMoveBadge();
    const badge = document.createElement('div');
    badge.className = 'move-mode-badge';
    badge.textContent = 'Modo Mover \u2014 Arraste para reordenar (ESC para sair)';
    document.body.appendChild(badge);
    state.drag.badge = badge;
  }

  function hideMoveBadge() {
    if (state.drag.badge) { state.drag.badge.remove(); state.drag.badge = null; }
  }

  function createGhost(el, x, y) {
    removeGhost();
    const rect = el.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    
    // Limit ghost size to be manageable
    ghost.style.width = Math.min(rect.width, 320) + 'px';
    ghost.style.height = Math.min(rect.height, 120) + 'px';
    ghost.style.left = x + 'px';
    ghost.style.top = y + 'px';

    // Use a clean placeholder instead of outerHTML which loses iframe styles
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--accent-color); font-weight:600; font-size:14px; background: rgba(13, 110, 253, 0.05); text-align:center; padding: 10px; box-sizing: border-box;';
    
    // Show a small hint of what is being moved
    let tagName = el.tagName.toLowerCase();
    if (el.classList.length > 0) {
      tagName += '.' + el.classList[0];
    }
    placeholder.textContent = 'Movendo: ' + tagName;
    
    ghost.appendChild(placeholder);
    document.body.appendChild(ghost);
    state.drag.ghost = ghost;
  }

  function updateGhost(x, y) {
    if (state.drag.ghost) {
      state.drag.ghost.style.left = x + 'px';
      state.drag.ghost.style.top = y + 'px';
    }
  }

  function removeGhost() {
    if (state.drag.ghost) { state.drag.ghost.remove(); state.drag.ghost = null; }
  }

  function positionDropIndicator(targetEl, pos) {
    const ind = state.drag.indicator;
    if (!ind || !targetEl) return;

    const doc = targetEl.ownerDocument;
    const iframe = currentIframe;
    const iframeRect = iframe.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    let top;
    if (pos === 'before') {
      top = targetRect.top + iframe.contentWindow.scrollY;
    } else {
      top = targetRect.bottom + iframe.contentWindow.scrollY;
    }

    ind.style.top = top + 'px';
    ind.style.left = '0';
    ind.style.width = '100%';
    ind.style.display = 'block';

    state.drag.dropTarget = targetEl;
    state.drag.dropPos = pos;
  }

  function hideDropIndicator() {
    if (state.drag.indicator) state.drag.indicator.style.display = 'none';
    state.drag.dropTarget = null;
    state.drag.dropPos = null;
  }

  function calcDropTarget(clientX, clientY) {
    if (!currentIframe) return null;
    const doc = currentIframe.contentDocument;
    const iframeRect = currentIframe.getBoundingClientRect();
    const scrollY = currentIframe.contentWindow.scrollY;
    const mouseY = clientY - iframeRect.top + scrollY;

    const els = getDraggableElements(doc);
    let best = null;
    let bestDist = Infinity;

    for (const el of els) {
      if (el === state.drag.source) continue;
      const r = el.getBoundingClientRect();
      const elTop = r.top + scrollY;
      const elBottom = r.bottom + scrollY;
      const mid = (elTop + elBottom) / 2;

      const dist = Math.abs(mouseY - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = { target: el, position: mouseY < mid ? 'before' : 'after' };
      }
    }

    return best;
  }

  function performDrop() {
    if (!state.drag.source || !state.drag.dropTarget || !state.drag.dropPos) return;
    if (state.drag.source === state.drag.dropTarget) return;

    pushUndo(currentIframe);

    const t = state.drag.dropTarget;
    if (state.drag.dropPos === 'before') {
      t.parentNode.insertBefore(state.drag.source, t);
    } else {
      t.parentNode.insertBefore(state.drag.source, t.nextSibling);
    }
  }

  // ─── DRAG EVENT HANDLERS ───
  function onDragMouseDown(e) {
    if (!state.drag.active) return;
    const target = e.target.closest('[data-ed-draggable="true"]');
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    state.drag.dragging = true;
    state.drag.source = target;

    const rect = target.getBoundingClientRect();
    state.drag.offsetX = e.clientX - rect.left;
    state.drag.offsetY = e.clientY - rect.top;

    target.setAttribute('data-ed-dragging', '');
    const iframeRect = currentIframe.getBoundingClientRect();
    const globalX = e.clientX + iframeRect.left;
    const globalY = e.clientY + iframeRect.top;
    createGhost(target, globalX - state.drag.offsetX, globalY - state.drag.offsetY);
  }

  function onDragMouseMove(e) {
    if (!state.drag.dragging) return;
    e.preventDefault();

    const iframeRect = currentIframe.getBoundingClientRect();
    const globalX = e.clientX + iframeRect.left;
    const globalY = e.clientY + iframeRect.top;

    updateGhost(globalX - state.drag.offsetX, globalY - state.drag.offsetY);

    const drop = calcDropTarget(globalX, globalY);
    if (drop) positionDropIndicator(drop.target, drop.position);
    else hideDropIndicator();
  }

  function onDragMouseUp(e) {
    if (!state.drag.dragging) return;
    performDrop();
    finishDrag();
  }

  function onParentMouseMove(e) {
    if (!state.drag.dragging) return;
    e.preventDefault();
    updateGhost(e.clientX - state.drag.offsetX, e.clientY - state.drag.offsetY);

    // Check if cursor is over iframe
    const iframeRect = currentIframe.getBoundingClientRect();
    if (e.clientX >= iframeRect.left && e.clientX <= iframeRect.right &&
        e.clientY >= iframeRect.top && e.clientY <= iframeRect.bottom) {
      const drop = calcDropTarget(e.clientX, e.clientY);
      if (drop) positionDropIndicator(drop.target, drop.position);
      else hideDropIndicator();
    }
  }

  function onParentMouseUp(e) {
    if (!state.drag.dragging) return;
    performDrop();
    finishDrag();
  }

  function finishDrag() {
    if (state.drag.source) {
      state.drag.source.removeAttribute('data-ed-dragging');
    }
    removeGhost();
    hideDropIndicator();
    state.drag.dragging = false;
    state.drag.source = null;
  }

  // ─── AI PROMPT SEND ───
  btnSend.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    btnSend.disabled = true;

    addMessage(text, true);
    switchView(previewView);

    loadingIndicator.classList.remove('hidden');
    previewIframe.style.opacity = '0.5';

    try {
      let systemPrompt = `Você é um Engenheiro de Front-end Sênior e UI/UX Designer Mestre, especializado em criar sites modernos e de alta conversão.

REGRAS DE DESIGN & PALETA DE CORES CONTEXTUAL:
1. ADAPTE A PALETA DE CORES AO NICHO DO PROMPT:
   - Para Petshop, Cachorros, Animais, Saúde ou Cuidados: Use design claro, acolhedor e minimalista com fundos claros (Branco/Cinza suave #f8fafc), azul limpo (#0284c7 / #38bdf8), verde (#10b981) e acentos amigáveis. NUNCA use fundo preto/dourado para petshop ou cachorros!
   - Para Restaurante / Comida / Pizza: Use cores quentes (Vermelho, Laranja, Dourado, Bege).
   - Para Tecnologia / SaaS / Crypto: Use tom escuro ou gradientes modernos.

2. ESTRUTURA DO SITE (CRIE UM SITE COMPLETO E RICO):
   - Navbar com Logo do Nicho, Links de Navegação (Início, Serviços, Galeria, Depoimentos, Contato) e Botão CTA destacado.
   - Hero Section de alto impacto com Título Forte, Subtítulo envolvente, Botões de Ação ("Agendar Agora", "Ver Serviços") e Imagem em destaque de alta qualidade do Unsplash.
   - Seção de Serviços / Benefícios com Cards bem desenhados, ícones (SVG ou FontAwesome) e sombras suaves.
   - Seção de Depoimentos / Avaliações de Clientes com estrelas e fotos.
   - Seção de Galeria de Fotos ou Destaques do produto/serviço.
   - Rodapé completo com links, contato (WhatsApp / E-mail) e direitos autorais.

3. REGRAS TÉCNICAS OBRIGATÓRIAS:
   - Retorne APENAS o código HTML cru iniciando com <!DOCTYPE html>.
   - Coloque todo o CSS dentro de uma tag <style> no <head>.
   - Use Google Fonts modernos (ex: Inter, Poppins, Outfit ou Plus Jakarta Sans).
   - Design 100% Responsivo para mobile e desktop.
   - NAO escreva marcacao Markdown como \`\`\`html. Retorne o HTML cru iniciando com <!DOCTYPE html>.`;

      // ─── VERIFICAÇÃO AUTOMÁTICA DE MODELOS BASE ───
      const REGISTERED_TEMPLATES = [
        {
          id: 'pizza',
          keywords: ['pizza', 'pizzaria', 'pizzeria', 'massa', 'italiana', 'napolitana'],
          path: '/modelos/pizza/index.html',
          name: 'Pizzaria Premium'
        }
      ];

      const lowerText = text.toLowerCase();
      const matchedTemplate = REGISTERED_TEMPLATES.find(t => 
        t.keywords.some(kw => lowerText.includes(kw))
      );

      if (matchedTemplate) {
        try {
          console.log(`[Template Match] Carregando modelo base '${matchedTemplate.name}' para personalização por IA.`);
          const tRes = await fetch(matchedTemplate.path);
          if (tRes.ok) {
            let baseTemplateCode = await tRes.text();

            // Normalizar caminhos relativos de imagens, scripts e frames para caminhos absolutos do modelo
            const templateBaseDir = matchedTemplate.path.substring(0, matchedTemplate.path.lastIndexOf('/'));
            baseTemplateCode = baseTemplateCode
              .replace(/src=["'](?!https?:\/\/|\/|data:)([^"']+)["']/gi, `src="${templateBaseDir}/$1"`)
              .replace(/href=["'](?!https?:\/\/|\/|data:)([^"']+\.(?:css|png|jpg|jpeg|svg|webp|ico))["']/gi, `href="${templateBaseDir}/$1"`);

            systemPrompt = `Você é um Engenheiro de Front-end Sênior e Especialista em UI/UX.
Abaixo está o código HTML de um MODELO BASE PROFISSIONAL DE ALTA QUALIDADE (${matchedTemplate.name}).

SUA MISSÃO:
Personalizar e adaptar este modelo base de acordo com a solicitação do usuário: "${text}".

REGRAS DE PERSONALIZAÇÃO OBRIGATÓRIAS:
1. MANTENHA A EXCELENTE ESTRUTURA VISUAL, ANIMAÇÕES E DESIGN DO MODELO BASE.
2. Altere os nomes, títulos, textos do cardápio, dados de contato e links do WhatsApp conforme solicitado no prompt.
3. Ajuste a paleta de cores ou adicione novas seções se o usuário pedir, mantendo a consistência do layout.
4. RETORNE APENAS O CÓDIGO HTML COMPLETO E FINAL iniciando com <!DOCTYPE html>. NADA MAIS.

=== CÓDIGO HTML DO MODELO BASE ===
${baseTemplateCode}`;
          }
        } catch (tErr) {
          console.warn('Não foi possível carregar o código do modelo base:', tErr);
        }
      }

      if (typeof activeSkillId !== 'undefined' && activeSkillId) {
        try {
          const { getSkillPrompt } = await import('../services/skills.js');
          const skillInstruction = getSkillPrompt(activeSkillId);
          systemPrompt = `Você é um Engenheiro de Front-end Sênior. 
Abaixo está a especificação rigorosa do design e tecnologia que você DEVE implementar:

${skillInstruction}

=== REGRAS DE ARQUITETURA OBRIGATÓRIAS ===
Como este código será renderizado diretamente em um iframe de preview sem bundler, você DEVE retornar a solução inteira como UM ÚNICO arquivo HTML (<!DOCTYPE html>).
- Se a especificação exigir React, Framer Motion, Tailwind ou TypeScript, VOCÊ DEVE importar tudo via CDN (ex: Babel standalone, unpkg, esm.sh, script do Tailwind).
- Coloque todo o código React/JSX dentro de uma tag <script type="text/babel" data-type="module"> (ou a configuração correta de CDN que você preferir).
- Todo CSS customizado deve ir em uma tag <style>.
- RETORNE APENAS O CÓDIGO HTML PURO. Não inclua blocos de markdown (como \`\`\`html), nem texto explicativo antes ou depois. Absolutamente NADA além do código fonte HTML.`;
        } catch(e) {
          console.error('Failed to load skill prompt:', e);
        }
        activeSkillId = null; // Reseta após o uso
      }

      const response = await window.aiService.generateCompletion(text, systemPrompt);
      
      let cleanResponse = response;
      const htmlMatch = response.match(/<!DOCTYPE\s+html>[\s\S]*<\/html>/i) || response.match(/<html[\s\S]*<\/html>/i);
      if (htmlMatch) {
        cleanResponse = htmlMatch[0];
      } else {
        cleanResponse = response.replace(/```html/gi, '').replace(/```/g, '');
      }

      lastGeneratedHtml = cleanResponse;

      addMessage("Site gerado com sucesso! Já está disponível no preview.", false);

      const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
      doc.open();
      doc.write(cleanResponse);
      doc.close();

    } catch (error) {
      console.error(error);
      addMessage('Ops, houve um erro ao tentar gerar o site: ' + error.message, false);
      if (error.message.includes('API key')) {
        addMessage('Atenção: Verifique se a sua chave de API está configurada no Painel Admin.', false);
      }
    } finally {
      loadingIndicator.classList.add('hidden');
      previewIframe.style.opacity = '1';
    }
  });

  // ─── AÇÕES DA PÁGINA (BAIXAR, SALVAR E PUBLICAR) ───
  let lastGeneratedHtml = '';

  const btnDownloadHtml = document.getElementById('btn-download-html');
  if (btnDownloadHtml) {
    btnDownloadHtml.addEventListener('click', () => {
      if (!lastGeneratedHtml) {
        alert('Nenhum site gerado para baixar. Crie um site primeiro pelo chat!');
        return;
      }
      const blob = new Blob([lastGeneratedHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sidarta-page.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  const btnSavePage = document.getElementById('btn-save-page');
  if (btnSavePage) {
    btnSavePage.addEventListener('click', async () => {
      if (!lastGeneratedHtml) {
        alert('Nenhum site gerado para salvar. Crie um site primeiro pelo chat!');
        return;
      }
      const title = prompt('Digite um nome para identificar e salvar sua página:', 'Minha Página Sidarta');
      if (!title) return;

      const pageItem = {
        id: Date.now().toString(),
        title,
        htmlContent: lastGeneratedHtml,
        createdAt: new Date().toISOString()
      };

      const savedPages = JSON.parse(localStorage.getItem('sidarta_saved_pages') || '[]');
      savedPages.unshift(pageItem);
      localStorage.setItem('sidarta_saved_pages', JSON.stringify(savedPages));

      try {
        const { db, auth, doc, setDoc } = await import('../firebase-config.js');
        if (auth && auth.currentUser) {
          const pageRef = doc(db, 'users', auth.currentUser.uid, 'pages', pageItem.id);
          await setDoc(pageRef, pageItem);
        }
      } catch (e) {
        console.warn('Página salva no armazenamento local:', e);
      }

      alert(`Página "${title}" salva com sucesso! Ela ficará disponível em "Meus Links/Linkflow".`);
    });
  }

  const btnPublishVercel = document.getElementById('btn-publish-vercel');
  if (btnPublishVercel) {
    btnPublishVercel.addEventListener('click', () => {
      if (!lastGeneratedHtml) {
        alert('Nenhum site gerado para publicar. Crie um site primeiro pelo chat!');
        return;
      }
      const vercelToken = localStorage.getItem('sidarta_vercel_token') || '';
      const inputToken = prompt(
        '🚀 Publicar Diretamente na Vercel (API Deploy):\n\nInsira seu Vercel Access Token para publicar esta página instantaneamente em um domínio .vercel.app:',
        vercelToken
      );

      if (inputToken) {
        localStorage.setItem('sidarta_vercel_token', inputToken);
        alert('Vercel Access Token salvo! A integração com a API da Vercel está pronta para efetuar os deploys diretos das suas páginas salvas.');
      }
    });
  }

  // ─── HELPERS ───
  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return '#' + match.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
});
