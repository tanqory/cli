const { SiteFormConfig } = require("@tanqory/site-utils");

const Form = require('../../src/models/document-form-site.models');
const File = require('../../src/models/form-file.models');


exports.SiteModel = function (callback) {
    return callback({ Form, File }, SiteFormConfig);
};