// src/lib/config.js
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const configDir = path.join(os.homedir(), '.tanqory-cli');
const configFile = path.join(configDir, 'config.json');

class Config {
  constructor() {
    this.data = {};
    // สร้าง Promise เพื่อติดตามสถานะการโหลด
    this.isLoaded = false;
    this.loadPromise = this.load();
  }

  async load() {
    try {
      await fs.ensureDir(configDir);
      if (await fs.pathExists(configFile)) {
        this.data = await fs.readJson(configFile);
      } else {
        this.data = {};
      }
    } catch (error) {
      this.data = {};
    } finally {
      this.isLoaded = true;
    }
  }

  async ensureLoaded() {
    // ให้ทุกส่วนของโปรแกรมที่เรียกใช้ config ต้องรอจนกว่า loadPromise จะเสร็จสิ้น
    if (!this.isLoaded) {
      await this.loadPromise;
    }
  }

  async save() {
    await this.ensureLoaded();
    await fs.ensureDir(configDir);
    await fs.writeJson(configFile, this.data, { spaces: 2 });
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save().catch(err => {
      console.error(chalk.red('Failed to save global config:'), err.message);
    });
  }

  delete(key) {
    delete this.data[key];
    this.save().catch(err => {
      console.error(chalk.red('Failed to save global config after deletion:'), err.message);
    });
  }
}

module.exports = new Config();