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
  headerStatus: document.getElementById('header-status'),
  rankingGeralTbody: document.getElementById('ranking-geral-tbody'),
  btnProfile: document.getElementById('btn-profile'),
  avatarModal: document.getElementById('avatar-modal'),
  flagGrid: document.getElementById('flag-grid'),
  flagSearch: document.getElementById('flag-search-input'),
  btnAvatarCancel: document.getElementById('btn-avatar-cancel'),
  btnAvatarSave: document.getElementById('btn-avatar-save'),
  headerFlagImg: document.getElementById('header-flag-img'),
  headerFlagPlaceholder: document.getElementById('header-flag-placeholder')
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
  var matchEnd = new Date(match.date.getTime() + 135 * 60 * 1000); // ~135 min de jogo (com margem)
  var oneHourBefore = new Date(match.date.getTime() - 60 * 60 * 1000);
  
  var res = globalOfficialResults[match.id];
  var isLiveAPI = res && res.status === 'live';
  var isFinishedAPI = res && res.status === 'finished';
  
  var isLive = isLiveAPI || (!isFinishedAPI && agora >= match.date && agora <= matchEnd);
  var isFinished = isFinishedAPI || (agora > matchEnd && !isLiveAPI);
  var isDeadlineNear = agora >= oneHourBefore && agora < match.date;
  
  var cardClasses = 'match-card';
  
  if (isLive) cardClasses += ' is-live';
  if (isFinished) cardClasses += ' is-finished';
  if (isDeadlineNear) cardClasses += ' deadline-near';
  if (match.home.name === 'Brasil' || match.away.name === 'Brasil') cardClasses += ' card-brasil';
  
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
  
  var isLocked = agora >= match.date;
  
  // Calculate weekday
  var weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  var dayOfWeek = weekdays[match.date.getDay()];
  var dayOfMonth = match.date.getDate();
  var weekdayDisplay = dayOfWeek + ' ' + dayOfMonth;
  
  return '<div class="' + cardClasses + '" data-group="' + match.group + '" data-match-id="' + match.id + '">' +
    '<div class="bet-result-badge" id="badge-' + match.id + '" style="display: none;"></div>' +
    '<div class="match-meta">' +
      '<span class="match-group-badge">GRUPO ' + match.group + '</span>' +
      '<span class="match-weekday">' + weekdayDisplay + '</span>' +
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
      '<div style="display:flex; flex-direction:column; align-items:center; width:100%;">' +
        '<div class="score-area">' +
          '<input type="number" class="score-input p-home" data-match="' + match.id + '" min="0" max="20" id="p-home-' + match.id + '"' + (isLocked ? ' disabled' : '') + '>' +
          '<span class="vs-text">×</span>' +
          '<input type="number" class="score-input p-away" data-match="' + match.id + '" min="0" max="20" id="p-away-' + match.id + '"' + (isLocked ? ' disabled' : '') + '>' +
          '<div class="save-status" id="status-' + match.id + '">✓</div>' +
        '</div>' +
        '<div class="official-score-wrapper">' +
          '<div class="official-score-box" id="off-box-' + match.id + '">' +
            '<div class="official-score-label" id="off-label-' + match.id + '">AGUARDANDO RESULTADO</div>' +
            '<div class="official-score-numbers">' +
              '<span class="off-num" id="off-h-' + match.id + '" style="color:#444;">–</span>' +
              '<span class="off-sep">×</span>' +
              '<span class="off-num" id="off-a-' + match.id + '" style="color:#444;">–</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
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
  var html = '<div class="groups-nav">';
  GROUPS.forEach(function(g) {
    html += '<a href="#group-' + g.letter + '" class="group-nav-pill">' + g.letter + '</a>';
  });
  html += '</div>';
  html += '<div class="groups-grid">';

  GROUPS.forEach(function(group) {
    var teamObjects = group.teams.map(function(tKey) { return TEAM_MAP[tKey]; });
    // Obter resultados oficiais
    var results = globalOfficialResults || JSON.parse(localStorage.getItem('official_results') || '{}');

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

    html += '<div class="group-card" id="group-' + group.letter + '">';
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
      html += '<div class="st-team-content">';
      html += '<img src="https://flagcdn.com/w40/' + s.team.code + '.png" class="st-flag" alt="">';
      html += '<span class="st-team-name" title="' + s.team.name + '">' + s.team.name + '</span>';
      html += '</div></td>';
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
      html += '<span class="gm-home">' + m.home.name + ' <img src="https://flagcdn.com/w20/' + m.home.code + '.png" class="gm-flag" alt=""></span>';
      html += '<span class="gm-score">' + scoreDisplay + '</span>';
      html += '<span class="gm-away"><img src="https://flagcdn.com/w20/' + m.away.code + '.png" class="gm-flag" alt=""> ' + m.away.name + '</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '</div>'; // .group-card
  });

  html += '</div>'; // .groups-grid
  els.gruposContainer.innerHTML = html;
}

// 5. RENDERIZAR OPÇÕES DE BÔNUS (REMOVIDO)
// Opções de bônus agora são textos livres.

// 6. UTILITÁRIOS DE FEEDBACK E RESULTADOS
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

