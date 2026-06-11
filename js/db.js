// =============================================
// db.js — DADOS E FIREBASE INTEGRAÇÃO
// =============================================

// 1. DADOS DAS SELEÇÕES (FlagCDN Iso Codes)
const GROUPS = [
  { letter: 'A', teams: [ {code:'mx', name:'México'}, {code:'za', name:'África do Sul'}, {code:'kr', name:'Coreia do Sul'}, {code:'cz', name:'Tchéquia'} ]},
  { letter: 'B', teams: [ {code:'ca', name:'Canadá'}, {code:'qa', name:'Catar'}, {code:'ch', name:'Suíça'}, {code:'ba', name:'Bósnia-Herzegovina'} ]},
  { letter: 'C', teams: [ {code:'br', name:'Brasil'}, {code:'ma', name:'Marrocos'}, {code:'ht', name:'Haiti'}, {code:'gb-sct', name:'Escócia'} ]},
  { letter: 'D', teams: [ {code:'au', name:'Austrália'}, {code:'us', name:'EUA'}, {code:'py', name:'Paraguai'}, {code:'tr', name:'Turquia'} ]},
  { letter: 'E', teams: [ {code:'de', name:'Alemanha'}, {code:'ci', name:'Costa do Marfim'}, {code:'cw', name:'Curaçao'}, {code:'ec', name:'Equador'} ]},
  { letter: 'F', teams: [ {code:'nl', name:'Holanda'}, {code:'jp', name:'Japão'}, {code:'tn', name:'Tunísia'}, {code:'se', name:'Suécia'} ]},
  { letter: 'G', teams: [ {code:'be', name:'Bélgica'}, {code:'eg', name:'Egito'}, {code:'ir', name:'Irã'}, {code:'nz', name:'Nova Zelândia'} ]},
  { letter: 'H', teams: [ {code:'sa', name:'Arábia Saudita'}, {code:'cv', name:'Cabo Verde'}, {code:'es', name:'Espanha'}, {code:'uy', name:'Uruguai'} ]},
  { letter: 'I', teams: [ {code:'fr', name:'França'}, {code:'no', name:'Noruega'}, {code:'sn', name:'Senegal'}, {code:'iq', name:'Iraque'} ]},
  { letter: 'J', teams: [ {code:'ar', name:'Argentina'}, {code:'dz', name:'Argélia'}, {code:'jo', name:'Jordânia'}, {code:'at', name:'Áustria'} ]},
  { letter: 'K', teams: [ {code:'co', name:'Colômbia'}, {code:'pt', name:'Portugal'}, {code:'uz', name:'Uzbequistão'}, {code:'cd', name:'RD Congo'} ]},
  { letter: 'L', teams: [ {code:'hr', name:'Croácia'}, {code:'gh', name:'Gana'}, {code:'gb-eng', name:'Inglaterra'}, {code:'pa', name:'Panamá'} ]}
];

const MATCH_PAIRS = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const ALL_MATCHES = [];
const ALL_TEAMS = [];

let _matchIdx = 0;
// Data inicial fictícia para a Copa 2026: 11 de Junho de 2026
const startDate = new Date('2026-06-11T12:00:00Z');

GROUPS.forEach(g => {
  g.teams.forEach(t => ALL_TEAMS.push(t));
  MATCH_PAIRS.forEach(pair => {
    // Distribuindo datas fictícias para gerar a aba "Próximos Jogos"
    const matchDate = new Date(startDate.getTime() + (_matchIdx * 4 * 60 * 60 * 1000)); // 1 jogo a cada 4 horas
    
    ALL_MATCHES.push({
      id: `m_${_matchIdx}`,
      group: g.letter,
      home: g.teams[pair[0]],
      away: g.teams[pair[1]],
      date: matchDate
    });
    _matchIdx++;
  });
});
ALL_TEAMS.sort((a,b) => a.name.localeCompare(b.name));

