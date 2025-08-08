// const { getSiteData } = require("@tanqory/editor-utilitys");

// const { SiteModel } = require("../services/models.service");
// const { getPageData } = require("../services/page.service");

exports.getAllProducts = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // // const productSlug = req.params.productSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // let template = "collection-list.json";
        // const seo = {
        //     title: `Collections | ${settings.general.store_name}`,
        //     description: `Collections ${settings.general.store_name}`,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template, siteId, themeId, country, language, settings, seo, data, collections: data.collections, editing: req.editing });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getProductBySlug = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const productSlug = req.params.productSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // const product = data.products.find(p => p.tqr_customer_product_url_handle === productSlug);
        // let template = "product.json";
        // if(!product.tqr_customer_product_theme_templates || product.tqr_customer_product_theme_templates === "default_product") {
        //     template = "product.json";
        // } else {
        //     template = product.tqr_customer_product_theme_templates + ".json";
        // }
        // const seo = {
        //     title: `${product.tqr_customer_product_page_title} | ${settings.general.store_name}`,
        //     description: product.tqr_customer_product_meta_description || settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template, siteId, themeId, country, language, settings, seo, data, product, editing: req.editing });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};