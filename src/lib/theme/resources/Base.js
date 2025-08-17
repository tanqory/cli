// src/lib/config.js

const path = require('path');
const fs = require("fs");


function extractBlock(blockString) {
    const modelMatch = blockString.match(/{% block model %}([\s\S]*?){% endblock %}/);
    if (modelMatch) {
        const modelString = modelMatch[1].trim();
        try {
            const cleanedTemplate = blockString.replace(/{% block model %}([\s\S]*?){% endblock %}/, '').trim();
            const model = JSON.parse(modelString); // พาร์สเป็น JSON
            return {
                template: cleanedTemplate,
                model: model,
            };
        } catch (error) {
            return null;
        }
    } else {
        return {
          template: blockString,
          model: {}
        };
    }
}

class Base {
  constructor(resourceName) {
    this.resourceName = resourceName;
  }

  async files() {
    const files = await fs.promises.readdir(this.srcDir);
    return files;
  }
  
  async content(fileName) {
    const data = await fs.promises.readFile(path.join(this.srcDir, fileName), { encoding: "utf8" });
    if(this.type === "json") {
      try {
        return JSON.parse(data);
      } catch (error) {
        return {};
      }
    } else if(this.type === "tanq") {
      try {
        return extractBlock(data);
      } catch (error) {
        return {};
      }
    }
    return data;
  }
}

module.exports = Base;