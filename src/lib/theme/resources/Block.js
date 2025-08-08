// src/lib/config.js
const path = require('path');
const Base = require('./Base');

class Block extends Base {
  constructor({ projectPath }) {
    super('block');
    this.srcDir = path.join(projectPath, 'blocks');
    this.type = "tanq";
  }
}

module.exports = Block;