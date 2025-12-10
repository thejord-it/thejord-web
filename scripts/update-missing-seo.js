const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA';

const updates = [
  {
    id: 'diff-it-001',
    metaTitle: 'Diff Checker: Confronta Testi e Codice Online',
    metaDescription: 'Strumento gratuito per confrontare file e codice. Trova differenze in tempo reale con evidenziazione riga per riga. 100% privacy.',
    keywords: ['diff checker', 'confronta testi', 'compare files', 'diff tool', 'text diff', 'code comparison']
  },
  {
    id: 'hash-gen-it-001',
    metaTitle: 'Hash Generator: MD5, SHA-256, SHA-512 Online',
    metaDescription: 'Genera hash crittografici con MD5, SHA-1, SHA-256, SHA-512. Strumento gratuito per checksum, password hashing e verifica integrità.',
    keywords: ['hash generator', 'md5 generator', 'sha256', 'sha512', 'hash calculator', 'checksum', 'genera hash']
  }
];

async function updatePost(post) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords
    });

    const options = {
      hostname: 'thejord.it',
      port: 443,
      path: `/api/proxy/api/posts/${post.id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, id: post.id });
        } else {
          resolve({ success: false, id: post.id, error: body });
        }
      });
    });

    req.on('error', (e) => resolve({ success: false, id: post.id, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  for (const post of updates) {
    console.log(`Updating ${post.id}...`);
    const result = await updatePost(post);
    if (result.success) {
      console.log(`  ✅ OK`);
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
    }
  }
}

main();
