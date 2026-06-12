const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBapdLKIiqP04vEp_z2b6_OS9CqpJyqKKo",
  authDomain: "bolaocopa26-f4d17.firebaseapp.com",
  projectId: "bolaocopa26-f4d17",
  storageBucket: "bolaocopa26-f4d17.firebasestorage.app",
  messagingSenderId: "665725539665",
  appId: "1:665725539665:web:58e64480638a187a2def70",
  measurementId: "G-98ZYG6P3M1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TEAM_MAP = {
  'Tchéquia': 'Czech Republic',
  'África do Sul': 'South Africa',
  'México': 'Mexico',
  'Coreia do Sul': 'South Korea',
  'Catar': 'Qatar',
  'Suíça': 'Switzerland',
  'Bósnia': 'Bosnia & Herzegovina',
  'Canadá': 'Canada',
  'Brasil': 'Brazil',
  'Marrocos': 'Morocco',
  'Haiti': 'Haiti',
  'Escócia': 'Scotland',
  'EUA': 'USA',
  'Paraguai': 'Paraguay',
  'Austrália': 'Australia',
  'Turquia': 'Turkey',
  'Alemanha': 'Germany',
  'Curaçao': 'Curaçao',
  'Costa do Marfim': 'Ivory Coast',
  'Equador': 'Ecuador',
  'Holanda': 'Netherlands',
  'Japão': 'Japan',
  'Suécia': 'Sweden',
  'Tunísia': 'Tunisia',
  'Bélgica': 'Belgium',
  'Egito': 'Egypt',
  'Irã': 'Iran',
  'Nova Zelândia': 'New Zealand',
  'Espanha': 'Spain',
  'Cabo Verde': 'Cape Verde',
  'Arábia Saudita': 'Saudi Arabia',
  'Uruguai': 'Uruguay',
  'França': 'France',
  'Senegal': 'Senegal',
  'Iraque': 'Iraq',
  'Noruega': 'Norway',
  'Argentina': 'Argentina',
  'Argélia': 'Algeria',
  'Áustria': 'Austria',
  'Jordânia': 'Jordan',
  'Portugal': 'Portugal',
  'RD Congo': 'DR Congo',
  'Uzbequistão': 'Uzbekistan',
  'Colômbia': 'Colombia',
  'Inglaterra': 'England',
  'Croácia': 'Croatia',
  'Gana': 'Ghana',
  'Panamá': 'Panama'
};

