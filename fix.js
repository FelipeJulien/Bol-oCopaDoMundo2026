const fs = require('fs');

let app = fs.readFileSync('js/app.js', 'utf8');

// Fix Chart instantiation
app = app.replace(
  "profileChartPizza = new Chart(ctxPizza, {",
  "try { profileChartPizza = new Chart(ctxPizza, {"
);
app = app.replace(
  "        }\n      }\n    });\n  }",
  "        }\n      }\n    });\n  } catch (e) { console.error('Chart error', e); }\n  }"
);

app = app.replace(
  "profileChartLinha = new Chart(ctxLinha, {",
  "try { profileChartLinha = new Chart(ctxLinha, {"
);
app = app.replace(
  "      }\n    });\n  }",
  "      }\n    });\n  } catch (e) { console.error('Chart error', e); }\n  }"
);

fs.writeFileSync('js/app.js', app);
