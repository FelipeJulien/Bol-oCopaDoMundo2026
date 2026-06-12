const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`<body></body>`, { runScripts: "dangerously", resources: "usable" });

dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

dom.window.onerror = function(message, source, lineno, colno, error) {
  console.error("JSDOM Error:", message);
};

let dbCode = fs.readFileSync('js/db.js', 'utf8');
dbCode = dbCode.replace(/const /g, 'var ');

dom.window.eval(dbCode);

setTimeout(() => {
  const db = dom.window.db;
  db.collection('config').doc('live').set({
    youtubeUrl: 'https://www.youtube.com/watch?v=CRtjePKnGvA',
    updatedAt: dom.window.firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).then(() => {
    console.log("SUCESSO: youtubeUrl atualizado no Firestore.");
    process.exit(0);
  }).catch(e => {
    console.error("Erro ao atualizar youtubeUrl no Firestore:", e);
    process.exit(1);
  });
}, 2000); // aguardar firebase inicializar
