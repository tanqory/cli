const fs = require("fs");
const path = require("path");
const EFS_PATH = process.env.EFS_PATH;
const { setupNunjucks, mapData } = require('../cdn/nunjuck/nunjuck');
const placeholders = require('../assets/placeholder');
const { tanqoryEnv } = require('../config/env');
const { logsMessage } = require("./log");

// Pages
async function getPages(siteId, themeId) {
    const srcDir = path.join(process.cwd(), 'pages');
    const files = await fs.promises.readdir(srcDir);
    return files;
}
async function getPage(siteId, themeId, name) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/pages/${name}`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return JSON.parse(data);
}
async function savePage(siteId, themeId, name, json) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/pages/${name}`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    const pageData = data ? JSON.parse(data) : {};
    const newPage = { blocks: json };
    await fs.promises.writeFile(srcDir, JSON.stringify(newPage));
    return newPage
}
function sanitizeFileName(name) {
    // แปลงเป็นพิมพ์เล็ก, แทนที่ช่องว่างด้วย -, อักขระที่ไม่ใช่ a-z0-9.- เป็น _
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.-]/g, '_');
}

function getUniqueFileName(siteId, themeId, name, templateType) {
    let sanitized = `${templateType}.${sanitizeFileName(name)}.json`;
    let counter = 1;
    while (fs.existsSync(`${EFS_PATH}/sites/${siteId}/themes/${themeId}/pages/${sanitized}`)) {
        sanitized = `${templateType}.${sanitizeFileName(name)}-${counter}.json`;
        counter++;
    }
    return sanitized;
}

function copyFileWithAutoRename(siteId, themeId, template, name) {
    const templates = template.split('.');
    const templateType = templates.length === 3 ? templates[1] : templates[0];
    const destFileName = getUniqueFileName(siteId, themeId, name, templateType);
    fs.copyFileSync(
        `${EFS_PATH}/sites/${siteId}/themes/${themeId}/pages/${template}.json`, 
        `${EFS_PATH}/sites/${siteId}/themes/${themeId}/pages/${destFileName}`
    );
    return { name: destFileName, type: templateType};
}

// Locales
async function getLocales(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/locales`;
    const files = await fs.promises.readdir(srcDir);
    return files;
}
async function getLocale(siteId, themeId, name) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/locales/${name}`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return JSON.parse(data);
}