function renderBetResults(picks, officialResults) {
  if (!officialResults) return;
  picks = picks || {};
  
  // Show official scores for ALL matches that have them
  Object.keys(officialResults).forEach(function(matchId) {
    var r = officialResults[matchId];
    if (r && (r.home !== undefined || r.canceled)) {
      var offLabelText = r.canceled ? 'JOGO CANCELADO' : 'RESULTADO OFICIAL';
      var hText = r.canceled ? '–' : r.home;
      var aText = r.canceled ? '–' : r.away;
      
      var lbl = document.getElementById('off-label-' + matchId);
      if(lbl) lbl.innerHTML = offLabelText;
      
      var oH = document.getElementById('off-h-' + matchId);
      if(oH) { oH.innerHTML = hText; oH.style.color = '#ffffff'; }
      
      var oA = document.getElementById('off-a-' + matchId);
      if(oA) { oA.innerHTML = aText; oA.style.color = '#ffffff'; }
      
      var box = document.getElementById('off-box-' + matchId);
      if(box && r.canceled) {
         box.style.borderBottom = '3px solid #666';
      }
    }
  });

  // Calculate and show points for user's picks
  Object.keys(picks).forEach(function(matchId) {
    var p = picks[matchId];
    var r = officialResults[matchId];
    
    // Tem aposta e tem resultado oficial
    if (p && p.home !== undefined && p.away !== undefined && r && r.home !== undefined && r.away !== undefined && !r.canceled) {
      var badgeHtml = '';
      var badgeClass = '';
      var borderColor = '';
      
      if (p.home === r.home && p.away === r.away) {
        badgeHtml = '+3 Placar exato';
        badgeClass = 'badge-exact';
        borderColor = '#22c55e';
        
        // Confetti Logic
        try {
          var seenExacts = JSON.parse(localStorage.getItem('seenExacts_' + currentUser) || '[]');
          if (!seenExacts.includes(matchId) && r.status === 'finished') {
            seenExacts.push(matchId);
            localStorage.setItem('seenExacts_' + currentUser, JSON.stringify(seenExacts));
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#009c3b', '#ffdf00', '#002776']
              });
            }
          }
        } catch(e) {}

      } else if (
        (p.home > p.away && r.home > r.away) ||
        (p.home < p.away && r.home < r.away) ||
        (p.home === p.away && r.home === r.away)
      ) {
        badgeHtml = '+1 Vencedor';
        badgeClass = 'badge-winner';
        borderColor = '#3b82f6';
      } else {
        badgeHtml = '+0 Errou';
        badgeClass = 'badge-wrong';
        borderColor = '#ef4444';
      }
      
      document.querySelectorAll('#badge-' + matchId).forEach(function(el) {
        el.className = 'bet-result-badge ' + badgeClass;
        el.innerHTML = badgeHtml;
        el.style.display = 'block';
      });
      
      var box = document.getElementById('off-box-' + matchId);
      if(box) {
         box.style.borderBottom = '3px solid ' + borderColor;
      }
    }
  });
}

// 7. CARREGAR DADOS DO USUÁRIO
async function loadUserData() {
  var data = await dbAPI.getUserData(currentUser);
  
  // Update header avatar with user data
  selectedFlag = data.avatar || null;
  updateHeaderAvatar(selectedFlag);

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

  // Render bet results for logged user
  var officialResults = await dbAPI.getResults();
  renderBetResults(data.picks, officialResults);
  
  // Lógica de Previsões Bônus
  // Novo prazo: fim da 1ª rodada (quando 24 jogos tiverem resultado oficial)
  var officialResultsCount = Object.keys(officialResults).filter(k => officialResults[k].home !== undefined).length;
  var isDeadlinePassed = officialResultsCount >= 24;
  
  // Atualiza o texto do indicador
  var progressIndicator = document.getElementById('bonus-progress-indicator');
  if (progressIndicator) {
    progressIndicator.innerText = `Rodada 1 em andamento: ${officialResultsCount} de 24 jogos concluídos`;
    if (isDeadlinePassed) progressIndicator.innerText = `Prazo encerrado (${officialResultsCount} jogos concluídos)`;
  }

  var bonusCategories = ['campeao', 'artilheiro', 'craque', 'goleiro', 'defensor', 'revelacao', 'decepcao', 'neymar_gol'];
  
  // Tentar buscar resultados oficiais (se disponíveis via db.js)
  var officialBonusResults = null;
  if (dbAPI.getBonusResults) {
    officialBonusResults = await dbAPI.getBonusResults();
  }

  var answeredCount = 0;

  bonusCategories.forEach(function(cat) {
    var card = document.getElementById('bonus-card-' + cat);
    var input = document.getElementById('input-bonus-' + cat);
    var btn = card ? card.querySelector('.btn-bonus-confirm') : null;
    var badge = document.getElementById('badge-bonus-' + cat);
    
    if (!card || !input) return;
    
    var userAnswer = data.bonus[cat];
    var officialAnswer = officialBonusResults ? officialBonusResults[cat] : null;

    if (userAnswer) {
      answeredCount++;
      // Usuário respondeu
      input.value = userAnswer;
      input.disabled = true;
      card.classList.add('status-filled');
      if (btn) btn.innerHTML = 'Confirmado ✓';
      
      // Atualiza dropdown customizado se for campeao ou decepcao
      if (cat === 'campeao' || cat === 'decepcao') {
        var trigger = document.getElementById('trigger-' + cat);
        if (trigger) {
          trigger.style.pointerEvents = 'none'; // disable
          var team = Object.values(TEAM_MAP).find(t => t.name === userAnswer);
          if (team) {
            document.getElementById('value-' + cat).innerHTML = '<img src="https://flagcdn.com/w20/' + team.code + '.png" alt="flag"><span>' + team.name + '</span>';
          }
        }
      }
      
      // Se for o toggle do Neymar, aplica o state ativo
      if (cat === 'neymar_gol') {
        var toggleParent = document.getElementById('toggle-neymar_gol');
        if (toggleParent) {
          toggleParent.querySelectorAll('.toggle-option').forEach(opt => {
            if (opt.getAttribute('data-val') === userAnswer) opt.classList.add('active');
            opt.disabled = true;
          });
        }
      }
      
      if (officialAnswer) {
        // Já tem resultado oficial, verificar acerto
        var isCorrect = dbAPI.normalizeString(userAnswer) === dbAPI.normalizeString(officialAnswer);
        if (isCorrect) {
          card.classList.add('status-correct');
          badge.innerHTML = '🎯 +3 pts — Acerto!';
        } else {
          card.classList.add('status-wrong');
          badge.innerHTML = '+0 pts — Errou';
        }
      } else {
        // Sem resultado ainda
        badge.classList.add('show-filled');
        badge.innerHTML = 'Enviada ✓';
      }
    } else {
      // Usuário não respondeu
      if (isDeadlinePassed) {
        input.disabled = true;
        card.classList.add('status-expired');
        badge.classList.add('show-expired');
        badge.innerHTML = 'Não respondida';
        if (cat === 'campeao' || cat === 'decepcao') {
          var trigger = document.getElementById('trigger-' + cat);
          if (trigger) trigger.style.pointerEvents = 'none';
        }
        // Desativa toggles se for Neymar
        if (cat === 'neymar_gol') {
          var toggleParent = document.getElementById('toggle-neymar_gol');
          if (toggleParent) {
            toggleParent.querySelectorAll('.toggle-option').forEach(opt => opt.disabled = true);
          }
        }
      }
    }
  });

  updateBonusProgress();
}

