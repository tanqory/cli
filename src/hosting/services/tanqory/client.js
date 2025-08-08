const fs = require('fs');
const os = require('os');
const path = require('path');
const TanqoryClient = require('@tanqory/api-client').default;

// อ่าน token จาก ~/.tanqory-cli/config.json
function loadConfig() {
  const configPath = path.join(os.homedir(), '.tanqory-cli', 'config.json');
  const projectPath = path.join(process.cwd(), '.tanqory', 'config');
  try {
    const file = fs.readFileSync(configPath, 'utf8');
    let config = JSON.parse(file);
    const projectConfig = fs.existsSync(projectPath) ? JSON.parse(fs.readFileSync(projectPath, 'utf8')) : {};
    config.siteId = projectConfig.storeName || config.siteId; // ใช้ siteId
    return config;
  } catch (err) {
    console.error('❌ ไม่พบ accessToken ใน ~/.tanqory-cli/config.json');
    return null;
  }
}

const config = loadConfig();

if (!config.accessToken || !config.refreshToken) {
  throw new Error('Access Token ไม่ถูกต้อง กรุณา login ด้วย tanqory-cli');
}

// สร้าง Tanqory Client พร้อม token

const client = TanqoryClient.init({
    accessToken: config.accessToken,
    refreshToken: config.refreshToken,
    siteId: config.siteId,
    apiAuthUrl: 'https://api-auth-staging.tanqory.com',
    apiFormsUrl: 'https://api-forms-staging.tanqory.com',
    apiSitesUrl: 'https://api-staging.tanqory.com',
    apiStorageUrl: 'https://api-storage-staging.tanqory.com',
})

// new TanqoryClient({
//   accessToken,
//   // baseURL: 'https://api.tanqory.com' // ไม่ใส่ก็ได้ถ้า SDK มี default
// });

module.exports = client;