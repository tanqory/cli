// src/lib/config.js
const path = require('path');
const Base = require('./Base');

class Component extends Base {
  constructor({ projectPath }) {
    super('component');
    this.srcDir = path.join(projectPath, 'components');
    this.type = "tanq";
  }
}

module.exports = Component;