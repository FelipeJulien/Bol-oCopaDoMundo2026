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
  apiKey: "AIzaSyBapdLKIiqP04vEp_z2b6_OS9CqpJyqKKo",
  authDomain: "bolaocopa26-f4d17.firebaseapp.com",
  projectId: "bolaocopa26-f4d17",
  storageBucket: "bolaocopa26-f4d17.firebasestorage.app",
  messagingSenderId: "665725539665",
  appId: "1:665725539665:web:58e64480638a187a2def70",
  measurementId: "G-98ZYG6P3M1"
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
  savePick: async (userId, userName, matchId, home, away, isCuringa = false) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    if (!localData.picks[matchId]) localData.picks[matchId] = {};
    localData.picks[matchId].home = home;
    localData.picks[matchId].away = away;
    if (isCuringa !== undefined) localData.picks[matchId].isCuringa = isCuringa;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (db) {
      const updateObj = {
        name: userName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      const pickData = { home: home, away: away };
      if (isCuringa) pickData.isCuringa = true;
      else pickData.isCuringa = firebase.firestore.FieldValue.delete(); // Delete if false to save space
      
      updateObj[`picks.${matchId}`] = pickData;
      await db.collection('users').doc(userId).set(updateObj, {merge: true});
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

  savePontosAjuste: async (userId, userName, val) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.pontos_ajuste = val;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        pontos_ajuste: val,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  saveNickname: async (userId, nickname) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.nickname = nickname;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));

    if (db) {
      await db.collection('users').doc(userId).set({
        nickname: nickname,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  saveManualBadge: async (userId, badgeId) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (!localData.manualBadges) localData.manualBadges = [];
    if (!localData.manualBadges.includes(badgeId)) {
      localData.manualBadges.push(badgeId);
    }
    localStorage.setItem('user_' + userId, JSON.stringify(localData));

    if (db) {
      await db.collection('users').doc(userId).set({
        manualBadges: firebase.firestore.FieldValue.arrayUnion(badgeId),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
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
    if (db) {
      const userSnap = await db.collection('users').doc(userId).get();
      const userData = userSnap.data() || {};
      const updateObj = { updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
      let hasChanges = false;
      
      if (userData.picks) {
        for (let mId in userData.picks) {
          if (userData.picks[mId].isCuringa) {
            updateObj[`picks.${mId}.isCuringa`] = firebase.firestore.FieldValue.delete();
            hasChanges = true;
          }
        }
      }
      
      if (hasChanges) {
        await db.collection('users').doc(userId).update(updateObj);
      } else {
        await db.collection('users').doc(userId).set({ updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }
    }
  },

  saveUserName: async (userId, userName) => {
    let localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localStorage.setItem('user_' + userId, JSON.stringify(localData));
    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  saveLiveConfig: async (config) => {
    localStorage.setItem('live_config', JSON.stringify(config));
    if (db) {
      await db.collection('meta').doc('live_config').set(config, {merge: true});
    }
  },

  listenToLiveConfig: (callback) => {
    if (db) {
      db.collection('meta').doc('live_config').onSnapshot(function(snap) {
        if (snap.exists) callback(snap.data());
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
    if (db) {
      await db.collection('users').doc(userId).set({
        avatar_bandeira: countryCode,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  getUserData: async (userId) => {
    const localData = JSON.parse(localStorage.getItem('user_' + userId) || '{"picks":{}, "bonus":{}}');
    if (!db) return localData;
    try {
      const userSnap = await db.collection('users').doc(userId).get();
      const userData = userSnap.data() || {};
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
    if (db) {
      await db.collection('meta').doc('results').set(resultsObj, {merge: true});
    }
  },

  deleteResult: async (matchId) => {
    let local = JSON.parse(localStorage.getItem('official_results') || '{}');
    delete local[matchId];
    localStorage.setItem('official_results', JSON.stringify(local));
    if (db && typeof firebase !== 'undefined') {
      const updateObj = {};
      updateObj[matchId] = firebase.firestore.FieldValue.delete();
      await db.collection('meta').doc('results').update(updateObj).catch(e => console.log(e));
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
    let previousResultsCache = null;
    db.collection('meta').doc('results').onSnapshot(function(snap) {
      const results = snap.exists ? snap.data() : {};
      
      // Detecção de Gols
      if (previousResultsCache !== null) {
        for (let mId in results) {
          const curr = results[mId];
          const prev = previousResultsCache[mId];
          if (curr && curr.home !== undefined && !curr.canceled) {
            const prevHome = prev && prev.home !== undefined ? prev.home : 0;
            const prevAway = prev && prev.away !== undefined ? prev.away : 0;
            
            if (curr.home > prevHome) {
               window.dispatchEvent(new CustomEvent('goalScored', { detail: { matchId: mId, team: 'home', homeScore: curr.home, awayScore: curr.away } }));
            }
            if (curr.away > prevAway) {
               window.dispatchEvent(new CustomEvent('goalScored', { detail: { matchId: mId, team: 'away', homeScore: curr.home, awayScore: curr.away } }));
            }
          }
        }
      }
      previousResultsCache = JSON.parse(JSON.stringify(results));

      db.collection('users').get().then(async function(usersSnap) {
          const usersPicksMap = {};
          const allPicksByMatch = {};
          const botUserIds = [];
          
          // First Pass: Load all picks and calculate community stats
          for (let userDoc of usersSnap.docs) {
            const uData = userDoc.data();
            if (uData && uData.name) {
               const nLower = uData.name.toLowerCase();
               if (nLower.includes("chatgpt") || nLower.includes("claude") || nLower.includes("gemini") || nLower.includes("grok")) {
                  botUserIds.push(userDoc.id);
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
            });
            usersPicksMap[userDoc.id] = picksData;
          }

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
            if (results.bonus_artilheiro && userData.bonus_artilheiro === results.bonus_artilheiro) pts += 5;
            if (results.bonus_ataque && userData.bonus_ataque === results.bonus_ataque) pts += 5;
            if (results.bonus_campeao && userData.bonus_campeao === results.bonus_campeao) pts += 5;
            if (results.bonus_decepcao && userData.bonus_decepcao === results.bonus_decepcao) pts += 5;
            if (results.bonus_craque && userData.bonus_craque === results.bonus_craque) pts += 5;
            if (results.bonus_goleiro && userData.bonus_goleiro === results.bonus_goleiro) pts += 5;
            if (results.bonus_defensor && userData.bonus_defensor === results.bonus_defensor) pts += 5;
            if (results.bonus_revelacao && userData.bonus_revelacao === results.bonus_revelacao) pts += 5;
            if (results.bonus_neymar_gol && userData.bonus_neymar_gol === results.bonus_neymar_gol) pts += 5;
            
            if (userData.pontos_ajuste) {
              pts += parseInt(userData.pontos_ajuste);
            }

            // Ordenar jogos finalizados pela data (usando ALL_MATCHES)
            let userFinishedMatches = [];
            ALL_MATCHES.forEach(function(m) {
              const r = results[m.id];
              const p = picksData[m.id];
              if (r && r.home !== undefined && p && p.home !== undefined) {
                let isExact = false;
                let isWinner = false;
                if (p.home === r.home && p.away === r.away) isExact = true;
                else if (
                  (p.home > p.away && r.home > r.away) ||
                  (p.home < p.away && r.home < r.away) ||
                  (p.home === p.away && r.home === r.away)
                ) isWinner = true;
                
                userFinishedMatches.push({
                  match: m, 
                  pick: p,
                  result: r,
                  pts: (isExact ? 3 : (isWinner ? 1 : 0)) * (p.isCuringa ? 2 : 1), 
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

            // New Trophy Variables
            let currentWinnerStreak = 0;
            let maxWinnerStreak = 0;
            let betOnBrazilAndWonAll = true;
            let hasPlayedBrazil = false;
            let drawBetsCount = 0;
            let totalBets = 0;
            let countFavorito = 0;
            let countZebraTotal = 0;
            let alienigenaCount = 0;
            let goleiroHits = 0;
            let exactHitsByDate = {};
            let azaradoHits = 0;
            let botHits = 0;
            let telepataMatchCount = {};

            userFinishedMatches.forEach(function(um) {
              if (um.exact) {
                currentExactStreak++;
                maxExactStreak = Math.max(maxExactStreak, currentExactStreak);
              } else {
                currentExactStreak = 0;
              }

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
              if (um.exact && um.totalGoals >= 4) hasGoleada = true;
              if (um.exact && um.pick.isCuringa) hasCuringaExato = true;
              if (um.winner) uniqueWinnerHits.add(um.match.id);
              
              if (um.exact) {
                 const scoreStr = um.pick.home + 'x' + um.pick.away;
                 if (allPicksByMatch[um.match.id] && allPicksByMatch[um.match.id].scores[scoreStr] === 1) {
                   hasSpecialOne = true;
                   alienigenaCount++;
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

              if (um.exact && um.match.date) {
                  const dateObj = new Date(um.match.date);
                  const dKey = dateObj.toISOString().split('T')[0];
                  exactHitsByDate[dKey] = (exactHitsByDate[dKey] || 0) + 1;
              }

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
              db.collection('users').doc(userDoc.id).update({
                manualBadges: firebase.firestore.FieldValue.arrayUnion('patriota')
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
              'alienigena': { id: 'alienigena', icon: '👽', title: 'Alienígena (Foi o único a acertar o placar 3 vezes)' },
              'vice_eterno': { id: 'vice_eterno', icon: '🥈', title: 'Vice Eterno (Ficou em 2º lugar por 3 rodadas seguidas)' },
              'goleiro': { id: 'goleiro', icon: '🧤', title: 'Goleiro (Acertou 5 jogos com placar de 0 a 0 ou 1 a 0)' },
              'hat_trick': { id: 'hat_trick', icon: '⚽', title: 'Hat-trick (Acertou 3 placares exatos em um único dia)' },
              'telepata': { id: 'telepata', icon: '🧠', title: 'Telepata (Teve o mesmo palpite exato que outro jogador 5 vezes)' },
              'campeao_antecipado': { id: 'campeao_antecipado', icon: '🏆', title: 'Campeão Antecipado (Apostou no campeão antes do torneio e acertou)' },
              'azarado': { id: 'azarado', icon: '😤', title: 'Azarado (Errou o placar exato por 1 gol 5 vezes)' },
              'igual_chatgpt': { id: 'igual_chatgpt', icon: '🤖', title: 'Igual ao ChatGPT (Teve o mesmo palpite que os perfis das IA em 3 jogos)' }
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
            let hasHatTrick = Object.values(exactHitsByDate).some(v => v >= 3);
            let hasAzarado = azaradoHits >= 5;
            let hasIgualChatGPT = botHits >= 3;
            let hasTelepata = Object.values(telepataMatchCount).some(v => v >= 5);
            let hasCampeaoAntecipado = false;
            if (results.bonus_campeao && userData.bonus_campeao === results.bonus_campeao) {
               hasCampeaoAntecipado = true;
            }

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
          ranking.sort(function(a, b) { return b.pts - a.pts || b.exato - a.exato; });
        callback(ranking, results, allPicksByMatch);
      });
    });
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
