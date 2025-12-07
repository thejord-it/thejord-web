const https = require('https');

https.get('https://thejord.it/api/posts?limit=50', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Total posts:', json.posts.length);
    console.log('\n=== POST STATUS ===\n');

    json.posts.forEach(p => {
      const wordCount = p.content ? p.content.split(/\s+/).length : 0;
      const metaStatus = (p.metaTitle && p.metaTitle.trim()) ? '✅' : '❌';
      const descStatus = (p.metaDescription && p.metaDescription.trim()) ? '✅' : '❌';
      console.log(`${metaStatus}${descStatus} [${p.language}] ${p.slug}`);
      console.log(`   Words: ${wordCount} | Title: ${p.metaTitle || 'EMPTY'}`);
      console.log(`   Desc: ${p.metaDescription ? p.metaDescription.substring(0, 50) + '...' : 'EMPTY'}`);
      console.log('');
    });
  });
}).on('error', console.error);
