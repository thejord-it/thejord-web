const https = require('https');

const data = JSON.stringify({
  email: 'admin@thejord.it',
  password: 'TJ0rd!Adm1n!2025'
});

const options = {
  hostname: 'thejord.it',
  port: 443,
  path: '/api/proxy/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      if (json.token) {
        console.log(json.token);
      } else {
        console.error('Login failed:', body);
      }
    } catch (e) {
      console.error('Parse error:', body);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
