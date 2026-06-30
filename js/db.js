// =============================================
// db.js — DADOS REAIS DA COPA DO MUNDO 2026
// =============================================

// 1. MAPEAMENTO DE SELEÇÕES
const TEAM_MAP = {
  'Mexico': { code: 'mx', name: 'México' },
  'South Africa': { code: 'za', name: 'África do Sul' },
  'South Korea': { code: 'kr', name: 'Coreia do Sul' },
  'Czech Republic': { code: 'cz', name: 'Tchéquia' },
  'Canada': { code: 'ca', name: 'Canadá' },
  'Bosnia & Herzegovina': { code: 'ba', name: 'Bósnia e Herzegovina' },
  'Qatar': { code: 'qa', name: 'Catar' },
  'Switzerland': { code: 'ch', name: 'Suíça' },
  'Brazil': { code: 'br', name: 'Brasil' },
  'Morocco': { code: 'ma', name: 'Marrocos' },
  'Haiti': { code: 'ht', name: 'Haiti' },
  'Scotland': { code: 'gb-sct', name: 'Escócia' },
  'USA': { code: 'us', name: 'EUA' },
  'Paraguay': { code: 'py', name: 'Paraguai' },
  'Australia': { code: 'au', name: 'Austrália' },
  'Turkey': { code: 'tr', name: 'Turquia' },
  'Germany': { code: 'de', name: 'Alemanha' },
  'Curaçao': { code: 'cw', name: 'Curaçao' },
  'Ivory Coast': { code: 'ci', name: 'Costa do Marfim' },
  'Ecuador': { code: 'ec', name: 'Equador' },
  'Netherlands': { code: 'nl', name: 'Holanda' },
  'Japan': { code: 'jp', name: 'Japão' },
  'Sweden': { code: 'se', name: 'Suécia' },
  'Tunisia': { code: 'tn', name: 'Tunísia' },
  'Belgium': { code: 'be', name: 'Bélgica' },
  'Egypt': { code: 'eg', name: 'Egito' },
  'Iran': { code: 'ir', name: 'Irã' },
  'New Zealand': { code: 'nz', name: 'Nova Zelândia' },
  'Spain': { code: 'es', name: 'Espanha' },
  'Cape Verde': { code: 'cv', name: 'Cabo Verde' },
  'Saudi Arabia': { code: 'sa', name: 'Arábia Saudita' },
  'Uruguay': { code: 'uy', name: 'Uruguai' },
  'France': { code: 'fr', name: 'França' },
  'Senegal': { code: 'sn', name: 'Senegal' },
  'Iraq': { code: 'iq', name: 'Iraque' },
  'Norway': { code: 'no', name: 'Noruega' },
  'Argentina': { code: 'ar', name: 'Argentina' },
  'Algeria': { code: 'dz', name: 'Argélia' },
  'Austria': { code: 'at', name: 'Áustria' },
  'Jordan': { code: 'jo', name: 'Jordânia' },
  'Portugal': { code: 'pt', name: 'Portugal' },
  'DR Congo': { code: 'cd', name: 'RD Congo' },
  'Uzbekistan': { code: 'uz', name: 'Uzbequistão' },
  'Colombia': { code: 'co', name: 'Colômbia' },
  'England': { code: 'gb-eng', name: 'Inglaterra' },
  'Croatia': { code: 'hr', name: 'Croácia' },
  'Ghana': { code: 'gh', name: 'Gana' },
  'Panama': { code: 'pa', name: 'Panamá' }
};

// 2. DADOS DOS GRUPOS
const GROUPS = [
  { letter: 'A', teams: ['Mexico','South Africa','South Korea','Czech Republic'] },
  { letter: 'B', teams: ['Canada','Bosnia & Herzegovina','Qatar','Switzerland'] },
  { letter: 'C', teams: ['Brazil','Morocco','Haiti','Scotland'] },
  { letter: 'D', teams: ['USA','Paraguay','Australia','Turkey'] },
  { letter: 'E', teams: ['Germany','Curaçao','Ivory Coast','Ecuador'] },
  { letter: 'F', teams: ['Netherlands','Japan','Sweden','Tunisia'] },
  { letter: 'G', teams: ['Belgium','Egypt','Iran','New Zealand'] },
  { letter: 'H', teams: ['Spain','Cape Verde','Saudi Arabia','Uruguay'] },
  { letter: 'I', teams: ['France','Senegal','Iraq','Norway'] },
  { letter: 'J', teams: ['Argentina','Algeria','Austria','Jordan'] },
  { letter: 'K', teams: ['Portugal','DR Congo','Uzbekistan','Colombia'] },
  { letter: 'L', teams: ['England','Croatia','Ghana','Panama'] }
];

// 3. MAPEAMENTO DE ESTÁDIOS
const STADIUM_MAP = {
  'Mexico City': 'Estádio Azteca',
  'Guadalajara (Zapopan)': 'Estádio Akron',
  'Monterrey (Guadalupe)': 'Estádio BBVA',
  'Vancouver': 'BC Place',
  'Toronto': 'BMO Field',
  'Seattle': 'Lumen Field',
  'San Francisco Bay Area (Santa Clara)': "Levi's Stadium",
  'Los Angeles (Inglewood)': 'SoFi Stadium',
  'Houston': 'NRG Stadium',
  'Dallas (Arlington)': 'AT&T Stadium',
  'Kansas City': 'Arrowhead Stadium',
  'Atlanta': 'Mercedes-Benz Stadium',
  'Miami (Miami Gardens)': 'Hard Rock Stadium',
  'Boston (Foxborough)': 'Gillette Stadium',
  'Philadelphia': 'Lincoln Financial Field',
  'New York/New Jersey (East Rutherford)': 'MetLife Stadium'
};

// 4. PARSER DE DATA/HORA
function parseMatchDateTime(dateStr, timeStr) {
  const parts = timeStr.split(' ');
  const time = parts[0];
  const utcPart = parts[1];
  if (!utcPart) {
    return new Date(dateStr + 'T' + time + ':00Z');
  }
  let offsetText = utcPart.replace('UTC', '');
  let offset = offsetText === '' ? 0 : parseInt(offsetText);
  if (isNaN(offset)) offset = 0;
  
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const offsetStr = sign + String(absOffset).padStart(2, '0') + ':00';
  return new Date(dateStr + 'T' + time + ':00' + offsetStr);
}

// 5. JOGOS DA FASE DE GRUPOS — 72 jogos reais
// Formato: [date, time, homeKey, awayKey, groupLetter, venueKey]
const _RAW = [
  ['2026-06-11','13:00 UTC-6','Mexico','South Africa','A','Mexico City'],
  ['2026-06-11','20:00 UTC-6','South Korea','Czech Republic','A','Guadalajara (Zapopan)'],
  ['2026-06-12','15:00 UTC-4','Canada','Bosnia & Herzegovina','B','Toronto'],
  ['2026-06-12','18:00 UTC-7','USA','Paraguay','D','Los Angeles (Inglewood)'],
  ['2026-06-13','12:00 UTC-7','Qatar','Switzerland','B','San Francisco Bay Area (Santa Clara)'],
  ['2026-06-13','18:00 UTC-4','Brazil','Morocco','C','New York/New Jersey (East Rutherford)'],
  ['2026-06-13','21:00 UTC-4','Haiti','Scotland','C','Boston (Foxborough)'],
  ['2026-06-13','21:00 UTC-7','Australia','Turkey','D','Vancouver'],
  ['2026-06-14','12:00 UTC-5','Germany','Curaçao','E','Houston'],
  ['2026-06-14','15:00 UTC-5','Netherlands','Japan','F','Dallas (Arlington)'],
  ['2026-06-14','19:00 UTC-4','Ivory Coast','Ecuador','E','Philadelphia'],
  ['2026-06-14','20:00 UTC-6','Sweden','Tunisia','F','Monterrey (Guadalupe)'],
  ['2026-06-15','12:00 UTC-7','Belgium','Egypt','G','Seattle'],
  ['2026-06-15','12:00 UTC-4','Spain','Cape Verde','H','Atlanta'],
  ['2026-06-15','18:00 UTC-7','Iran','New Zealand','G','Los Angeles (Inglewood)'],
  ['2026-06-15','18:00 UTC-4','Saudi Arabia','Uruguay','H','Miami (Miami Gardens)'],
  ['2026-06-16','15:00 UTC-4','France','Senegal','I','New York/New Jersey (East Rutherford)'],
  ['2026-06-16','18:00 UTC-4','Iraq','Norway','I','Boston (Foxborough)'],
  ['2026-06-16','20:00 UTC-5','Argentina','Algeria','J','Kansas City'],
  ['2026-06-16','21:00 UTC-7','Austria','Jordan','J','San Francisco Bay Area (Santa Clara)'],
  ['2026-06-17','12:00 UTC-5','Portugal','DR Congo','K','Houston'],
  ['2026-06-17','15:00 UTC-5','England','Croatia','L','Dallas (Arlington)'],
  ['2026-06-17','19:00 UTC-4','Ghana','Panama','L','Toronto'],
  ['2026-06-17','20:00 UTC-6','Uzbekistan','Colombia','K','Mexico City'],
  ['2026-06-18','12:00 UTC-4','Czech Republic','South Africa','A','Atlanta'],
  ['2026-06-18','12:00 UTC-7','Switzerland','Bosnia & Herzegovina','B','Los Angeles (Inglewood)'],
  ['2026-06-18','15:00 UTC-7','Canada','Qatar','B','Vancouver'],
  ['2026-06-18','19:00 UTC-6','Mexico','South Korea','A','Guadalajara (Zapopan)'],
  ['2026-06-19','12:00 UTC-7','USA','Australia','D','Seattle'],
  ['2026-06-19','18:00 UTC-4','Scotland','Morocco','C','Boston (Foxborough)'],
  ['2026-06-19','20:00 UTC-7','Turkey','Paraguay','D','San Francisco Bay Area (Santa Clara)'],
  ['2026-06-19','20:30 UTC-4','Brazil','Haiti','C','Philadelphia'],
  ['2026-06-20','12:00 UTC-5','Netherlands','Sweden','F','Houston'],
  ['2026-06-20','16:00 UTC-4','Germany','Ivory Coast','E','Toronto'],
  ['2026-06-20','19:00 UTC-5','Ecuador','Curaçao','E','Kansas City'],
  ['2026-06-20','22:00 UTC-6','Tunisia','Japan','F','Monterrey (Guadalupe)'],
  ['2026-06-21','12:00 UTC-7','Belgium','Iran','G','Los Angeles (Inglewood)'],
  ['2026-06-21','12:00 UTC-4','Spain','Saudi Arabia','H','Atlanta'],
  ['2026-06-21','18:00 UTC-7','New Zealand','Egypt','G','Vancouver'],
  ['2026-06-21','18:00 UTC-4','Uruguay','Cape Verde','H','Miami (Miami Gardens)'],
  ['2026-06-22','12:00 UTC-5','Argentina','Austria','J','Dallas (Arlington)'],
  ['2026-06-22','17:00 UTC-4','France','Iraq','I','Philadelphia'],
  ['2026-06-22','20:00 UTC-4','Norway','Senegal','I','New York/New Jersey (East Rutherford)'],
  ['2026-06-22','20:00 UTC-7','Jordan','Algeria','J','San Francisco Bay Area (Santa Clara)'],
  ['2026-06-23','12:00 UTC-5','Portugal','Uzbekistan','K','Houston'],
  ['2026-06-23','16:00 UTC-4','England','Ghana','L','Boston (Foxborough)'],
  ['2026-06-23','19:00 UTC-4','Panama','Croatia','L','Toronto'],
  ['2026-06-23','20:00 UTC-6','Colombia','DR Congo','K','Guadalajara (Zapopan)'],
  ['2026-06-24','12:00 UTC-7','Switzerland','Canada','B','Vancouver'],
  ['2026-06-24','12:00 UTC-7','Bosnia & Herzegovina','Qatar','B','Seattle'],
  ['2026-06-24','18:00 UTC-4','Scotland','Brazil','C','Miami (Miami Gardens)'],
  ['2026-06-24','18:00 UTC-4','Morocco','Haiti','C','Atlanta'],
  ['2026-06-24','19:00 UTC-6','Czech Republic','Mexico','A','Mexico City'],
  ['2026-06-24','19:00 UTC-6','South Africa','South Korea','A','Monterrey (Guadalupe)'],
  ['2026-06-25','16:00 UTC-4','Curaçao','Ivory Coast','E','Philadelphia'],
  ['2026-06-25','16:00 UTC-4','Ecuador','Germany','E','New York/New Jersey (East Rutherford)'],
  ['2026-06-25','18:00 UTC-5','Japan','Sweden','F','Dallas (Arlington)'],
  ['2026-06-25','18:00 UTC-5','Tunisia','Netherlands','F','Kansas City'],
  ['2026-06-25','19:00 UTC-7','Turkey','USA','D','Los Angeles (Inglewood)'],
  ['2026-06-25','19:00 UTC-7','Paraguay','Australia','D','San Francisco Bay Area (Santa Clara)'],
  ['2026-06-26','15:00 UTC-4','Norway','France','I','Boston (Foxborough)'],
  ['2026-06-26','15:00 UTC-4','Senegal','Iraq','I','Toronto'],
  ['2026-06-26','18:00 UTC-6','Uruguay','Spain','H','Guadalajara (Zapopan)'],
  ['2026-06-26','19:00 UTC-5','Cape Verde','Saudi Arabia','H','Houston'],
  ['2026-06-26','20:00 UTC-7','Egypt','Iran','G','Seattle'],
  ['2026-06-26','20:00 UTC-7','New Zealand','Belgium','G','Vancouver'],
  ['2026-06-27','17:00 UTC-4','Panama','England','L','New York/New Jersey (East Rutherford)'],
  ['2026-06-27','17:00 UTC-4','Croatia','Ghana','L','Philadelphia'],
  ['2026-06-27','19:30 UTC-4','Colombia','Portugal','K','Miami (Miami Gardens)'],
  ['2026-06-27','19:30 UTC-4','DR Congo','Uzbekistan','K','Atlanta'],
  ['2026-06-27','21:00 UTC-5','Algeria','Austria','J','Kansas City'],
  ['2026-06-27','21:00 UTC-5','Jordan','Argentina','J','Dallas (Arlington)']
];

