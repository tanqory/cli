#!/usr/bin/env node

const { Command } = require('commander');
const { log } = require('./lib/utils');

const program = new Command();

program
  .name('tanqory')
  .description('A command-line interface for Tanqory theme development.')
  .version('1.0.0');

// --- นำเข้าและกำหนดคำสั่งย่อย ---
const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const newCommand = require('./commands/new');
const pushCommand = require('./commands/push');
const pullCommand = require('./commands/pull');
const serveCommand = require('./commands/serve');
const devCommand = require('./commands/dev');

program.command('login')
  .description(loginCommand.description)
  .action(async () => {
    await loginCommand.execute();
  });

program.command('logout')
  .description(logoutCommand.description)
  .action(async () => {
    await logoutCommand.execute();
  });

const themeCommand = program.command('theme')
  .description('Manage Tanqory themes.');

themeCommand.command('new [name]')
  .description(newCommand.description)
  .option('-p, --path <path>', 'Path where the new theme project will be created.', '.')
  .action(async (name, options) => {
    await newCommand.execute(name, options.path);
  });

themeCommand.command('push [themeId]')
  .description(pushCommand.description)
  .option('-p, --path <path>', 'Path to the local theme directory.', '.')
  .action(async (themeId, options) => {
    await pushCommand.execute(themeId, options.path);
  });

themeCommand.command('pull [themeId]')
  .description(pullCommand.description)
  .option('-p, --path <path>', 'Path where the theme files will be saved.', '.')
  .action(async (themeId, options) => {
    await pullCommand.execute(themeId, options.path);
  });

themeCommand.command('serve [themeId]')
  .description(serveCommand.description)
  .option('-p, --path <path>', 'Path to the local theme directory.', '.')
  .option('-P, --port <port>', 'Port for the local development server.', '9292')
  .action(async (themeId, options) => {
    await serveCommand.execute(themeId, options.path, options.port);
  });

themeCommand.command('dev [themeId]')
  .description(devCommand.description)
  .option('-p, --path <path>', 'Path to the local theme directory to watch.', '.')
  .option('-P, --port <port>', 'Port for the local development server.', '9292')
  .action(async (themeId, options) => {
    await devCommand.execute(themeId, options.path, options.port);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}