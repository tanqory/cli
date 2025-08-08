// const { getSiteData } = require("@tanqory/editor-utilitys");

// const { SiteModel } = require("../services/models.service");
// const { getPageData } = require("../services/page.service");

exports.getRefund = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const policy = req.params.policy;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        
        // let content = ``;
        // let title = '';
        // if (policy === "refund") {
        //     title = "Return and refund policy";
        //     content = data.policies.tqr_customer_settings_policy_refund;
        // } else if (policy === "privacy") {
        //     title = "Privacy policy";
        //     content = data.policies.tqr_customer_settings_policy_privacy;
        // } else if (policy === "terms") {
        //     title = "Terms of service";
        //     content = data.policies.tqr_customer_settings_policy_terms;
        // } else if (policy === "shipping") {
        //     title = "Terms of service";
        //     content = data.policies.tqr_customer_settings_policy_shipping;
        // } else if (policy === "contact") {
        //     title = "Contact information";
        //     content = data.policies.tqr_customer_settings_policy_contact;
        // }
        // const seo = {
        //     title: `${title} | ${settings.general.store_name}`,
        //     description: settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: "",
        //     favicon: ""
        // }
        // let pageName = 'policy.json'
        // const pageHtml = await getPageData({ template: pageName, siteId, themeId, country, language, settings, policy: { title, content }, seo , data, editing: req.editing  });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};