// 6. JOGOS DO MATA-MATA (Baseado no chaveamento oficial da imagem fornecida)
const _RAW_KNOCKOUT = [
  // 32-AVOS
  { num: 73, date: '2026-06-28', time: '16:00 UTC-3', homeRef: '2A', awayRef: '2B', ground: 'Los Angeles (Inglewood)', round: '32-AVOS' },
  { num: 74, date: '2026-06-29', time: '17:30 UTC-3', homeRef: 'Germany', awayRef: 'Paraguay', ground: 'Boston (Foxborough)', round: '32-AVOS' },
  { num: 75, date: '2026-06-29', time: '22:00 UTC-3', homeRef: '1F', awayRef: '2C', ground: 'Monterrey (Guadalupe)', round: '32-AVOS' },
  { num: 76, date: '2026-06-29', time: '14:00 UTC-3', homeRef: '1C', awayRef: '2F', ground: 'Houston', round: '32-AVOS' },
  { num: 77, date: '2026-06-30', time: '18:00 UTC-3', homeRef: 'France', awayRef: 'Sweden', ground: 'New York/New Jersey (East Rutherford)', round: '32-AVOS' },
  { num: 78, date: '2026-06-30', time: '14:00 UTC-3', homeRef: '2E', awayRef: '2I', ground: 'Dallas (Arlington)', round: '32-AVOS' },
  { num: 79, date: '2026-06-30', time: '22:00 UTC-3', homeRef: '1A', awayRef: '3C/E/F/H/I', ground: 'Mexico City', round: '32-AVOS' },
  { num: 80, date: '2026-07-01', time: '13:00 UTC-3', homeRef: '1L', awayRef: '3E/H/I/J/K', ground: 'Atlanta', round: '32-AVOS' },
  { num: 81, date: '2026-07-01', time: '21:00 UTC-3', homeRef: '1D', awayRef: '3B/E/F/I/J', ground: 'San Francisco Bay Area (Santa Clara)', round: '32-AVOS' },
  { num: 82, date: '2026-07-01', time: '17:00 UTC-3', homeRef: 'Belgium', awayRef: 'Senegal', ground: 'Seattle', round: '32-AVOS' },
  { num: 83, date: '2026-07-02', time: '20:00 UTC-3', homeRef: '2K', awayRef: '2L', ground: 'Toronto', round: '32-AVOS' },
  { num: 84, date: '2026-07-02', time: '16:00 UTC-3', homeRef: '1H', awayRef: '2J', ground: 'Los Angeles (Inglewood)', round: '32-AVOS' },
  { num: 85, date: '2026-07-03', time: '00:00 UTC-3', homeRef: 'Switzerland', awayRef: 'Algeria', ground: 'Vancouver', round: '32-AVOS' },
  { num: 86, date: '2026-07-03', time: '19:00 UTC-3', homeRef: '1J', awayRef: '2H', ground: 'Miami (Miami Gardens)', round: '32-AVOS' },
  { num: 87, date: '2026-07-03', time: '22:30 UTC-3', homeRef: '1K', awayRef: '3D/E/I/J/L', ground: 'Kansas City', round: '32-AVOS' },
  { num: 88, date: '2026-07-03', time: '15:00 UTC-3', homeRef: '2D', awayRef: '2G', ground: 'Dallas (Arlington)', round: '32-AVOS' },
  
  // OITAVAS
  { num: 89, date: '2026-07-04', time: '18:00 UTC-4', homeRef: 'W74', awayRef: 'W77', ground: 'Philadelphia', round: 'OITAVAS' },
  { num: 90, date: '2026-07-04', time: '14:00 UTC-5', homeRef: 'W73', awayRef: 'W75', ground: 'Houston', round: 'OITAVAS' },
  { num: 91, date: '2026-07-05', time: '17:00 UTC-4', homeRef: 'W76', awayRef: 'W78', ground: 'New York/New Jersey (East Rutherford)', round: 'OITAVAS' },
  { num: 92, date: '2026-07-05', time: '21:00 UTC-6', homeRef: 'W79', awayRef: 'W80', ground: 'Mexico City', round: 'OITAVAS' },
  { num: 93, date: '2026-07-06', time: '16:00 UTC-5', homeRef: 'W83', awayRef: 'W84', ground: 'Dallas (Arlington)', round: 'OITAVAS' },
  { num: 94, date: '2026-07-06', time: '21:00 UTC-7', homeRef: 'W81', awayRef: 'W82', ground: 'Seattle', round: 'OITAVAS' },
  { num: 95, date: '2026-07-07', time: '13:00 UTC-4', homeRef: 'W86', awayRef: 'W88', ground: 'Atlanta', round: 'OITAVAS' },
  { num: 96, date: '2026-07-07', time: '17:00 UTC-7', homeRef: 'W85', awayRef: 'W87', ground: 'Vancouver', round: 'OITAVAS' },
  
  // QUARTAS
  { num: 97, date: '2026-07-09', time: '17:00 UTC-4', homeRef: 'W89', awayRef: 'W90', ground: 'Boston (Foxborough)', round: 'QUARTAS' },
  { num: 98, date: '2026-07-10', time: '16:00 UTC-7', homeRef: 'W93', awayRef: 'W94', ground: 'Los Angeles (Inglewood)', round: 'QUARTAS' },
  { num: 99, date: '2026-07-11', time: '18:00 UTC-4', homeRef: 'W91', awayRef: 'W92', ground: 'Miami (Miami Gardens)', round: 'QUARTAS' },
  { num: 100, date: '2026-07-11', time: '22:00 UTC-5', homeRef: 'W95', awayRef: 'W96', ground: 'Kansas City', round: 'QUARTAS' },
  
  // SEMIS
  { num: 101, date: '2026-07-14', time: '16:00 UTC-5', homeRef: 'W97', awayRef: 'W98', ground: 'Dallas (Arlington)', round: 'SEMIFINAL' },
  { num: 102, date: '2026-07-15', time: '16:00 UTC-4', homeRef: 'W99', awayRef: 'W100', ground: 'Atlanta', round: 'SEMIFINAL' },
  
  // 3º LUGAR
  { num: 103, date: '2026-07-18', time: '18:00 UTC-4', homeRef: 'RU101', awayRef: 'RU102', ground: 'Miami (Miami Gardens)', round: '3º LUGAR' },
  
  // FINAL
  { num: 104, date: '2026-07-19', time: '16:00 UTC-4', homeRef: 'W101', awayRef: 'W102', ground: 'New York/New Jersey (East Rutherford)', round: 'FINAL' }
];

// Fix J85 time based on image (it's 00:00 on 03/07)
_RAW_KNOCKOUT.find(m => m.num === 85).date = '2026-07-03';

const KNOCKOUT_MATCHES = _RAW_KNOCKOUT.map(function(r) {
  // We use m_72 to m_103 to represent matches 73 to 104
  return {
    id: 'm_' + (r.num - 1),
    num: r.num,
    group: 'Mata-Mata',
    round: r.round,
    homeRef: r.homeRef,
    awayRef: r.awayRef,
    // Em mata-mata, os times reais serão resolvidos dinamicamente. Se não houver, exibe o placeholder.
    home: { code: 'unknown', name: r.homeRef, isPlaceholder: true },
    away: { code: 'unknown', name: r.awayRef, isPlaceholder: true },
    date: parseMatchDateTime(r.date, r.time),
    dateStr: r.date,
    ground: r.ground,
    stadium: STADIUM_MAP[r.ground] || r.ground
  };
});

