// src/lib/config.js
const path = require('path');
const Base = require('./Base');

class Layout extends Base {
  constructor({ projectPath, siteId, themeId }) {
    super('layout');
    this.srcDir = path.join(projectPath, 'layouts');
    this.type = "tanq";
    this.siteId = siteId;
    this.themeId = themeId;
  }
}

module.exports = Layout;