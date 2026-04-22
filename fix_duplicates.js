process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');

const newImages = [
    { dest: 'images/slide_3.jpg', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_16.jpg', url: 'https://images.unsplash.com/photo-1600880292081-30919b49f9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_22.jpg', url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_14.jpg', url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_19.jpg', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_15.jpg', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    { dest: 'images/slide_8.jpg', url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }
];

let pending = newImages.length;

newImages.forEach((item) => {
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