// 7. CONSTRUIR ARRAYS FINAIS
const ALL_MATCHES = _RAW.map(function(r, i) {
  return {
    id: 'm_' + i,
    num: i + 1, // num 1 to 72
    group: r[4],
    home: TEAM_MAP[r[2]],
    away: TEAM_MAP[r[3]],
    date: parseMatchDateTime(r[0], r[1]),
    dateStr: r[0],
    ground: r[5],
    stadium: STADIUM_MAP[r[5]] || r[5]
  };
}).concat(KNOCKOUT_MATCHES).sort(function(a, b) { return a.date - b.date; });

const ALL_TEAMS = Object.values(TEAM_MAP).sort(function(a, b) {
  return a.name.localeCompare(b.name);
});

// FUNÇÃO PARA RESOLVER TIMES DO MATA-MATA COM BASE NOS RESULTADOS
function getGroupStandings(results) {
  let standingsByGroup = {};
  
  GROUPS.forEach(function(group) {
    var standings = {};
    group.teams.forEach(function(tKey) {
      standings[tKey] = { key: tKey, team: TEAM_MAP[tKey], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    var groupMatches = ALL_MATCHES.filter(function(m) { return m.group === group.letter; });
    groupMatches.forEach(function(m) {
      var r = results[m.id];
      if (r && r.home !== undefined && r.away !== undefined && !r.canceled) {
        var homeKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k].code === m.home.code; });
        var awayKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k].code === m.away.code; });
        if (standings[homeKey] && standings[awayKey]) {
          standings[homeKey].p++; standings[awayKey].p++;
          standings[homeKey].gf += r.home; standings[homeKey].ga += r.away;
          standings[awayKey].gf += r.away; standings[awayKey].ga += r.home;
          if (r.home > r.away) { standings[homeKey].pts += 3; }
          else if (r.home < r.away) { standings[awayKey].pts += 3; }
          else { standings[homeKey].pts += 1; standings[awayKey].pts += 1; }
        }
      }
    });

    var sorted = Object.values(standings).sort(function(a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      var gdA = a.gf - a.ga; var gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
    
    standingsByGroup[group.letter] = sorted;
  });
  return standingsByGroup;
}

window.resolveKnockoutTeams = function(results) {
  const standings = getGroupStandings(results);
  
  // Calcular melhores 3ºs colocados (8 vagas)
  let thirds = [];
  GROUPS.forEach(g => {
    if (standings[g.letter] && standings[g.letter][2]) {
      thirds.push({ group: g.letter, team: standings[g.letter][2].team, stats: standings[g.letter][2] });
    }
  });
  
  thirds.sort(function(a, b) {
    if (b.stats.pts !== a.stats.pts) return b.stats.pts - a.stats.pts;
    var gdB = b.stats.gf - b.stats.ga;
    var gdA = a.stats.gf - a.stats.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.stats.gf - a.stats.gf;
  });
  
  let top8 = thirds.slice(0, 8);
  let thirdAssignments = {};
  
  if (top8.length === 8) {
    let slots = [
      { id: '3A/B/C/D/F', groups: ['A','B','C','D','F'] },
      { id: '3C/D/F/G/H', groups: ['C','D','F','G','H'] },
      { id: '3C/E/F/H/I', groups: ['C','E','F','H','I'] },
      { id: '3E/H/I/J/K', groups: ['E','H','I','J','K'] },
      { id: '3B/E/F/I/J', groups: ['B','E','F','I','J'] },
      { id: '3A/E/H/I/J', groups: ['A','E','H','I','J'] },
      { id: '3E/F/G/I/J', groups: ['E','F','G','I','J'] },
      { id: '3D/E/I/J/L', groups: ['D','E','I','J','L'] }
    ];
    
    function backtrack(slotIndex, availableTeams) {
      if (slotIndex === slots.length) return true;
      let slot = slots[slotIndex];
      for (let i = 0; i < availableTeams.length; i++) {
        let t = availableTeams[i];
        if (slot.groups.includes(t.group)) {
          thirdAssignments[slot.id] = t.team;
          let nextAvailable = availableTeams.slice();
          nextAvailable.splice(i, 1);
          if (backtrack(slotIndex + 1, nextAvailable)) return true;
        }
      }
      return false;
    }
    
    if (!backtrack(0, top8)) {
      // Greedy fallback se não achar match perfeito
      thirdAssignments = {};
      let used = new Set();
      slots.forEach(slot => {
        let match = top8.find(t => !used.has(t.group) && slot.groups.includes(t.group));
        if (match) {
          thirdAssignments[slot.id] = match.team;
          used.add(match.group);
        } else {
          let fallback = top8.find(t => !used.has(t.group));
          if (fallback) {
            thirdAssignments[slot.id] = fallback.team;
            used.add(fallback.group);
          }
        }
      });
    }
  }

  // Resolve times
  ALL_MATCHES.forEach(m => {
    if (m.group === 'Mata-Mata') {
      // Resolve Home
      m.home = resolveTeamRef(m.homeRef, standings, results, thirdAssignments) || { code: 'unknown', name: m.homeRef, isPlaceholder: true };
      // Resolve Away
      m.away = resolveTeamRef(m.awayRef, standings, results, thirdAssignments) || { code: 'unknown', name: m.awayRef, isPlaceholder: true };
    }
  });
}

function resolveTeamRef(ref, standings, results, thirdAssignments) {
  if (!ref) return null;
  
  if (TEAM_MAP[ref]) return TEAM_MAP[ref];

  if (thirdAssignments && thirdAssignments[ref]) {
    return thirdAssignments[ref];
  }
  // Group winners/runners up (e.g. 1A, 2B)
  const groupMatch = ref.match(/^([1-2])([A-L])$/);
  if (groupMatch) {
    const pos = parseInt(groupMatch[1]) - 1;
    const group = groupMatch[2];
    if (standings[group] && standings[group][pos]) {
      // Só resolve se o grupo já tiver completado pelo menos os jogos mínimos ou todos
      // (simplificação: sempre resolvemos com o que temos, mas times podem mudar)
      return standings[group][pos].team;
    }
  }
  
  // Winners (e.g. W74)
  const winnerMatch = ref.match(/^W(\d+)$/);
  if (winnerMatch) {
    const num = parseInt(winnerMatch[1]);
    const mId = 'm_' + (num - 1);
    const mData = ALL_MATCHES.find(m => m.id === mId);
    const r = results[mId];
    if (mData && r && r.home !== undefined && r.away !== undefined) {
      // Para mata-mata oficial deve haver pênaltis. Vamos usar o placar simples por enquanto.
      if (r.home > r.away) return mData.home;
      if (r.away > r.home) return mData.away;
      if (r.home_pen !== undefined && r.away_pen !== undefined) {
          if (r.home_pen > r.away_pen) return mData.home;
          if (r.away_pen > r.home_pen) return mData.away;
      }
      return { code: 'unknown', name: 'Empate s/ Pen: ' + mData.home.name + ' ou ' + mData.away.name, isPlaceholder: true };
    }
  }
  
  // Losers (e.g. RU101)
  const loserMatch = ref.match(/^RU(\d+)$/);
  if (loserMatch) {
    const num = parseInt(loserMatch[1]);
    const mId = 'm_' + (num - 1);
    const mData = ALL_MATCHES.find(m => m.id === mId);
    const r = results[mId];
    if (mData && r && r.home !== undefined && r.away !== undefined) {
      if (r.home > r.away) return mData.away;
      if (r.away > r.home) return mData.home;
      if (r.home_pen !== undefined && r.away_pen !== undefined) {
          if (r.home_pen > r.away_pen) return mData.away;
          if (r.away_pen > r.home_pen) return mData.home;
      }
    }
  }
  
  return null;
}

// 8. CONFIGURAÇÃO SUPABASE
const supabaseUrl = "https://aeoknivsayldwtdxendn.supabase.co";
const supabaseKey = "sb_publishable_8eboWI3ZuIuVG_7McZfunQ_to2lgfME";

if (typeof supabase !== 'undefined') {
  try {
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    console.log("Supabase conectado.");
  } catch(e) {
    console.error("Erro ao conectar Supabase:", e);
  }
}

async function _updateUser(userId, modifierFn) {
  if (!window.supabaseClient) return;
  const { data: userRow } = await window.supabaseClient.from('users').select('data').eq('id', userId).single();
  const dbData = (userRow && userRow.data) ? userRow.data : { picks: {}, bonus: {} };
  modifierFn(dbData);
  dbData.updatedAt = new Date().toISOString();
  await window.supabaseClient.from('users').upsert({ id: userId, data: dbData });
}

