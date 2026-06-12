const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

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

async function getUserData(userId) {
  const picksSnap = await getDocs(collection(db, 'users', userId, 'picks'));
  const userSnap = await getDoc(doc(db, 'users', userId));
  const picks = {};
  picksSnap.forEach(function(doc) { picks[doc.id] = doc.data(); });
  const userData = userSnap.data() || {};
  return { name: userData.name || '', picks: picks };
}

async function run() {
  var data = await getUserData('claude');
  let loadedCount = 0;
  Object.keys(data.picks).forEach(function(matchId) {
    var pick = data.picks[matchId];
    if (pick.home !== undefined && pick.away !== undefined) {
      loadedCount++;
    }
  });
  console.log(`Successfully loaded ${loadedCount} valid picks for Claude.`);
  process.exit(0);
}

run().catch(console.error);
