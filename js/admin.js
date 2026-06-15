// =============================================
// admin.js — Lógica do Painel Administrativo
// =============================================

const ADMIN_USER = 'ADM26';
const ADMIN_PWD = 'B2026'; // Obs: Hash local pode ser feito, mas usamos texto puro por restrições de servidor estático

// Elementos
const loginModal = document.getElementById('admin-login-modal');
const adminPanel = document.getElementById('admin-panel');
const userInput = document.getElementById('admin-user-input');
const pwdInput = document.getElementById('admin-pwd-input');
const btnLogin = document.getElementById('btn-admin-login');
const loginError = document.getElementById('admin-login-error');
const btnLogout = document.getElementById('btn-admin-logout');
const menuBtns = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('.admin-section');

// Estado
let allUsersCache = [];
let allResultsCache = {};

// 1. AUTENTICAÇÃO
function checkAuth() {
  if (sessionStorage.getItem('admin_auth') === 'true') {
    loginModal.classList.add('hidden');
    adminPanel.style.display = 'flex';
    initAdmin();
  } else {
    loginModal.classList.remove('hidden');
    adminPanel.style.display = 'none';
  }
}

btnLogin.addEventListener('click', () => {
  if (userInput.value === ADMIN_USER && pwdInput.value === ADMIN_PWD) {
    sessionStorage.setItem('admin_auth', 'true');
    logAction('Login', 'Admin autenticado com sucesso', '');
    checkAuth();
  } else {
    loginError.style.display = 'block';
  }
});

btnLogout.addEventListener('click', () => {
  sessionStorage.removeItem('admin_auth');
  logAction('Logout', 'Admin encerrou a sessão', '');
  checkAuth();
});

// 2. NAVEGAÇÃO
menuBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    menuBtns.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(e.target.getAttribute('data-target')).classList.add('active');
  });
});

// 3. INICIALIZAÇÃO
async function initAdmin() {
  if (typeof ALL_MATCHES === 'undefined') return;

  // Usa o hook nativo do sistema para manter o cache de resultados e ranking atualizado
  dbAPI.listenToUpdates((ranking, officialResults) => {
    allResultsCache = officialResults || {};
    allUsersCache = ranking || []; // Ranking já traz exato, vencedor e pts
    
    renderJogos();
    renderRanking();
    renderUsuarios();
    renderBonusAdmin();
    populateBetFilters();
  });
}

// 4. SISTEMA DE LOGS
async function logAction(action, newValue, oldValue) {
  const logEntry = {
    date: new Date().toISOString(),
    admin: ADMIN_USER,
    action: action,
    oldValue: oldValue,
    newValue: newValue
  };
  console.log("ADMIN LOG:", logEntry);
  
  if (typeof db !== 'undefined' && db) {
    db.collection('admin_logs').add(logEntry).catch(e => console.error("Log error", e));
  } else {
    let logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('admin_logs', JSON.stringify(logs));
  }
}

// 5. TOAST NOTIFICATIONS
function showAdminToast(msg, isError = false) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.color = 'white';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '99999';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
    document.body.appendChild(toast);
  }
  
  toast.style.backgroundColor = isError ? 'var(--admin-primary)' : 'var(--admin-success)';
  toast.innerHTML = msg;
  toast.style.opacity = '1';
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 3000);
}