// 8. API DO BANCO DE DADOS
const dbAPI = {
  savePick: async (userId, userName, matchId, home, away, isCuringa = false, penaltyWinner = null) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    if (!localData.picks[matchId]) localData.picks[matchId] = {};
    localData.picks[matchId].home = home;
    localData.picks[matchId].away = away;
    if (isCuringa !== undefined) localData.picks[matchId].isCuringa = isCuringa;
    if (penaltyWinner) localData.picks[matchId].penaltyWinner = penaltyWinner;
    else delete localData.picks[matchId].penaltyWinner;
    
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.name = userName;
        if (!dbData.picks) dbData.picks = {};
        if (!dbData.picks[matchId]) dbData.picks[matchId] = {};
        dbData.picks[matchId].home = home;
        dbData.picks[matchId].away = away;
        if (isCuringa) dbData.picks[matchId].isCuringa = true;
        else delete dbData.picks[matchId].isCuringa;
        if (penaltyWinner) dbData.picks[matchId].penaltyWinner = penaltyWinner;
        else delete dbData.picks[matchId].penaltyWinner;
      });
    }
  },

  saveBonus: async (userId, userName, bonusKey, value) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.bonus[bonusKey] = value;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.name = userName;
        dbData['bonus_' + bonusKey] = value;
      });
    }
  },

  savePontosAjuste: async (userId, userName, val) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.pontos_ajuste = val;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.name = userName;
        dbData.pontos_ajuste = val;
      });
    }
  },

  saveNickname: async (userId, nickname) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.nickname = nickname;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));

    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.nickname = nickname;
      });
    }
  },

  saveManualBadge: async (userId, badgeId) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (!localData.manualBadges) localData.manualBadges = [];
    if (!localData.manualBadges.includes(badgeId)) {
      localData.manualBadges.push(badgeId);
    }
    localStorage.setItem('user_' + userId, JSON.stringify(localData));

    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        if (!dbData.manualBadges) dbData.manualBadges = [];
        if (!dbData.manualBadges.includes(badgeId)) {
          dbData.manualBadges.push(badgeId);
        }
      });
    }
  },
  resetUserCuringa: async (userId) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (localData.picks) {
      for (let mId in localData.picks) {
        if (localData.picks[mId].isCuringa) {
          localData.picks[mId].isCuringa = false;
        }
      }
      localStorage.setItem('user_' + userId, JSON.stringify(localData));
    }
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        if (dbData.picks) {
          for (let mId in dbData.picks) {
            if (dbData.picks[mId].isCuringa) {
              delete dbData.picks[mId].isCuringa;
            }
          }
        }
      });
    }
  },

  saveUserName: async (userId, userName) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.name = userName;
      });
    }
  },

  saveLiveConfig: async (config) => {
    localStorage.setItem('live_config', JSON.stringify(config));
    if (window.supabaseClient) {
      const { data: row } = await window.supabaseClient.from('meta').select('data').eq('id', 'live_config').single();
      const dbData = (row && row.data) ? row.data : {};
      Object.assign(dbData, config);
      await window.supabaseClient.from('meta').upsert({ id: 'live_config', data: dbData });
    }
  },

  listenToLiveConfig: (callback) => {
    if (window.supabaseClient) {
      window._configListener = window.supabaseClient
        .channel('public:meta')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.live_config' }, payload => {
          callback(payload.new.data);
        })
        .subscribe();
        
      window.supabaseClient.from('meta').select('data').eq('id', 'live_config').single().then(res => {
         if(res.data && res.data.data) callback(res.data.data);
      });
    } else {
      const l = localStorage.getItem('live_config');
      if (l) callback(JSON.parse(l));
    }
  },

  saveUserAvatar: async (userId, countryCode) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.avatar = countryCode;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (window.supabaseClient) {
      await _updateUser(userId, (dbData) => {
        dbData.avatar_bandeira = countryCode;
      });
    }
  },

  getUserData: async (userId) => {
    const localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (!window.supabaseClient) return localData;
    try {
      const { data: row } = await window.supabaseClient.from('users').select('data').eq('id', userId).single();
      const userData = (row && row.data) ? row.data : {};
      const picks = userData.picks || {};
      const bonus = {
        campeao: userData.bonus_campeao || '',
        artilheiro: userData.bonus_artilheiro || '',
        ataque: userData.bonus_ataque || '',
        decepcao: userData.bonus_decepcao || '',
        craque: userData.bonus_craque || '',
        goleiro: userData.bonus_goleiro || '',
        defensor: userData.bonus_defensor || '',
        revelacao: userData.bonus_revelacao || '',
        neymar_gol: userData.bonus_neymar_gol || ''
      };
      return { name: userData.name || '', picks: picks, bonus: bonus, avatar: userData.avatar_bandeira || '' };
    } catch(e) {
      console.error(e);
      return localData;
    }
  },

  saveResult: async (resultsObj) => {
    let local = JSON.parse(localStorage.getItem('official_results') || '{}');
    Object.assign(local, resultsObj);
    localStorage.setItem('official_results', JSON.stringify(local));
    if (window.supabaseClient) {
      const { data: row } = await window.supabaseClient.from('meta').select('data').eq('id', 'results').single();
      const dbData = (row && row.data) ? row.data : {};
      Object.assign(dbData, resultsObj);
      await window.supabaseClient.from('meta').upsert({ id: 'results', data: dbData });
      await dbAPI.recalculateGlobalRanking(dbData, true);
    }
  },

  deleteResult: async (matchId) => {
    let local = JSON.parse(localStorage.getItem('official_results') || '{}');
    delete local[matchId];
    localStorage.setItem('official_results', JSON.stringify(local));
    if (window.supabaseClient) {
      const { data: row } = await window.supabaseClient.from('meta').select('data').eq('id', 'results').single();
      const dbData = (row && row.data) ? row.data : {};
      delete dbData[matchId];
      await window.supabaseClient.from('meta').upsert({ id: 'results', data: dbData }).catch(e => console.log(e));
      await dbAPI.recalculateGlobalRanking(dbData, true);
    }
  },

  getResults: async () => {
    if (!window.supabaseClient) return JSON.parse(localStorage.getItem('official_results') || '{}');
    try {
      const { data: row } = await window.supabaseClient.from('meta').select('data').eq('id', 'results').single();
      return (row && row.data) ? row.data : {};
    } catch(e) {
      return JSON.parse(localStorage.getItem('official_results') || '{}');
    }
  },

  
  recalculateGlobalRanking: async (results, force = false) => {
    if (!window.supabaseClient) return;
    if (!results) results = await dbAPI.getResults();
    try {
        console.log("Recalculating Global Ranking (Master Client)...");
        // Check lock
        const { data: lockRow } = await window.supabaseClient.from('meta').select('data').eq('id', 'ranking_lock').single();
        const lastCalc = (lockRow && lockRow.data && lockRow.data.updatedAt) ? new Date(lockRow.data.updatedAt).getTime() : 0;
        const now = Date.now();
        if (!force && now - lastCalc < 30000) {
            console.log("Ranking already recalculated recently by another client.");
            return;
        }
        await window.supabaseClient.from('meta').upsert({ id: 'ranking_lock', data: { updatedAt: new Date().toISOString() } });
        
        const { data: usersData } = await window.supabaseClient.from('users').select('*');
        const usersSnap = { docs: usersData.map(r => ({ id: r.id, data: () => r.data })) };
        const usersPicksMap = {};
        const allPicksByMatch = {};
        const botUserIds = [];
        const kickUserIds = [];
          
          // First Pass: Load all picks and calculate community stats
          for (let userDoc of usersSnap.docs) {
            const uData = userDoc.data();
            if (uData && uData.name) {
               const nLower = uData.name.toLowerCase();
               if (nLower.includes("chatgpt") || nLower.includes("claude") || nLower.includes("gemini") || nLower.includes("grok")) {
                  botUserIds.push(userDoc.id);
               }
               if (nLower.includes("kick") || (uData.nickname && uData.nickname.toLowerCase().includes("kick"))) {
                  kickUserIds.push(userDoc.id);
               }
            }
            const picksData = uData.picks || {};
            for (let mId in picksData) {
              const p = picksData[mId];
              
              if (p.home !== undefined && p.away !== undefined) {
                if (!allPicksByMatch[mId]) allPicksByMatch[mId] = { home: 0, draw: 0, away: 0, total: 0, scores: {} };
                allPicksByMatch[mId].total++;
                if (p.home > p.away) allPicksByMatch[mId].home++;
                else if (p.home < p.away) allPicksByMatch[mId].away++;
                else allPicksByMatch[mId].draw++;
                
                const scoreStr = p.home + 'x' + p.away;
                if (!allPicksByMatch[mId].scores[scoreStr]) allPicksByMatch[mId].scores[scoreStr] = 0;
                allPicksByMatch[mId].scores[scoreStr]++;
              }
            }
            usersPicksMap[userDoc.id] = picksData;
          }

          const mostPopularPicks = {};
          for (let mId in allPicksByMatch) {
              const scores = allPicksByMatch[mId].scores;
              let max = 0;
              let popularScores = [];
              for (let s in scores) {
                  if (scores[s] > max) {
                      max = scores[s];
                      popularScores = [s];
                  } else if (scores[s] === max) {
                      popularScores.push(s);
                  }
              }
              mostPopularPicks[mId] = popularScores;
          }

          // Fase 1: Histórico Diário de Pontos e Rankings
          const agora = new Date();
          function isMatchFinished(m, resObj) {
            if (!resObj || resObj.home === undefined) return false;
            if (resObj.canceled) return true;
            var isFinAPI = resObj.status === 'finished';
            var mEnd = new Date(m.date.getTime() + 120 * 60 * 1000);
            return isFinAPI || (agora > mEnd && resObj.status !== 'live');
          }
          
          const finishedMatches = ALL_MATCHES.filter(m => isMatchFinished(m, results[m.id]));
          const daysSet = new Set(finishedMatches.map(m => m.dateStr));
          const daysList = Array.from(daysSet).sort();
          
          const userDailyPoints = {};
          usersSnap.docs.forEach(uDoc => {
             userDailyPoints[uDoc.id] = {};
             let runningPts = 0;
             daysList.forEach(day => {
                finishedMatches.filter(m => m.dateStr === day).forEach(m => {
                   const r = results[m.id];
                   const p = usersPicksMap[uDoc.id][m.id];
                   if (r && p && r.home !== undefined && p.home !== undefined) {
                       let mPts = 0;
                       
                       var exactScore = (p.home === r.home && p.away === r.away);
                       var userWinner = (p.home > p.away) ? 'home' : (p.away > p.home) ? 'away' : (p.penaltyWinner || null);
                       var actualWinner = (r.home > r.away) ? 'home' : (r.away > r.home) ? 'away' : 
                                          ((r.home_pen !== undefined && r.away_pen !== undefined) ? ((r.home_pen > r.away_pen) ? 'home' : 'away') : null);
                       
                       if (exactScore) {
                         mPts = 3;
                         if (p.home === p.away && m.group === 'Mata-Mata' && actualWinner && userWinner === actualWinner) {
                            mPts += 1;
                         }
                       } else {
                         if (p.home === p.away && r.home === r.away) mPts = 1;
                         else if (userWinner && actualWinner && userWinner === actualWinner) mPts = 1;
                       }
                       
                       if (p.isCuringa) mPts *= 2;
                       runningPts += mPts;
                   }
                });
                userDailyPoints[uDoc.id][day] = runningPts;
             });
          });
          
          const dailyRankings = {};
          daysList.forEach(day => {
             const sortedUsers = usersSnap.docs.map(d => d.id).sort((a, b) => userDailyPoints[b][day] - userDailyPoints[a][day]);
             dailyRankings[day] = {};
             sortedUsers.forEach((uid, index) => {
                 dailyRankings[day][uid] = index + 1;
             });
          });

          const ranking = [];
          for (let userDoc of usersSnap.docs) {
            const userData = userDoc.data();
            const picksData = usersPicksMap[userDoc.id];
            
            let exato = 0, vencedor = 0, pts = 0;
            let curingasUsados = 0;
            
            // Loop for basic points
            for (let mId in picksData) {
              if (picksData[mId].isCuringa) curingasUsados++;
              const p = picksData[mId];
              const r = results[mId];
              if (r && r.home !== undefined && p.home !== undefined) {
                let matchPts = 0;
                if (p.home === r.home && p.away === r.away) {
                  exato++; matchPts = 3;
                } else if (
                  (p.home > p.away && r.home > r.away) ||
                  (p.home < p.away && r.home < r.away) ||
                  (p.home === p.away && r.home === r.away)
                ) {
                  vencedor++; matchPts = 1;
                }
                if (p.isCuringa) matchPts *= 2;
                pts += matchPts;
              }
            }

            // Calcular pontos de bonus
            if (results.bonus_artilheiro && userData.bonus_artilheiro === results.bonus_artilheiro) pts += 2;
            if (results.bonus_ataque && userData.bonus_ataque === results.bonus_ataque) pts += 2;
            if (results.bonus_campeao && userData.bonus_campeao === results.bonus_campeao) pts += 2;
            if (results.bonus_decepcao && userData.bonus_decepcao === results.bonus_decepcao) pts += 2;
            if (results.bonus_craque && userData.bonus_craque === results.bonus_craque) pts += 2;
            if (results.bonus_goleiro && userData.bonus_goleiro === results.bonus_goleiro) pts += 2;
            if (results.bonus_defensor && userData.bonus_defensor === results.bonus_defensor) pts += 2;
            if (results.bonus_revelacao && userData.bonus_revelacao === results.bonus_revelacao) pts += 2;
            if (results.bonus_neymar_gol && userData.bonus_neymar_gol === results.bonus_neymar_gol) pts += 2;
            
            if (userData.pontos_ajuste) {
              pts += parseInt(userData.pontos_ajuste);
            }

            // Ordenar jogos finalizados pela data (usando ALL_MATCHES)
            let userFinishedMatches = [];
            ALL_MATCHES.forEach(function(m) {
              const r = results[m.id];
              const p = picksData[m.id];
              if (r && r.home !== undefined && p && p.home !== undefined && isMatchFinished(m, r)) {
                let isExact = false;
                let isWinner = false;
                let pts = 0;
                
                var userWinner = (p.home > p.away) ? 'home' : (p.away > p.home) ? 'away' : (p.penaltyWinner || null);
                var actualWinner = (r.home > r.away) ? 'home' : (r.away > r.home) ? 'away' : 
                                   ((r.home_pen !== undefined && r.away_pen !== undefined) ? ((r.home_pen > r.away_pen) ? 'home' : 'away') : null);
                
                if (p.home === r.home && p.away === r.away) {
                  isExact = true;
                  pts = 3;
                  if (p.home === p.away && m.group === 'Mata-Mata' && actualWinner && userWinner === actualWinner) {
                     pts += 1;
                  }
                } else {
                  if (p.home === p.away && r.home === r.away) {
                    isWinner = true;
                    pts = 1;
                  } else if (userWinner && actualWinner && userWinner === actualWinner) {
                    isWinner = true;
                    pts = 1;
                  }
                }
                pts *= (p.isCuringa ? 2 : 1);
                
                userFinishedMatches.push({
                  match: m, 
                  pick: p,
                  result: r,
                  pts: pts, 
                  totalGoals: r.home + r.away, 
                  exact: isExact,
                  winner: isWinner || isExact,
                  isTie: p.home === p.away
                });
              }
            });

            // Sort por data
            userFinishedMatches.sort((a, b) => a.match.date - b.match.date);

            let currentHitStreak = 0; // The requested Hot Streak
            let currentExactStreak = 0;
            let maxExactStreak = 0;
            let currentMissStreak = 0;
            let maxMissStreak = 0;
            let exactTies = 0;
            let hasZebra = false;
            let hasMaria = false;
            let has0x0 = false;
            let hasGoleada = false;
            let hasCuringaExato = false;
            let uniqueWinnerHits = new Set();
            let hasPatriota = false;
            let hasSpecialOne = false;
            let hasExorcista = false;
            let hasZebraNoturna = false;
            let hasTeimoso = false;
            let hasSangueFrio = false;
            let hasExplorador = false;
            let hasContraTudo = false;
            
            let userScoreBetsCount = {};
            let exactGroups = new Set();
            let prevUm = null;
            let hasDupla = false;
            let userDailyMatchCount = {};
            let userDailyMissCount = {};

            // New Trophy Variables
            let muralhaCount = 0;
            let popularidadeCount = 0;
            let hasKamikaze = false;
            let reiDaSelvaCount = 0;
            daysList.forEach(day => {
                if (dailyRankings[day] && dailyRankings[day][userDoc.id] === 1) reiDaSelvaCount++;
            });
            let hasReiDaSelva = reiDaSelvaCount > 10;
            
            let currentWinnerStreak = 0;
            let maxWinnerStreak = 0;
            let zebraExatasCount = 0;
            let impossiveisBet = 0;
            let impossiveisExact = 0;
            let exactHitsList = [];
            let hasElefante = false;
            let hasEnxame = false;
            let betOnBrazilAndWonAll = true;
            let hasPlayedBrazil = false;
            let drawBetsCount = 0;
            let totalBets = 0;
            let countFavorito = 0;
            let countZebraTotal = 0;
            let alienigenaCount = 0;
            let goleiroHits = 0;
            let azaradoHits = 0;
            let botHits = 0;
            let telepataMatchCount = {};

            userFinishedMatches.forEach(function(um) {

              if (um.pts === 0) {
                currentMissStreak++;
                maxMissStreak = Math.max(maxMissStreak, currentMissStreak);
                currentHitStreak = 0;
              } else {
                currentMissStreak = 0;
                currentHitStreak++;
              }
              
              if (um.exact && um.isTie) exactTies++;
              if (um.exact && um.pick.home === 0 && um.pick.away === 0) has0x0 = true;
              if (um.exact && um.pick.home !== um.pick.away && (um.pick.home === 0 || um.pick.away === 0)) {
                  muralhaCount++;
              }
              if (um.exact && um.totalGoals >= 4) hasGoleada = true;
              if (um.exact && um.pick.isCuringa) {
                  hasCuringaExato = true;
                  const cStats = allPicksByMatch[um.match.id];
                  if (cStats && cStats.total >= 3) {
                      const scoreStrC = um.pick.home + 'x' + um.pick.away;
                      const betPct = (cStats.scores[scoreStrC] || 0) / cStats.total;
                      if (betPct < 0.20) {
                          hasKamikaze = true;
                      }
                  }
              }
              if (um.winner) uniqueWinnerHits.add(um.match.id);
              
              if (prevUm && um.exact && prevUm.exact) {
                  if (um.pick.home === prevUm.pick.away && um.pick.away === prevUm.pick.home && um.pick.home !== um.pick.away) {
                      hasDupla = true;
                  }
              }
              prevUm = um;

              const dayStr = um.match.dateStr;
              userDailyMatchCount[dayStr] = (userDailyMatchCount[dayStr] || 0) + 1;
              if (!um.winner) {
                  userDailyMissCount[dayStr] = (userDailyMissCount[dayStr] || 0) + 1;
              }

              const scoreStr = um.pick.home + 'x' + um.pick.away;
              userScoreBetsCount[scoreStr] = (userScoreBetsCount[scoreStr] || 0) + 1;
              
              if (mostPopularPicks[um.match.id] && mostPopularPicks[um.match.id].includes(scoreStr)) {
                  popularidadeCount++;
              }

              if (um.exact) {
                 alienigenaCount++;
                 if (allPicksByMatch[um.match.id] && allPicksByMatch[um.match.id].scores[scoreStr] === 1) {
                   hasSpecialOne = true;
                 }
                 if (exactHitsList.includes(scoreStr)) hasElefante = true;
                 else exactHitsList.push(scoreStr);
                 
                 const cStatsExact = allPicksByMatch[um.match.id];
                 if (cStatsExact && cStatsExact.scores[scoreStr] >= 6) {
                     hasEnxame = true;
                 }
                 
                 let kickAlsoExact = false;
                 kickUserIds.forEach(kId => {
                     if (kId !== userDoc.id) {
                         let kPick = usersPicksMap[kId][um.match.id];
                         if (kPick && kPick.home === um.pick.home && kPick.away === um.pick.away) {
                             kickAlsoExact = true;
                         }
                     }
                 });
                 if (kickAlsoExact) {
                     hasExorcista = true;
                 }
                 
                 const brHour = (um.match.date.getUTCHours() - 3 + 24) % 24;
                 if (brHour >= 0 && brHour < 6) {
                     hasZebraNoturna = true;
                 }
                 if (userScoreBetsCount[scoreStr] >= 5) {
                     hasTeimoso = true;
                 }
                 if (um.match.group.toLowerCase().includes('final') || um.match.group === 'SF' || um.match.group === 'F') {
                     hasSangueFrio = true;
                 }
                 if (um.match.group.length === 1) {
                     exactGroups.add(um.match.group);
                 }
                 
                 const cStats = allPicksByMatch[um.match.id];
                 if (cStats && cStats.total >= 5) {
                     const betPct = (cStats.scores[scoreStr] || 0) / cStats.total;
                     if (betPct <= 0.10) {
                         hasContraTudo = true;
                     }
                 }
              }
              
              if (userData.avatar_bandeira && um.exact) {
                 if (um.match.home.code === userData.avatar_bandeira || um.match.away.code === userData.avatar_bandeira) {
                    hasPatriota = true;
                 }
              }

              // Zebra e Maria Vai Com As Outras
              if (um.winner) {
                const cStats = allPicksByMatch[um.match.id];
                if (cStats && cStats.total >= 3) { // precisa de um quórum mínimo para ser zebra
                   let pickType = '';
                   if (um.pick.home > um.pick.away) pickType = 'home';
                   else if (um.pick.home < um.pick.away) pickType = 'away';
                   else pickType = 'draw';
                   
                   const scoreStrC = um.pick.home + 'x' + um.pick.away;
                   const betPctExact = (cStats.scores[scoreStrC] || 0) / cStats.total;
                   
                   if (betPctExact < 0.20 && um.exact) zebraExatasCount++;
                   if (betPctExact < 0.05) {
                       impossiveisBet++;
                       if (um.exact) impossiveisExact++;
                   }
                   
                   const pct = cStats[pickType] / cStats.total;
                   if (pct <= 0.20) hasZebra = true;
                   if (pct >= 0.80) hasMaria = true;
                }
              }
              
              // New Trophy Logic
              if (um.winner) {
                 currentWinnerStreak++;
                 maxWinnerStreak = Math.max(maxWinnerStreak, currentWinnerStreak);
              } else {
                 currentWinnerStreak = 0;
              }

              if (um.match.home.name === 'Brasil' || um.match.away.name === 'Brasil') {
                  hasPlayedBrazil = true;
                  let pickBrazilWinner = false;
                  if (um.match.home.name === 'Brasil' && um.pick.home > um.pick.away) pickBrazilWinner = true;
                  if (um.match.away.name === 'Brasil' && um.pick.away > um.pick.home) pickBrazilWinner = true;
                  if (!pickBrazilWinner) {
                      betOnBrazilAndWonAll = false;
                  }
              }

              if (um.pick.home === um.pick.away) drawBetsCount++;
              totalBets++;
              
              const cStats = allPicksByMatch[um.match.id];
              if (cStats && cStats.total >= 3) {
                  let pickType = '';
                  if (um.pick.home > um.pick.away) pickType = 'home';
                  else if (um.pick.home < um.pick.away) pickType = 'away';
                  else pickType = 'draw';
                  
                  const pct = cStats[pickType] / cStats.total;
                  if (pct >= 0.60) countFavorito++;
                  if (pct <= 0.20) countZebraTotal++;
              }

              if (um.exact && (um.pick.home + um.pick.away <= 1)) goleiroHits++;

              if (!um.exact) {
                  const errGols = Math.abs(um.pick.home - um.result.home) + Math.abs(um.pick.away - um.result.away);
                  if (errGols === 1) azaradoHits++;
              }

              let matchBot = false;
              Object.keys(usersPicksMap).forEach(otherId => {
                  if (otherId !== userDoc.id) {
                      let oPick = usersPicksMap[otherId][um.match.id];
                      if (oPick && oPick.home === um.pick.home && oPick.away === um.pick.away) {
                          telepataMatchCount[otherId] = (telepataMatchCount[otherId] || 0) + 1;
                          if (botUserIds.includes(otherId)) {
                              matchBot = true;
                          }
                      }
                  }
              });
              if (matchBot) botHits++;
            });

            // Save Patriota if earned so it persists even if avatar changes
            if (hasPatriota && (!userData.manualBadges || !userData.manualBadges.includes('patriota'))) {
              _updateUser(userDoc.id, (dbData) => {
                if (!dbData.manualBadges) dbData.manualBadges = [];
                if (!dbData.manualBadges.includes('patriota')) dbData.manualBadges.push('patriota');
              }).catch(e => console.error("Erro ao salvar Patriota:", e));
              
              if (!userData.manualBadges) userData.manualBadges = [];
              userData.manualBadges.push('patriota');
            }

            // Badges Calculation
            const ALL_POSSIBLE_BADGES = {
              'zebra': { id: 'zebra', icon: '🦓', title: 'Zebra (Acertou placar com menos de 20% das apostas)' },
              'maria': { id: 'maria', icon: '🛡️', title: 'Maria Vai com as Outras (Acertou placar com mais de 80% das apostas)' },
              'mae_dinah': { id: 'mae_dinah', icon: '🔮', title: 'Mãe Dináh (3 placares exatos seguidos)' },
              'pe_frio': { id: 'pe_frio', icon: '🥶', title: 'Pé Frio (5 erros seguidos)' },
              'empate': { id: 'empate', icon: '🤝', title: 'Mestre do Empate (Acertou 3 empates exatos)' },
              'zero_zero': { id: 'zero_zero', icon: '🍩', title: 'O Famoso 0x0 (Acertou um 0x0 exato)' },
              'goleada': { id: 'goleada', icon: '💥', title: 'Goleada Mágica (Acertou placar exato de jogo com 4+ gols)' },
              'curinga_exato': { id: 'curinga_exato', icon: '🌟', title: 'Milagre do Curinga (Cravou placar usando multiplicador)' },
              'atirador': { id: 'atirador', icon: '🎯', title: 'Atirador de Elite (Acertou 10 jogos no campeonato)' },
              'patriota': { id: 'patriota', icon: '🏴', title: 'Patriota (Cravou o placar da sua seleção)' },
              'special_one': { id: 'special_one', icon: '👑', title: 'Special One (Único a acertar um placar exato)' },
              'em_chamas': { id: 'em_chamas', icon: '🔥', title: 'Em Chamas (Acertou o vencedor de 5 jogos seguidos)' },
              'fiel': { id: 'fiel', icon: '忠', title: 'Fiel (Sempre apostou no Brasil para vencer)' },
              'empatador': { id: 'empatador', icon: '⚖️', title: 'Empatador (Apostou em empate mais de 10 vezes)' },
              'lider': { id: 'lider', icon: '🥇', title: 'Líder (Ficou em 1º no ranking por várias rodadas)' },
              'conservador': { id: 'conservador', icon: '🔒', title: 'Conservador (80%+ dos palpites foram em vitórias do favorito)' },
              'virada_epica': { id: 'virada_epica', icon: '🚀', title: 'Virada Épica (Subiu 5+ posições no ranking em uma rodada)' },
              'anarquista': { id: 'anarquista', icon: '🃏', title: 'Anarquista (50%+ dos palpites foram em zebras)' },
              'craque_rodada': { id: 'craque_rodada', icon: '💎', title: 'Craque da Rodada (Maior pontuação numa única rodada)' },
              'alienigena': { id: 'alienigena', icon: '👽', title: 'Alienígena (Acertou o placar exato 3 vezes)' },
              'vice_eterno': { id: 'vice_eterno', icon: '🥈', title: 'Vice Eterno (Ficou em 2º lugar por 3 rodadas seguidas)' },
              'goleiro': { id: 'goleiro', icon: '🧤', title: 'Goleiro (Acertou 5 jogos com placar de 0 a 0 ou 1 a 0)' },
              'hat_trick': { id: 'hat_trick', icon: '⚽', title: 'Hat-trick (Acertou o vencedor de um jogo onde houve um hat trick)' },
              'telepata': { id: 'telepata', icon: '🧠', title: 'Telepata (Teve o mesmo palpite exato que outro jogador 5 vezes)' },
              'campeao_antecipado': { id: 'campeao_antecipado', icon: '🏆', title: 'Campeão Antecipado (Apostou no campeão antes do torneio e acertou)' },
              'azarado': { id: 'azarado', icon: '😤', title: 'Azarado (Errou o placar exato por 1 gol 5 vezes)' },
              'igual_chatgpt': { id: 'igual_chatgpt', icon: '🤖', title: 'Igual ao ChatGPT (Teve o mesmo palpite que os perfis das IA em 3 jogos)' },
              'exorcista': { id: 'exorcista', icon: '🧿', title: 'Exorcista (Cravou o placar exato no mesmo jogo que o Kick)' },
              'zebra_noturna': { id: 'zebra_noturna', icon: '🌙', title: 'Zebra Noturna (Acertou o placar exato de um jogo que começou depois da meia-noite)' },
              'teimoso': { id: 'teimoso', icon: '🔁', title: 'Teimoso (Apostou no mesmo placar 5 vezes e finalmente acertou)' },
              'sangue_frio': { id: 'sangue_frio', icon: '🥶', title: 'Sangue Frio (Acertou o placar exato de uma final ou semifinal)' },
              'explorador': { id: 'explorador', icon: '🌍', title: 'Explorador (Acertou pelo menos um placar exato de cada grupo da fase de grupos)' },
              'contra_tudo': { id: 'contra_tudo', icon: '🎲', title: 'Contra Tudo e Todos (Acertou o exato apostando diferente de 90%+ dos jogadores)' },
              'dupla_personalidade': { id: 'dupla_personalidade', icon: '🎭', title: 'Dupla Personalidade (Apostou em placares completamente opostos em dois jogos seguidos e acertou os dois)' },
              'palhaco': { id: 'palhaco', icon: '🤡', title: 'Palhaço (Errou todos os palpites de uma rodada inteira)' },
              'lenda': { id: 'lenda', icon: '🌟', title: 'Lenda (Nunca saiu do Top 3 desde o início do torneio - mín. 5 dias)' },
              'muralha': { id: 'muralha', icon: '🧱', title: 'Muralha (Acertou 5 placares com 0 gols do time perdedor)' },
              'rei_da_selva': { id: 'rei_da_selva', icon: '🦁', title: 'Rei da Selva (Ficou em 1º por mais de 10 rodadas acumuladas no torneio)' },
              'popularidade': { id: 'popularidade', icon: '🫂', title: 'Popularidade (Teve o palpite mais escolhido pelo bolão em 5 jogos diferentes)' },
              'kamikaze': { id: 'kamikaze', icon: '💣', title: 'Kamikaze (Usou o multiplicador num jogo de zebra e acertou o placar exato)' },
              'ima_zebra': { id: 'ima_zebra', icon: '🧲', title: 'Ímã de Zebra (Apostou em zebra e acertou o exato 3 vezes no torneio)' },
              'montanha_russa': { id: 'montanha_russa', icon: '🎡', title: 'Montanha Russa (Subiu e desceu mais de 3 posições no ranking em rodadas alternadas)' },
              'arqueiro': { id: 'arqueiro', icon: '🏹', title: 'Arqueiro (Acertou o placar exato sem errar o vencedor em nenhum dos últimos 5 jogos)' },
              'condecorado': { id: 'condecorado', icon: '🎖️', title: 'Condecorado (Desbloqueou 10 troféus ao longo do torneio)' },
              'raposa': { id: 'raposa', icon: '🦊', title: 'Raposa (Acertou o vencedor de 10 jogos seguidos sem errar)' },
              'peso_pesado': { id: 'peso_pesado', icon: '🏋️', title: 'Peso Pesado (Acumulou mais de 50 pontos no total durante o torneio)' },
              'astronomo': { id: 'astronomo', icon: '🔭', title: 'Astrônomo (Apostou em 3 resultados considerados impossíveis e acertou pelo menos 1 exato)' },
              'elefante': { id: 'elefante', icon: '🐘', title: 'Memória de Elefante (Apostou o mesmo placar que já tinha acertado antes e acertou de novo)' },
              'orbita': { id: 'orbita', icon: '🪐', title: 'Órbita (Ficou sempre entre a 3ª e 5ª posição por 5 rodadas sem sair)' },
              'enxame': { id: 'enxame', icon: '🐝', title: 'Enxame (Teve o mesmo palpite que pelo menos 5 jogadores diferentes e acertou o exato)' }
            };

            let userBadgesMap = new Map();
            let manualBadges = userData.manualBadges || [];
            
            // 1. Adiciona manuais primeiro
            manualBadges.forEach(bId => {
               if (ALL_POSSIBLE_BADGES[bId]) {
                 userBadgesMap.set(bId, ALL_POSSIBLE_BADGES[bId]);
               }
            });
            // 2. Adiciona automáticos (sobrescreve ou apenas adiciona se não existir)
            if (hasZebra) userBadgesMap.set('zebra', ALL_POSSIBLE_BADGES['zebra']);
            if (hasMaria) userBadgesMap.set('maria', ALL_POSSIBLE_BADGES['maria']);
            if (maxExactStreak >= 3) userBadgesMap.set('mae_dinah', ALL_POSSIBLE_BADGES['mae_dinah']);
            if (maxMissStreak >= 5) userBadgesMap.set('pe_frio', ALL_POSSIBLE_BADGES['pe_frio']);
            if (exactTies >= 3) userBadgesMap.set('empate', ALL_POSSIBLE_BADGES['empate']);
            if (has0x0) userBadgesMap.set('zero_zero', ALL_POSSIBLE_BADGES['zero_zero']);
            if (hasGoleada) userBadgesMap.set('goleada', ALL_POSSIBLE_BADGES['goleada']);
            if (hasCuringaExato) userBadgesMap.set('curinga_exato', ALL_POSSIBLE_BADGES['curinga_exato']);
            if (uniqueWinnerHits.size >= 10) userBadgesMap.set('atirador', ALL_POSSIBLE_BADGES['atirador']);
            if (hasPatriota) userBadgesMap.set('patriota', ALL_POSSIBLE_BADGES['patriota']);
            if (hasSpecialOne) userBadgesMap.set('special_one', ALL_POSSIBLE_BADGES['special_one']);

            let hasEmChamas = maxWinnerStreak >= 5;
            let hasFiel = hasPlayedBrazil && betOnBrazilAndWonAll;
            let hasEmpatador = drawBetsCount >= 10;
            let hasConservador = totalBets > 0 && (countFavorito / totalBets) >= 0.80;
            let hasAnarquista = totalBets > 0 && (countZebraTotal / totalBets) >= 0.50;
            let hasAlien = alienigenaCount >= 3;
            let hasGoleiro = goleiroHits >= 5;
            let hasHatTrick = manualBadges.includes('hat_trick');
            let hasAzarado = azaradoHits >= 5;
            let hasIgualChatGPT = botHits >= 3;
            let hasTelepata = Object.values(telepataMatchCount).some(v => v >= 5);
            let hasCampeaoAntecipado = false;
            if (results.bonus_campeao && userData.bonus_campeao === results.bonus_campeao) {
               hasCampeaoAntecipado = true;
            }
            
            let hasPalhaco = false;
            for (let day in userDailyMatchCount) {
                if (userDailyMatchCount[day] >= 3 && userDailyMatchCount[day] === userDailyMissCount[day]) {
                    hasPalhaco = true;
                }
            }

            let hasLenda = true;
            if (daysList.length < 5) {
                hasLenda = false;
            } else {
                for (let day of daysList) {
                    if (dailyRankings[day] && dailyRankings[day][userDoc.id] > 3) {
                        hasLenda = false;
                        break;
                    }
                }
            }
            
            let orbitaStreak = 0;
            let maxOrbitaStreak = 0;
            let subiuMaisDe3 = false;
            let desceuMaisDe3 = false;
            let prevRank = null;
            for (let day of daysList) {
                if (dailyRankings[day]) {
                    let rank = dailyRankings[day][userDoc.id];
                    if (rank >= 3 && rank <= 5) orbitaStreak++;
                    else orbitaStreak = 0;
                    if (orbitaStreak > maxOrbitaStreak) maxOrbitaStreak = orbitaStreak;
                    
                    if (prevRank !== null) {
                        let diff = prevRank - rank;
                        if (diff > 3) subiuMaisDe3 = true;
                        if (diff < -3) desceuMaisDe3 = true;
                    }
                    prevRank = rank;
                }
            }
            let hasOrbita = maxOrbitaStreak >= 5;
            let hasMontanhaRussa = subiuMaisDe3 && desceuMaisDe3;
            
            // Recalculate chronologically ALL finished matches for accurate streak logic
            let allFinishedChronological = [...finishedMatches].sort((a, b) => a.date - b.date);
            let chronologicalWinnerStreak = 0;
            let maxChronologicalWinnerStreak = 0;
            let chronologicalExactStreak = 0;
            let maxChronologicalExactStreak = 0;

            allFinishedChronological.forEach(m => {
                const r = results[m.id];
                const p = picksData[m.id];
                let isWinner = false;
                let isExact = false;
                
                if (p && p.home !== undefined) {
                    if (p.home === r.home && p.away === r.away) {
                        isExact = true;
                        isWinner = true;
                    } else if (
                      (p.home > p.away && r.home > r.away) ||
                      (p.home < p.away && r.home < r.away) ||
                      (p.home === p.away && r.home === r.away)
                    ) {
                        isWinner = true;
                    }
                }
                
                if (isExact) {
                    chronologicalExactStreak++;
                    maxChronologicalExactStreak = Math.max(maxChronologicalExactStreak, chronologicalExactStreak);
                } else {
                    chronologicalExactStreak = 0;
                }
                
                if (isWinner) {
                    chronologicalWinnerStreak++;
                    maxChronologicalWinnerStreak = Math.max(maxChronologicalWinnerStreak, chronologicalWinnerStreak);
                } else {
                    chronologicalWinnerStreak = 0;
                }
            });

            maxWinnerStreak = maxChronologicalWinnerStreak;
            maxExactStreak = maxChronologicalExactStreak;
            
            let hasArqueiro = false;
            if (allFinishedChronological.length >= 5) {
                let last5 = allFinishedChronological.slice(-5);
                let allWinners = true;
                let anyExact = false;
                last5.forEach(m => {
                    const r = results[m.id];
                    const p = picksData[m.id];
                    if (!p || p.home === undefined) {
                        allWinners = false;
                    } else {
                        let isExact = (p.home === r.home && p.away === r.away);
                        let isWinner = isExact || (p.home > p.away && r.home > r.away) || (p.home < p.away && r.home < r.away) || (p.home === p.away && r.home === r.away);
                        if (!isWinner) allWinners = false;
                        if (isExact) anyExact = true;
                    }
                });
                if (allWinners && anyExact) hasArqueiro = true;
            }
            
            let hasPesoPesado = pts > 50;
            let hasAstronomo = impossiveisBet >= 3 && impossiveisExact >= 1;
            let hasRaposa = maxWinnerStreak >= 10;
            let hasImaZebra = zebraExatasCount >= 3;

            if (hasEmChamas) userBadgesMap.set('em_chamas', ALL_POSSIBLE_BADGES['em_chamas']);
            if (hasFiel) userBadgesMap.set('fiel', ALL_POSSIBLE_BADGES['fiel']);
            if (hasEmpatador) userBadgesMap.set('empatador', ALL_POSSIBLE_BADGES['empatador']);
            if (hasConservador) userBadgesMap.set('conservador', ALL_POSSIBLE_BADGES['conservador']);
            if (hasAnarquista) userBadgesMap.set('anarquista', ALL_POSSIBLE_BADGES['anarquista']);
            if (hasAlien) userBadgesMap.set('alienigena', ALL_POSSIBLE_BADGES['alienigena']);
            if (hasGoleiro) userBadgesMap.set('goleiro', ALL_POSSIBLE_BADGES['goleiro']);
            if (hasHatTrick) userBadgesMap.set('hat_trick', ALL_POSSIBLE_BADGES['hat_trick']);
            if (hasAzarado) userBadgesMap.set('azarado', ALL_POSSIBLE_BADGES['azarado']);
            if (hasIgualChatGPT) userBadgesMap.set('igual_chatgpt', ALL_POSSIBLE_BADGES['igual_chatgpt']);
            if (hasTelepata) userBadgesMap.set('telepata', ALL_POSSIBLE_BADGES['telepata']);
            if (hasCampeaoAntecipado) userBadgesMap.set('campeao_antecipado', ALL_POSSIBLE_BADGES['campeao_antecipado']);
            if (hasExorcista) userBadgesMap.set('exorcista', ALL_POSSIBLE_BADGES['exorcista']);
            
            if (exactGroups.size >= 12) hasExplorador = true;
            if (hasZebraNoturna) userBadgesMap.set('zebra_noturna', ALL_POSSIBLE_BADGES['zebra_noturna']);
            if (hasTeimoso) userBadgesMap.set('teimoso', ALL_POSSIBLE_BADGES['teimoso']);
            if (hasSangueFrio) userBadgesMap.set('sangue_frio', ALL_POSSIBLE_BADGES['sangue_frio']);
            if (hasExplorador) userBadgesMap.set('explorador', ALL_POSSIBLE_BADGES['explorador']);
            if (hasContraTudo) userBadgesMap.set('contra_tudo', ALL_POSSIBLE_BADGES['contra_tudo']);
            if (hasDupla) userBadgesMap.set('dupla_personalidade', ALL_POSSIBLE_BADGES['dupla_personalidade']);
            if (hasPalhaco) userBadgesMap.set('palhaco', ALL_POSSIBLE_BADGES['palhaco']);
            if (hasLenda) userBadgesMap.set('lenda', ALL_POSSIBLE_BADGES['lenda']);
            if (muralhaCount >= 5) userBadgesMap.set('muralha', ALL_POSSIBLE_BADGES['muralha']);
            if (hasReiDaSelva) userBadgesMap.set('rei_da_selva', ALL_POSSIBLE_BADGES['rei_da_selva']);
            if (popularidadeCount >= 5) userBadgesMap.set('popularidade', ALL_POSSIBLE_BADGES['popularidade']);
            if (hasKamikaze) userBadgesMap.set('kamikaze', ALL_POSSIBLE_BADGES['kamikaze']);
            if (hasImaZebra) userBadgesMap.set('ima_zebra', ALL_POSSIBLE_BADGES['ima_zebra']);
            if (hasMontanhaRussa) userBadgesMap.set('montanha_russa', ALL_POSSIBLE_BADGES['montanha_russa']);
            if (hasArqueiro) userBadgesMap.set('arqueiro', ALL_POSSIBLE_BADGES['arqueiro']);
            if (hasRaposa) userBadgesMap.set('raposa', ALL_POSSIBLE_BADGES['raposa']);
            if (hasPesoPesado) userBadgesMap.set('peso_pesado', ALL_POSSIBLE_BADGES['peso_pesado']);
            if (hasAstronomo) userBadgesMap.set('astronomo', ALL_POSSIBLE_BADGES['astronomo']);
            if (hasElefante) userBadgesMap.set('elefante', ALL_POSSIBLE_BADGES['elefante']);
            if (hasOrbita) userBadgesMap.set('orbita', ALL_POSSIBLE_BADGES['orbita']);
            if (hasEnxame) userBadgesMap.set('enxame', ALL_POSSIBLE_BADGES['enxame']);

            // Troféus Dinâmicos Automáticos
            let hasLider = manualBadges.includes('lider');
            let liderDays = 0;
            let hasViceEterno = manualBadges.includes('vice_eterno');
            let viceStreak = 0;
            let hasCraque = manualBadges.includes('craque_rodada');
            let hasVirada = manualBadges.includes('virada_epica');

            if (!hasLider || !hasViceEterno || !hasCraque || !hasVirada) {
                daysList.forEach((day, idx) => {
                    if (hasLider && hasViceEterno && hasCraque && hasVirada) return; // Optimization break

                    const pos = dailyRankings[day][userDoc.id];
                    const prevDay = idx > 0 ? daysList[idx-1] : null;
                    const prevPos = prevDay ? dailyRankings[prevDay][userDoc.id] : null;
                    const dailyPts = userDailyPoints[userDoc.id][day] - (prevDay ? userDailyPoints[userDoc.id][prevDay] : 0);

                    // Líder: 3x em 1º
                    if (!hasLider && pos === 1) {
                        liderDays++;
                        if (liderDays >= 3) hasLider = true;
                    }

                    // Vice Eterno: 3x seguidas em 2º
                    if (!hasViceEterno) {
                        if (pos === 2) {
                            viceStreak++;
                            if (viceStreak >= 3) hasViceEterno = true;
                        } else {
                            viceStreak = 0;
                        }
                    }

                    // Virada Épica: subiu 5 posições
                    if (!hasVirada && prevPos !== null) {
                        if (prevPos - pos >= 5) hasVirada = true;
                    }

                    // Craque da Rodada: maior pontuação do dia
                    if (!hasCraque && dailyPts > 0) {
                        let maxDayPts = 0;
                        usersSnap.docs.forEach(u => {
                            const uPts = userDailyPoints[u.id][day] - (prevDay ? userDailyPoints[u.id][prevDay] : 0);
                            if (uPts > maxDayPts) maxDayPts = uPts;
                        });
                        if (dailyPts === maxDayPts) hasCraque = true;
                    }
                });
            }

            if (hasLider) userBadgesMap.set('lider', ALL_POSSIBLE_BADGES['lider']);
            if (hasViceEterno) userBadgesMap.set('vice_eterno', ALL_POSSIBLE_BADGES['vice_eterno']);
            if (hasCraque) userBadgesMap.set('craque_rodada', ALL_POSSIBLE_BADGES['craque_rodada']);
            if (hasVirada) userBadgesMap.set('virada_epica', ALL_POSSIBLE_BADGES['virada_epica']);

            if (userBadgesMap.size >= 10) {
                userBadgesMap.set('condecorado', ALL_POSSIBLE_BADGES['condecorado']);
            }

            let badges = Array.from(userBadgesMap.values());

            // if (Object.keys(picksData).length > 0) {
              ranking.push({ 
                 id: userDoc.id, 
                 name: userData.name || 'Anônimo', 
                 nickname: userData.nickname || '',
                 pts: pts, 
                 pontos_ajuste: userData.pontos_ajuste || 0,
                 curingasUsados: curingasUsados,
                 exato: exato, 
                 vencedor: vencedor, 
                 avatar: userData.avatar_bandeira || '', 
                 badges: badges,
                 currentHitStreak: currentHitStreak,
                 picks: picksData, 
                 bonus_answers: { artilheiro: userData.bonus_artilheiro, ataque: userData.bonus_ataque, campeao: userData.bonus_campeao, decepcao: userData.bonus_decepcao, craque: userData.bonus_craque, goleiro: userData.bonus_goleiro, defensor: userData.bonus_defensor, revelacao: userData.bonus_revelacao, neymar_gol: userData.bonus_neymar_gol } 
              });
            // }
          }
          ranking.sort(function(a, b) { return b.pts - a.pts || (b.badges ? b.badges.length : 0) - (a.badges ? a.badges.length : 0) || b.exato - a.exato; });
          await window.supabaseClient.from('meta').upsert({ id: 'ranking_cache', data: { ranking: ranking, allPicksByMatch: allPicksByMatch, updatedAt: new Date().toISOString() } });
          console.log('Global Ranking updated successfully!');
        
    } catch(e) {
        console.error("Error recalculating ranking:", e);
    }
  },
