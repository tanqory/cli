// src/lib/theme/resources/Page/transforms/Collection.js
const client = require('../../../../../hosting/services/tanqory/client');

async function transformCollection({ value }) {
  if(value) {
    const { collection, product } = client;
    const data = await collection.find(value);

    // Transform keys
    const keys = {
        "id": "_id",
        "title": "tqr_customer_product_collection_title",
        "description": "tqr_customer_product_collection_description",
        "conditions": "tqr_customer_product_collection_conditions",
        "products_match": "tqr_customer_product_collection_create_products_match",
        "page_title": "tqr_customer_product_collection_page_title",
        "meta_description": "tqr_customer_product_collection_meta_description",
        "url": "tqr_customer_product_collection_url",
        "sales_channels": "tqr_customer_product_collection_sales_channels",
        "image": "tqr_customer_product_collection_image",
        "theme_template": "tqr_customer_product_collection_theme_template",
        "created_at": "created_at"
    };
    const reponse = {};
    for(const i in keys) {
        reponse[i] = data[keys[i]];
    }

    // Transform product
    if(reponse.conditions) {
      let products = []
      for(let i = 0; i < reponse.conditions.length; i++) {
        let p = await product.find(reponse.conditions[i]);
        if(p) {
          products.push(p)
        }
      }
      reponse.products = products;
    }
    return reponse;
  }
  return null;
}

module.exports = {
    transformCollection
};