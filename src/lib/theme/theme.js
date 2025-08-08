// src/lib/theme/theme.js
const { setupNunjucks } = require('./nunjucks');
const Block = require('./resources/Block');
const Component = require('./resources/Component');
const Layout = require('./resources/Layout');
const Page = require('./resources/Page');
const Theme = require('./resources/Themes');

class ThemeManager {
  constructor({ projectPath, siteId, themeId }) {
    this.siteId = siteId;
    this.themeId = themeId;
    this.projectPath = projectPath;
    this.block = new Block({ projectPath, siteId, themeId });
    this.component = new Component({ projectPath, siteId, themeId });
    this.layout = new Layout({ projectPath, siteId, themeId });
    this.page = new Page({ projectPath, siteId, themeId });
    this.theme = new Theme({ projectPath, siteId, themeId });
  }
  async pageHtml(pageName) {
    let components = {};
    const componentFiles = await this.component.files();
    for(let i = 0; i < componentFiles.length; i++) {
      const componentName = componentFiles[i];
      const componentConent = await this.component.content(componentName);
      components[componentName.split(".")[0]] = componentConent;
    }

    const envNunjucks = setupNunjucks({
      siteId: this.siteId, 
      themeId: this.themeId, 
      lang: "en", 
      country: "US",
      components,
      placeholders: {},
    });

    const page = await this.page.content(pageName);
    const header = await this.page.content("header.json");
    const footer = await this.page.content("footer.json");
    const headerHtml = await this.page.renderPageHtml(header.blocks, envNunjucks);
    const pageHtml = await this.page.renderPageHtml(page.blocks, envNunjucks);
    const footerHtml = await this.page.renderPageHtml(footer.blocks, envNunjucks);

    const stylesheetHtml = "";
    const scriptHtml = "";

    const mainTemplate = `
        {% extends "layouts/main.tanq" %}
        
        {% block head %}
        ${stylesheetHtml}
        {% endblock %}

        {% block header %}
        ${headerHtml}
        {% endblock %}

        {% block content %}
        ${pageHtml}
        {% endblock %}

        {% block footer %}
        ${footerHtml}
        {% endblock %}

        {% block script %}
        ${scriptHtml}
        {% endblock %}
    `;
    const html = envNunjucks.renderString(mainTemplate, {
        props: {},
        store: {},
        form: {},
    })
    return html;
  }
}

module.exports = ThemeManager;