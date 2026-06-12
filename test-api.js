const https = require('https');

https.get('https://worldcup26.ir/get/games', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2).substring(0, 2000));
    } catch(e) {
      console.log('Error parsing:', e);
    }
  });
});
