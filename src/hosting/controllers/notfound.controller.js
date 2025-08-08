// const { getSiteData } = require("@tanqory/editor-utilitys");
// const { SiteModel } = require("../services/models.service");
// const { getPageData } = require("../services/page.service");

exports.getNotFound = async function (req, res) {
    try {
        res.send({ error: "Page not found" });
        // console.log("getNotFound [PATH]", req.path);
        // console.log("getNotFound [URL]", req.url);
        // console.log("getNotFound [originalUrl]", req.originalUrl);
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // let pageName = "404.json"
        // const seo = {
        //     title: `${settings.general.store_name}`,
        //     description: settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template: pageName, siteId, themeId, country, language, settings, seo, data, editing: req.editing  });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};