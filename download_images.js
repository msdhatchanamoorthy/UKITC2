process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');
const path = require('path');

let content = fs.readFileSync('script.js', 'utf8');

// We will find all Unsplash URLs and replace them.
const regex = /image:\s*['"](https:\/\/images\.unsplash\.com[^'"]+)['"]/g;
let match;
let slideIndex = 0;
const downloads = [];
let newContent = content;

while ((match = regex.exec(content)) !== null) {
  const originalUrl = match[1];
  const localFilename = `images/slide_${slideIndex}.jpg`;
  
  // Replace in content
  newContent = newContent.replace(originalUrl, localFilename);
  
  downloads.push({
    url: originalUrl,
    dest: localFilename
  });
  
  slideIndex++;
}

// Save the updated script.js
fs.writeFileSync('script.js', newContent);
console.log('Updated script.js to use local images.');

// Download images
let pending = downloads.length;
if (pending === 0) {
    console.log('No images to download.');
}

downloads.forEach((item, i) => {
  const file = fs.createWriteStream(item.dest);
  https.get(item.url, (response) => {
    if (response.statusCode >= 400) {
        console.error('Failed to download ' + item.url + ' status: ' + response.statusCode);
        file.close();
        pending--;
        if (pending === 0) console.log('All downloads finished.');
        return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded ' + item.dest);
      pending--;
      if (pending === 0) console.log('All downloads finished.');
    });
  }).on('error', (err) => {
    fs.unlink(item.dest, () => {});
    console.error('Error downloading ' + item.url + ': ' + err.message);
    pending--;
    if (pending === 0) console.log('All downloads finished.');
  });
});
