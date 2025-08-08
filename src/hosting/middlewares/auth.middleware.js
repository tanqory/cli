// const { loadThemeProjectConfig } = require("../../lib/utils");

const { loadProjectConfig } = require("../../lib/utils");

async function auth(req, res, next) {
  try {
    // const themeConfig = await loadProjectConfig(req.fullLocalPath);
    // console.log(themeConfig)
    // if (!themeConfig || !themeConfig.themeId) {
    //   return res.status(401).send({ error: "Theme ID not found. Please run 'tanqory theme pull <theme-id>' or specify the ID: 'tanqory theme dev <theme-id>'" });
    // }
    // req.site = {
    //   siteId: themeConfig.siteId || null,
    //   themeId: themeConfig.themeId,
    // }
    // console.log("Auth Middleware Triggered", req.fullLocalPath);
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = {
  auth,
};
