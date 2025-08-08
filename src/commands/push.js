// src/commands/push.js
const themeKit = require('../lib/theme-kit');
const config = require('../lib/config');
const { error, success, log, loadProjectConfig, saveProjectConfig } = require('../lib/utils');
const path = require('path');
const inquirer = require('inquirer');

const description = `Push local theme files to your Tanqory store.`;

async function execute(themeIdFromCli, localPath) {
  let themeId = themeIdFromCli;
  const fullLocalPath = path.resolve(localPath);
  let storeName = null;

  // const accessToken = config.get('accessToken');
  // if (!accessToken) {
  //   error('You are not logged in. Please run `tanqory login` first.');
  //   process.exit(1);
  // }
  
  try {
    const projectConfig = await loadProjectConfig(fullLocalPath);
    if (projectConfig.themeId) {
      themeId = projectConfig.themeId;
      storeName = projectConfig.storeName;
      log(`Using Theme ID from project config: ${themeId}`);
    }
  
    if (!themeId) {
      const { inputThemeId } = await inquirer.prompt([
          {
              type: 'input',
              name: 'inputThemeId',
              message: 'Enter the Theme ID you want to push to:',
              validate: (input) => input.length > 0 || 'Theme ID cannot be empty.'
          }
      ]);
      themeId = inputThemeId;
      log(`Pushing to Theme ID: ${themeId}`);
    }
  
    if (!storeName) {
      storeName = config.get('storeName');
    }

    await themeKit.pushTheme(themeId, fullLocalPath, storeName);
    // await saveProjectConfig(fullLocalPath, themeId, storeName);
    success(`Theme ${themeId} pushed successfully from ${fullLocalPath}!`);

  } catch (err) {
    process.exit(1);
  }
}

module.exports = {
  description,
  execute,
};