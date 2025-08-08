// const { getSiteData } = require("@tanqory/editor-utilitys");
// const { SiteModel } = require("../services/models.service");
// const { getPageData } = require("../services/page.service");
// const { default: axios } = require("axios");

exports.getSearchResults = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // const pageName = 'search.json';
        // const seo = {
        //     title: `Search | ${settings.general.store_name}`,
        //     description: 'Search ' + settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // const { data: response } = await axios.get(`${process.env.URL_API_SITES}/api/v1/sites/${siteId}/products?search=${req.query.q}&next=${req.query.next || ""}&previous=${req.query.previous || ""}&limit=6`);
        
        // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // const urlNext = new URL(fullUrl);
        // urlNext.searchParams.set('next', response.paging.next);
        // urlNext.searchParams.delete('previous');

        // const urlPrevious = new URL(fullUrl);
        // urlPrevious.searchParams.set('previous', response.paging.previous);
        // urlPrevious.searchParams.delete('next');

        // const pageHtml = await getPageData({ 
        //     template: pageName, 
        //     siteId, themeId, 
        //     country, language, 
        //     settings, 
        //     seo, 
        //     data, 
        //     editing: req.editing,
        //     search: {
        //         products: response.items,
        //         paging: {
        //             next: response.paging.next ? urlNext.toString() : null,
        //             previous: response.paging.previous ? urlPrevious.toString() : null,
        //         },
        //     }
        // });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};