// 2. CONFIGURAÇÃO FIREBASE
// COLOQUE SUAS CREDENCIAIS AQUI
const firebaseConfig = {
  // apiKey: "API_KEY",
  // authDomain: "PROJECT_ID.firebaseapp.com",
  // projectId: "PROJECT_ID",
  // storageBucket: "PROJECT_ID.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID"
};

// Inicialização segura
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

// 3. API DO BANCO DE DADOS (Wrapper para LocalStorage fallback)
const dbAPI = {
  // SALVAR PALPITE JOGO
  savePick: async (userId, userName, matchId, home, away) => {
    // LocalStorage Fallback sempre ativo
    let localData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.picks[matchId] = { home, away };
    localStorage.setItem(`user_${userId}`, JSON.stringify(localData));

    // Firebase Save
    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
      
      await db.collection('users').doc(userId).collection('picks').doc(matchId).set({
        home, away
      });
    }
  },

  // SALVAR BÔNUS
  saveBonus: async (userId, userName, bonusKey, value) => {
    let localData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{"picks":{}, "bonus":{}}');
    localData.name = userName;
    localData.bonus[bonusKey] = value;
    localStorage.setItem(`user_${userId}`, JSON.stringify(localData));

    if (db) {
      await db.collection('users').doc(userId).set({
        name: userName,
        [`bonus_${bonusKey}`]: value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true});
    }
  },

  // PEGAR DADOS DO USUÁRIO ATUAL
  getUserData: async (userId) => {
    const localData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{"picks":{}, "bonus":{}}');
    if (!db) return localData;

    try {
      const picksSnap = await db.collection('users').doc(userId).collection('picks').get();
      const userSnap = await db.collection('users').doc(userId).get();
      
      const picks = {};
      picksSnap.forEach(doc => picks[doc.id] = doc.data());
      
      const userData = userSnap.data() || {};
      const bonus = {
        campeao: userData.bonus_campeao || '',
        artilheiro: userData.bonus_artilheiro || '',
        ataque: userData.bonus_ataque || '',
        decepcao: userData.bonus_decepcao || ''
      };

      return { picks, bonus };
    } catch(e) {
      console.error(e);
      return localData;
    }
  },

  // ADMIN: SALVAR RESULTADOS
  saveResult: async (resultsObj) => {
    let local = JSON.parse(localStorage.getItem('official_results') || '{}');
    Object.assign(local, resultsObj);
    localStorage.setItem('official_results', JSON.stringify(local));

    if (db) {
      await db.collection('meta').doc('results').set(resultsObj, {merge: true});
    }
  },

  // PEGAR RESULTADOS OFICIAIS
  getResults: async () => {
    if (!db) return JSON.parse(localStorage.getItem('official_results') || '{}');
    try {
      const snap = await db.collection('meta').doc('results').get();
      return snap.exists ? snap.data() : {};
    } catch(e) {
      return JSON.parse(localStorage.getItem('official_results') || '{}');
    }
  },

  // LISTENER DO RANKING E RESULTADOS (Real-time)
  listenToUpdates: (callback) => {
    if (!db) return; // Em modo local não há real-time push entre abas facilmente
    
    // Escuta resultados mudando
    db.collection('meta').doc('results').onSnapshot(snap => {
      const results = snap.exists ? snap.data() : {};
      
      // Quando os resultados mudam, pegamos os palpites de todos para recalcular o ranking
      db.collection('users').get().then(async usersSnap => {
        const ranking = [];
        for (let userDoc of usersSnap.docs) {
          const userData = userDoc.data();
          const picksSnap = await db.collection('users').doc(userDoc.id).collection('picks').get();
          
          let exato = 0, vencedor = 0, pts = 0;
          
          picksSnap.forEach(pickDoc => {
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

          // Bônus mock simplificado (na vida real admin preencheria tb)
          // Aqui, apenas os jogos.

          ranking.push({
            id: userDoc.id,
            name: userData.name || 'Anônimo',
            pts, exato, vencedor
          });
        }

        ranking.sort((a,b) => b.pts - a.pts || b.exato - a.exato);
        callback(ranking, results);
      });
    });
  }
};