function updateBonusProgress() {
  var bonusCategories = ['campeao', 'artilheiro', 'craque', 'goleiro', 'defensor', 'revelacao', 'decepcao', 'neymar_gol'];
  var answeredCount = document.querySelectorAll('.bonus-card.status-filled, .bonus-card.status-correct, .bonus-card.status-wrong').length;
  var progressText = document.getElementById('bonus-progress-text');
  var progressPercent = document.getElementById('bonus-progress-percent');
  var progressFill = document.getElementById('bonus-progress-fill');
  if (progressText && progressFill) {
    var totalBonus = bonusCategories.length;
    var pct = Math.round((answeredCount / totalBonus) * 100);
    progressText.innerText = answeredCount + ' de ' + totalBonus + ' respondidas';
    progressPercent.innerText = pct + '%';
    progressFill.style.width = pct + '%';
  }
}

// 8. AUTO-SAVE & BONUS SUBMIT
function setupAutoSave() {
  document.querySelector('.main-content').addEventListener('change', async function(e) {
    if (e.target.classList.contains('score-input')) {
      var matchId = e.target.getAttribute('data-match');
      var matchData = ALL_MATCHES.find(function(m) { return m.id === matchId; });
      if (matchData && new Date() >= matchData.date) {
         alert("O tempo para apostar neste jogo já se esgotou!");
         e.target.value = '';
         return;
      }
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
  });

  // Manipulador para Confirmar Bônus
  document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-bonus-confirm')) {
      var btn = e.target;
      var key = btn.getAttribute('data-bonus');
      var card = document.getElementById('bonus-card-' + key);
      var input = document.getElementById('input-bonus-' + key);
      var val = input.value.trim();

      if (!val) {
        alert('Selecione ou digite sua previsão antes de confirmar.');
        return;
      }

      // Validar prazo consultando localmente official_results
      let localOfficial = JSON.parse(localStorage.getItem('official_results') || '{}');
      let officialCount = Object.keys(localOfficial).filter(k => localOfficial[k].home !== undefined).length;
      if (officialCount >= 24) {
         alert("O prazo para enviar palpites bônus já encerrou (a 1ª rodada terminou)!");
         input.disabled = true;
         return;
      }

      btn.disabled = true;
      btn.innerText = 'Salvando...';

      try {
        await dbAPI.saveBonus(currentUser, currentUserName, key, val);
        
        // Atualiza a UI imediatamente para estado "filled"
        input.disabled = true;
        card.classList.add('status-filled');
        var badge = document.getElementById('badge-bonus-' + key);
        if (badge) {
          badge.classList.add('show-filled');
          badge.innerHTML = 'Enviada ✓';
        }
        btn.innerHTML = 'Confirmado ✓';
        updateBonusProgress();
      } catch (err) {
        console.error(err);
        alert('Erro ao salvar palpite bônus.');
        btn.disabled = false;
        btn.innerText = 'Confirmar';
      }
    } else if (e.target.classList.contains('toggle-option')) {
      // Bloquear edição se o toggle-option estiver com disabled via CSS pointer-events ou se já foi salvo
      if (e.target.disabled || e.target.closest('.status-filled') || e.target.closest('.status-expired')) return;
      
      var parent = e.target.parentElement;
      parent.querySelectorAll('.toggle-option').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      var hiddenInput = parent.parentElement.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = e.target.getAttribute('data-val');
      }
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

  function renderAvatar(avatarCode, name) {
    if (avatarCode) {
      return '<img src="https://flagcdn.com/h40/' + avatarCode + '.png" class="ranking-avatar" alt="Bandeira">';
    } else {
      return '<div class="ranking-avatar-placeholder">' + name.charAt(0).toUpperCase() + '</div>';
    }
  }

  top5.forEach(function(u, idx) {
    if (u.id === currentUser) isMeInTop = true;
    var isMeClass = u.id === currentUser ? ' me' : '';
    html += '<div class="ranking-item rank-item-clickable' + isMeClass + '" data-id="' + u.id + '">';
    html += '<div class="rank-pos">' + (idx + 1) + 'º</div>';
    html += renderAvatar(u.avatar, u.name);
    
    // Render Badges
    var badgesHtml = '';
    if (u.badges && u.badges.length > 0) {
      badgesHtml = '<span style="margin-left: 6px; font-size: 0.9rem;" title="' + u.badges.map(b => b.title).join(', ') + '">' + u.badges.map(b => b.icon).join('') + '</span>';
    }

    html += '<div class="rank-name">' + u.name + badgesHtml + '</div>';
    html += '<div class="rank-pts">' + u.pts + ' pts</div>';
    html += '</div>';
  });
  if (!isMeInTop && currentUser) {
    var myRankIdx = ranking.findIndex(function(u) { return u.id === currentUser; });
    if (myRankIdx !== -1) {
      var me = ranking[myRankIdx];
      html += '<div style="text-align:center; color:var(--border-subtle); margin: 6px 0; font-size: 12px;">···</div>';
      html += '<div class="ranking-item rank-item-clickable me" data-id="' + me.id + '">';
      html += '<div class="rank-pos">' + (myRankIdx + 1) + 'º</div>';
      html += renderAvatar(me.avatar, me.name);
      html += '<div class="rank-name">' + me.name + '</div>';
      html += '<div class="rank-pts">' + me.pts + ' pts</div>';
      html += '</div>';
    }
  }
  els.rankingContainer.innerHTML = html;

  // Adiciona listener de clique
  document.querySelectorAll('.rank-item-clickable').forEach(function(item) {
    item.addEventListener('click', function() {
      var userId = this.getAttribute('data-id');
      if (userId) openUserProfile(userId);
    });
  });
}

