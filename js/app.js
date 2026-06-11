// =============================================
// app.js — LÓGICA DE UI E EVENTOS DO DASHBOARD
// =============================================

// ELEMENTOS DOM
const els = {
  proximosContainer: document.getElementById('proximos-container'),
  jogosContainer: document.getElementById('jogos-container'),
  gruposContainer: document.getElementById('grupos-container'),
  rankingContainer: document.getElementById('ranking-container'),
  tabs: document.querySelectorAll('.tab-btn'),
  panes: document.querySelectorAll('.tab-pane'),
  mobileToggle: document.getElementById('btn-mobile-toggle'),
  sidebar: document.getElementById('sidebar'),
  bonusSelects: document.querySelectorAll('.bonus-input'),
  headerStatus: document.getElementById('header-status')
};

// NOMES DOS DIAS E MESES EM PORTUGUÊS
const DIAS_SEMANA = ['DOMINGO','SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA','SÁBADO'];
const MESES = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];

// 1. FORMATAR DATA (horário compacto para meta)
function formatDate(dateObj) {
  const h = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  return h + ':' + min;
}

function formatDayHeader(dateObj) {
  const dia = DIAS_SEMANA[dateObj.getDay()];
  const num = dateObj.getDate();
  const mes = MESES[dateObj.getMonth()];
  return dia + ', ' + num + ' DE ' + mes;
}

function getDateKey(dateObj) {
  return dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0') + '-' + String(dateObj.getDate()).padStart(2,'0');
}