// Layouts
async function getLayout(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/layouts/main.njk`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return data;
}

// Blocks
async function getBlocks(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/blocks`;
    const files = await fs.promises.readdir(srcDir);
    return files;
}
async function getBlock(siteId, themeId, name) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/blocks/${name}`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return data;
}
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
        return null;
    }
}
async function getAllBlockTemplate(siteId, themeId) {
    let blockTemplates = [];
    const blocks = await getBlocks(siteId, themeId);
    for(let i = 0; i < blocks.length; i++) {
        const blockName = blocks[i];
        const blockString = await getBlock(siteId, themeId, blockName);
        const blockTemplate = extractBlock(blockString);
        blockTemplates.push(blockTemplate);
    }
    return blockTemplates.filter(b => b && b.model && b.template);
}
async function getPreviewBlock(siteId, themeId, blockType, exampleProps) {
    const componentTemplates = [];
    const components = await getComponents(siteId, themeId);
    const settings = await getTheme(siteId, themeId);
    for(let i = 0; i < components.length; i++) {
        const componentName = components[i];
        const componentString = await getComponent(siteId, themeId, componentName);
        componentTemplates.push([componentName.replace(".njk",""), componentString]);
    }
    const envNunjucks = setupNunjucks({
        siteId: siteId, 
        themeId: themeId, 
        lang: 'EN', 
        country: "USA",
        components: Object.fromEntries(componentTemplates),
        tanqoryEnv,
        placeholders,
    });
    const blockString = await getBlock(siteId, themeId, `${blockType}.njk`)
    const blockTemplate = extractBlock(blockString);
    if(exampleProps) {
        const html = envNunjucks.renderString(`${blockTemplate.template}`, {
            block: exampleProps,
            props: settings.root
        });
        return html;
    }
    let props = {}
    let blockComponents = [];
    for(var i in blockTemplate.model.fields) {
        if(blockTemplate.model.fields[i].defaultValue != undefined) {
            props[i] = blockTemplate.model.fields[i].defaultValue;
        }
    }
    if(blockTemplate.model.defaultComponents) {
        for(let i = 0; i < blockTemplate.model.defaultComponents.length; i++) {
            const componetType = blockTemplate.model.defaultComponents[i].type;
            const component = blockTemplate.model.components?.find(c => c.type === componetType);
            if(component) {
                let componentProps = {}
                for(let j in component.fields) {
                    if(component.fields[j].defaultValue != undefined) {
                        componentProps[j] = component.fields[j].defaultValue;
                    }
                }
                blockComponents.push({
                    type: component.type,
                    props: componentProps
                })
            }
        }
    }
    const html = envNunjucks.renderString(`${blockTemplate.template}`, {
        block: {
            components: blockComponents,
            props,
        },
        props: settings.root
    });
    const cleanedHtml = html.replace(/(<[^>]*data-w-id="[^"]+"[^>]*)\sstyle="opacity:0"/g, '$1');
    return cleanedHtml;
}

// Components
async function getComponents(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/components`;
    const files = await fs.promises.readdir(srcDir);
    return files;
}
async function getComponent(siteId, themeId, name) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/components/${name}`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return data;
}

// Themes
async function getTheme(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/themes/theme.json`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return JSON.parse(data);
}
async function getThemeConfigs(siteId, themeId) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/themes/theme.setting.json`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    return JSON.parse(data);
}
async function saveThemeConfig(siteId, themeId, json) {
    const srcDir = `${EFS_PATH}/sites/${siteId}/themes/${themeId}/themes/theme.json`;
    const data = await fs.promises.readFile(srcDir, { encoding: "utf8" });
    const configData = JSON.parse(data);
    const newConfig = { ...configData, root: json };
    await fs.promises.writeFile(srcDir, JSON.stringify(newConfig));
    return newConfig
}

async function copyFolder(source, destination) {
    try {
      // สร้างโฟลเดอร์ปลายทางถ้ายังไม่มี
      await fs.promises.mkdir(destination, { recursive: true });
  
      // อ่านรายการไฟล์และโฟลเดอร์ในโฟลเดอร์ต้นทาง
      const items = await fs.promises.readdir(source, { withFileTypes: true });
  
      // วนลูปผ่านแต่ละรายการ
      for (const item of items) {
        const srcPath = path.join(source, item.name);
        const destPath = path.join(destination, item.name);
  
        if (item.isDirectory()) {
          // ถ้าเป็นโฟลเดอร์ ให้เรียกฟังก์ชันนี้ซ้ำ (recursive)
          await copyFolder(srcPath, destPath);
        } else {
          // ถ้าเป็นไฟล์ ให้คัดลอก
          await fs.promises.copyFile(srcPath, destPath);
        }
      }
    } catch (err) {
        logsMessage("ERROR", "copyFolder()", err);
    }
  }

async function removeFolder(folderPath) {
    try {
      await fs.promises.rm(folderPath, { recursive: true, force: true });
    } catch (err) {
      logsMessage("ERROR", `removeFolder():${folderPath}`, err);
    }
}

async function createSite(siteId, instanceId) {
    try {
        await fs.promises.mkdir(`${EFS_PATH}/sites/${siteId}`);
        await fs.promises.mkdir(`${EFS_PATH}/sites/${siteId}/themes`);
        const data = {
            "id": siteId,
            "preview": instanceId,
            "theme": instanceId,
            "lang":"en"
        }
        await fs.promises.writeFile(`${EFS_PATH}/sites/${siteId}/settings.json`, JSON.stringify(data))
    } catch (err) {
        logsMessage("ERROR", `createSite()`, err);
    }
}
async function createTheme(siteId, instanceId, themeSlug) {
    try {
        const sourceFolder = `${EFS_PATH}/store/themes/${themeSlug}`;
        const destinationFolder = `${EFS_PATH}/sites/${siteId}/themes/${instanceId}`;
        await fs.promises.mkdir(destinationFolder);
        await copyFolder(sourceFolder, destinationFolder);
    } catch (err) {
        logsMessage("ERROR", `createTheme()`, err);
    }
}
async function udateTheme(siteId, instanceId, themeSlug) {
    try {
        const sourceFolder = `${EFS_PATH}/store/themes/${themeSlug}`;
        const destinationFolder = `${EFS_PATH}/sites/${siteId}/themes/${instanceId}`;
        await copyFolder(sourceFolder, destinationFolder, ['theme.json', 'pages']);
    } catch (err) {
        logsMessage("ERROR", `udateTheme()`, err);
    }
}
  
async function removeTheme(siteId, instanceId) {
    try {
        const destinationFolder = `${EFS_PATH}/sites/${siteId}/themes/${instanceId}`;
        await removeFolder(destinationFolder)
    } catch (err) {
        logsMessage("ERROR", `removeTheme()`, err);
    }
}

async function duplicateTheme(siteId, sourceInstanceId, destInstanceId) {
    try {
        const sourceFolder = `${EFS_PATH}/sites/${siteId}/themes/${sourceInstanceId}`;
        const destinationFolder = `${EFS_PATH}/sites/${siteId}/themes/${destInstanceId}`;
        await fs.promises.mkdir(destinationFolder);
        await copyFolder(sourceFolder, destinationFolder);
    } catch (err) {
        logsMessage("ERROR", `duplicateTheme()`, err);
    }
}

async function setPreviewTheme(siteId, instanceId) {
    try {
        const source = `${EFS_PATH}/sites/${siteId}/settings.json`;
        let data = await fs.promises.readFile(source, { encoding: "utf8" });
        if(data) {
            data = {
                ...JSON.parse(data),
                view: instanceId,
            }
        } else {
            data = {
                "id": siteId,
                "preview": instanceId,
                "theme": instanceId,
                "lang": "en"
            }
        }
        await fs.promises.writeFile(source, JSON.stringify(data))
    } catch (err) {
        logsMessage("ERROR", `setPreviewTheme()`, err);
    }
}

async function setPrimaryTheme(siteId, instanceId) {
    try {
        const source = `${EFS_PATH}/sites/${siteId}/settings.json`;
        let data = await fs.promises.readFile(source, { encoding: "utf8" });
        if(data) {
            data = {
                ...JSON.parse(data),
                theme: instanceId,
            }
        } else {
            data = {
                "id": siteId,
                "preview": instanceId,
                "theme": instanceId,
                "lang": "en"
            }
        }
        await fs.promises.writeFile(source, JSON.stringify(data))
    } catch (err) {
        logsMessage("ERROR", `setPrimaryTheme()`, err);
    }
}

async function screenshotTheme(url) {
    try {
        console.log('Scrennshort completed!');
    } catch (err) {
        console.error('Error during copy:', err);
    }
}

  

module.exports = {
    getPages,
    getPage,
    savePage,
    getLocales,
    getLocale,
    getLayout,
    getBlocks,
    getBlock,
    extractBlock,
    getPreviewBlock,
    getComponents,
    getComponent,
    getTheme,
    getThemeConfigs,
    saveThemeConfig,
    getAllBlockTemplate,
    copyFileWithAutoRename,
    createSite,
    createTheme,
    udateTheme,
    removeTheme,
    duplicateTheme,
    setPreviewTheme,
    setPrimaryTheme,
    screenshotTheme,
};
