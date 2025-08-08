// src/lib/config.js
const path = require('path');
const Base = require('./Base');

class Theme extends Base {
  constructor({ projectPath }) {
    super('theme');
    this.srcDir = path.join(projectPath, 'themes');
    this.type = "json";
  }
}

module.exports = Theme;