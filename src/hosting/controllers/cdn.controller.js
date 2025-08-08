const { default: axios } = require("axios");
const path = require("path");

exports.getAssetContent = async function (req, res) {
    try {
        const assetRoot = path.join(process.cwd(), 'assets'); // root folder
        let segment = req.params.segment || ''; // "images/logo.png"

        if(typeof segment == "object") {
            segment = segment.join("/")
        }
        
        // ป้องกัน path traversal
        const requestedPath = path.normalize(segment).replace(/^(\.\.(\/|\\|$))+/, '');
        const fullPath = path.join(assetRoot, requestedPath);

        res.sendFile(fullPath);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};

exports.getCdnContent = async function (req, res) {
    try {
        if(req.params.segment.join("/") === "assets/js/tanqory.js") {
            const url = `https://${req.site.siteId}.mytanqory-staging.com/en/cdn/assets/js/tanqory.js`;
            const response = await axios.get(url);
            res.set('Content-Type', 'application/javascript');
            res.send(response.data);
        } else {
            res.status(404).send({ error: "file not found." })
        }
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
};