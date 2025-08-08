// src/commands/logout.js
const config = require('../lib/config');
const { log, success } = require('../lib/utils');
const inquirer = require('inquirer');

const description = `Log out from your Tanqory account.`;

async function execute() {
  const currentToken = config.get('accessToken');

  if (!currentToken && !config.get('refreshToken')) {
    log('You are not currently logged in.');
    return;
  }

  const { confirmLogout } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmLogout',
      message: 'Are you sure you want to log out?',
      default: true,
    },
  ]);

  if (confirmLogout) {
    config.delete('accessToken');
    config.delete('refreshToken');
    config.delete('storeName');
    success('Successfully logged out from Tanqory. Your credentials have been removed.');
  } else {
    log('Logout cancelled.');
  }
}

module.exports = {
  description,
  execute,
};