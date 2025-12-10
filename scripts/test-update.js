const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA';

const data = JSON.stringify({
  metaTitle: 'UUID Generator: Genera Identificatori Univoci Online',
  metaDescription: 'Genera UUID v1, v4, v5 online gratis. Crea identificatori univoci per database, API e applicazioni. 100% client-side.',
  keywords: ['uuid generator', 'genera uuid', 'uuid online']
});

const options = {
  hostname: 'thejord.it',
  port: 443,
  path: '/api/proxy/api/posts/5114c357-0e9d-4d91-90b0-da1f54cfd09c',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Sending PUT request...');
console.log('Data:', data);

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Response:', body.substring(0, 500));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
