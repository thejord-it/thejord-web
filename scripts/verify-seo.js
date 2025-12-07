const https = require('https');

async function fetchPost(id) {
  return new Promise((resolve, reject) => {
    https.get(`https://thejord.it/api/proxy/api/posts/${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).data || JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllPosts() {
  return new Promise((resolve, reject) => {
    https.get('https://thejord.it/api/proxy/api/posts?limit=50', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || json.posts || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching posts list...');
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts\n`);

  let withMeta = 0;
  let withoutMeta = 0;

  for (const post of posts) {
    const full = await fetchPost(post.id);
    const hasMeta = full.metaTitle && full.metaTitle.trim();

    if (hasMeta) {
      console.log(`✅ ${post.slug}`);
      console.log(`   Title: ${full.metaTitle}`);
      withMeta++;
    } else {
      console.log(`❌ ${post.slug} - NO META`);
      withoutMeta++;
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`With meta tags: ${withMeta}/${posts.length}`);
  console.log(`Without meta tags: ${withoutMeta}/${posts.length}`);
}

main().catch(console.error);
