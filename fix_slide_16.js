process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');

const item = { dest: 'images/slide_16.jpg', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' };

const file = fs.createWriteStream(item.dest);
https.get(item.url, (response) => {
  if (response.statusCode >= 400) {
      console.error('Failed to download ' + item.url + ' status: ' + response.statusCode);
      file.close();
      return;
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded ' + item.dest);
  });
});
