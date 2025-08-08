// src/lib/config.js
const path = require('path');
const Base = require('./Base');
const Block = require('./Block');
const client = require('../../../hosting/services/tanqory/client');

/**
 * ค้นหา key ทั้งหมดจาก schema ของ block model
 */
function extractFieldTypesFromModel(id, model, prefix) {
  let keys = {};
  for (let field in model.fields) {
    const key = prefix
      ? `${id}.${prefix}.${model.type}.props.${field}`
      : `${id}.props.${field}`;
    keys[key] = model.fields[field].type;
  }

  if (model.components) {
    for (let component in model.components) {
      const nestedKeys = extractFieldTypesFromModel(id, model.components[component], 'components');
      keys = { ...keys, ...nestedKeys };
    }
  }

  return keys;
}

/**
 * ดึง key และ value ของ props ออกมาจากข้อมูลหน้าเพจ (blocks)
 */
function extractKeysFromPageData(data, type, prefix) {
  let keys = [];

  for (let item of data) {
    for (let propKey in item.props) {
      const key = type && prefix
        ? `${type}.components.${item.type}.props.${propKey}`
        : `${item.type}.props.${propKey}`;

      keys.push({ key, value: item.props[propKey] });
    }

    if (item.components) {
      const nestedKeys = extractKeysFromPageData(
        Object.values(item.components),
        item.type,
        'components'
      );
      keys = [...keys, ...nestedKeys];
    }
  }

  return keys;
}

/**
 * จับคู่ key ที่ได้จากหน้ากับ schema model เพื่อตรวจสอบชนิดข้อมูล
 */
async function matchPageKeysWithModel(blocks, projectPath, siteId, themeId) {
  const pageKeys = extractKeysFromPageData(blocks);
  let schemaKeys = {};

  for (const block of blocks) {
    const blockService = new Block({ projectPath, siteId, themeId });
    const blockContent = await blockService.content(`${block.type}.tanq`);
    const blockSchemaKeys = extractFieldTypesFromModel(block.type, blockContent.model);
    schemaKeys = { ...schemaKeys, ...blockSchemaKeys };
  }

  const result = {};
  for (const { key, value } of pageKeys) {
    const type = schemaKeys[key];
    if (type) {
      if (!result[type]) result[type] = [];
      if (!result[type].includes(value)) result[type].push(value);
    }
  }

  return result;
}

function modelToProps(model) {
  for(let key in model.fields) {

  }
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

  /**
   * สร้าง HTML ของเพจจาก block ทั้งหมด
   */
  async renderPageHtml(blocks, envNunjucks) {
    let resolvedKeys = await matchPageKeysWithModel(blocks, this.projectPath, this.siteId, this.themeId);
    const { collection, product } = client;

    if (resolvedKeys.collection) {
      let collections = await Promise.all(
        resolvedKeys.collection.map(id => collection.find(id))
      );
      for(let i = 0; i < collections.length; i++) {
        collections[i].products = await Promise.all(collections[i].tqr_customer_product_collection_conditions.map(pid => product.find(pid)))
      }
      resolvedKeys.collection = collections;
    }

    if (resolvedKeys.product) {
      const products = await Promise.all(
        resolvedKeys.product.map(id => product.find(id))
      );
      resolvedKeys.product = products;
    }
    console.log(resolvedKeys)
    
    const htmlBlocks = [];
    for (const block of blocks) {
      if (block.type) {
        const blockService = new Block({ projectPath: this.projectPath, siteId: this.siteId, themeId: this.themeId });
        const blockContent = await blockService.content(`${block.type}.tanq`);
        console.log({
            props: block.props,
            components: block.componentOrder ? block.componentOrder.map(cmid => block.components[cmid]) : null
          })
        const html = await envNunjucks.renderString(blockContent.template, {
          block: {
            props: block.props,
            components: block.componentOrder ? block.componentOrder.map(cmid => block.components[cmid]) : null
          }
        });
        htmlBlocks.push(html);
      }
    }

    return htmlBlocks.join('');
  }
}

module.exports = Page;