// const { getSiteData } = require('@tanqory/editor-utilitys');

const ThemeManager = require("../../lib/theme/theme");
const client = require("../services/tanqory/client");

// const { SiteModel } = require('../services/models.service');
// const { getPageData } = require('../services/page.service');
// const tanqory = require('../../lib/tanqory');


exports.getHome = async function (req, res) {
    try {
        // const products = client.product;
        // const p = await products.all();
        
        
        // console.log("getHome      [PATH]", req.path);
        // console.log("getHome      [URL]", req.url);
        // console.log("getHome      [originalUrl]", req.originalUrl);
        const siteId = req.site.siteId;
        const themeId = req.site.themeId;
        const country = req.country;
        const language = req.language;
        // const settings = req.settings;
        
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));

        // const seo = {
        //     title: `Home | ${settings.general.store_name}`,
        //     description: settings.general.store_name,
        //     image: "",
        //     favicon: ""
        // }

        const theme = new ThemeManager({ projectPath: process.cwd(), siteId, themeId });
        const pageHtml = await theme.pageHtml("index.json");
        res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getAllPages = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const country = req.country;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // res.send({ pages: data.pages });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getPageBySlug = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const slug = req.params.pageSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // const page = data.pages?.find(p => p.url === slug);
        // let pageName;
        // if(page.theme_template === "page") {
        //     pageName = `page.json`;
        // } else {
        //     pageName = `page.${page.theme_template}.json`;
        // }
        // const seo = {
        //     title: `${page.page_title} | ${settings.general.store_name}`,
        //     description: page.description || settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template: pageName, siteId, themeId, country, language, settings, page, seo, data, editing: req.editing  });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};