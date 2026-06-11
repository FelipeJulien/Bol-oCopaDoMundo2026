// =============================================
// app.js — LÓGICA DE UI E EVENTOS DO DASHBOARD
// =============================================

// ELEMENTOS DOM
const els = {
  proximosContainer: document.getElementById('proximos-container'),
  gruposContainer: document.getElementById('grupos-container'),
  rankingContainer: document.getElementById('ranking-container'),
  tabs: document.querySelectorAll('.tab-btn'),
  panes: document.querySelectorAll('.tab-pane'),
  mobileToggle: document.getElementById('btn-mobile-toggle'),
  sidebar: document.getElementById('sidebar'),
  bonusSelects: document.querySelectorAll('.bonus-input')
};

// 1. RENDERIZAÇÃO INICIAL
function renderMatches() {
  const agora = new Date();
  const tresDiasDepois = new Date(agora.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  let htmlGrupos = '';
  let htmlProximos = '';
  let curGroup = '';

  ALL_MATCHES.forEach(match => {
    // Header do Grupo
    if (match.group !== curGroup) {
      curGroup = match.group;
      htmlGrupos += `<h3 class="group-header">Grupo ${curGroup}</h3>`;
    }

    const matchCard = `
      <div class="match-card">
        <div class="match-date">${formatDate(match.date)}</div>
        <div class="match-teams">
          <div class="team home">
            <span class="team-name">${match.home.name}</span>
            <img src="https://flagcdn.com/w40/${match.home.code}.png" class="flag-img" alt="${match.home.name}">
          </div>
          <div class="score-area">
            <input type="number" class="score-input p-home" data-match="${match.id}" min="0" max="20" id="p-home-${match.id}">
            <span class="vs-text">×</span>
            <input type="number" class="score-input p-away" data-match="${match.id}" min="0" max="20" id="p-away-${match.id}">
            <div class="save-status" id="status-${match.id}">✓</div>
          </div>
          <div class="team away">
            <img src="https://flagcdn.com/w40/${match.away.code}.png" class="flag-img" alt="${match.away.name}">
            <span class="team-name">${match.away.name}</span>
          </div>
        </div>
      </div>
    `;
    
    htmlGrupos += matchCard;

    // Lógica para "Próximos Jogos"
    // Se o jogo for depois de agora e antes de 3 dias
    if (match.date >= agora && match.date <= tresDiasDepois) {
      htmlProximos += matchCard;
    }
  });

  if (!htmlProximos) {
    htmlProximos = '<p style="color:var(--text-muted)">Nenhum jogo programado para os próximos 3 dias.</p>';
  }

  els.gruposContainer.innerHTML = htmlGrupos;
  els.proximosContainer.innerHTML = htmlProximos;
}

function renderBonusOptions() {
  let optionsHtml = '<option value="">Selecione...</option>';
  ALL_TEAMS.forEach(t => {
    optionsHtml += `<option value="${t.code}">${t.name}</option>`;
  });
  
  document.getElementById('bonus-campeao').innerHTML = optionsHtml;
  document.getElementById('bonus-ataque').innerHTML = optionsHtml;
  document.getElementById('bonus-decepcao').innerHTML = optionsHtml;
}

// 2. UTILITÁRIOS
function formatDate(dateObj) {
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const h = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  return `${d}/${m} - ${h}:${min}`;
}

function showSaveFeedback(matchId) {
  // Pega os inputs da aba de grupos e próximos jogos
  document.querySelectorAll(`.score-input[data-match="${matchId}"]`).forEach(input => {
    input.classList.remove('saved-flash');
    void input.offsetWidth; // trigger reflow
    input.classList.add('saved-flash');
  });

  // Mostrar micro ícone de OK
  document.querySelectorAll(`#status-${matchId}`).forEach(el => {
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1500);
  });
}

function showBonusSaveFeedback(element) {
  element.classList.remove('saved-flash');
  void element.offsetWidth;
  element.classList.add('saved-flash');
}

// 3. CARREGAR DADOS DO USUÁRIO
async function loadUserData() {
  const data = await dbAPI.getUserData(currentUser);
  
  // Preencher placares
  Object.keys(data.picks).forEach(matchId => {
    const pick = data.picks[matchId];
    document.querySelectorAll(`#p-home-${matchId}`).forEach(el => el.value = pick.home);
    document.querySelectorAll(`#p-away-${matchId}`).forEach(el => el.value = pick.away);
  });

  // Preencher bônus
  document.getElementById('bonus-campeao').value = data.bonus.campeao || '';
  document.getElementById('bonus-artilheiro').value = data.bonus.artilheiro || '';
  document.getElementById('bonus-ataque').value = data.bonus.ataque || '';
  document.getElementById('bonus-decepcao').value = data.bonus.decepcao || '';
}