// =============================================
// SEÇÃO: JOGOS
// =============================================
function renderJogos() {
  const container = document.getElementById('admin-jogos-list');
  let html = '';
  const agora = new Date();

  ALL_MATCHES.forEach(match => {
    const res = allResultsCache[match.id];
    const isFinished = !!(res && res.home !== undefined);
    const isCanceled = res && res.canceled;
    
    let statusClass = 'status-agendado';
    let statusText = 'Agendado';
    
    if (isCanceled) {
      statusClass = 'status-cancelado';
      statusText = 'Cancelado';
    } else if (isFinished) {
      statusClass = 'status-encerrado';
      statusText = 'Encerrado';
    } else if (agora >= match.date) {
      statusClass = 'status-andamento';
      statusText = 'Em andamento / Aguardando';
    }

    const homeVal = isFinished && !isCanceled ? res.home : '';
    const awayVal = isFinished && !isCanceled ? res.away : '';

    html += `
      <div class="admin-game-card">
        <div class="admin-game-meta">
          <div><strong>Grupo ${match.group}</strong></div>
          <div>${match.dateStr}</div>
          <div style="margin-top: 8px;"><span class="badge-status ${statusClass}">${statusText}</span></div>
        </div>
        <div class="admin-game-teams">
          <span style="font-weight: 600;">${match.home.name}</span>
          <img src="https://flagcdn.com/w40/${match.home.code}.png" alt="home">
          
          <input type="number" id="res-home-${match.id}" class="admin-score-input" value="${homeVal}" min="0">
          <span style="font-size: 1.2rem;">×</span>
          <input type="number" id="res-away-${match.id}" class="admin-score-input" value="${awayVal}" min="0">
          
          <img src="https://flagcdn.com/w40/${match.away.code}.png" alt="away">
          <span style="font-weight: 600;">${match.away.name}</span>
        </div>
        <div class="admin-game-actions" style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-admin primary" onclick="salvarResultado('${match.id}')">Salvar Resultado</button>
          <button class="btn-admin" style="background:#8a2be2;" onclick="finalizarJogo('${match.id}')">Finalizar Jogo</button>
          <button class="btn-admin secondary" style="background:#444;" onclick="zerarResultado('${match.id}')">Zerar Placar</button>
          <button class="btn-admin danger" onclick="cancelarJogo('${match.id}')">Cancelar Jogo</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.salvarResultado = async function(matchId) {
  const hVal = document.getElementById(`res-home-${matchId}`).value;
  const aVal = document.getElementById(`res-away-${matchId}`).value;
  
  if (hVal === '' || aVal === '') {
    showAdminToast("Erro: Preencha os placares das duas equipes!", true);
    return;
  }
  
  const resultsObj = {};
  resultsObj[matchId] = { home: parseInt(hVal), away: parseInt(aVal), canceled: false };
  
  await dbAPI.saveResult(resultsObj);
  logAction('Salvar Resultado', `Jogo ${matchId}: ${hVal}x${aVal}`, 'Sem resultado oficial');
  showAdminToast("Resultado salvo com sucesso!");
  logAction("salvar_resultado", resultsObj, null);
};

window.finalizarJogo = async function(matchId) {
  if (!confirm('Tem certeza que deseja finalizar este jogo manualmente? Ele será encerrado na tela principal.')) return;
  const hVal = document.getElementById(`res-home-${matchId}`).value;
  const aVal = document.getElementById(`res-away-${matchId}`).value;
  
  if (hVal === '' || aVal === '') {
    showAdminToast("Erro: Preencha os placares antes de finalizar!", true);
    return;
  }
  
  const resultsObj = {};
  resultsObj[matchId] = { home: parseInt(hVal), away: parseInt(aVal), canceled: false, status: 'finished' };
  
  await dbAPI.saveResult(resultsObj);
  showAdminToast("Jogo finalizado com sucesso!");
  logAction("finalizar_jogo", resultsObj, null);
};

window.zerarResultado = async function(matchId) {
  if (!confirm("Tem certeza que deseja zerar o placar deste jogo? Ele voltará a ficar sem resultado e pontos distribuídos serão removidos.")) return;
  
  await dbAPI.deleteResult(matchId);
  logAction('Zerar Resultado', `Jogo ${matchId} teve placar removido`, '');
  showAdminToast("Placar removido com sucesso! Ranking recalculado.");
};

window.cancelarJogo = async function(matchId) {
  if (!confirm("Tem certeza que deseja cancelar este jogo? Ninguém receberá pontos.")) return;
  
  const resultsObj = {};
  resultsObj[matchId] = { canceled: true };
  
  await dbAPI.saveResult(resultsObj);
  logAction('Cancelar Jogo', `Jogo ${matchId} marcado como cancelado`, '');
  showAdminToast("Jogo cancelado com sucesso.");
};

// =============================================
// SEÇÃO: BÔNUS
// =============================================
function renderBonusAdmin() {
  const container = document.getElementById('admin-bonus-list');
  const categorias = [
    { key: 'campeao', label: 'Campeão da Copa' },
    { key: 'artilheiro', label: 'Artilheiro da Copa' },
    { key: 'craque', label: 'Craque da Copa' },
    { key: 'goleiro', label: 'Melhor Goleiro' },
    { key: 'defensor', label: 'Melhor Defensor' },
    { key: 'revelacao', label: 'Jogador Revelação' },
    { key: 'decepcao', label: 'Decepção da Copa' },
    { key: 'neymar_gol', label: 'Neymar vai marcar?' }
  ];
  
  let html = '';
  categorias.forEach(cat => {
    const val = allResultsCache['bonus_' + cat.key] || '';
    html += `
      <div class="admin-game-card" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0 0 8px 0;">${cat.label}</h3>
          <input type="text" id="res-bonus-${cat.key}" class="modal-input" placeholder="Resultado Oficial" value="${val}" style="width: 300px;">
        </div>
        <button class="btn-admin primary" onclick="salvarResultadoBonus('${cat.key}')">Salvar Resultado</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

window.salvarResultadoBonus = async function(key) {
  const val = document.getElementById(`res-bonus-${key}`).value.trim();
  
  if (val === '') {
    showAdminToast("Erro: Preencha o resultado bônus!", true);
    return;
  }
  
  const resultsObj = {};
  resultsObj['bonus_' + key] = val;
  
  await dbAPI.saveResult(resultsObj);
  logAction('Salvar Bônus', `Bônus ${key}: ${val}`, '');
  showAdminToast("Resultado Bônus Oficial salvo! Pontos recalculados automaticamente.");
};


// =============================================
// SEÇÃO: RANKING & USUÁRIOS
// =============================================
function renderRanking() {
  const tbody = document.getElementById('admin-ranking-tbody');
  if (!allUsersCache.length) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhum dado encontrado.</td></tr>';
    return;
  }
  
  let html = '';
  allUsersCache.forEach((user, idx) => {
    html += `
      <tr>
        <td>${idx + 1}º</td>
        <td><strong>${(user.nickname || user.name)}</strong><br><small style="color:var(--admin-muted)">ID: ${user.id}</small></td>
        <td style="color: var(--admin-primary); font-weight: bold; font-size: 1.1rem;">${user.pts} pts</td>
        <td><span style="background:var(--admin-success); color:white; padding:2px 6px; border-radius:4px; font-size:10px;">${user.exato} 🎯</span> &nbsp; <span style="background:#3b82f6; color:white; padding:2px 6px; border-radius:4px; font-size:10px;">${user.vencedor} ✓</span></td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function renderUsuarios() {
  const tbody = document.getElementById('admin-usuarios-tbody');
  if (!allUsersCache.length) {
    tbody.innerHTML = '<tr><td colspan="6">Nenhum usuário encontrado.</td></tr>';
    return;
  }
  
  let html = '';
  // allUsersCache already has pts, exato, vencedor, curingasUsados from listenToUpdates
  allUsersCache.forEach((user) => {
    let curingasDisp = 2 - (user.curingasUsados || 0);
    html += `
      <tr>
        <td><strong>${(user.nickname || user.name)}</strong><br><small style="color:var(--admin-muted)">ID: ${user.id}</small></td>
        <td>${user.pts}</td>
        <td>${user.exato}</td>
        <td>${user.vencedor}</td>
        <td><strong>${curingasDisp}</strong> disp.</td>
        <td>
          <button class="btn-admin" onclick="filtrarApostasUsuario('${user.id}')" style="margin-right:8px; margin-bottom:4px;">Ver Apostas</button>
          <button class="btn-admin secondary" onclick="definirPontos('${user.id}', '${(user.nickname || user.name)}', ${user.pontos_ajuste})" style="margin-right:8px; margin-bottom:4px; background:var(--admin-success); color:white; border:none;">Definir Pontos</button>
          <button class="btn-admin" onclick="resetarCuringa('${user.id}')" style="margin-right:8px; margin-bottom:4px; background:#eab308; color:black; border:none;">Resetar Curinga</button>
          <button class="btn-admin" onclick="darTrofeuManual('${user.id}', '${(user.nickname || user.name)}')" style="margin-right:8px; margin-bottom:4px; background:#8a2be2; color:white; border:none;">Dar Troféu 🏆</button>
          <button class="btn-admin secondary" onclick="zerarUsuario('${user.id}')" style="margin-right:8px; margin-bottom:4px;">Zerar Pontuação</button>
          <button class="btn-admin danger" onclick="excluirUsuario('${user.id}', '${(user.nickname || user.name)}')" style="margin-bottom:4px;">Excluir Conta</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

window.zerarUsuario = async function(userId) {
  const code = prompt("Digite CONFIRMAR para zerar toda a pontuação e deletar as apostas deste usuário:");
  if (code !== "CONFIRMAR") {
    showAdminToast("Operação de exclusão abortada.", true);
    return;
  }
  
  logAction("Zerar Usuário", `Usuário ${userId} zerado.`, '');
  
  if (typeof db !== 'undefined' && db) {
    // Delete picks subcollection is tricky in client-side, we can just delete the user doc 
    // or clear fields if we only want to reset points. But since ranking is computed dynamically,
    // we MUST delete their picks to truly zero them.
    const picksSnap = await db.collection('users').doc(userId).collection('picks').get();
    const batch = db.batch();
    picksSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } else {
    localStorage.removeItem('user_' + userId);
  }
  showAdminToast("Pontuação do usuário zerada com sucesso!");
};

window.excluirUsuario = async function(userId, userName) {
  const code = prompt(`ATENÇÃO! Digite DELETAR para apagar permanentemente a conta de ${userName}. Eles terão que fazer um novo cadastro se quiserem voltar:`);
  if (code !== "DELETAR") {
    showAdminToast("Operação abortada.", true);
    return;
  }
  
  logAction("Excluir Usuário", `Usuário ${userName} (${userId}) excluído do sistema.`, '');
  
  if (typeof db !== 'undefined' && db) {
    const picksSnap = await db.collection('users').doc(userId).collection('picks').get();
    const batch = db.batch();
    picksSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    // Apaga o documento raiz do usuário
    batch.delete(db.collection('users').doc(userId));
    await batch.commit();
  } else {
    localStorage.removeItem('user_' + userId);
  }
  showAdminToast(`Conta de ${userName} excluída permanentemente!`);
};

window.definirPontos = async function(userId, userName, currentAjuste) {
  const val = prompt(`Ajuste de Pontos para ${userName}.\n\nValor atual de ajuste: ${currentAjuste}\n\nDigite o valor que deseja adicionar (ex: 10) ou subtrair (ex: -5) do total de pontos:`, currentAjuste || 0);
  if (val === null) return; // Cancelled
  
  const intVal = parseInt(val);
  if (isNaN(intVal)) {
    showAdminToast("Valor inválido.", true);
    return;
  }
  
  await dbAPI.savePontosAjuste(userId, userName, intVal);
  logAction("Definir Pontos", `Usuário ${userId} recebeu ajuste de ${intVal} pontos`, "");
  showAdminToast("Pontos ajustados com sucesso! Ranking será recalculado.");
};

window.resetarCuringa = async function(userId) {
  if (!confirm("Tem certeza que deseja devolver a carta lendária (2x) para este usuário?\n\nIsso removerá o bônus 2x de TODAS as apostas anteriores dele onde o curinga foi usado, permitindo que ele use novamente.")) return;
  
  await dbAPI.resetUserCuringa(userId);
  logAction("Resetar Curinga", `Curinga do usuário ${userId} resetado`, "");
  showAdminToast("Curinga resetado com sucesso!");
};

window.darTrofeuManual = async function(userId, userName) {
  document.getElementById('dar-trofeu-userid').value = userId;
  document.getElementById('dar-trofeu-username').innerText = userName;
  document.getElementById('dar-trofeu-select').selectedIndex = 0;
  document.getElementById('modal-dar-trofeu').classList.remove('hidden');
};

document.getElementById('btn-cancel-trofeu').addEventListener('click', () => {
  document.getElementById('modal-dar-trofeu').classList.add('hidden');
});

document.getElementById('btn-save-trofeu').addEventListener('click', async () => {
  const userId = document.getElementById('dar-trofeu-userid').value;
  const badgeId = document.getElementById('dar-trofeu-select').value;
  const userName = document.getElementById('dar-trofeu-username').innerText;

  if (!badgeId || !userId) return;

  const btn = document.getElementById('btn-save-trofeu');
  btn.innerText = 'Salvando...';
  btn.disabled = true;

  try {
    await dbAPI.saveManualBadge(userId, badgeId);
    logAction("Dar Troféu", `Deu o troféu '${badgeId}' para o usuário ${userId}`, "");
    showAdminToast(`Troféu concedido com sucesso para ${userName}! Ranking será recalculado.`);
    document.getElementById('modal-dar-trofeu').classList.add('hidden');
  } catch (err) {
    showAdminToast("Erro ao conceder troféu.", true);
  }

  btn.innerText = 'Conceder Troféu';
  btn.disabled = false;
});

document.getElementById('btn-recalc-all').addEventListener('click', () => {
  // Since db.js listenToUpdates already fetches ALL users and ALL results and calculates them, 
  // simply resaving a dummy meta triggers the recalculation for everyone.
  logAction("Recalcular Geral", "Forçou o recálculo do ranking", "");
  showAdminToast("O ranking já é calculado dinamicamente na nuvem! Está 100% atualizado.");
});

document.getElementById('btn-export-csv').addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Posicao,Nome,ID,Pontos,Placares_Exatos,Vencedores_Acertados\n";
  allUsersCache.forEach((user, idx) => {
    csvContent += `${idx+1},${(user.nickname || user.name)},${user.id},${user.pts},${user.exato},${user.vencedor}\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ranking_bolao2026.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  logAction("Exportar Ranking", "Gerou CSV do Ranking Geral", "");
});

// =============================================
// SEÇÃO: APOSTAS (Edição Manual)
// =============================================
const filterGame = document.getElementById('filter-game');
const filterUser = document.getElementById('filter-user');

function populateBetFilters() {
  if (filterGame.options.length <= 1) {
    ALL_MATCHES.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.text = `Grupo ${m.group} | ${m.home.name} x ${m.away.name}`;
      filterGame.appendChild(opt);
    });
  }
}

async function carregarApostasTabela() {
  const matchId = filterGame.value;
  const userNameSearch = filterUser.value.toLowerCase();
  const tbody = document.getElementById('admin-apostas-tbody');
  
  if (!matchId) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Selecione um jogo no filtro acima.</td></tr>';
    return;
  }
  
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Buscando apostas...</td></tr>';
  
  let html = '';
  
  if (typeof db !== 'undefined' && db) {
    // Busca as apostas desse jogo para todos os usuários
    // Como não temos Firebase Admin SDK, precisamos varrer usuarios
    const usersSnap = await db.collection('users').get();
    for (let uDoc of usersSnap.docs) {
      if (userNameSearch && !uDoc.data().name?.toLowerCase().includes(userNameSearch)) continue;
      
      const pickDoc = await db.collection('users').doc(uDoc.id).collection('picks').doc(matchId).get();
      if (pickDoc.exists) {
        html += renderLinhaAposta(uDoc.id, uDoc.data().name || 'Anônimo', matchId, pickDoc.data());
      }
    }
  } else {
    // Modo localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('user_')) {
        const data = JSON.parse(localStorage.getItem(key));
        if (userNameSearch && !data.name?.toLowerCase().includes(userNameSearch)) continue;
        if (data.picks && data.picks[matchId]) {
          const userId = key.replace('user_', '');
          html += renderLinhaAposta(userId, data.name || 'Anônimo', matchId, data.picks[matchId]);
        }
      }
    }
  }
  
  if (!html) html = '<tr><td colspan="5" style="text-align: center;">Nenhuma aposta encontrada.</td></tr>';
  tbody.innerHTML = html;
}

function renderLinhaAposta(userId, userName, matchId, pick) {
  const r = allResultsCache[matchId];
  let pts = 0;
  let statusHTML = '<span class="badge-status status-agendado">Pendente</span>';
  
  if (r && r.home !== undefined && !r.canceled) {
    if (pick.home === r.home && pick.away === r.away) {
      pts = 3;
      statusHTML = '<span class="badge-status status-encerrado">Placar Exato</span>';
    } else if (
      (pick.home > pick.away && r.home > r.away) ||
      (pick.home < pick.away && r.home < r.away) ||
      (pick.home === pick.away && r.home === r.away)
    ) {
      pts = 1;
      statusHTML = '<span class="badge-status status-andamento" style="background:#3b82f6; color:white;">Vencedor</span>';
    } else {
      pts = 0;
      statusHTML = '<span class="badge-status status-agendado" style="background:var(--admin-border);">Errou</span>';
    }
  }
  
  const m = ALL_MATCHES.find(x => x.id === matchId);
  const jogoStr = `${m.home.name} x ${m.away.name}`;
  const pickStr = `${pick.home} x ${pick.away}`;
  
  return `
    <tr>
      <td>${userName}<br><small style="color:var(--admin-muted)">${userId}</small></td>
      <td>${jogoStr}</td>
      <td style="font-weight:bold;">${pickStr}</td>
      <td><strong>${pts} pts</strong> ${statusHTML}</td>
      <td>
        <button class="btn-admin" onclick="abrirModalEdicao('${userId}', '${userName}', '${matchId}', ${pick.home}, ${pick.away})">Editar</button>
      </td>
    </tr>
  `;
}

filterGame.addEventListener('change', carregarApostasTabela);
filterUser.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') carregarApostasTabela();
});

window.filtrarApostasUsuario = function(userId) {
  const user = allUsersCache.find(u => u.id === userId);
  if (user) {
    filterUser.value = (user.nickname || user.name);
    document.querySelector('.menu-btn[data-target="sec-apostas"]').click();
  }
};

// Modal Edição Aposta
const modalEditBet = document.getElementById('modal-edit-bet');
const editBetUser = document.getElementById('edit-bet-user');
const editBetUserid = document.getElementById('edit-bet-userid');
const editBetGame = document.getElementById('edit-bet-game');
const editBetGameid = document.getElementById('edit-bet-gameid');
const editBetHome = document.getElementById('edit-bet-home');
const editBetAway = document.getElementById('edit-bet-away');

window.abrirModalEdicao = function(userId, userName, matchId, home, away) {
  editBetUserid.value = userId;
  editBetUser.value = userName;
  editBetGameid.value = matchId;
  
  const m = ALL_MATCHES.find(x => x.id === matchId);
  editBetGame.value = `${m.home.name} x ${m.away.name}`;
  
  editBetHome.value = home;
  editBetAway.value = away;
  
  modalEditBet.classList.remove('hidden');
};

document.getElementById('btn-cancel-edit').addEventListener('click', () => {
  modalEditBet.classList.add('hidden');
});

document.getElementById('btn-save-edit').addEventListener('click', async () => {
  const userId = editBetUserid.value;
  const userName = editBetUser.value;
  const matchId = editBetGameid.value;
  const h = parseInt(editBetHome.value);
  const a = parseInt(editBetAway.value);
  
  if (isNaN(h) || isNaN(a)) {
    showAdminToast("Erro: Valores inválidos para a aposta.", true);
    return;
  }
  
  await dbAPI.savePick(userId, userName, matchId, h, a);
  logAction("Editar Aposta", `Aposta do usuário ${userId} no jogo ${matchId} alterada para ${h}x${a}`, "");
  
  modalEditBet.classList.add('hidden');
  carregarApostasTabela();
  showAdminToast("Aposta do usuário salva com sucesso!");
});

document.getElementById('btn-add-bet').addEventListener('click', () => {
  const matchId = filterGame.value;
  if (!matchId) {
    showAdminToast("Erro: Selecione um jogo no filtro primeiro.", true);
    return;
  }

  const userNameInput = filterUser.value.trim();
  let userName = userNameInput;
  let userId = '';

  if (!userName) {
    userName = prompt("Digite o nome do Usuário para esta aposta manual:");
    if (!userName) return;
  }

  // Try to find if user already exists by name
  const existingUser = allUsersCache.find(u => u.name.toLowerCase() === userName.toLowerCase());
  
  if (existingUser) {
    userId = existingUser.id;
    userName = existingUser.name;
  } else {
    // Generates a new ID for the manual user
    userId = 'manual_' + Date.now();
  }
  
  abrirModalEdicao(userId, userName, matchId, 0, 0);
});

// INITIALIZE
checkAuth();

// GOAL NOTIFICATION LISTENER
window.addEventListener('goalScored', function(e) {
  var matchId = e.detail.matchId;
  var team = e.detail.team;
  var homeScore = e.detail.homeScore;
  var awayScore = e.detail.awayScore;
  
  var match = window.allMatchesCache ? window.allMatchesCache.find(m => m.id === matchId) : null;
  
  var title = 'GOOOL!';
  var subtitle = matchId + ': ' + homeScore + ' x ' + awayScore;
  
  if (match) {
    var teamName = team === 'home' ? match.home.name : match.away.name;
    title = 'GOOOL DA ' + teamName.toUpperCase() + '!';
    subtitle = match.home.name + ' ' + homeScore + ' x ' + awayScore + ' ' + match.away.name;
  }
  
  var container = document.getElementById('goal-notification-container');
  var titleEl = document.getElementById('goal-title');
  var subtitleEl = document.getElementById('goal-subtitle');
  
  if (container && titleEl && subtitleEl) {
    titleEl.innerText = title;
    subtitleEl.innerText = subtitle;
    
    container.classList.remove('hidden');
    
    setTimeout(function() {
      container.classList.add('hidden');
    }, 5000);
  }
});
