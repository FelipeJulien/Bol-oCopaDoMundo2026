const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function run() {
  const snap = await getDocs(collection(db, 'users', 'claude', 'picks'));
  console.log(`Found ${snap.size} picks inside users/claude/picks.`);
  const all = [];
  snap.forEach(doc => all.push({ id: doc.id, home: doc.data().home, away: doc.data().away }));
  console.log(all);
  process.exit(0);
}

run().catch(console.error);
