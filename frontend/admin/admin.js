import { 
  auth, 
  db, 
  onAuthStateChanged, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from '/firebase-config.js';
import { supabase } from '/supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const usersTableBody = document.getElementById('users-table-body');
  const userCountEl = document.getElementById('user-count');
  const toast = document.getElementById('toast');

  function showToast(msg, isError = false) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = isError ? '#ff4d4f' : '#28a745';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // 1. Verificação de Segurança (Super Admin Guard)
  async function checkAdminAccess(currentUser) {
    const localUser = JSON.parse(localStorage.getItem('sidarta_user') || '{}');
    const userEmail = currentUser ? currentUser.email : (localUser.email || '');

    const isMasterAdmin = (userEmail === 'brisasofc@gmail.com' || userEmail === 'isaacbomfim.00@gmail.com' || userEmail === 'comercial@grupoarrezeb.com');

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const uData = snap.data();
        if (!isMasterAdmin && uData.role !== 'admin') {
          alert('Acesso negado: Apenas o Administrador tem permissão de gerenciar o sistema.');
          window.location.href = '/dashboard/index.html';
          return false;
        }
      }
    } else if (!isMasterAdmin && localUser.role !== 'admin') {
      alert('Acesso restrito ao Administrador. Faça login com uma conta de Administrador.');
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const hasAccess = await checkAdminAccess(user);
      if (hasAccess) initRealtimeUsers();
    } else {
      // Tentar Supabase session fallback
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const hasAccess = await checkAdminAccess(session.user);
        if (hasAccess) initRealtimeUsers();
      } else {
        const localUser = JSON.parse(localStorage.getItem('sidarta_user') || '{}');
        if (localUser.email === 'brisasofc@gmail.com' || localUser.email === 'isaacbomfim.00@gmail.com' || localUser.role === 'admin') {
          initRealtimeUsers();
        } else {
          alert('Sessão expirada ou acesso restrito.');
          window.location.href = '/login.html';
        }
      }
    }
  });

  // 2. Navegação da Sidebar
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const sections = document.querySelectorAll('.section-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      if (targetId && document.getElementById(targetId)) {
        document.getElementById(targetId).classList.add('active');
      }
    });
  });

  // Botão Voltar ao Dashboard
  const btnBack = document.getElementById('btn-back-dashboard');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.location.href = '/dashboard/index.html';
    });
  }

  // 3. Renderização Dinâmica em Tempo Real da Tabela de Usuários (Firestore)
  function initRealtimeUsers() {
    if (!usersTableBody) return;

    onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach(docSnap => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (userCountEl) userCountEl.textContent = usersList.length;

      if (usersList.length === 0) {
        usersTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 20px;">
              Nenhum usuário cadastrado no Firestore ainda.
            </td>
          </tr>`;
        return;
      }

      usersTableBody.innerHTML = usersList.map(u => {
        const isMaster = (u.email === 'brisasofc@gmail.com' || u.email === 'isaacbomfim.00@gmail.com');
        const isBlocked = u.status === 'blocked';
        const isAdmin = u.role === 'admin';

        const roleBadge = isMaster 
          ? `<span class="badge" style="background: rgba(255, 215, 0, 0.2); color: #ffd700; border: 1px solid #ffd700;">👑 Super Admin</span>`
          : (isAdmin 
            ? `<span class="badge" style="background: rgba(13, 110, 253, 0.2); color: #4db8ff; border: 1px solid #0d6efd;">Admin</span>` 
            : `<span class="badge" style="background: rgba(255, 255, 255, 0.05); color: #adb5bd;">Usuário</span>`);

        const statusBadge = isBlocked 
          ? `<span class="badge badge-blocked">Bloqueado</span>`
          : `<span class="badge badge-active">Ativo</span>`;

        const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Recente';

        const blockBtnText = isBlocked ? 'Desbloquear' : 'Bloquear';
        const blockBtnClass = isBlocked ? 'style="background: #28a745; color: white;"' : 'style="background: #ff4d4f; color: white;"';

        const adminBtnText = isAdmin ? 'Remover Admin' : 'Tornar Admin';

        return `
          <tr>
            <td>
              <strong>${escapeHtml(u.displayName || u.email.split('@')[0])}</strong><br>
              <span style="color: var(--text-secondary); font-size: 12px;">${escapeHtml(u.email || '')}</span>
            </td>
            <td>${roleBadge}</td>
            <td>${dateStr}</td>
            <td>${statusBadge}</td>
            <td>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${isMaster ? '<span style="font-size: 12px; color: #ffd700;">Protegido</span>' : `
                  <button class="btn-action btn-toggle-block" ${blockBtnClass} data-id="${u.id}" data-status="${u.status || 'active'}">
                    ${blockBtnText}
                  </button>
                  <button class="btn-action btn-toggle-admin" style="background: #0d6efd; color: white;" data-id="${u.id}" data-role="${u.role || 'user'}">
                    ${adminBtnText}
                  </button>
                  <button class="btn-action btn-delete-user" style="background: rgba(255, 77, 79, 0.2); color: #ff4d4f; border: 1px solid #ff4d4f;" data-id="${u.id}">
                    Excluir
                  </button>
                `}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      attachActionListeners();
    }, (error) => {
      console.error('Erro no listener do Firestore:', error);
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #ff4d4f; padding: 20px;">
            Erro ao carregar usuários do Firestore. Verifique a permissão do projeto.
          </td>
        </tr>`;
    });
  }

  function attachActionListeners() {
    // Alternar Bloqueio
    document.querySelectorAll('.btn-toggle-block').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.target.getAttribute('data-id');
        const currentStatus = e.target.getAttribute('data-status');
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        try {
          await updateDoc(doc(db, 'users', uid), { status: newStatus });
          showToast(`Usuário ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
        } catch (err) {
          showToast('Erro ao alterar status: ' + err.message, true);
        }
      });
    });

    // Alternar Função de Admin
    document.querySelectorAll('.btn-toggle-admin').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.target.getAttribute('data-id');
        const currentRole = e.target.getAttribute('data-role');
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
          await updateDoc(doc(db, 'users', uid), { role: newRole });
          showToast(`Permissão alterada para ${newRole.toUpperCase()}!`);
        } catch (err) {
          showToast('Erro ao alterar permissão: ' + err.message, true);
        }
      });
    });

    // Excluir Usuário
    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja remover este usuário permanentemente?')) {
          try {
            await deleteDoc(doc(db, 'users', uid));
            showToast('Usuário removido com sucesso!');
          } catch (err) {
            showToast('Erro ao remover usuário: ' + err.message, true);
          }
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 4. Lógica de Configuração de Backend de IA (Salva APENAS URL e provider — NUNCA chaves)
  const providerSelect  = document.getElementById('provider');
  const backendUrlInput = document.getElementById('backend-url');
  const formAi          = document.getElementById('ai-keys-form');

  // Carrega config salva (apenas URL + provider, nunca chaves)
  const savedConfig = JSON.parse(localStorage.getItem('sidarta_ai_config') || '{}');
  // Retrocompatibilidade: lê backendUrl do formato antigo se novo não existir
  const legacyConfig = JSON.parse(localStorage.getItem('sidarta_ai_keys') || '{}');
  const loadedBackendUrl = savedConfig.backendUrl || legacyConfig.backendUrl || '';
  const loadedProvider   = savedConfig.provider   || legacyConfig.provider   || 'gemini';

  if (providerSelect  && loadedProvider)   providerSelect.value   = loadedProvider;
  if (backendUrlInput && loadedBackendUrl) backendUrlInput.value  = loadedBackendUrl;

  // Remove qualquer chave de API que possa ter sido salva anteriormente por segurança
  if (legacyConfig.gemini || legacyConfig.openai || legacyConfig.anthropic) {
    delete legacyConfig.gemini;
    delete legacyConfig.openai;
    delete legacyConfig.anthropic;
    localStorage.setItem('sidarta_ai_keys', JSON.stringify(legacyConfig));
    console.info('[Admin] Chaves de API removidas do localStorage por segurança. Configure-as como variáveis de ambiente no Render.');
  }

  if (formAi) {
    formAi.addEventListener('submit', (e) => {
      e.preventDefault();
      const provider   = providerSelect  ? providerSelect.value.trim()  : 'gemini';
      const backendUrl = backendUrlInput ? backendUrlInput.value.trim() : '';

      // Salva APENAS configurações não-sensíveis
      if (window.aiService) {
        window.aiService.saveConfig({ provider, backendUrl });
      }
      showToast('Configurações salvas! A chave de API deve estar nas variáveis de ambiente do Render.');
    });
  }
});
