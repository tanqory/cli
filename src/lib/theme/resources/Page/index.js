// src/lib/config.js
const path = require('path');
const Base = require('../Base');
const Block = require('../Block');
const { transformImage } = require('./transforms/Image');
const { transformMenu } = require('./transforms/Menu');
const { transformCollection } = require('./transforms/Collection');

async function transformData(params, modelComponent = null, projectPath, siteId, themeId) {
  const blockService = new Block({ projectPath, siteId, themeId });
  for(let i = 0; i < params.length; i++) {
    let block = params[i];
    let blockContent = {};

    if(modelComponent) {
        blockContent = {
            model: modelComponent.find(c => c.type === block.type),
            template: ""
        };
    } else {
        blockContent = await blockService.content(`${block.type}.tanq`);
    }
    
    for(let field in block.props) {
      const model = blockContent.model.fields[field];
      if(model && model.type) {
        const options = {
          value: block.props[field],
          projectPath, 
          siteId, 
          themeId
        }
        if(model.type === "image") {
          block.props[field] = await transformImage(options);
        } else if(model.type === "menu") {
          block.props[field] = await transformMenu(options);
        } else if(model.type === "collection") {
          block.props[field] = await transformCollection(options);
        } else {
        //   console.log(" |- ⚪️ :", model.type)
        }
      }
      block.template = blockContent.template;
    }
    if(block.componentOrder && block.components) {
        const components = JSON.parse(JSON.stringify(block.components));
        block.components = await transformData(
            block.componentOrder.map(componentId => components[componentId]),
            blockContent.model.components, 
            projectPath, 
            siteId, 
            themeId
        )
    }
  }
  return params;
}

class Page extends Base {
  constructor({ projectPath, siteId, themeId }) {
    super('page');
    this.projectPath = projectPath;
    this.srcDir = path.join(projectPath, 'pages');
    this.type = 'json';
    this.siteId = siteId;
    this.themeId = themeId;
  }

  async renderPageHtml(blocks, envNunjucks) {
    let data = await transformData(
      blocks,
      null,
      this.projectPath,
      this.siteId,
      this.themeId
    )
    const htmlBlocks = [];
    for (const block of data) {
      if (!block.type) continue;
      const html = await envNunjucks.renderString(block.template, {
        block: {
          props: block.props,
          components: block.components,
        },
      });
      htmlBlocks.push(html);
    }
    return htmlBlocks.join('');
  }
}

module.exports = Page;