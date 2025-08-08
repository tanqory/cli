// src/commands/login.js
const inquirer = require('inquirer');
const open = require('open').default;
const config = require('../lib/config');
const api = require('../lib/api');
const { log, error, success, spinner } = require('../lib/utils');
const chalk = require('chalk');

const description = `Log in to your Tanqory account via device authorization flow.`;

async function execute() {
  const currentToken = config.get('accessToken');
  if (currentToken) {
    log('You are already logged in.');
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to log out and log in with a new account?',
        default: false,
      },
    ]);
    if (!overwrite) {
      return;
    }
    config.delete('accessToken');
    config.delete('refreshToken');
    config.delete('storeName');
    log('Existing credentials cleared. Proceeding to new login.');
  }

  // --- ขั้นตอนที่ 1: ล็อกอินเพื่อรับ Token ---
  let deviceCodeData;
  const initSpinner = spinner('Initiating device authorization...').start();
  let tokenData;

  try {
    deviceCodeData = await api.initiateDeviceAuth();
    initSpinner.succeed('Device authorization initiated!');

    const {
      device_code,
      user_code,
      verification_uri_complete,
      expires_in,
      interval
    } = deviceCodeData;

    log(chalk.bold('\nTo complete login, please visit this URL in your browser:'));
    log(chalk.blue.underline(verification_uri_complete));
    log(`\nAnd enter the following code: ${chalk.yellow.bold(user_code)}\n`);
    log(chalk.gray(`This code will expire in ${expires_in / 60} minutes.`));

    log('Opening browser automatically...');
    try {
        await open(verification_uri_complete);
    } catch (openErr) {
        log(chalk.yellow(`Could not open browser automatically. Please open the URL manually.`));
    }

    const pollSpinner = spinner('Waiting for device authorization in browser...').start();
    const startTime = Date.now();

    while (true) {
      if (Date.now() - startTime > expires_in * 1000) {
        pollSpinner.fail('Device authorization expired.');
        error('Please run "tanqory login" again to restart the process.');
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, interval * 1000));

      try {
        tokenData = await api.pollDeviceAuth(device_code);
        if (tokenData && tokenData.access_token) {
          config.set('accessToken', tokenData.access_token);
          if (tokenData.refresh_token) {
            config.set('refreshToken', tokenData.refresh_token);
          }
          config.set('accessTokenExpiresAt', Date.now() + (tokenData.access_token_expires * 1000));
          pollSpinner.succeed(`Successfully logged in! Your API Access Token has been saved.`);
          break;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          const errorCode = err.response.data.error;
          if (errorCode === 'authorization_pending' || errorCode === 'slow_down') {
            continue;
          }
        }
        pollSpinner.fail('Login failed during polling.');
        error(err.message);
        process.exit(1);
      }
    }
  } catch (err) {
    initSpinner.fail('Login process failed to initiate.');
    error(err.message);
    process.exit(1);
  }

  // // --- ขั้นตอนที่ 2: ดึงและเลือกไซต์ ---
  // const siteSpinner = spinner('Fetching available sites...').start();
  // let sites;
  // try {
  //     sites = await api.getSites();
  //     siteSpinner.succeed('Sites fetched successfully!');
  // } catch (err) {
  //     siteSpinner.fail('Failed to fetch sites.');
  //     error(err.message);
  //     process.exit(1);
  // }

  // if (!sites || sites.length === 0) {
  //     log(chalk.yellow('No sites found for this account.'));
  //     success('Login complete.');
  //     return;
  // }
  
  // const siteChoices = sites.filter(site => site.site_status).map(site => ({
  //     name: `${site._id} (${site.name})`,
  //     value: site._id
  // }));

  // const { selectedStoreName } = await inquirer.prompt([
  //     {
  //         type: 'list',
  //         name: 'selectedStoreName',
  //         message: 'Select a site to use:',
  //         choices: siteChoices,
  //     },
  // ]);

  // config.set('storeName', selectedStoreName);
  // success(`Successfully selected store: ${chalk.green.bold(selectedStoreName)}!`);
}

module.exports = {
  description,
  execute,
};