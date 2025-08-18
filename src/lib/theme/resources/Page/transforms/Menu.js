// src/lib/theme/resources/Page/transforms/Menu.js

const client = require('../../../../../hosting/services/tanqory/client');

async function resolveMenuHrefs(items) {
  let { page, blog, post } = client;

  let pageCache = {};
  let blogCache = {};
  let postCache = {};

  let clone = Array.isArray(items) ? [...items] : [];

  for (let i = 0; i < clone.length; i++) {
    let current = clone[i];
    let href = current?.href;

    if (typeof href === 'object' && href?.value) {
      const value = href.value;

      if (value.startsWith('/home')) {
        current.href = '/';
      } else if (value.startsWith('pages/')) {
        const pageId = value.split('/')[1];
        if (!pageCache[pageId]) {
          pageCache[pageId] = await page.getPage(pageId);
        }
        current.href = `/pages/${pageCache[pageId]?.tqr_customer_sales_channels_pages_add_url}`;
      } else if (value.startsWith('blogs/')) {
        const blogId = value.split('/')[1];
        if (!blogCache[blogId]) {
          blogCache[blogId] = await blog.getBlogPost(blogId);
        }
        current.href = `/blogs/${blogCache[blogId]?.tqr_customer_sales_channels_blog_manage_url}`;
      } else if (value.startsWith('posts/')) {
        const postId = value.split('/')[1];
        if (!postCache[postId]) {
          postCache[postId] = await post.getPost(postId);
        }
        // เดิมไม่ได้ตั้งค่า href ให้ posts; เติมให้สอดคล้องโครงสร้าง
        current.href = `/posts/${postCache[postId]?.tqr_customer_sales_channels_blog_post_manage_url || postId}`;
      } else if (value === 'products') {
        current.href = '/collections';
      } else {
        current.href = value;
      }
    }

    if (current.children?.length) {
        clone[i] = {
            title: current.name,
            url: current.href,
            items: await resolveMenuHrefs(current.children),
        };
    } else {
        clone[i] = {
            title: current.name,
            url: current.href,
        };
    }
  }

  return clone;
}

async function transformMenu({ value }) {
  if(value) {
    const { menu } = client;
    const data = await menu.getMenu(value);
    if(data) {
        if(data.tqr_customer_sales_channels_navigation_add_menu_items?.length) {
            const response = await resolveMenuHrefs(data.tqr_customer_sales_channels_navigation_add_menu_items);
            return {
                id: data?._id || value,
                title: data?.tqr_customer_sales_channels_navigation_add_title || '',
                items: response,
            }
        } else {
            console.log("data", data)
            return {
                id: data?._id || value,
                title: data?.tqr_customer_sales_channels_navigation_add_title || '',
            }
        }
    }
  }
  return [];
}

module.exports = {
    transformMenu
};