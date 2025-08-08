const { getSiteData, getTheme, getIframe } = require("@tanqory/editor-utilitys");
const { SiteModel } = require("./models.service");

exports.iframe = async function (req, res) {
    try {
        const siteId = req.site.siteId;
        const themeId = req.site.themeId;
        const country = req.country;
        const language = req.language;
        const settings = req.settings;
        const data = await SiteModel(getSiteData(siteId, country?.country_code));
        const theme = await getTheme(siteId, themeId);
        const options = {
            data,
            props: { 
                ...settings, 
                ...theme.root
            },
            store: {
                languages: settings.languages,
                markets: settings.markets,
                markets_rules: settings.markets_rules,
                country: country,
                language: language
            }
        };
        const layout = await getIframe(siteId, themeId, options);
        res.send(layout);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};