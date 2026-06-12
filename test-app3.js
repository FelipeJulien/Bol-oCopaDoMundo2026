const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`
  <body>
    <div id="header-status"></div>
    <div id="proximos-container"></div>
    <div id="jogos-container"></div>
  </body>
`, { runScripts: "dangerously", resources: "usable" });

dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

dom.window.onerror = function(message, source, lineno, colno, error) {
  console.error("JSDOM Error:", message, "at line", lineno);
  if (error) console.error(error);
};

let dbCode = fs.readFileSync('js/db.js', 'utf8');
let appCode = fs.readFileSync('js/app.js', 'utf8');

dbCode = dbCode.replace(/const /g, 'var ');
appCode = appCode.replace(/const /g, 'var ');

dom.window.eval(dbCode);
dom.window.eval(`
  var els = {
    jogosContainer: document.getElementById('jogos-container'),
    proximosContainer: document.getElementById('proximos-container'),
    headerStatus: document.getElementById('header-status')
  };
`);

// extract only renderMatches, formatDate, buildMatchCardHTML, formatDayHeader, getDateKey
dom.window.eval(`
  var globalOfficialResults = {};
  var agora = new Date('2026-06-12T17:14:35-03:00'); // Mock time!

  // overwrite Date constructor to use mock time
  var OriginalDate = Date;
  Date = function(arg) {
    if (arg === undefined) return new OriginalDate('2026-06-12T17:14:35-03:00');
    return new OriginalDate(arg);
  };
  Date.now = function() { return new OriginalDate('2026-06-12T17:14:35-03:00').getTime(); };
`);

dom.window.eval(appCode);
dom.window.eval(`
  try {
    renderMatches();
    console.log("jogosContainer HTML len:", els.jogosContainer.innerHTML.length);
    console.log("proximosContainer HTML len:", els.proximosContainer.innerHTML.length);
    if (els.proximosContainer.innerHTML.length < 200) {
      console.log("proximos content:", els.proximosContainer.innerHTML);
    }
  } catch(e) {
    console.error("Crash during renderMatches!", e);
  }
`);
