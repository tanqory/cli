// src/lib/utils.js
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  log: console.log,
  error: (msg) => console.error(chalk.red(`Error: ${msg}`)),
  success: (msg) => console.log(chalk.green(`Success: ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`Warning: ${msg}`)),
  spinner: (text) => ora({ text, spinner: 'dots' }),

  saveProjectConfig: async (projectPath, themeId, storeName) => {
    const configDir = path.join(projectPath, '.tanqory');
    const configFilePath = path.join(configDir, 'config');
    try {
      await fs.ensureDir(configDir);
      await fs.writeJson(configFilePath, {
        themeId: themeId,
        storeName: storeName
      }, { spaces: 2 });
      console.log(chalk.gray(`Theme config saved to ${configFilePath}`))
    } catch (err) {
      console.error(`Failed to save theme config to ${configFilePath}: ${err.message}`)
      throw err;
    }
  },

  loadProjectConfig: async (projectPath) => {
    const configFilePath = path.join(projectPath, '.tanqory', 'config');
    try {
      if (fs.existsSync(configFilePath)) {
        const config = await fs.readJson(configFilePath);
        return {
          themeId: config.themeId || null,
          storeName: config.storeName || null
        };
      }
    } catch (err) {
      console.error(`Failed to read theme config from ${configFilePath}: ${err.message}`)
    }
    return { themeId: null, storeName: null };
  }
};