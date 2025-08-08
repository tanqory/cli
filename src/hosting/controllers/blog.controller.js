// const { getSiteData } = require('@tanqory/editor-utilitys');

// const { SiteModel } = require('../services/models.service');
// const { getPageData } = require('../services/page.service');

exports.getAllBlogs = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const country = req.country;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // res.send({ blogs: data.blogs });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getBlogBySlug = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const blogSlug = req.params.blogSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // let blog = data.blogs.find(b => b.url === blogSlug);
        // const pageName = blog.theme_template === "blog" ? `blog.json` : `blog.${blog.theme_template}.json`;
        // const posts = data.posts.filter(post => post.blog === blog.id?.toString());
        // blog.posts = posts;
        // const seo = {
        //     title: `${blog.page_title} | ${settings.general.store_name}`,
        //     description: blog.description || settings.general.store_name,
        //     image: "",
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template: pageName, siteId, themeId, country, language, settings, seo, data, blog, editing: req.editing  });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getPostBySlug = async function (req, res) {
    try {
        res.send({});
        // const siteId = req.site.siteId;
        // const themeId = req.site.themeId;
        // const country = req.country;
        // const language = req.language;
        // const settings = req.settings;
        // const blogSlug = req.params.blogSlug;
        // const postSlug = req.params.postSlug;
        // const data = await SiteModel(getSiteData(siteId, country?.country_code));
        // const blog = data.blogs.find(p => p.url === blogSlug);
        // const post = data.posts.find(p => p.url === postSlug && p.blog == blog.id?.toString());
        // const pageName = post.theme_template === "post" ? `post.json` : `post.${post.theme_template}.json`;
        // const seo = {
        //     title: `${post.page_title} | ${settings.general.store_name}`,
        //     description: post.description || settings.general.store_name,
        //     content_url: `${settings.protocol}://${settings.hostname}`,
        //     image: post.image[0],
        //     favicon: ""
        // }
        // const pageHtml = await getPageData({ template: pageName, siteId, themeId, country, language, settings, seo, data, post, editing: req.editing });
        // res.send(pageHtml);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};