// 4. EVENT LISTENERS PARA AUTO-SAVE
function setupAutoSave() {
  // Delegação de eventos para placares
  document.querySelector('.main-content').addEventListener('change', async (e) => {
    if (e.target.classList.contains('score-input')) {
      const matchId = e.target.getAttribute('data-match');
      
      // Procurar home e away no mesmo container
      const container = e.target.closest('.score-area');
      const hVal = container.querySelector('.p-home').value;
      const aVal = container.querySelector('.p-away').value;

      // Sincronizar input se estiver aparecendo em mais de uma aba
      document.querySelectorAll(`#p-home-${matchId}`).forEach(el => { if(el !== e.target) el.value = hVal; });
      document.querySelectorAll(`#p-away-${matchId}`).forEach(el => { if(el !== e.target) el.value = aVal; });

      if (hVal !== '' && aVal !== '') {
        await dbAPI.savePick(currentUser, currentUserName, matchId, parseInt(hVal), parseInt(aVal));
        showSaveFeedback(matchId);
      }
    }
    
    // Bônus auto-save
    if (e.target.classList.contains('bonus-input')) {
      const key = e.target.getAttribute('data-bonus');
      const val = e.target.value.trim();
      await dbAPI.saveBonus(currentUser, currentUserName, key, val);
      showBonusSaveFeedback(e.target);
    }
  });
}

// 5. ATUALIZAR RANKING REAL-TIME
function renderSidebarRanking(ranking) {
  if (ranking.length === 0) {
    els.rankingContainer.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Nenhum participante ainda.</div>';
    return;
  }

  let html = '';
  // Pega o top 5 + o próprio usuário se não estiver no top 5
  const top5 = ranking.slice(0, 5);
  let isMeInTop = false;

  top5.forEach((user, idx) => {
    if (user.id === currentUser) isMeInTop = true;
    const isMeClass = user.id === currentUser ? ' me' : '';
    html += `
      <div class="ranking-item${isMeClass}">
        <div class="rank-pos">${idx + 1}º</div>
        <div class="rank-name">${user.name}</div>
        <div class="rank-pts">${user.pts} pts</div>
      </div>
    `;
  });

  if (!isMeInTop && currentUser) {
    const myRankIdx = ranking.findIndex(u => u.id === currentUser);
    if (myRankIdx !== -1) {
      const me = ranking[myRankIdx];
      html += `
        <div style="text-align:center; color:var(--border); margin: 4px 0;">...</div>
        <div class="ranking-item me">
          <div class="rank-pos">${myRankIdx + 1}º</div>
          <div class="rank-name">${me.name}</div>
          <div class="rank-pts">${me.pts} pts</div>
        </div>
      `;
    }
  }

  els.rankingContainer.innerHTML = html;
}

// 6. COUNTDOWN TIMER
function initCountdown() {
  const targetDate = new Date('2026-06-11T00:00:00Z').getTime();
  
  setInterval(() => {
    const now = new Date().getTime();
    const dist = targetDate - now;
    
    if (dist < 0) {
      document.getElementById('cd-days').innerText = '00';
      document.getElementById('cd-hours').innerText = '00';
      document.getElementById('cd-mins').innerText = '00';
      return;
    }
    
    const days = Math.floor(dist / (1000 * 60 * 60 * 24));
    const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');
  }, 1000);
}

// 7. TABS & MOBILE
els.tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    els.tabs.forEach(t => t.classList.remove('active'));
    els.panes.forEach(p => p.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-target')).classList.add('active');
  });
});

els.mobileToggle.addEventListener('click', () => {
  els.sidebar.classList.toggle('mobile-open');
});

// Fecha o sidebar ao clicar fora no mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900 && els.sidebar.classList.contains('mobile-open')) {
    if (!els.sidebar.contains(e.target) && e.target !== els.mobileToggle) {
      els.sidebar.classList.remove('mobile-open');
    }
  }
});

// PONTO DE ENTRADA (Chamado por auth.js)
function initApp() {
  renderMatches();
  renderBonusOptions();
  loadUserData();
  setupAutoSave();
  initCountdown();
  
  // Inicia listener de resultados oficiais no DB para o Ranking ao vivo
  dbAPI.listenToUpdates((ranking) => {
    renderSidebarRanking(ranking);
  });
}
