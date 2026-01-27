import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chromeWebstoreUpload from 'chrome-webstore-upload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get credentials from environment variables
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const refreshToken = process.env.REFRESH_TOKEN
const extensionId = process.env.EXTENSION_ID

if (!clientId || !clientSecret || !refreshToken || !extensionId) {
  console.error('❌ Missing required environment variables:')
  console.error('   - CLIENT_ID')
  console.error('   - CLIENT_SECRET')
  console.error('   - REFRESH_TOKEN')
  console.error('   - EXTENSION_ID')
  console.error('\nPlease set these in your GitHub repository secrets.')
  process.exit(1)
}

const zipPath = path.join(__dirname, '../extension.zip')

if (!fs.existsSync(zipPath)) {
  console.error(`❌ Extension zip file not found: ${zipPath}`)
  process.exit(1)
}

console.log('📦 Uploading extension to Chrome Web Store...')

const webStore = chromeWebstoreUpload({
  extensionId,
  clientId,
  clientSecret,
  refreshToken,
})

async function uploadExtension() {
  try {
    // Read the zip file
    const zipFile = fs.createReadStream(zipPath)

    // Upload the extension
    console.log('⬆️  Uploading...')
    const uploadResponse = await webStore.uploadExisting(zipFile)
    
    if (uploadResponse.uploadState === 'SUCCESS') {
      console.log('✅ Upload successful!')
      
      // Publish the extension
      console.log('📢 Publishing...')
      const publishResponse = await webStore.publish()
      
      if (publishResponse.status.includes('OK')) {
        console.log('✅ Extension published successfully!')
        console.log(`🎉 Your extension is now live on Chrome Web Store!`)
      } else {
        console.error('❌ Publish failed:', publishResponse)
        process.exit(1)
      }
    } else {
      console.error('❌ Upload failed:', uploadResponse)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error uploading extension:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
    process.exit(1)
  }
}

uploadExtension()