function openUserProfile(userId) {
  var user = globalRanking.find(u => u.id === userId);
  if (!user) return;
  
  var modal = document.getElementById('profile-modal');
  var header = document.getElementById('profile-header');
  var stats = document.getElementById('profile-stats');
  var list = document.getElementById('profile-picks-list');

  // Cabeçalho
  var avatarHtml = '';
  if (user.avatar) {
    avatarHtml = '<img src="https://flagcdn.com/h60/' + user.avatar + '.png" class="profile-avatar">';
  } else {
    avatarHtml = '<div class="profile-avatar-placeholder">' + user.name.charAt(0).toUpperCase() + '</div>';
  }
  var pos = globalRanking.findIndex(u => u.id === userId) + 1;
  header.innerHTML = avatarHtml + '<div class="profile-info"><h3>' + user.name + '</h3><p>' + pos + 'º lugar · ' + user.pts + ' pontos</p></div>';

  // Lista de Palpites e contagem
  var listHtml = '';
  var totalJogosAvaliados = 0;
  var exatos = 0;
  var parciais = 0;
  var erros = 0;

  var picks = user.picks || {};
  
  // Apenas jogos com resultados
  var matchesWithResult = ALL_MATCHES.filter(m => globalOfficialResults[m.id] && globalOfficialResults[m.id].home !== undefined);
  matchesWithResult.sort((a, b) => b.date - a.date);

  matchesWithResult.forEach(m => {
    totalJogosAvaliados++;
    var p = picks[m.id] || {};
    var r = globalOfficialResults[m.id];
    var badgeClass = 'errou';
    var badgeText = 'Errou';
    
    if (p.home !== undefined) {
      if (p.home === r.home && p.away === r.away) {
        badgeClass = 'exato';
        badgeText = 'Exato (+3)';
        exatos++;
      } else if (
        (p.home > p.away && r.home > r.away) ||
        (p.home < p.away && r.home < r.away) ||
        (p.home === p.away && r.home === r.away)
      ) {
        badgeClass = 'vencedor';
        badgeText = 'Parcial (+1)';
        parciais++;
      } else {
        erros++;
      }
    } else {
      badgeClass = 'errou';
      badgeText = 'Sem palpite';
      erros++;
    }

    var palpiteStr = p.home !== undefined ? p.home + ' × ' + p.away : '- × -';
    var oficialStr = r.home + ' × ' + r.away;
    
    listHtml += `
      <div class="profile-pick-card">
        <div class="match-info">
          <div class="match-teams"><img src="https://flagcdn.com/w20/${m.home.code}.png"> ${m.home.name} × ${m.away.name} <img src="https://flagcdn.com/w20/${m.away.code}.png"></div>
          <div class="match-result">Resultado oficial: ${oficialStr} &nbsp;|&nbsp; Palpite: <strong>${palpiteStr}</strong></div>
        </div>
        <div class="pick-badge ${badgeClass}">${badgeText}</div>
      </div>
    `;
  });

  if (matchesWithResult.length === 0) {
    listHtml = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">Nenhum jogo com resultado oficial ainda.</div>';
  }

  list.innerHTML = listHtml;

  var perc = totalJogosAvaliados > 0 ? Math.round(((exatos + parciais) / totalJogosAvaliados) * 100) : 0;
  stats.innerHTML = `
    <div class="stat-box"><div class="stat-val">${totalJogosAvaliados}</div><div class="stat-lbl">Jogos</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#4CAF50">${exatos}</div><div class="stat-lbl">Exatos</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#FFD700">${parciais}</div><div class="stat-lbl">Parciais</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#EF5350">${erros}</div><div class="stat-lbl">Erros</div></div>
    <div class="stat-box"><div class="stat-val">${perc}%</div><div class="stat-lbl">Aproveitamento</div></div>
  `;

  modal.classList.remove('hidden');
}

// Fechar modal de perfil
document.addEventListener('DOMContentLoaded', function() {
  var btnCloseProfile = document.getElementById('btn-close-profile');
  if (btnCloseProfile) {
    btnCloseProfile.addEventListener('click', function() {
      document.getElementById('profile-modal').classList.add('hidden');
    });
  }
});

