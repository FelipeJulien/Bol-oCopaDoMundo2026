const fs = require('fs');

const dbCode = fs.readFileSync('js/db.js', 'utf8');
const TEAM_MAP_MATCH = dbCode.match(/const TEAM_MAP = {([\s\S]*?)};\n/);
const _RAW_MATCH = dbCode.match(/const _RAW = \[([\s\S]*?)\];/);

eval(`var TEAM_MAP = {${TEAM_MAP_MATCH[1]}};`);
eval(`var _RAW = [${_RAW_MATCH[1]}];`);

for (let i = 0; i < _RAW.length; i++) {
  const r = _RAW[i];
  if (!TEAM_MAP[r[2]]) console.error("MISSING HOME TEAM:", r[2], "at index", i);
  if (!TEAM_MAP[r[3]]) console.error("MISSING AWAY TEAM:", r[3], "at index", i);
}
console.log("Team validation complete.");
