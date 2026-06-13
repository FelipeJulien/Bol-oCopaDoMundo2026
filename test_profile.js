const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

// Mock Firebase, etc
window.globalOfficialResults = { '1': { home: 1, away: 0 } };
window.ALL_MATCHES = [ { id: '1', date: new Date(), home: { code: 'br', name: 'Brasil' }, away: { code: 'ar', name: 'Argentina' } } ];
window.TEAM_MAP = { 'br': { code: 'br', name: 'Brasil' }, 'ar': { code: 'ar', name: 'Argentina' } };
window.globalRanking = [
  {
    id: 'mock_user_123',
    name: 'Julien',
    pts: 5,
    exato: 1,
    vencedor: 1,
    picks: { '1': { home: 1, away: 0 } }
  }
];
window.Chart = class Chart { constructor() { this.destroy = () => {}; } };

const appCode = fs.readFileSync('js/app.js', 'utf8') + '\n; currentUser = "mock_user_123"; updateDashboardProfile();';
try {
  window.eval(appCode);
  console.log("App.js evaluated and updateDashboardProfile ran successfully");
} catch(e) {
  console.error("ERROR:", e.message);
  console.error(e.stack);
}
