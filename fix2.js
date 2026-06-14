const fs = require('fs');

let app = fs.readFileSync('js/app.js', 'utf8');

app = app.replace(
  "var dRank = globalRanking.filter(u => Object.keys(u.picks || {}).length > 0); const pos = dRank.findIndex(u => u.id === currentUser) + 1;",
  "var dRank = globalRanking.filter(u => Object.keys(u.picks || {}).length > 0 || u.pts > 0); const pos = dRank.findIndex(u => u.id === currentUser) + 1;"
);

app = app.replace(
  "animateValue(dashPtsEl, 0, myData.pts, 1000);",
  "animateValue(dashPtsEl, 0, myData.pts || 0, 1000);"
);

app = app.replace(
  "animateValue(dashPosEl, 100, pos, 1500);",
  "animateValue(dashPosEl, 100, pos > 0 ? pos : 0, 1500);"
);

fs.writeFileSync('js/app.js', app);
