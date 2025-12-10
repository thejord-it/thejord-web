const https = require('https');

const TOKEN = process.env.ADMIN_TOKEN;

const posts = [
  {
    id: 'diff-it-001',
    metaTitle: 'Diff Checker Online Gratuito | Confronta Testi e Codice | THEJORD',
    metaDescription: 'Confronta testi e codice con il nostro Diff Checker online gratuito. Evidenzia differenze, side-by-side view, 100% client-side. Nessun upload, massima privacy.',
    keywords: ['diff checker', 'confronta testi', 'confronta codice', 'differenze file', 'text compare', 'code diff', 'git diff online', 'confronto documenti', 'merge tool']
  },
  {
    id: 'hash-gen-it-001',
    metaTitle: 'Hash Generator Online | MD5, SHA-256, SHA-512 Gratuito | THEJORD',
    metaDescription: 'Genera hash MD5, SHA-1, SHA-256, SHA-512 online gratis. Verifica integrità file, checksum istantaneo. 100% client-side, nessun upload server.',
    keywords: ['hash generator', 'md5 online', 'sha256 generator', 'sha512', 'checksum file', 'verifica integrità', 'hash calculator', 'crypto hash', 'password hash']
  },
  {
    id: '640ca7d7-6d39-415f-9f57-c4f819fb55b0',
    metaTitle: 'Base64 Encoder Decoder Online Gratuito | THEJORD',
    metaDescription: 'Codifica e decodifica Base64 online gratis. Supporta testi, file, immagini. URL-Safe, Data URI. 100% client-side, privacy totale.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'codifica base64', 'decodifica base64', 'data uri', 'base64 image', 'url safe base64']
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
          console.log(`✅ ${post.id}: Meta tags updated`);
          resolve(true);
        } else {
          console.log(`❌ ${post.id}: Failed (${res.statusCode})`);
          console.log(body.substring(0, 200));
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ${post.id}: Error - ${e.message}`);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  if (!TOKEN) {
    console.error('Error: ADMIN_TOKEN environment variable not set');
    process.exit(1);
  }

  console.log('Updating SEO meta tags for Sprint 2 posts...\n');

  for (const post of posts) {
    await updatePost(post);
  }

  console.log('\nDone!');
}

main();