const ALL_MATCHES = [
  { id: 1, home: 'Mexico', away: 'South Africa' },
  { id: 2, home: 'South Korea', away: 'Czech Republic' },
  { id: 3, home: 'Czech Republic', away: 'South Africa' },
  { id: 4, home: 'Mexico', away: 'South Korea' },
  { id: 5, home: 'Czech Republic', away: 'Mexico' },
  { id: 6, home: 'South Africa', away: 'South Korea' },
  { id: 7, home: 'Canada', away: 'Bosnia & Herzegovina' },
  { id: 8, home: 'Qatar', away: 'Switzerland' },
  { id: 9, home: 'Switzerland', away: 'Bosnia & Herzegovina' },
  { id: 10, home: 'Canada', away: 'Qatar' },
  { id: 11, home: 'Switzerland', away: 'Canada' },
  { id: 12, home: 'Bosnia & Herzegovina', away: 'Qatar' },
  { id: 13, home: 'Brazil', away: 'Morocco' },
  { id: 14, home: 'Haiti', away: 'Scotland' },
  { id: 15, home: 'Scotland', away: 'Morocco' },
  { id: 16, home: 'Brazil', away: 'Haiti' },
  { id: 17, home: 'Scotland', away: 'Brazil' },
  { id: 18, home: 'Morocco', away: 'Haiti' },
  { id: 19, home: 'USA', away: 'Paraguay' },
  { id: 20, home: 'Australia', away: 'Turkey' },
  { id: 21, home: 'USA', away: 'Australia' },
  { id: 22, home: 'Turkey', away: 'Paraguay' },
  { id: 23, home: 'Turkey', away: 'USA' },
  { id: 24, home: 'Paraguay', away: 'Australia' },
  { id: 25, home: 'Germany', away: 'Curaçao' },
  { id: 26, home: 'Ivory Coast', away: 'Ecuador' },
  { id: 27, home: 'Germany', away: 'Ivory Coast' },
  { id: 28, home: 'Ecuador', away: 'Curaçao' },
  { id: 29, home: 'Curaçao', away: 'Ivory Coast' },
  { id: 30, home: 'Ecuador', away: 'Germany' },
  { id: 31, home: 'Netherlands', away: 'Japan' },
  { id: 32, home: 'Sweden', away: 'Tunisia' },
  { id: 33, home: 'Netherlands', away: 'Sweden' },
  { id: 34, home: 'Tunisia', away: 'Japan' },
  { id: 35, home: 'Japan', away: 'Sweden' },
  { id: 36, home: 'Tunisia', away: 'Netherlands' },
  { id: 37, home: 'Belgium', away: 'Egypt' },
  { id: 38, home: 'Iran', away: 'New Zealand' },
  { id: 39, home: 'Belgium', away: 'Iran' },
  { id: 40, home: 'New Zealand', away: 'Egypt' },
  { id: 41, home: 'Egypt', away: 'Iran' },
  { id: 42, home: 'New Zealand', away: 'Belgium' },
  { id: 43, home: 'Spain', away: 'Cape Verde' },
  { id: 44, home: 'Saudi Arabia', away: 'Uruguay' },
  { id: 45, home: 'Spain', away: 'Saudi Arabia' },
  { id: 46, home: 'Uruguay', away: 'Cape Verde' },
  { id: 47, home: 'Uruguay', away: 'Spain' },
  { id: 48, home: 'Cape Verde', away: 'Saudi Arabia' },
  { id: 49, home: 'France', away: 'Senegal' },
  { id: 50, home: 'Iraq', away: 'Norway' },
  { id: 51, home: 'France', away: 'Iraq' },
  { id: 52, home: 'Norway', away: 'Senegal' },
  { id: 53, home: 'Norway', away: 'France' },
  { id: 54, home: 'Senegal', away: 'Iraq' },
  { id: 55, home: 'Argentina', away: 'Algeria' },
  { id: 56, home: 'Austria', away: 'Jordan' },
  { id: 57, home: 'Argentina', away: 'Austria' },
  { id: 58, home: 'Jordan', away: 'Algeria' },
  { id: 59, home: 'Algeria', away: 'Austria' },
  { id: 60, home: 'Jordan', away: 'Argentina' },
  { id: 61, home: 'Portugal', away: 'DR Congo' },
  { id: 62, home: 'Uzbekistan', away: 'Colombia' },
  { id: 63, home: 'Portugal', away: 'Uzbekistan' },
  { id: 64, home: 'Colombia', away: 'DR Congo' },
  { id: 65, home: 'Colombia', away: 'Portugal' },
  { id: 66, home: 'DR Congo', away: 'Uzbekistan' },
  { id: 67, home: 'England', away: 'Croatia' },
  { id: 68, home: 'Ghana', away: 'Panama' },
  { id: 69, home: 'England', away: 'Ghana' },
  { id: 70, home: 'Panama', away: 'Croatia' },
  { id: 71, home: 'Panama', away: 'England' },
  { id: 72, home: 'Croatia', away: 'Ghana' }
];