// 2. GERAR HTML DE UM CARD DE JOGO — Redesign 3 colunas
function buildMatchCardHTML(match) {
  var agora = new Date();
  var matchEnd = new Date(match.date.getTime() + 105 * 60 * 1000); // ~105 min de jogo
  var oneHourBefore = new Date(match.date.getTime() - 60 * 60 * 1000);
  
  var cardClasses = 'match-card';
  var isLive = agora >= match.date && agora <= matchEnd;
  var isFinished = agora > matchEnd;
  var isDeadlineNear = agora >= oneHourBefore && agora < match.date;
  
  if (isLive) cardClasses += ' is-live';
  if (isFinished) cardClasses += ' is-finished';
  if (isDeadlineNear) cardClasses += ' deadline-near';
  
  // Live indicator HTML
  var liveHTML = '';
  if (isLive) {
    liveHTML = '<div class="match-live-indicator">' +
      '<span class="live-dot"></span>' +
      '<span class="live-label">AO VIVO</span>' +
    '</div>';
  }

  // Format date display with full date for meta
  var dateDisplay = formatDate(match.date);
  
  return '<div class="' + cardClasses + '" data-group="' + match.group + '" data-match-id="' + match.id + '">' +
    '<div class="match-meta">' +
      '<span class="match-group-badge">GRUPO ' + match.group + '</span>' +
      '<span class="match-time">' + dateDisplay + '</span>' +
      liveHTML +
      '<div class="bet-check-icon"><svg viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<span class="match-venue">' + match.stadium + ' — ' + match.ground + '</span>' +
    '</div>' +
    '<div class="match-teams">' +
      '<div class="team home">' +
        '<img src="https://flagcdn.com/h80/' + match.home.code + '.png" class="flag-img" alt="' + match.home.name + '">' +
        '<span class="team-name">' + match.home.name + '</span>' +
      '</div>' +
      '<div class="score-area">' +
        '<input type="number" class="score-input p-home" data-match="' + match.id + '" min="0" max="20" id="p-home-' + match.id + '"' + (isFinished ? ' disabled' : '') + '>' +
        '<span class="vs-text">×</span>' +
        '<input type="number" class="score-input p-away" data-match="' + match.id + '" min="0" max="20" id="p-away-' + match.id + '"' + (isFinished ? ' disabled' : '') + '>' +
        '<div class="save-status" id="status-' + match.id + '">✓</div>' +
      '</div>' +
      '<div class="team away">' +
        '<img src="https://flagcdn.com/h80/' + match.away.code + '.png" class="flag-img" alt="' + match.away.name + '">' +
        '<span class="team-name">' + match.away.name + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// 3. RENDERIZAR TODOS OS JOGOS (CRONOLÓGICO)
function renderMatches() {
  var agora = new Date();
  var tresDias = new Date(agora.getTime() + (3 * 24 * 60 * 60 * 1000));

  var htmlJogos = '';
  var htmlProximos = '';
  var curDay = '';
  var curDayProx = '';

  ALL_MATCHES.forEach(function(match) {
    var dayKey = getDateKey(match.date);

    // Header do dia para a aba Todos os Jogos
    if (dayKey !== curDay) {
      curDay = dayKey;
      htmlJogos += '<h3 class="day-header">' + formatDayHeader(match.date) + '</h3>';
    }
    htmlJogos += buildMatchCardHTML(match);

    // Próximos Jogos (próximos 3 dias)
    if (match.date >= agora && match.date <= tresDias) {
      if (dayKey !== curDayProx) {
        curDayProx = dayKey;
        htmlProximos += '<h3 class="day-header">' + formatDayHeader(match.date) + '</h3>';
      }
      htmlProximos += buildMatchCardHTML(match);
    }
  });

  if (!htmlProximos) {
    htmlProximos = '<p style="color:var(--text-secondary); font-size:14px;">Nenhum jogo programado para os próximos 3 dias.</p>';
  }

  els.jogosContainer.innerHTML = htmlJogos;
  els.proximosContainer.innerHTML = htmlProximos;
}

// 4. RENDERIZAR ABA DE GRUPOS
function renderGroups() {
  var html = '<div class="groups-grid">';

  GROUPS.forEach(function(group) {
    var teamObjects = group.teams.map(function(tKey) { return TEAM_MAP[tKey]; });
    // Obter resultados oficiais
    var results = JSON.parse(localStorage.getItem('official_results') || '{}');

    // Calcular classificação
    var standings = {};
    group.teams.forEach(function(tKey) {
      standings[tKey] = { key: tKey, team: TEAM_MAP[tKey], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    // Encontrar jogos deste grupo
    var groupMatches = ALL_MATCHES.filter(function(m) { return m.group === group.letter; });

    groupMatches.forEach(function(m) {
      var r = results[m.id];
      if (r && r.home !== undefined && r.away !== undefined) {
        var homeKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k].code === m.home.code; });
        var awayKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k].code === m.away.code; });
        if (standings[homeKey] && standings[awayKey]) {
          standings[homeKey].p++;
          standings[awayKey].p++;
          standings[homeKey].gf += r.home;
          standings[homeKey].ga += r.away;
          standings[awayKey].gf += r.away;
          standings[awayKey].ga += r.home;
          if (r.home > r.away) {
            standings[homeKey].w++; standings[homeKey].pts += 3;
            standings[awayKey].l++;
          } else if (r.home < r.away) {
            standings[awayKey].w++; standings[awayKey].pts += 3;
            standings[homeKey].l++;
          } else {
            standings[homeKey].d++; standings[homeKey].pts += 1;
            standings[awayKey].d++; standings[awayKey].pts += 1;
          }
        }
      }
    });

    // Ordenar classificação
    var sorted = Object.values(standings).sort(function(a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      var gdA = a.gf - a.ga;
      var gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });

    html += '<div class="group-card">';
    html += '<h3 class="group-card-title">Grupo ' + group.letter + '</h3>';

    // Tabela de classificação
    html += '<div class="standings-table-wrapper">';
    html += '<table class="standings-table">';
    html += '<thead><tr>';
    html += '<th class="st-pos">#</th>';
    html += '<th class="st-team">Seleção</th>';
    html += '<th>P</th><th>V</th><th>E</th><th>D</th>';
    html += '<th>GP</th><th>GC</th><th>SG</th>';
    html += '<th class="st-pts">Pts</th>';
    html += '</tr></thead><tbody>';

    sorted.forEach(function(s, idx) {
      var qualClass = idx < 2 ? ' st-qualify' : '';
      html += '<tr class="st-row' + qualClass + '">';
      html += '<td class="st-pos">' + (idx + 1) + '</td>';
      html += '<td class="st-team">';
      html += '<img src="https://flagcdn.com/w40/' + s.team.code + '.png" class="st-flag" alt="">';
      html += '<span>' + s.team.name + '</span>';
      html += '</td>';
      html += '<td>' + s.p + '</td>';
      html += '<td>' + s.w + '</td>';
      html += '<td>' + s.d + '</td>';
      html += '<td>' + s.l + '</td>';
      html += '<td>' + s.gf + '</td>';
      html += '<td>' + s.ga + '</td>';
      html += '<td>' + (s.gf - s.ga) + '</td>';
      html += '<td class="st-pts">' + s.pts + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';

    // Jogos do grupo (compacto)
    html += '<div class="group-matches-list">';
    html += '<h4 class="group-matches-title">Jogos do Grupo</h4>';
    groupMatches.forEach(function(m) {
      var r = results[m.id];
      var scoreDisplay = (r && r.home !== undefined) ? (r.home + ' × ' + r.away) : '× ';
      var hasResult = r && r.home !== undefined;
      html += '<div class="gm-row' + (hasResult ? ' gm-played' : '') + '">';
      html += '<span class="gm-date">' + formatDate(m.date) + '</span>';
      html += '<span class="gm-home">' + m.home.name + '</span>';
      html += '<span class="gm-score">' + scoreDisplay + '</span>';
      html += '<span class="gm-away">' + m.away.name + '</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '</div>'; // .group-card
  });

  html += '</div>'; // .groups-grid
  els.gruposContainer.innerHTML = html;
}

// 5. RENDERIZAR OPÇÕES DE BÔNUS
function renderBonusOptions() {
  var optionsHtml = '<option value="">Selecione...</option>';
  ALL_TEAMS.forEach(function(t) {
    optionsHtml += '<option value="' + t.code + '">' + t.name + '</option>';
  });
  document.getElementById('bonus-campeao').innerHTML = optionsHtml;
  document.getElementById('bonus-ataque').innerHTML = optionsHtml;
  document.getElementById('bonus-decepcao').innerHTML = optionsHtml;
}

// 6. UTILITÁRIOS DE FEEDBACK
function showSaveFeedback(matchId) {
  // Mark card as bet-placed
  document.querySelectorAll('.match-card[data-match-id="' + matchId + '"]').forEach(function(card) {
    card.classList.add('bet-placed');
  });
  
  document.querySelectorAll('.score-input[data-match="' + matchId + '"]').forEach(function(input) {
    input.classList.remove('saved-flash');
    void input.offsetWidth;
    input.classList.add('saved-flash');
  });
  document.querySelectorAll('#status-' + matchId).forEach(function(el) {
    el.classList.add('show');
    setTimeout(function() { el.classList.remove('show'); }, 1500);
  });
}

function showBonusSaveFeedback(element) {
  element.classList.remove('saved-flash');
  void element.offsetWidth;
  element.classList.add('saved-flash');
}

// 7. CARREGAR DADOS DO USUÁRIO
async function loadUserData() {
  var data = await dbAPI.getUserData(currentUser);
  Object.keys(data.picks).forEach(function(matchId) {
    var pick = data.picks[matchId];
    document.querySelectorAll('#p-home-' + matchId).forEach(function(el) { el.value = pick.home; });
    document.querySelectorAll('#p-away-' + matchId).forEach(function(el) { el.value = pick.away; });
    // Mark cards with existing bets as bet-placed
    if (pick.home !== undefined && pick.away !== undefined) {
      document.querySelectorAll('.match-card[data-match-id="' + matchId + '"]').forEach(function(card) {
        card.classList.add('bet-placed');
      });
    }
  });
  document.getElementById('bonus-campeao').value = data.bonus.campeao || '';
  document.getElementById('bonus-artilheiro').value = data.bonus.artilheiro || '';
  document.getElementById('bonus-ataque').value = data.bonus.ataque || '';
  document.getElementById('bonus-decepcao').value = data.bonus.decepcao || '';
}

// 8. AUTO-SAVE
function setupAutoSave() {
  document.querySelector('.main-content').addEventListener('change', async function(e) {
    if (e.target.classList.contains('score-input')) {
      var matchId = e.target.getAttribute('data-match');
      var container = e.target.closest('.score-area');
      var hVal = container.querySelector('.p-home').value;
      var aVal = container.querySelector('.p-away').value;
      // Sincronizar inputs duplicados entre abas
      document.querySelectorAll('#p-home-' + matchId).forEach(function(el) { if(el !== e.target) el.value = hVal; });
      document.querySelectorAll('#p-away-' + matchId).forEach(function(el) { if(el !== e.target) el.value = aVal; });
      if (hVal !== '' && aVal !== '') {
        await dbAPI.savePick(currentUser, currentUserName, matchId, parseInt(hVal), parseInt(aVal));
        showSaveFeedback(matchId);
      }
    }
    if (e.target.classList.contains('bonus-input')) {
      var key = e.target.getAttribute('data-bonus');
      var val = e.target.value.trim();
      await dbAPI.saveBonus(currentUser, currentUserName, key, val);
      showBonusSaveFeedback(e.target);
    }
  });
}

// 9. RANKING REAL-TIME — Redesenhado com estado vazio
function renderSidebarRanking(ranking) {
  if (!ranking || ranking.length === 0) {
    els.rankingContainer.innerHTML = '<div class="ranking-empty">O ranking será atualizado após os primeiros jogos.</div>';
    return;
  }
  
  // Check if all scores are 0
  var hasScores = ranking.some(function(u) { return u.pts > 0; });
  if (!hasScores) {
    els.rankingContainer.innerHTML = '<div class="ranking-empty">O ranking será atualizado após os primeiros jogos.</div>';
    return;
  }
  
  var html = '';
  var top5 = ranking.slice(0, 5);
  var isMeInTop = false;
  top5.forEach(function(user, idx) {
    if (user.id === currentUser) isMeInTop = true;
    var isMeClass = user.id === currentUser ? ' me' : '';
    html += '<div class="ranking-item' + isMeClass + '">';
    html += '<div class="rank-pos">' + (idx + 1) + 'º</div>';
    html += '<div class="rank-name">' + user.name + '</div>';
    html += '<div class="rank-pts">' + user.pts + ' pts</div>';
    html += '</div>';
  });
  if (!isMeInTop && currentUser) {
    var myRankIdx = ranking.findIndex(function(u) { return u.id === currentUser; });
    if (myRankIdx !== -1) {
      var me = ranking[myRankIdx];
      html += '<div style="text-align:center; color:var(--border-subtle); margin: 6px 0; font-size: 12px;">···</div>';
      html += '<div class="ranking-item me">';
      html += '<div class="rank-pos">' + (myRankIdx + 1) + 'º</div>';
      html += '<div class="rank-name">' + me.name + '</div>';
      html += '<div class="rank-pts">' + me.pts + ' pts</div>';
      html += '</div>';
    }
  }
  els.rankingContainer.innerHTML = html;
}

// 10. HEADER STATUS — Redesenhado (substitui countdown confuso)
function updateHeaderStatus() {
  var agora = new Date();
  var liveMatch = null;
  var nextMatch = null;
  
  ALL_MATCHES.forEach(function(match) {
    var matchEnd = new Date(match.date.getTime() + 105 * 60 * 1000);
    if (agora >= match.date && agora <= matchEnd) {
      liveMatch = match;
    }
    if (!nextMatch && match.date > agora) {
      nextMatch = match;
    }
  });
  
  if (liveMatch) {
    // Jogo ao vivo — destaque em vermelho
    var minuteElapsed = Math.floor((agora - liveMatch.date) / 60000);
    var minDisplay = minuteElapsed > 90 ? '90+' + (minuteElapsed - 90) : minuteElapsed + "'";
    els.headerStatus.innerHTML = 
      '<span class="live-dot"></span>' +
      '<span class="live-text">AO VIVO</span>' +
      '<span class="status-highlight">' + liveMatch.home.name + ' vs ' + liveMatch.away.name + '</span>' +
      '<span style="color:var(--state-live); font-weight:600;">' + minDisplay + '</span>';
  } else if (nextMatch) {
    // Próximo jogo com countdown real
    var dist = nextMatch.date - agora;
    var days = Math.floor(dist / (1000 * 60 * 60 * 24));
    var hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((dist % (1000 * 60)) / 1000);
    
    var countdownStr = '';
    if (days > 0) countdownStr += days + 'd ';
    countdownStr += String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    
    els.headerStatus.innerHTML = 
      '<span class="status-label">Copa do Mundo 2026 · Em andamento</span>' +
      '<span style="color:var(--text-muted); font-size:12px;">Próximo:</span>' +
      '<span class="status-highlight" style="font-size:13px;">' + nextMatch.home.name + ' vs ' + nextMatch.away.name + '</span>' +
      '<span class="next-game-countdown">' + countdownStr + '</span>';
  } else {
    els.headerStatus.innerHTML = '<span class="status-label">Copa do Mundo 2026 · Em andamento</span>';
  }
}

// 11. TABS & MOBILE
els.tabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    els.tabs.forEach(function(t) { t.classList.remove('active'); });
    els.panes.forEach(function(p) { p.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-target')).classList.add('active');
    // Atualizar classificação dos grupos quando clicar na aba
    if (tab.getAttribute('data-target') === 'tab-grupos') {
      renderGroups();
    }
  });
});

els.mobileToggle.addEventListener('click', function() {
  els.sidebar.classList.toggle('mobile-open');
});

document.addEventListener('click', function(e) {
  if (window.innerWidth <= 900 && els.sidebar.classList.contains('mobile-open')) {
    if (!els.sidebar.contains(e.target) && e.target !== els.mobileToggle) {
      els.sidebar.classList.remove('mobile-open');
    }
  }
});

// PONTO DE ENTRADA
function initApp() {
  renderMatches();
  renderGroups();
  renderBonusOptions();
  loadUserData();
  setupAutoSave();
  
  // Header status com update a cada segundo
  updateHeaderStatus();
  setInterval(updateHeaderStatus, 1000);
  
  dbAPI.listenToUpdates(function(ranking) {
    renderSidebarRanking(ranking);
  });
}
