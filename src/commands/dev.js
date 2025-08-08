// src/commands/dev.js
const themeKit = require('../lib/theme-kit');
const config = require('../lib/config');
const { error, success, log, loadProjectConfig } = require('../lib/utils');
const path = require('path');
const chokidar = require('chokidar');
const inquirer = require('inquirer');
const fs = require('fs-extra');

const description = `Start a local development server with live reloading and automatic file upload.`;

async function execute(themeIdFromCli, localPath, port) {
  let themeId = themeIdFromCli;
  let storeName = null;
  const fullLocalPath = path.resolve(localPath);

  // const accessToken = config.get('accessToken');
  // if (!accessToken) {
  //   error('You are not logged in. Please run `tanqory login` first.');
  //   process.exit(1);
  // }
  
  try {
    const projectConfig = await loadProjectConfig(fullLocalPath);
    if (projectConfig.themeId) {
      themeId = projectConfig.themeId;
      log(`Using Theme ID from project config: ${themeId}`);
    }
    
    if (!themeId) {
      error('No Theme ID provided. Please specify a Theme ID or run `tanqory theme push` first.');
      process.exit(1);
    }

    if (projectConfig.storeName) {
      storeName = projectConfig.storeName;
      log(`Using Store ID from project config: ${storeName}`);
    }
    
    if (!storeName) {
      error('No Store ID provided. Please specify a Store ID or run `tanqory store push` first.');
      process.exit(1);
    }
    
    // Start local server
    await themeKit.serveTheme(storeName, themeId, fullLocalPath, port);
    success(`Serving store ${storeName} and theme ${themeId} on port ${port}`);
    
    // Start watching files
    // log(`\nWatching for file changes in: ${fullLocalPath}`);
    // const watcher = chokidar.watch(fullLocalPath, {
    //   ignored: /(^|[\/\\])\../, // ignore dotfiles
    //   persistent: true
    // });
    
    // watcher.on('change', async (filePath) => {
    //   // const relativePath = path.relative(fullLocalPath, filePath);
    //   // log(`File changed: ${relativePath}. Uploading...`);
    //   // try {
    //   //   const fileContent = await fs.readFile(filePath, 'utf8');
    //   //   await themeKit.uploadFile(themeId, relativePath, fileContent);
    //   //   success(`Successfully uploaded: ${relativePath}`);
    //   // } catch (err) {
    //   //   error(`Failed to upload ${relativePath}: ${err.message}`);
    //   // }
    // });

  } catch (err) {
    process.exit(1);
  }
}

module.exports = {
  description,
  execute,
};