// const { getSiteData } = require("@tanqory/editor-utilitys");
// const { SiteModel } = require("../services/models.service");
// const { getPageData } = require("../services/page.service");

exports.getAllCollections = async function (req, res) {
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
        //     image: post.image[0],
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

exports.getCollectionBySlug = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const collectionSlug = req.params.collectionSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // let collection = data.collections.find(p => p.url === collectionSlug);
        // const products = collection.conditions.map(productId => {
        //     const product = data.products.find(p => p._id === productId);
        //     return product;
        // }).filter(p => p);
        // let template = "collection.json";
        // if(!collection.theme_template || collection.theme_template === "default_collection") {
        //     template = "collection.json";
        // } else {
        //     template = collection.theme_template + ".json";
        // }
        // collection.products = products;

        // const seo = {
        //     title: `${collection.page_title} | ${settings.general.store_name}`,
        //     description: collection.description || settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: collection.image[0],
        //     favicon: ""
        // }

        // const pageHtml = await getPageData({ template, siteId, themeId, country, language, settings, seo, data, collection, editing: req.editing });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};