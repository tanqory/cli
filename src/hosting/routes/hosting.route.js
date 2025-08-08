const express = require("express");
const router = express.Router();

const { getAllBlogs, getBlogBySlug, getPostBySlug } = require("../controllers/blog.controller");
const { getAssetContent, getCdnContent } = require("../controllers/cdn.controller");
const { getAllCollections, getCollectionBySlug } = require("../controllers/collection.controller");
const { getNotFound } = require("../controllers/notfound.controller");
const { getHome, getAllPages, getPageBySlug } = require("../controllers/page.controller");
const { getRefund } = require("../controllers/policies.controller");
const { getAllProducts, getProductBySlug } = require("../controllers/product.controller");
const { getSearchResults } = require("../controllers/search.controller");
const { auth } = require("../middlewares/auth.middleware");

// Pages
router.get("/", auth, getHome);
router.get("/pages", auth, getAllPages);
router.get("/pages/:pageSlug", auth, getPageBySlug);

// Blogs
router.get("/blogs", auth, getAllBlogs);
router.get("/blogs/:blogSlug", auth, getBlogBySlug);
router.get("/blogs/:blogSlug/:postSlug", auth, getPostBySlug);

// Collections
router.get("/collections", auth, getAllCollections);
router.get("/collections/:collectionSlug", auth, getCollectionBySlug);

// Products
router.get("/products", auth, getAllProducts);
router.get("/products/:productSlug", auth, getProductBySlug);

// Search
router.get("/search", auth, getSearchResults);

// Policies
router.get("/policies/:policy", auth, getRefund);

// Assets
router.get("/cdn/*segment", auth, getCdnContent);
router.get("/assets/*segment", auth, getAssetContent);

// 404
router.get("/*segment", auth, getNotFound);

module.exports = router;