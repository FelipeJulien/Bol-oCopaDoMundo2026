const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`
  <body>
    <div id="header-status"></div>
    <div id="proximos-container"></div>
    <div id="jogos-container"></div>
    <div id="grupos-container"></div>
    <div id="ranking-container"></div>
    <div id="sidebar"></div>
    <div id="btn-mobile-toggle"></div>
    <div id="avatar-modal"></div>
    <div id="flag-grid"></div>
    <input id="flag-search-input" />
    <button id="btn-avatar-cancel"></button>
    <button id="btn-avatar-save"></button>
    <img id="header-flag-img" />
    <div id="header-flag-placeholder"></div>
    <div id="trigger-campeao"></div>
    <div id="trigger-decepcao"></div>
    <div id="trigger-artilheiro"></div>
    <div id="trigger-ataque"></div>
    <div id="trigger-craque"></div>
    <div id="trigger-goleiro"></div>
    <div id="trigger-defensor"></div>
    <div id="trigger-revelacao"></div>
    <div id="trigger-neymar-gol"></div>
    <div id="live-modal"></div>
    <button id="btn-close-live"></button>
    <iframe id="live-youtube-iframe"></iframe>
    <div id="btn-profile"></div>
    <div id="display-user-name"></div>
  </body>
`, { runScripts: "dangerously", resources: "usable" });

dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

dom.window.firebase = {
  initializeApp: () => ({}),
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        onSnapshot: () => {},
        get: async () => ({ exists: false, data: () => ({}) })
      }),
      get: async () => ({ docs: [] })
    })
  })
};
dom.window.firebase.firestore.FieldValue = { serverTimestamp: () => {} };
dom.window.db = dom.window.firebase.firestore();

// Catch errors
dom.window.onerror = function(message, source, lineno, colno, error) {
  console.error("JSDOM Error:", message, "at line", lineno);
  if (error) console.error(error);
};

let dbCode = fs.readFileSync('js/db.js', 'utf8');
let appCode = fs.readFileSync('js/app.js', 'utf8');

// fix const -> var for eval scope issue
dbCode = dbCode.replace(/const /g, 'var ');
appCode = appCode.replace(/const /g, 'var ');

dom.window.eval(dbCode);
dom.window.eval(appCode);
dom.window.eval("initApp();");

console.log("jogosContainer length:", dom.window.document.getElementById('jogos-container').innerHTML.length);
console.log("proximosContainer length:", dom.window.document.getElementById('proximos-container').innerHTML.length);
console.log("proximosContainer contents:", dom.window.document.getElementById('proximos-container').innerHTML.substring(0, 50));
console.log("header status:", dom.window.document.getElementById('header-status').innerHTML);
