// src/lib/theme-kit.js
const fs = require('fs-extra');
const path = require('path');
const api = require('./api');
const config = require('./config');
const { log, error, spinner } = require('./utils');
const express = require('express');
const chalk = require('chalk');
const extract = require('extract-zip'); 
const archiver = require('archiver');
const cors = require('cors');


class ThemeKit {
  constructor() {
    this.storeName = config.get('storeName');
    // if (!this.storeName) {
    //   error('Store name not found in global config. Please run `tanqory login` first.');
    //   throw new Error('Store name not configured.');
    // }
  }

  async pushTheme(themeId, localPath, storeName) {
    const fullLocalPath = path.resolve(localPath);
    if (!fs.existsSync(fullLocalPath)) {
      error(`Theme directory not found at: ${fullLocalPath}`);
      throw new Error('Theme directory not found.');
    }

    const filePaths = await this.getFiles(fullLocalPath);

    const pushSpinner = spinner(`Pushing ${filePaths.length} files to theme ${themeId}...`).start();
    const tempZipPath = path.join(fullLocalPath, '..', `theme-${Date.now()}.zip`);

    try {
      const output = fs.createWriteStream(tempZipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      
      output.on('close', async () => {
        pushSpinner.text = `Uploading theme (${archive.pointer()} bytes)...`;
        
        // 2. อัปโหลดไฟล์ Zip
        await api.uploadThemeZip(storeName, themeId, tempZipPath).then(() => {
          pushSpinner.succeed(`Theme ${themeId} pushed successfully!`);
        }).catch(error => {
          pushSpinner.warn(`Theme ${themeId} push error : ${error.message}`);
        })
        await fs.remove(tempZipPath); // 3. ลบไฟล์ Zip ชั่วคราว
      });
      
      archive.on('error', (err) => {
        throw err;
      });
      
      archive.pipe(output);
      archive.directory(fullLocalPath, false); // false คือไม่รวมโฟลเดอร์ root ใน zip
      await archive.finalize();
    } catch (err) {
      pushSpinner.fail(`Failed to push theme: ${err.message}`);
      throw err;
    }
  }
  
  async pullTheme(themeId, localPath, storeName) {
    const finalStoreName = storeName || this.checkStoreName();
    if (!finalStoreName) return;

    const fullLocalPath = path.resolve(localPath);
    const tempZipPath = path.join(fullLocalPath, 'theme.zip');

    const pullSpinner = spinner(`Pulling theme ${themeId} to ${fullLocalPath}...`).start();

    try {
      // 1. ดาวน์โหลดไฟล์ zip
      const zipBuffer = await api.downloadThemeZip(finalStoreName, themeId);

      // 2. บันทึกไฟล์ zip ลงในเครื่อง
      await fs.ensureDir(fullLocalPath);
      await fs.writeFile(tempZipPath, zipBuffer);

      // 3. แตกไฟล์ zip
      await extract(tempZipPath, { dir: fullLocalPath });

      // 4. ลบไฟล์ zip ที่ไม่จำเป็นทิ้ง
      await fs.remove(tempZipPath);
      
      pullSpinner.succeed(chalk.green(`Theme ${themeId} pulled successfully to ${fullLocalPath}`));
    } catch (err) {
      pullSpinner.fail(`Failed to pull theme: ${err.message}`);
      throw err;
    }
  }

  async serveTheme(storeName, themeId, localPath, port) {
    const fullLocalPath = path.resolve(localPath);
    // if (!fs.existsSync(fullLocalPath) || !fs.statSync(fullLocalPath).isDirectory()) {
    //   error(`Theme directory not found at: ${fullLocalPath}`);
    //   throw new Error('Theme directory not found.');
    // }
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use((req, res, next) => {
      req.site = {
        siteId: storeName,
        themeId: themeId,
      };
      next();
    });
    
    try {
      require('../hosting/routes/index')(app);
    } catch (error) {
      console.log(chalk.red(`Error loading routes: ${error.message}`));
    }

    app.use(express.static(fullLocalPath, { index: false }));
    try {
      const server = app.listen(port, () => {
        log(chalk.green(`\nLocal Tanqory theme server running at:`));
        log(chalk.blue.bold(`  http://localhost:${port}`));
        log(chalk.gray(`\nServing files from: ${fullLocalPath}`));
      }).on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
              error(`Port ${port} is already in use.`);
          } else {
              error(`Failed to start local server: ${err.message}`);
          }
          throw err;
      });

      return server;
    } catch (err) {
      error(`Failed to start local server: ${err.message}`);
      throw err;
    }
  }

  async uploadFile(themeId, filePath, fileContent) {
    // await api.uploadFile(this.storeName, themeId, filePath, fileContent);
  }
  
  // Helper function เพื่ออ่านไฟล์ทั้งหมดในโฟลเดอร์
  async getFiles(dir) {
    let files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(await this.getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }
}

module.exports = new ThemeKit();