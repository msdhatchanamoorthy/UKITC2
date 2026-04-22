process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('script.js', 'utf8');
const regex = /image:\s*['"](https:\/\/images\.unsplash\.com[^'"]+)['"]/g;
let match;
const urls = [];
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}
console.log('Found ' + urls.length + ' urls');

let pending = urls.length;
urls.forEach((url, i) => {
  https.get(url, (res) => {
    if (res.statusCode >= 400) {
      console.log('Slide ' + i + ' failed with status ' + res.statusCode + ': ' + url);
    }
    pending--;
    if (pending === 0) console.log('Done');
  }).on('error', (e) => {
    console.error('Slide ' + i + ' error: ' + e.message);
    pending--;
    if (pending === 0) console.log('Done');
  });
});