listenToUpdates: (callback) => {
    if (!window.supabaseClient) return;
    let currentResults = {};
    let currentRankingData = null;

    // Fetch initially
    window.supabaseClient.from('meta').select('id, data').in('id', ['results', 'ranking_cache']).then(({ data, error }) => {
        if (!error && data) {
            data.forEach(row => {
                if (row.id === 'results') currentResults = row.data || {};
                if (row.id === 'ranking_cache') currentRankingData = row.data || null;
            });
            if (currentRankingData) {
                if (!currentRankingData.ranking) currentRankingData.ranking = [];
                if (!currentRankingData.allPicksByMatch) currentRankingData.allPicksByMatch = {};
                callback(currentRankingData.ranking, currentResults, currentRankingData.allPicksByMatch);
            } else {
                dbAPI.recalculateGlobalRanking();
            }
        }
    });

    let previousResultsCache = null;

    window._rankingListener = window.supabaseClient
      .channel('public:meta:listenToUpdates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meta' }, payload => {
          if (payload.new.id === 'results') {
              currentResults = payload.new.data || {};
              if (previousResultsCache !== null) {
                for (let mId in currentResults) {
                  const curr = currentResults[mId];
                  const prev = previousResultsCache[mId];
                  if (curr && curr.home !== undefined && !curr.canceled) {
                     // Goal notifications log
                  }
                }
              }
              previousResultsCache = JSON.parse(JSON.stringify(currentResults));
              if (currentRankingData) {
                 callback(currentRankingData.ranking, currentResults, currentRankingData.allPicksByMatch);
              }
          }
          if (payload.new.id === 'ranking_cache') {
              currentRankingData = payload.new.data || {};
              if (!currentRankingData.ranking) currentRankingData.ranking = [];
              if (!currentRankingData.allPicksByMatch) currentRankingData.allPicksByMatch = {};
              callback(currentRankingData.ranking, currentResults, currentRankingData.allPicksByMatch);
          }
      })
      .subscribe();
  },

  // Normalizar string para comparação de bônus
  normalizeString: (str) => {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }
};

