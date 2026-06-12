const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

// Mock localStorage
dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

// Mock firebase
dom.window.firebase = {
  initializeApp: () => ({
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          onSnapshot: () => {},
          get: async () => ({ exists: false, data: () => ({}) })
        }),
        get: async () => ({ docs: [] })
      })
    })
  })
};

// Catch errors
dom.window.onerror = function(message, source, lineno, colno, error) {
  console.error("JSDOM Error:", message, "at line", lineno);
  if (error) console.error(error);
};

setTimeout(() => {
  console.log("Done waiting for scripts");
}, 3000);
