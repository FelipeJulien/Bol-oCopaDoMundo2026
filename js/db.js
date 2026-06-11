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
  const offset = parseInt(utcPart.replace('UTC', ''));
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

// 6. CONSTRUIR ARRAYS FINAIS
const ALL_MATCHES = _RAW.map(function(r, i) {
  return {
    id: 'm_' + i,
    group: r[4],
    home: TEAM_MAP[r[2]],
    away: TEAM_MAP[r[3]],
    date: parseMatchDateTime(r[0], r[1]),
    dateStr: r[0],
    ground: r[5],
    stadium: STADIUM_MAP[r[5]] || r[5]
  };
}).sort(function(a, b) { return a.date - b.date; });

const ALL_TEAMS = Object.values(TEAM_MAP).sort(function(a, b) {
  return a.name.localeCompare(b.name);
});

// 7. CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
  // apiKey: "API_KEY",
  // authDomain: "PROJECT_ID.firebaseapp.com",
  // projectId: "PROJECT_ID",
  // storageBucket: "PROJECT_ID.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID"
};

let db = null;
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase conectado.");
  } catch(e) {
    console.error("Erro ao conectar Firebase:", e);
  }
}

// 8. API DO BANCO DE DADOS
const dbAPI = {
  savePick: async (userId, userName, matchId, home, away) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.picks[matchId] = { home: home, away: away };
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
      await db.collection('users').doc(userId).collection('picks').doc(matchId).set({ home: home, away: away });
    }
  },

  saveBonus: async (userId, userName, bonusKey, value) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.bonus[bonusKey] = value;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        ['bonus_' + bonusKey]: value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  getUserData: async (userId) => {
    const localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (!db) return localData;
    try {
      const picksSnap = await db.collection('users').doc(userId).collection('picks').get();
      const userSnap = await db.collection('users').doc(userId).get();
      const picks = {};
      picksSnap.forEach(function(doc) { picks[doc.id] = doc.data(); });
      const userData = userSnap.data() || {};
      const bonus = {
        campeao: userData.bonus_campeao || '',
        artilheiro: userData.bonus_artilheiro || '',
        ataque: userData.bonus_ataque || '',
        decepcao: userData.bonus_decepcao || ''
      };
      return { picks: picks, bonus: bonus };
    } catch(e) {
      console.error(e);
      return localData;
    }
  },

  saveResult: async (resultsObj) => {
    let local = JSON.parse(localStorage.getItem('official_results') || '{}');
    Object.assign(local, resultsObj);
    localStorage.setItem('official_results', JSON.stringify(local));
    if (db) {
      await db.collection('meta').doc('results').set(resultsObj, {merge: true});
    }
  },

  getResults: async () => {
    if (!db) return JSON.parse(localStorage.getItem('official_results') || '{}');
    try {
      const snap = await db.collection('meta').doc('results').get();
      return snap.exists ? snap.data() : {};
    } catch(e) {
      return JSON.parse(localStorage.getItem('official_results') || '{}');
    }
  },

  listenToUpdates: (callback) => {
    if (!db) return;
    db.collection('meta').doc('results').onSnapshot(function(snap) {
      const results = snap.exists ? snap.data() : {};
      db.collection('users').get().then(async function(usersSnap) {
        const ranking = [];
        for (let userDoc of usersSnap.docs) {
          const userData = userDoc.data();
          const picksSnap = await db.collection('users').doc(userDoc.id).collection('picks').get();
          let exato = 0, vencedor = 0, pts = 0;
          picksSnap.forEach(function(pickDoc) {
            const mId = pickDoc.id;
            const p = pickDoc.data();
            const r = results[mId];
            if (r && r.home !== undefined && p.home !== undefined) {
              if (p.home === r.home && p.away === r.away) {
                exato++; pts += 3;
              } else if (
                (p.home > p.away && r.home > r.away) ||
                (p.home < p.away && r.home < r.away) ||
                (p.home === p.away && r.home === r.away)
              ) {
                vencedor++; pts += 1;
              }
            }
          });
          ranking.push({ id: userDoc.id, name: userData.name || 'Anônimo', pts: pts, exato: exato, vencedor: vencedor });
        }
        ranking.sort(function(a, b) { return b.pts - a.pts || b.exato - a.exato; });
        callback(ranking, results);
      });
    });
  }
};