function renderComparativo(ranking, officialResults) {
  var container = document.getElementById('comparativo-container');
  if (!container) return;

  var matchesWithResult = ALL_MATCHES.filter(m => officialResults[m.id] && officialResults[m.id].home !== undefined);
  if (matchesWithResult.length === 0) {
    container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">Nenhum jogo com resultado oficial ainda.</div>';
    return;
  }
  
  // Ordenar por data decrescente (o mais recente primeiro nas colunas da esquerda)
  matchesWithResult.sort((a, b) => b.date - a.date);
  
  var latestMatchId = matchesWithResult[0].id;

  var html = '<div class="comparativo-wrapper"><table class="comparativo-table">';
  
  // Cabeçalho
  html += '<thead><tr><th class="col-user">Participante</th>';
  matchesWithResult.forEach(m => {
    var isLatest = m.id === latestMatchId ? ' class="col-latest"' : '';
    html += '<th' + isLatest + '><div style="font-size:12px;color:var(--text-muted);">' + m.home.name + ' vs ' + m.away.name + '</div><div style="font-size:18px;color:#fff;">' + officialResults[m.id].home + ' - ' + officialResults[m.id].away + '</div></th>';
  });
  html += '</tr></thead><tbody>';

  // Linhas por usuário
  ranking.forEach(user => {
    var isMe = user.id === currentUser ? ' row-me' : '';
    html += '<tr class="' + isMe + '">';
    var avatarHtml = user.avatar ? '<img src="https://flagcdn.com/w20/' + user.avatar + '.png">' : '<span>👤</span>';
    html += '<td class="col-user">' + avatarHtml + ' ' + user.name + '</td>';
    
    matchesWithResult.forEach(m => {
      var p = (user.picks && user.picks[m.id]) ? user.picks[m.id] : {};
      var r = officialResults[m.id];
      var badgeClass = 'none';
      
      if (p.home !== undefined) {
        if (p.home === r.home && p.away === r.away) {
          badgeClass = 'exato';
        } else if (
          (p.home > p.away && r.home > r.away) ||
          (p.home < p.away && r.home < r.away) ||
          (p.home === p.away && r.home === r.away)
        ) {
          badgeClass = 'vencedor';
        } else {
          badgeClass = 'errou';
        }
      }
      
      var palpiteStr = p.home !== undefined ? p.home + ' - ' + p.away : '—';
      var isLatest = m.id === latestMatchId ? ' class="col-latest"' : '';
      html += '<td' + isLatest + '><span class="comp-badge ' + badgeClass + '">' + palpiteStr + '</span></td>';
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// 10. HEADER STATUS — Redesenhado (substitui countdown confuso)
function updateHeaderStatus() {
  var agora = new Date();
  var liveMatch = null;
  var nextMatch = null;
  
  ALL_MATCHES.forEach(function(match) {
    var matchEnd = new Date(match.date.getTime() + 135 * 60 * 1000);
    var res = globalOfficialResults[match.id];
    var isLiveAPI = res && res.status === 'live';
    var isFinishedAPI = res && res.status === 'finished';
    
    var isLive = isLiveAPI || (!isFinishedAPI && agora >= match.date && agora <= matchEnd);
    
    if (isLive) {
      liveMatch = match;
    }
    if (!nextMatch && match.date > agora) {
      nextMatch = match;
    }
  });
  
  if (liveMatch) {
    // Busca placar atual (mesmo q não tenha acabado)
    var liveRes = globalOfficialResults[liveMatch.id] || { home: 0, away: 0 };
    var minuteElapsed = Math.floor((agora - liveMatch.date) / 60000);
    var minDisplay = minuteElapsed > 90 ? '90+' + (minuteElapsed - 90) : minuteElapsed + "'";
    
    currentLiveMatchId = liveMatch.id;
    
    // Header clicável
    els.headerStatus.style.cursor = 'pointer';
    els.headerStatus.onclick = () => {
      document.getElementById('tab-btn-transmissao').click();
    };

    els.headerStatus.innerHTML = 
      '<span class="live-dot"></span>' +
      '<span class="live-text">AO VIVO</span>' +
      '<img src="https://flagcdn.com/w20/' + liveMatch.home.code + '.png" class="gm-flag" style="margin:0 6px;">' +
      '<span class="status-highlight">' + liveMatch.home.name + ' <strong style="color: #FFD700;">' + liveRes.home + ' × ' + liveRes.away + '</strong> ' + liveMatch.away.name + '</span>' +
      '<img src="https://flagcdn.com/w20/' + liveMatch.away.code + '.png" class="gm-flag" style="margin:0 6px;">' +
      '<span style="color:var(--state-live); font-weight:600; margin-left: 6px;">' + minDisplay + '</span>';
      
  } else if (nextMatch) {
    currentLiveMatchId = null;
    els.headerStatus.style.cursor = 'default';
    els.headerStatus.onclick = null;
    
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
      '<img src="https://flagcdn.com/w20/' + nextMatch.home.code + '.png" class="gm-flag" style="margin:0 4px;">' +
      '<span class="status-highlight" style="font-size:13px;">' + nextMatch.home.name + ' vs ' + nextMatch.away.name + '</span>' +
      '<img src="https://flagcdn.com/w20/' + nextMatch.away.code + '.png" class="gm-flag" style="margin:0 4px;">' +
      '<span class="next-game-countdown">' + countdownStr + '</span>';
  } else {
    currentLiveMatchId = null;
    els.headerStatus.style.cursor = 'default';
    els.headerStatus.onclick = null;
    els.headerStatus.innerHTML = '<span class="status-label">Copa do Mundo 2026 · Em andamento</span>';
  }
}

// =============================================
// 11.5 LIVE TAB LÓGICA (Transmissão)
// =============================================

function updateLiveTab() {
  var container = document.getElementById('live-games-container');
  if (!container) return;
  
  var agora = new Date();
  var liveMatches = [];
  
  // 1. Identificar quais jogos estão ao vivo
  ALL_MATCHES.forEach(function(m) {
    var res = globalOfficialResults[m.id] || { home: 0, away: 0, canceled: false };
    var matchEnd = new Date(m.date.getTime() + 135 * 60 * 1000); // margem de 135 min
    var isLiveAPI = res.status === 'live';
    var isFinishedAPI = res.status === 'finished';
    var isFinished = isFinishedAPI || (agora > matchEnd && !isLiveAPI);
    var isLiveLocal = !isFinished && agora >= m.date && agora <= matchEnd;
    
    if (isLiveAPI || isLiveLocal) {
      liveMatches.push({ match: m, result: res });
    }
  });
  
  // 2. Se não houver jogos
  if (liveMatches.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 1.1rem; padding: 40px 0;">Nenhum jogo rolando no momento.</div>';
    return;
  }
  
  // 3. Renderizar um card para cada jogo ao vivo
  var html = '';
  liveMatches.forEach(function(item) {
    var m = item.match;
    var res = item.result;
    var myPick = globalPicks[m.id];
    var minuteElapsed = Math.floor((agora - m.date) / 60000);
    var minDisplay = minuteElapsed > 90 ? '90+' + (minuteElapsed - 90) : minuteElapsed + "'";
    
    html += '<div class="live-cards-container" style="display: flex; flex-direction: column; md:flex-row; gap: 16px; margin-bottom: 24px;">';
    
    html += '<div class="live-card" style="flex: 1; background: #1a1a1a; border: 1px solid var(--accent-gold); border-radius: 12px; padding: 20px; text-align: center;">';
    html += '<h4 style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Placar Atual</h4>';
    html += '<div style="display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 1.5rem; font-weight: bold; color: white;">';
    html += '<div style="display: flex; flex-direction: column; align-items: center; width: 40%;">';
    html += '<img src="https://flagcdn.com/w40/' + m.home.code + '.png" style="border-radius:4px; margin-bottom: 8px;"> ';
    html += '<span style="font-size: 1.1rem;">' + m.home.name + '</span>';
    
    // Parse home scorers
    var homeScorersStr = res.home_scorers && res.home_scorers !== 'null' ? res.home_scorers.replace(/[\{\}\"“”]/g, '').split(',') : [];
    var homeScorersHtml = homeScorersStr.length > 0 ? homeScorersStr.map(function(s) { return '<div style="color: #bbb; font-size: 0.75rem; font-weight: normal; margin-top: 2px;">⚽ ' + s.trim() + '</div>'; }).join('') : '';
    html += homeScorersHtml;
    
    html += '</div>';
    
    html += '<div style="width: 20%; display: flex; flex-direction: column; align-items: center;">';
    html += '<span style="color:#FFD700; font-size: 1.8rem; letter-spacing: 2px;">' + res.home + ' × ' + res.away + '</span>';
    html += '<div style="color: var(--state-live); font-weight: 600; margin-top: 12px; font-size: 0.9rem;">⏱ ' + minDisplay + '</div>';
    html += '</div>';

    html += '<div style="display: flex; flex-direction: column; align-items: center; width: 40%;">';
    html += '<img src="https://flagcdn.com/w40/' + m.away.code + '.png" style="border-radius:4px; margin-bottom: 8px;">';
    html += '<span style="font-size: 1.1rem;">' + m.away.name + '</span>';
    
    // Parse away scorers
    var awayScorersStr = res.away_scorers && res.away_scorers !== 'null' ? res.away_scorers.replace(/[\{\}\"“”]/g, '').split(',') : [];
    var awayScorersHtml = awayScorersStr.length > 0 ? awayScorersStr.map(function(s) { return '<div style="color: #bbb; font-size: 0.75rem; font-weight: normal; margin-top: 2px;">⚽ ' + s.trim() + '</div>'; }).join('') : '';
    html += awayScorersHtml;
    
    html += '</div>';
    html += '</div>'; // End live-card content
    html += '</div>'; // End live-card
    
    // -- Seu Palpite
    var pickCardBorder = 'var(--border-subtle)';
    var pickStatusHtml = '';
    var userPickHtml = '<span style="color:var(--text-muted); font-size: 1rem; font-weight: normal;">Você não apostou neste jogo.</span>';
    
    if (myPick) {
      userPickHtml = '<img src="https://flagcdn.com/w40/' + m.home.code + '.png" style="border-radius:4px; opacity:0.8;"> ' + 
      '<span style="opacity:0.8;">' + m.home.name + '</span> <span style="margin:0 10px;">' + myPick.home + ' × ' + myPick.away + '</span> <span style="opacity:0.8;">' + m.away.name + '</span>' +
      ' <img src="https://flagcdn.com/w40/' + m.away.code + '.png" style="border-radius:4px; opacity:0.8;">';
      
      pickCardBorder = 'var(--accent-gold)';
      pickStatusHtml = '<span style="color:var(--accent-gold);">Em Aberto (Jogo rolando)</span>';
    }
    
    html += '<div class="live-card" style="flex: 1; background: #1a1a1a; border: 1px solid ' + pickCardBorder + '; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s ease;">';
    html += '<h4 style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Seu Palpite</h4>';
    html += '<div style="display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 1.5rem; font-weight: bold; color: white;">';
    html += userPickHtml;
    html += '</div>';
    html += '<div style="margin-top: 12px; font-size: 0.9rem; font-weight: 600;">' + pickStatusHtml + '</div>';
    html += '</div>';
    
    html += '</div>'; // end cards container
  });
  
  container.innerHTML = html;
}

// =============================================
// 11.6 RANKING GERAL (Aba Completa)
// =============================================
function renderFullRanking() {
  if (!els.rankingGeralTbody) return;
  var html = '';
  globalRanking.forEach(function(u, idx) {
    var isMe = (u.id === currentUser);
    var rowStyle = isMe ? 'background: rgba(255, 215, 0, 0.1); font-weight: bold;' : '';
    
    html += '<tr style="' + rowStyle + ' border-bottom: 1px solid var(--border-subtle);">';
    html += '<td style="padding: 12px 16px; text-align: center; color: var(--accent-gold); font-size: 1.1rem; font-weight: bold;">' + (idx + 1) + 'º</td>';
    html += '<td style="padding: 12px 16px; display: flex; align-items: center; gap: 10px;">';
    
    if (u.flag) {
      html += '<img src="https://flagcdn.com/w40/' + u.flag + '.png" class="flag-img" style="width: 24px; height: 16px;">';
    } else {
      html += '<div class="avatar-placeholder" style="width:24px; height:24px; font-size:10px;">A</div>';
    }
    
    // Render Badges
    var badgesHtml = '';
    if (u.badges && u.badges.length > 0) {
      badgesHtml = '<span style="margin-left: 8px; font-size: 1.1rem; cursor: help;" title="' + u.badges.map(b => b.title).join(', ') + '">' + u.badges.map(b => b.icon).join(' ') + '</span>';
    }

    html += '<span>' + (u.name || 'Anônimo') + (isMe ? ' (Você)' : '') + badgesHtml + '</span></td>';
    html += '<td style="padding: 12px 16px; text-align: center; color: var(--text-muted);">' + (u.exato||0) + '</td>';
    html += '<td style="padding: 12px 16px; text-align: center; color: var(--text-muted);">' + (u.vencedor||0) + '</td>';
    html += '<td style="padding: 12px 16px; text-align: right; color: var(--accent-gold); font-size: 1.1rem; font-weight: bold;">' + u.pts + ' PTS</td>';
    html += '</tr>';
  });
  
  els.rankingGeralTbody.innerHTML = html;
}

// 12. PERFIL DE USUÁRIO (BANDEIRA)
let selectedFlag = null;

function renderFlagGrid(filterText = '') {
  const teams = Object.values(TEAM_MAP);
  teams.sort((a, b) => a.name.localeCompare(b.name));
  
  els.flagGrid.innerHTML = '';
  teams.forEach(team => {
    if (filterText && !team.name.toLowerCase().includes(filterText.toLowerCase())) return;
    
    const div = document.createElement('div');
    div.className = 'flag-grid-item';
    if (selectedFlag === team.code) div.classList.add('selected');
    div.innerHTML = '<img src="https://flagcdn.com/h40/' + team.code + '.png" alt="' + team.name + '"><span>' + team.name + '</span>';
    
    div.addEventListener('click', () => {
      document.querySelectorAll('.flag-grid-item').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      selectedFlag = team.code;
    });
    els.flagGrid.appendChild(div);
  });
}

function updateHeaderAvatar(avatarCode) {
  if (avatarCode) {
    els.headerFlagImg.src = 'https://flagcdn.com/h40/' + avatarCode + '.png';
    els.headerFlagImg.style.display = 'block';
    els.headerFlagPlaceholder.style.display = 'none';
  } else {
    els.headerFlagImg.style.display = 'none';
    els.headerFlagPlaceholder.style.display = 'block';
    els.headerFlagPlaceholder.innerText = currentUserName ? currentUserName.charAt(0).toUpperCase() : '?';
  }
}

els.btnProfile.addEventListener('click', () => {
  els.avatarModal.classList.remove('hidden');
  els.flagSearch.value = '';
  renderFlagGrid();
});

els.btnAvatarCancel.addEventListener('click', () => {
  els.avatarModal.classList.add('hidden');
});

els.btnAvatarSave.addEventListener('click', async () => {
  if (selectedFlag) {
    els.btnAvatarSave.innerText = 'Salvando...';
    await dbAPI.saveUserAvatar(currentUser, selectedFlag);
    updateHeaderAvatar(selectedFlag);
    els.btnAvatarSave.innerText = 'Salvar Foto';
    els.avatarModal.classList.add('hidden');
  }
});

els.flagSearch.addEventListener('input', (e) => {
  renderFlagGrid(e.target.value);
});

// 13. TABS & MOBILE
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
    
    // Atualizar player ao vivo ao trocar de abas
    if (typeof updateLiveTab === 'function') {
      updateLiveTab();
    }
    
    if (tab.getAttribute('data-target') === 'tab-perfil') {
      if (typeof updateDashboardProfile === 'function') updateDashboardProfile();
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

function populateBonusSelects() {
  const teams = Object.values(TEAM_MAP);
  teams.sort((a, b) => a.name.localeCompare(b.name));

  ['campeao', 'decepcao'].forEach(type => {
    const trigger = document.getElementById('trigger-' + type);
    const dropdown = document.getElementById('dropdown-' + type);
    const search = document.getElementById('search-' + type);
    const optionsContainer = document.getElementById('options-' + type);
    const hiddenInput = document.getElementById('input-bonus-' + type);
    const valueDisplay = document.getElementById('value-' + type);

    if (!trigger) return;

    function renderOptions(filterText) {
      optionsContainer.innerHTML = '';
      teams.forEach(t => {
        if (filterText && !t.name.toLowerCase().includes(filterText.toLowerCase())) return;
        const opt = document.createElement('div');
        opt.className = 'custom-select-option';
        opt.innerHTML = '<img src="https://flagcdn.com/w20/' + t.code + '.png" alt="flag"><span>' + t.name + '</span>';
        opt.addEventListener('click', () => {
          hiddenInput.value = t.name;
          valueDisplay.innerHTML = '<img src="https://flagcdn.com/w20/' + t.code + '.png" alt="flag"><span>' + t.name + '</span>';
          dropdown.classList.add('hidden');
        });
        optionsContainer.appendChild(opt);
      });
    }

    renderOptions('');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.classList.contains('hidden');
      document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.add('hidden'));
      if (isHidden) {
        dropdown.classList.remove('hidden');
        search.value = '';
        renderOptions('');
        search.focus();
      }
    });

    search.addEventListener('input', (e) => {
      renderOptions(e.target.value);
    });
    
    search.addEventListener('click', (e) => e.stopPropagation());
    dropdown.addEventListener('click', (e) => e.stopPropagation());
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.add('hidden'));
  });
}

let globalPicks = {};
let globalRanking = [];
let globalOfficialResults = {};
let globalLiveConfig = {};
let currentLiveMatchId = null;

// =============================================
// DASHBOARD DE ESTATÍSTICAS (Meu Perfil)
// =============================================
let profileChartPizza = null;
let profileChartLinha = null;

function updateDashboardProfile() {
  if (!currentUser || !globalRanking || !globalOfficialResults) return;
  
  var myData = globalRanking.find(u => u.id === currentUser);
  if (!myData) return;

  var picks = myData.picks || {};
  
  // 1. Calcular Aproveitamento (Pizza)
  var exatos = myData.exato || 0;
  var vencedores = myData.vencedor || 0;
  var erros = 0;
  
  // Para erros, precisamos contar quantos palpites têm resultado final
  var jogosFinalizados = 0;
  var timeSorte = {}; // pts ganhos por time
  var timeAzar = {}; // pts perdidos por time
  
  // Evolução
  var evolutionData = [];
  var acmPoints = 0;

  var sortedMatches = [...ALL_MATCHES].sort((a, b) => a.date - b.date);
  
  sortedMatches.forEach(function(m) {
    var r = globalOfficialResults[m.id];
    var p = picks[m.id];
    if (r && r.status === 'finished' && p && p.home !== undefined) {
      jogosFinalizados++;
      
      // Points calculation for this match
      var pts = 0;
      if (p.home === r.home && p.away === r.away) {
        pts = 3;
      } else if (
        (p.home > p.away && r.home > r.away) ||
        (p.home < p.away && r.home < r.away) ||
        (p.home === p.away && r.home === r.away)
      ) {
        pts = 1;
      }
      
      if (pts === 0) erros++;

      acmPoints += pts;
      evolutionData.push({
        date: m.date,
        label: m.home.code + 'x' + m.away.code,
        pts: acmPoints
      });

      // Time sorte / azar
      if (!timeSorte[m.home.code]) timeSorte[m.home.code] = 0;
      if (!timeSorte[m.away.code]) timeSorte[m.away.code] = 0;
      if (!timeAzar[m.home.code]) timeAzar[m.home.code] = 0;
      if (!timeAzar[m.away.code]) timeAzar[m.away.code] = 0;

      if (pts > 0) {
        timeSorte[m.home.code] += pts;
        timeSorte[m.away.code] += pts;
      } else {
        timeAzar[m.home.code] += 1;
        timeAzar[m.away.code] += 1;
      }
    }
  });

  // Render Pizza
  var ctxPizza = document.getElementById('chart-pizza-acertos');
  if (ctxPizza) {
    if (profileChartPizza) profileChartPizza.destroy();
    profileChartPizza = new Chart(ctxPizza, {
      type: 'doughnut',
      data: {
        labels: ['Placar Exato (+3)', 'Vencedor (+1)', 'Erros (+0)'],
        datasets: [{
          data: [exatos, vencedores, erros],
          backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#ccc' } }
        }
      }
    });
  }

  // Render Linha (Evolução)
  var ctxLinha = document.getElementById('chart-linha-evolucao');
  if (ctxLinha && evolutionData.length > 0) {
    if (profileChartLinha) profileChartLinha.destroy();
    profileChartLinha = new Chart(ctxLinha, {
      type: 'line',
      data: {
        labels: evolutionData.map((d, idx) => 'Jogo ' + (idx + 1)), // idx
        datasets: [{
          label: 'Pontos Acumulados',
          data: evolutionData.map(d => d.pts),
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#888' }, grid: { color: '#333' } },
          y: { ticks: { color: '#888' }, grid: { color: '#333' }, beginAtZero: true }
        }
      }
    });
  }

  // Time da Sorte / Azar
  function getTopTeam(dict) {
    var maxVal = 0;
    var maxTeam = null;
    for (var k in dict) {
      if (dict[k] > maxVal) { maxVal = dict[k]; maxTeam = k; }
    }
    return maxTeam;
  }

  var tSorte = getTopTeam(timeSorte);
  var tAzar = getTopTeam(timeAzar);

  function getTeamName(code) {
    var t = Object.values(TEAM_MAP).find(x => x.code === code);
    return t ? t.name : '--';
  }

  document.getElementById('stats-time-sorte').innerHTML = tSorte ? getTeamName(tSorte) : '--';
  document.getElementById('stats-time-azar').innerHTML = tAzar ? getTeamName(tAzar) : '--';
}

// =============================================
// 12. NOTIFICAÇÕES (Push)
// =============================================
function setupNotifications() {
  if (!('Notification' in window)) return;
  
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

  setInterval(function() {
    if (Notification.permission !== 'granted') return;
    
    var agora = new Date();
    ALL_MATCHES.forEach(function(m) {
      var msDiff = m.date.getTime() - agora.getTime();
      var minDiff = msDiff / 60000;
      
      // Jogo começa em ~15 minutos
      if (minDiff > 14 && minDiff <= 15) {
        // Verifica se já notificou pra evitar flood (usar localStorage)
        var notifiedKey = 'notified_' + m.id;
        if (!localStorage.getItem(notifiedKey)) {
          localStorage.setItem(notifiedKey, 'true');
          
          var p = globalPicks[m.id];
          var msg = p && p.home !== undefined
            ? 'Seu palpite foi ' + p.home + ' x ' + p.away + '. Boa sorte!'
            : 'Você ainda não palpitou neste jogo! Corra que dá tempo.';
            
          new Notification('Faltam 15 minutos para ' + m.home.name + ' x ' + m.away.name + '!', {
            body: msg,
            icon: 'https://flagcdn.com/w160/' + m.home.code + '.png'
          });
        }
      }
    });
  }, 60000); // Check a cada 1 min
}

// =============================================
// CHAVEAMENTO (MATA-MATA)
// =============================================
function renderBracket() {
  var container = document.getElementById('bracket-container');
  if (!container) return;

  var rounds = [
    { name: '16-Avos', matches: 16 },
    { name: 'Oitavas', matches: 8 },
    { name: 'Quartas', matches: 4 },
    { name: 'Semis', matches: 2 },
    { name: 'Final', matches: 1 }
  ];

  var html = '';
  rounds.forEach(function(r) {
    html += '<div class="bracket-column">';
    html += '<h3 style="text-align:center; color: var(--accent-gold); margin-bottom: 20px;">' + r.name + '</h3>';
    for (var i = 0; i < r.matches; i++) {
      html += '<div class="bracket-match">';
      html += '<div style="display:flex; justify-content:space-between; margin-bottom:4px; padding-bottom:4px; border-bottom:1px solid #333;">';
      html += '<span style="color:#aaa;">TBD</span><span style="font-weight:bold;">-</span>';
      html += '</div>';
      html += '<div style="display:flex; justify-content:space-between;">';
      html += '<span style="color:#aaa;">TBD</span><span style="font-weight:bold;">-</span>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';
  });

  container.innerHTML = html;
}

// PONTO DE ENTRADA
function initApp() {
  populateBonusSelects();
  renderMatches();
  renderGroups();
  renderBracket();
  loadUserData();
  setupAutoSave();
  setupNotifications();
  
  // Header status com update a cada segundo
  updateHeaderStatus();
  setInterval(updateHeaderStatus, 1000);
  
  // Auto-sync de resultados via API WorldCup26.ir a cada 2 minutos
  startAutoSync(120000);
  
  // Sidebar toggle
  var sidebar = document.getElementById('sidebar');
  var btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
  if (sidebar && btnSidebarToggle) {
    if (localStorage.getItem('sidebar_collapsed') === 'true') {
      sidebar.classList.add('collapsed');
      btnSidebarToggle.innerText = '›';
    }
    btnSidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        btnSidebarToggle.innerText = '›';
        localStorage.setItem('sidebar_collapsed', 'true');
      } else {
        btnSidebarToggle.innerText = '‹';
        localStorage.setItem('sidebar_collapsed', 'false');
      }
    });
  }

  // Se tem hash, tenta abrir a aba
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const btn = document.querySelector(`.tab-btn[data-target="${hash}"]`);
    if (btn) btn.click();
  }

  dbAPI.listenToLiveConfig((config) => {
    globalLiveConfig = config || {};
    // Atualiza aba de jogos no momento
    var isTabActive = document.getElementById('tab-jogos-momento') && document.getElementById('tab-jogos-momento').classList.contains('active');
    if (isTabActive) {
      if (typeof updateLiveTab === 'function') updateLiveTab();
    }
  });

  dbAPI.listenToUpdates(async function(ranking, officialResults) {
    globalRanking = ranking;
    globalOfficialResults = officialResults;
    // Sync official results to localStorage for other reads
    localStorage.setItem('official_results', JSON.stringify(officialResults));
    renderSidebarRanking(ranking);
    renderFullRanking();
    renderComparativo(ranking, officialResults);
    renderGroups();
    
    // Atualiza modal se estiver aberto
    if (typeof updateLiveTab === 'function') {
      updateLiveTab();
    }
    
    if (currentUser) {
      var data = await dbAPI.getUserData(currentUser);
      
      // Fallback seguro: se DB não retornou nome, usa do localStorage
      var authName = localStorage.getItem('auth_name');
      currentUserName = data.name || authName || 'Anônimo';
      globalPicks = data.picks || {};
      
      document.getElementById('display-user-name').innerText = currentUserName;
      
      // Update avatar
      selectedFlag = data.avatar || null;
      updateHeaderAvatar(selectedFlag);

      var hasScores = Object.keys(data.picks).length > 0;
      if (!hasScores && document.getElementById('login-modal')) {
        // Se ainda for necessário exibir algo inicial
      }
      renderBetResults(data.picks, officialResults);
    }
  });
}
