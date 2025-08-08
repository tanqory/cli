(function (global) {
    'use strict';
    // กำหนด URL ของ API ตะกร้า ตามที่ mount ใน Express (เช่น app.use('/cart', cartRoutes))
    const tanqoryEnv = {"URL_API_EDITOR":"https://api-editor-staging.tanqory.com","URL_STORAGE":"https://storage-staging.tanqory.com","URL_HOSTING":"https://mytanqory-staging.com","URL_API_ANALYTICS":"https://api-analytics-staging.tanqory.com","EFS_PATH":"/mnt/storage/file-system","WHITELIST":["https://manage-staging.tanqory.com"],"SITE_ID":"67a4274918ed4bb247c0f1cd"};
    const CART_ENDPOINT = '/api/v1/cart';
    const ANALYTICS_ENDPOINT = '/api/v1/sites'

    // ฟังก์ชันสำหรับจัดการ error response
    function errorMessageHandle(response) {
      if (!response.ok) {
        return response.json().then(function (err) {
          const errorMsg = err.message || 'เกิดข้อผิดพลาด';
          throw new Error(errorMsg);
        });
      }
      return response.json();
    }

    /**
     * ดึงข้อมูลตะกร้า (GET)
     * ไม่ต้องระบุ site เนื่องจากระบบจะตรวจสอบจาก domain
     *
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function getCart() {
      return fetch(`${CART_ENDPOINT}`, {
        method: 'GET',
        credentials: 'include' // ส่ง cookies (เช่น cartId) ไปด้วย
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error fetching cart:', error);
          throw error;
        });
    }
  
    /**
     * เพิ่มสินค้าเข้าตะกร้า (POST)
     * รับ object ที่ประกอบด้วย productId และ quantity เท่านั้น
     *
     * @param {object} params - ข้อมูลสำหรับเพิ่มสินค้า { productId, quantity }
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function addToCart(params, options) {
      // ส่งเพียง productId และ quantity โดยไม่รวม site
      const lang = options?.lang ? "/" + options.lang : "";
      return fetch(`${lang}${CART_ENDPOINT}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error adding to cart:', error);
          throw error;
        });
    }
    function buyNow(params, options) {
      // ส่งเพียง productId และ quantity โดยไม่รวม site
      const lang = options?.lang ? "/" + options.lang : "";
      return fetch(`${lang}${CART_ENDPOINT}/buynow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error adding to cart:', error);
          throw error;
        });
    }
  
    /**
     * อัปเดตจำนวนสินค้าในตะกร้า (PUT)
     * รับ object ที่ประกอบด้วย productId และ quantity เท่านั้น
     *
     * @param {object} params - ข้อมูลสำหรับอัปเดตสินค้า { productId, quantity }
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function updateCartItem(params) {
      const { productId, quantity } = params;
      return fetch(`${CART_ENDPOINT}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity })
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error updating cart item:', error);
          throw error;
        });
    }
  
    /**
     * ลบสินค้าออกจากตะกร้า (DELETE)
     * รับ object ที่ประกอบด้วย productId เท่านั้น
     *
     * @param {object} params - ข้อมูลสำหรับลบสินค้า { productId }
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function removeCartItem(params) {
      const { productId, options } = params;
      return fetch(`${CART_ENDPOINT}/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, options })
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error removing cart item:', error);
          throw error;
        });
    }
  
    /**
     * ล้างตะกร้าทั้งหมด (DELETE)
     * ไม่ต้องส่งข้อมูลเพิ่มเติมใด ๆ
     *
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function clearCart() {
      return fetch(`${CART_ENDPOINT}/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}) // ส่ง body เปล่าไปยัง server
      })
        .then(errorMessageHandle)
        .catch(function (error) {
          console.log('Error clearing cart:', error);
          throw error;
        });
    }
  

    /**
     * ล้างตะกร้าทั้งหมด (DELETE)
     * ไม่ต้องส่งข้อมูลเพิ่มเติมใด ๆ
     *
     * @returns {Promise} - Promise ที่คืนค่า JSON response
     */
    function analyticsTrack(payload) {

      if (!document.cookie.includes("session_id")) {
        const sid = "sess_" + Date.now();
        document.cookie = `session_id=${sid}; path=/; max-age=86400`;
      }

      // 1. ดึง userAgent โดยตรง
      const userAgent = navigator.userAgent;

      // 2. สร้างฟังก์ชันวิเคราะห์ browser จาก userAgent
      function detectBrowser(ua) {
        if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
        if (ua.includes("Edg")) return "Edge";
        if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
        return "Unknown";
      }

      // 3. วิเคราะห์ OS จาก userAgent
      function detectOS(ua) {
        if (ua.includes("Win")) return "Windows";
        if (ua.includes("Mac")) return "MacOS";
        if (ua.includes("Linux")) return "Linux";
        if (ua.includes("Android")) return "Android";
        if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
        return "Unknown";
      }

      // 4. ตรวจประเภทอุปกรณ์ (desktop / mobile / tablet)
      function detectDeviceType(ua) {
        if (/Mobi|Android/i.test(ua)) return "mobile";
        if (/Tablet|iPad/i.test(ua)) return "tablet";
        return "desktop";
      }

      // 5. รวมข้อมูล
      const deviceInfo = {
        type: detectDeviceType(userAgent),
        browser: detectBrowser(userAgent),
        os: detectOS(userAgent),
        userAgent
      };

      const origin = window.location.origin;
      const path = window.location.pathname;
      const query = window.location.search

      const sessionId = document.cookie.match(/session_id=([^;]+)/)?.[1];
      return fetch(`${tanqoryEnv.URL_API_ANALYTICS}${ANALYTICS_ENDPOINT}/${tanqoryEnv.SITE_ID}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
        body: JSON.stringify({
          ...(payload || {}),
          session_id: sessionId,
          device_info: deviceInfo,
          referrer: origin,
          entry_page: `${path}${query}`,
        })
      })
        .then(res => res.json())
        .catch(error => console.log(error.message))
    }

    function storage(value) {
        if(value.startsWith("http")) {
            return value;
        } 
        return `${tanqoryEnv.URL_STORAGE}/${value}`
    }
    // Expose ฟังก์ชันทั้งหมดผ่าน global object "tanqory"
    global.tanqoryEnv = tanqoryEnv;
    global.tanqory = {
      cart: {
        buyNow: buyNow,
        getCart: getCart,
        addToCart: addToCart,
        updateCartItem: updateCartItem,
        removeCartItem: removeCartItem,
        clearCart: clearCart
      },
      analytics: {
        track: analyticsTrack,
      },
      storage,
    };
  
  })(this);