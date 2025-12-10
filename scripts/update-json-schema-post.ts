import fs from 'fs'
import path from 'path'

const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN

if (!ADMIN_TOKEN) {
  console.error('ADMIN_TOKEN environment variable is required')
  process.exit(1)
}

const POST_ID = 'f86b51fb-e3f7-48f1-bf36-e102449f0e49'
const contentPath = path.join(__dirname, 'content-json-schema-en.html')
const content = fs.readFileSync(contentPath, 'utf8')

async function updatePost() {
  console.log('Updating post:', POST_ID)
  console.log('Content length:', content.length, 'chars')
  console.log('API URL:', API_URL)

  const response = await fetch(`${API_URL}/api/proxy/api/posts/${POST_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({ content })
  })

  const data = await response.json()

  if (data.success) {
    console.log('✅ Post updated successfully!')
    console.log('New content length:', data.data?.content?.length, 'chars')
  } else {
    console.error('❌ Failed to update post:', data.error)
    process.exit(1)
  }
}

updatePost().catch(console.error)
