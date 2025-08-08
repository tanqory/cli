const { getPageJson, getPageTemplate, getLayoutTemplate, getIframe } = require('@tanqory/editor-utilitys');
const { getTheme } = require('@tanqory/editor-utilitys/src/services/theme-fs.service');

async function getPageData({ template, html, siteId, themeId, country, language, settings, data, seo, collection, product, blog, post, page: pageData, collections, policy, editing, search }) {
    try {
        const header = await getPageJson(siteId, themeId, "header.json");
        const page = template ? await getPageJson(siteId, themeId, template) : null;
        const footer = await getPageJson(siteId, themeId, "footer.json");
        const theme = await getTheme(siteId, themeId);
        seo.favicon = theme.root.favicon?.[0];
        
        const options = { 
            language, 
            data,
            country, 
            props: { 
                ...settings, 
                ...theme.root,
                seo,
            },
            collection,
            product,
            blog,
            post,
            collections,
            page: pageData,
            policy: policy,
            template: template,
            search,
        };

        if(editing) {
            const layout = await getIframe(siteId, themeId, options);
            return layout;
        } else {
            const htmlHeader = await getPageTemplate(siteId, themeId, header, options);
            const htmlPage = template ? (await getPageTemplate(siteId, themeId, page, options)) : (html|| "");
            const htmlFooter = await getPageTemplate(siteId, themeId, footer, options);
            const layout = await getLayoutTemplate(siteId, themeId, { 
                header: htmlHeader,
                page: htmlPage,
                footer: htmlFooter,
                script: "",
                stylesheet: "",
            }, options);
            return layout;
        }
    } catch (error) {
        return error.message
    }
    
}

module.exports = {
    getPageData,
};