// =============================================
// 9. AUTO-SYNC — WorldCup26.ir API
// =============================================

// Mapeamento de nomes da API para nomes locais (_RAW keys)
const API_TEAM_NAME_MAP = {
  'United States': 'USA',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Democratic Republic of the Congo': 'DR Congo'
};

// Converte nome da API para chave local
function apiNameToLocalKey(apiName) {
  return API_TEAM_NAME_MAP[apiName] || apiName;
}

// Busca e sincroniza resultados da API
async function fetchAndSyncResults() {
  // Proxy próprio no Vercel (mesmo domínio = sem CORS) — prioridade máxima
  const LOCAL_PROXY = '/api/games';
  const API_URL = 'https://worldcup26.ir/get/games';

  let apiData = null;

  // 1. Tentar proxy local (Vercel serverless function — só funciona no deploy)
  try {
    const resp = await fetch(LOCAL_PROXY, { signal: AbortSignal.timeout(8000) });
    if (resp.ok) {
      apiData = await resp.json();
      console.log('Auto-sync: dados recebidos via proxy local (/api/games)');
    }
  } catch (e) {
    // Esperado falhar localmente (Live Server), silencioso
  }

  // 2. Tentar chamada direta (pode funcionar em alguns ambientes)
  if (!apiData) {
    try {
      const resp = await fetch(API_URL, { signal: AbortSignal.timeout(8000) });
      if (resp.ok) {
        apiData = await resp.json();
        console.log('Auto-sync: dados recebidos via API direta');
      }
    } catch (e) {
      // CORS esperado em produção
    }
  }

  // 3. Fallback: allorigins (endpoint /get retorna { contents: "..." })
  if (!apiData) {
    try {
      const resp = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(API_URL), { signal: AbortSignal.timeout(12000) });
      if (resp.ok) {
        const wrapper = await resp.json();
        if (wrapper && wrapper.contents) {
          apiData = JSON.parse(wrapper.contents);
          console.log('Auto-sync: dados recebidos via allorigins');
        }
      }
    } catch (e) {
      console.log('Auto-sync: allorigins falhou:', e.message);
    }
  }

  // 4. Fallback: codetabs
  if (!apiData) {
    try {
      const resp = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(API_URL), { signal: AbortSignal.timeout(12000) });
      if (resp.ok) {
        apiData = await resp.json();
        console.log('Auto-sync: dados recebidos via codetabs');
      }
    } catch (e) {
      console.log('Auto-sync: codetabs falhou:', e.message);
    }
  }

  if (!apiData) {
    console.warn('Auto-sync: nenhuma fonte respondeu. Tentará novamente em 2 min.');
    return { updated: 0, total: 0, error: true };
  }

  if (!apiData || !apiData.games) {
    console.error('Auto-sync: resposta inválida da API');
    return { updated: 0, total: 0, error: true };
  }

  // Filtrar jogos finalizados OU em andamento (AO VIVO)
  const gamesToSync = apiData.games.filter(function(g) {
    const isLive = g.finished === 'FALSE' && g.time_elapsed !== 'notstarted';
    return (g.finished === 'TRUE' || isLive) && g.type === 'group';
  });

  if (gamesToSync.length === 0) {
    return { updated: 0, total: 0, error: false };
  }

  // Buscar resultados atuais do Firebase/localStorage
  const currentResults = await dbAPI.getResults();
  const newResults = {};
  let updatedCount = 0;

  gamesToSync.forEach(function(apiGame) {
    const homeKey = apiNameToLocalKey(apiGame.home_team_name_en);
    const awayKey = apiNameToLocalKey(apiGame.away_team_name_en);
    const homeScore = parseInt(apiGame.home_score);
    const awayScore = parseInt(apiGame.away_score);

    if (isNaN(homeScore) || isNaN(awayScore)) return;

    // Encontrar o match local correspondente
    const localMatch = ALL_MATCHES.find(function(m) {
      const localHomeKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k] === m.home; });
      const localAwayKey = Object.keys(TEAM_MAP).find(function(k) { return TEAM_MAP[k] === m.away; });
      return localHomeKey === homeKey && localAwayKey === awayKey;
    });

    if (!localMatch) {
      console.warn('Auto-sync: jogo não encontrado localmente:', homeKey, 'vs', awayKey);
      return;
    }

    // Verificar se o resultado já existe e é igual
    const existing = currentResults[localMatch.id];
    if (existing && existing.home === homeScore && existing.away === awayScore && existing.status === apiGame.time_elapsed && existing.home_scorers === apiGame.home_scorers && existing.away_scorers === apiGame.away_scorers && !existing.canceled) {
      return; // Já está atualizado
    }

    // Novo resultado ou resultado diferente
    newResults[localMatch.id] = { 
      home: homeScore, 
      away: awayScore, 
      canceled: false, 
      status: apiGame.time_elapsed,
      home_scorers: apiGame.home_scorers || null,
      away_scorers: apiGame.away_scorers || null
    };
    updatedCount++;
  });

  // Salvar apenas se há novidades
  if (updatedCount > 0) {
    // Lock para evitar escritas duplicadas entre abas
    const lockKey = 'api_sync_lock';
    const now = Date.now();
    const lastLock = parseInt(localStorage.getItem(lockKey) || '0');

    if (now - lastLock < 30000) {
      // Outra aba sincronizou há menos de 30s, pular
      console.log('Auto-sync: outra aba já sincronizou recentemente.');
      return { updated: 0, total: gamesToSync.length, error: false, skipped: true };
    }

    localStorage.setItem(lockKey, String(now));

    try {
      await dbAPI.saveResult(newResults);
      console.log('Auto-sync: ' + updatedCount + ' resultado(s) atualizado(s) via API.');
    } catch (e) {
      console.error('Auto-sync: erro ao salvar resultados:', e);
      return { updated: 0, total: gamesToSync.length, error: true };
    }
  }

  return { updated: updatedCount, total: gamesToSync.length, error: false };
}

// Timer global para auto-sync
let _autoSyncInterval = null;

function startAutoSync(intervalMs) {
  if (_autoSyncInterval) clearInterval(_autoSyncInterval);

  intervalMs = intervalMs || 30000; // 30 segundos padrão (polling rápido para navbar)

  // Executar imediatamente na primeira vez
  fetchAndSyncResults().then(function(result) {
    if (!result.error && result.updated > 0) {
      console.log('🔄 Auto-sync inicial: ' + result.updated + ' resultado(s) sincronizado(s)');
    }
  });

  // Repetir a cada intervalo
  _autoSyncInterval = setInterval(function() {
    fetchAndSyncResults().then(function(result) {
      if (!result.error && result.updated > 0) {
        console.log('🔄 Auto-sync: ' + result.updated + ' resultado(s) sincronizado(s)');
      }
    });
  }, intervalMs);

  console.log('✅ Auto-sync ativado — verificando API a cada ' + (intervalMs / 1000) + 's');
}

function stopAutoSync() {
  if (_autoSyncInterval) {
    clearInterval(_autoSyncInterval);
    _autoSyncInterval = null;
    console.log('⏹ Auto-sync desativado');
  }
}