const picks = `Tchéquia 1 x 1 África do Sul
México 2 x 1 Coreia do Sul
Tchéquia 0 x 2 México
África do Sul 1 x 2 Coreia do Sul
Catar 0 x 2 Suíça
Suíça 2 x 0 Bósnia
Canadá 3 x 0 Catar
Suíça 1 x 1 Canadá
Bósnia 1 x 0 Catar
Brasil x Marrocos — 3 x 0
Haiti x Escócia — 0 x 2
Escócia x Marrocos — 1 x 1
Brasil x Haiti — 4 x 0
Escócia x Brasil — 0 x 2
Marrocos x Haiti — 2 x 0
EUA x Paraguai — 2 x 0
Austrália x Turquia — 1 x 1
EUA x Austrália — 2 x 1
Turquia x Paraguai — 2 x 1
Turquia x EUA — 1 x 2
Paraguai x Austrália — 1 x 1
Alemanha x Curaçao — 4 x 0
Costa do Marfim x Equador — 1 x 1
Alemanha x Costa do Marfim — 2 x 1
Equador x Curaçao — 2 x 0
Curaçao x Costa do Marfim — 0 x 2
Equador x Alemanha — 0 x 3
Holanda x Japão — 2 x 1
Suécia x Tunísia — 2 x 0
Holanda x Suécia — 2 x 0
Tunísia x Japão — 0 x 2
Japão x Suécia — 1 x 1
Tunísia x Holanda — 0 x 3
Bélgica x Egito — 2 x 0
Irã x Nova Zelândia — 1 x 0
Bélgica x Irã — 2 x 0
Nova Zelândia x Egito — 1 x 1
Egito x Irã — 1 x 1
Nova Zelândia x Bélgica — 0 x 2
Espanha x Cabo Verde — 3 x 0
Arábia Saudita x Uruguai — 1 x 2
Espanha x Arábia Saudita — 2 x 0
Uruguai x Cabo Verde — 3 x 0
Uruguai x Espanha — 1 x 1
Cabo Verde x Arábia Saudita — 1 x 1
França x Senegal — 2 x 1
Iraque x Noruega — 0 x 2
França x Iraque — 3 x 0
Noruega x Senegal — 1 x 1
Noruega x França — 1 x 2
Senegal x Iraque — 2 x 0
Argentina x Argélia — 3 x 0
Áustria x Jordânia — 2 x 0
Argentina x Áustria — 2 x 0
Jordânia x Argélia — 0 x 1
Argélia x Áustria — 1 x 1
Jordânia x Argentina — 0 x 3
Portugal x RD Congo — 3 x 0
Uzbequistão x Colômbia — 0 x 2
Portugal x Uzbequistão — 2 x 0
Colômbia x RD Congo — 2 x 1
Colômbia x Portugal — 1 x 2
RD Congo x Uzbequistão — 1 x 0
Inglaterra x Croácia — 2 x 0
Gana x Panamá — 1 x 0
Inglaterra x Gana — 2 x 1
Panamá x Croácia — 0 x 2
Panamá x Inglaterra — 0 x 3
Croácia x Gana — 1 x 1`;

async function run() {
  const lines = picks.split('\n');
  const userId = 'claude';
  const userName = 'Claude'; // usei capital "C" dessa vez

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Parse line: "Time A 2 x 1 Time B" or "Time A x Time B - 3 x 0" (the user sent two formats!)
    let homeNamePt, awayNamePt, hScore, aScore;
    
    if (line.includes(' — ')) {
      // "Brasil x Marrocos — 3 x 0"
      const [teams, scores] = line.split(' — ');
      const tArr = teams.split(' x ');
      const sArr = scores.split(' x ');
      homeNamePt = tArr[0].trim();
      awayNamePt = tArr[1].trim();
      hScore = parseInt(sArr[0].trim());
      aScore = parseInt(sArr[1].trim());
    } else {
      // "Tchéquia 1 x 1 África do Sul"
      const parts = line.split(' x ');
      
      const p0 = parts[0].trim().split(' ');
      hScore = parseInt(p0.pop());
      homeNamePt = p0.join(' ');
      
      const p1 = parts[1].trim().split(' ');
      aScore = parseInt(p1.shift());
      awayNamePt = p1.join(' ');
    }
    
    const homeTeam = TEAM_MAP[homeNamePt];
    const awayTeam = TEAM_MAP[awayNamePt];
    
    if (!homeTeam || !awayTeam) {
      console.log('FALHA ao parsear times:', line, homeNamePt, awayNamePt);
      continue;
    }
    
    const match = ALL_MATCHES.find(m => m.home === homeTeam && m.away === awayTeam);
    if (!match) {
      console.log('JOGO NÃO ENCONTRADO:', homeTeam, 'vs', awayTeam);
      continue;
    }
    
    console.log(`Salvando: ${homeNamePt} ${hScore} x ${aScore} ${awayNamePt} (Match ${match.id})`);
    
    // THE REAL FIX: save to 'users/claude/picks/{match.id}'
    const docRef = doc(db, 'users', userId, 'picks', match.id.toString());
    await setDoc(docRef, {
      userId,
      userName,
      matchId: match.id,
      home: hScore,
      away: aScore,
      timestamp: new Date().toISOString() // Just a string is fine, it doesn't matter for read.
    });
  }
  
  console.log("Palpites do claude inseridos com sucesso na sub-collection correta.");
  process.exit(0);
}

run().catch(console.error);
