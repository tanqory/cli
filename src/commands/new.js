const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const { log, success, error, spinner, saveProjectConfig } = require('../lib/utils');
const config = require('../lib/config');
const api = require('../lib/api');
const themeKit = require('../lib/theme-kit');
const chalk = require('chalk');

const description = `Create a new Tanqory theme project from an existing theme.`;

async function execute(name, directoryPath) {
  await config.ensureLoaded();

  const accessToken = config.get('accessToken');
  if (!accessToken) {
    error('You are not logged in. Please run `tanqory login` first.');
    process.exit(1);
  }

  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for your new theme:',
        validate: (input) => input.length > 0 || 'Theme name cannot be empty.'
      }
    ]);
    name = answers.name;
  }

  const projectPath = path.join(process.cwd(), directoryPath, name);

  if (fs.existsSync(projectPath)) {
    error(`Directory '${projectPath}' already exists. Please choose a different name or path.`);
    process.exit(1);
  }
  
  // --- ขั้นตอนที่ 1: เลือก Store ---
  const sitesSpinner = spinner('Fetching available sites...').start();
  let sites;
  try {
      sites = await api.getSites();
      sitesSpinner.succeed('Sites fetched successfully!');
  } catch (err) {
      sitesSpinner.fail('Failed to fetch sites.');
      error(err.message);
      process.exit(1);
  }

  if (!sites || sites.length === 0) {
      log(chalk.yellow('No sites found for this account.'));
      process.exit(1);
  }
  
  const siteChoices = sites.filter(site => site.site_status).map(site => ({
      name: `${site.name} (${site._id})`,
      value: site._id
  }));

  const { selectedStoreName } = await inquirer.prompt([
      {
          type: 'list',
          name: 'selectedStoreName',
          message: 'Select a site to connect to:',
          choices: siteChoices,
      },
  ]);

  // --- ขั้นตอนที่ 2: เลือก Theme ---
  const themesSpinner = spinner('Creating themes for selected site...').start();
  const selectedThemeId = await api.createTheme(selectedStoreName).then((response) => {
    themesSpinner.succeed('Theme created successfully!');
    const selectedThemeId = response.instanceId;
    log(`Created new theme with ID: ${selectedThemeId}`);
    return selectedThemeId;
  }).catch((err) => {
    themesSpinner.fail('Failed to create theme.');
    error(err.message);
    process.exit(1);
  });
  // ]);

  // --- ขั้นตอนที่ 3: ดึงโค้ดและสร้างโปรเจกต์ ---
  log(chalk.gray(`\nCreating new theme project '${name}'...`));
  try {
      await fs.ensureDir(projectPath);
      await themeKit.pullTheme(selectedThemeId, projectPath, selectedStoreName);
      await saveProjectConfig(projectPath, selectedThemeId, selectedStoreName);

      success(`Theme '${name}' created successfully!`);
      log(`\nTo get started, navigate into the directory and run:`);
      log(chalk.yellow(`  cd ${name}`));
      log(chalk.yellow(`  tanqory theme dev`));

  } catch (err) {
      error(`Failed to create theme: ${err.message}`);
      process.exit(1);
  }
}

module.exports = {
  description,
  execute,
};