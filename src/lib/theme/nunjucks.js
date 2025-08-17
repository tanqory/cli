const nunjucks = require('nunjucks');

const tanqoryEnv = {
    URL_API_EDITOR: "http://localhost:3002",
    URL_STORAGE: "https://storage.tanqory.com",
    URL_HOSTING: "http://localhost:3003",
    URL_API_ANALYTICS: "https://api-analytics.tanqory.com",
    EFS_PATH: process.cwd(),
    WHITELIST: ["http://localhost:8082"]
}

class RenderForm {
    constructor() {
        this.tags = ['form', 'endform'];
    }

    parse(parser, nodes) {
        const token = parser.nextToken();
        if (token.value === 'form') {
            // เริ่มต้นการสร้างบล็อก
            const args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(token.value);

            // สร้างโหนดสำหรับ form
            return new nodes.CallExtension(this, 'renderForm', args);
        } else if (token.value === 'endform') {
            parser.advanceAfterBlockEnd(token.value);

            // สร้างโหนดสำหรับ endform
            return new nodes.CallExtension(this, 'renderEndForm');
        }
    }

    renderForm(context, ...args) {
        const action = args[0];
        const options = args[1];
        // if(action === "localization") {
        //     return `
        //     <script>
        //         document.addEventListener('DOMContentLoaded', function () {
        //             const list = document.querySelector('#${options.id} ul');
        //             const input = document.querySelector('#${options.id} #country_code');

        //             list.addEventListener('click', async function (event) {
        //                 const item = event.target.closest('li');
        //                 if (item && item.dataset.value) {
        //                     input.value = item.dataset.value; // อัปเดตค่าของ input

        //                     // ✅ ใช้ fetch() ส่งข้อมูลไปที่ API
        //                     try {
        //                         let response = await fetch('/api/sites/localization', {
        //                             method: 'POST',
        //                             headers: {
        //                                 'Content-Type': 'application/json'
        //                             },
        //                             body: JSON.stringify({ country_code: input.value })
        //                         });

        //                         if (response.ok) {
        //                             console.log('Country updated successfully!');
        //                             setTimeout(() => location.reload(), 500);
        //                         } else {
        //                             console.error('Error updating country');
        //                         }
        //                     } catch (error) {
        //                         console.error('Fetch error:', error);
        //                     }
        //                 }
        //             });
        //         });
        //     </script>
        //     <form action="/api/sites/localization" method="POST" id="${options.id}" class="${options.class}">`;
        // }
        // if(action === "languages") {
        //     return `
        //     <script>
        //         document.addEventListener('DOMContentLoaded', function () {
        //             const list = document.querySelector('#${options.id} ul');
        //             const input = document.querySelector('#${options.id} #lang');

        //             list.addEventListener('click', async function (event) {
        //                 const item = event.target.closest('li');
        //                 if (item && item.dataset.value) {
        //                     input.value = item.dataset.value; // อัปเดตค่าของ input

        //                     // ✅ ใช้ fetch() ส่งข้อมูลไปที่ API
        //                     try {
        //                         let response = await fetch('/api/languages', {
        //                             method: 'POST',
        //                             headers: {
        //                                 'Content-Type': 'application/json'
        //                             },
        //                             body: JSON.stringify({ lang: input.value })
        //                         });

        //                         if (response.ok) {
        //                             console.log('Country updated successfully!');
        //                             setTimeout(() => location.reload(), 500);
        //                         } else {
        //                             console.error('Error updating country');
        //                         }
        //                     } catch (error) {
        //                         console.error('Fetch error:', error);
        //                     }
        //                 }
        //             });
        //         });
        //     </script>
        //     <form action="/api/languages" method="POST" id="${options.id}" class="${options.class}">`;
        // }
        if(action === "contact") {
            return `<form action="/contact" method="POST" id="${options.id}">`;
        }
        if(action === "subscribe") {
            return `<form action="/subscribe" method="POST" id="${options.id}">`;
        }
        if(action === "search") {
            return `<form action="/search" method="GET" id="${options.id}" class="${options.class || ""}">`;
        }
        if(action === "product") {
            return `<form action="/product" method="POST" id="${options.id}">`;
        }
        return `<form action="${action}" method="POST">`;
    }

    renderEndForm() {
        return `</form>`;
    }
}

const setupNunjucks = ({ siteId, themeId, lang, components, placeholders, hostname, protocol }) => {
    const envNunjucks = nunjucks.configure(tanqoryEnv.EFS_PATH, {
        noCache: true,
        autoescape: false,
        throwOnUndefined: false,
        watch: true,
    });
    envNunjucks.addFilter("storage", function (value) {
        if(value) {
            if(typeof value == 'string' && value.startsWith('images')) {
                if(hostname) {
                    return `${protocol}://${hostname}/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
                }
                const url = tanqoryEnv.URL_HOSTING;
                if(url.includes('https')) {
                    return `https://${siteId}.${url.replace("https://", "")}/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
                }
                return `http://${siteId}.${url.replace("http://", "")}/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
            }
            if(value.includes("https://")) {
                return value;
            }
            return `${tanqoryEnv.URL_STORAGE}/${value}`;
        };
        return "";
    });
    envNunjucks.addFilter("assets", function (value) {
        if(hostname) {
            return `${protocol}://${hostname}/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
        }
        const url = tanqoryEnv.URL_HOSTING;
        if(url.includes('https')) {
            return `/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
        }
        return `/assets/${value}${themeId ? '?themeId=' + themeId : ''}`;
    });
    envNunjucks.addFilter("cdn", function (value) {
        if(hostname) {
            return `${protocol}://${hostname}/cdn/${value}`;
        }
        const url = tanqoryEnv.URL_HOSTING;
        if(url.includes('https')) {
            return `/cdn/${value}`;
        }
        return `/cdn/${value}`;
    });
    envNunjucks.addFilter("stylesheet", function (value) {
        return new nunjucks.runtime.SafeString(
            `<link rel="stylesheet" href="${value}">`
        );
    });
    envNunjucks.addFilter('hexToRgb', function(hex) {
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
            return 'Invalid HEX'; // ตรวจสอบความถูกต้อง
        }
        
        // ลบเครื่องหมาย # ออกจากค่า HEX
        let cleanHex = hex.slice(1);
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(char => char + char).join('');
        }
        
        // แปลง HEX เป็น RGB
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return `${r}, ${g}, ${b}`;
    });
    envNunjucks.addFilter('selectLanguage', function(languages, lang) {
        try {
            const language = languages?.find(lg => lg.code === lang);
            if(language) {
                const languageDefault = languages.find(lg => lg.primary);
                const data = language || languageDefault;
                return data;
            } else {
                return "";
            }
        } catch(error) {
            console.log("ERROR", "selectLanguage()", error.message);
            return "";
        }
    });
    envNunjucks.addFilter('selectMarket', function(markets, country) {
        try {
            const market = markets?.find(m => m.country_code === country.country_code);
            if(market) {
                const marketDefault = markets.find(m => m.primary);
                const data = market || marketDefault;
                return data;
            } else {
                return "";
            }
        } catch(error) {
            console.log("ERROR", "selectMarket()", error.message);
            return "";
        }
    });
    envNunjucks.addFilter('limit', function(data, limit) {
        try {
            if(!data) {
                const arr = new Array(limit).fill(null);
                return arr;
            }
            if(data.length && limit) {
                return data.slice(0, limit);
            }
            return data;
        } catch (error) {
            console.log("ERROR", "limit()", error.message);
            return data;
        }
    });
    envNunjucks.addFilter('select', (array, key) => {
        if (!Array.isArray(array)) return [];
        return array.map(item => item[key]);
    });
    envNunjucks.addFilter('max', (array) => {
        if (!Array.isArray(array)) return 0;
        return Math.max(...array);
    });
    envNunjucks.addFilter('min', (array) => {
        if (!Array.isArray(array)) return 0;
        return Math.min(...array);
    });
    envNunjucks.addFilter('videoId', (value) => {
        if(value && value.includes("youtube.com")) {
            const match = value.match(/[?&]v=([^&]+)/);
            return match ? match[1] : '';
        } else {
            return '';
        }
    });
    envNunjucks.addFilter('link', (value) => {
        // let enpont = ""
        // if(value == '/home') {
        //     value = ""
        // }
        // if(tanqoryEnv.URL_HOSTING.includes("http://")) {
        //     enpont = tanqoryEnv.URL_HOSTING.replace("http://", `http://${siteId}.`)
        // } else {
        //     enpont = tanqoryEnv.URL_HOSTING.replace("https://", `https://${siteId}.`)
        // }
        // if(lang) {
        //     if(lang.code) {
        //         if(hostname) {
        //             return `${protocol}://${hostname}/${lang.code}${value}`;
        //         }
        //         return `${enpont}/${lang.code}${value}`;
        //     } else {
        //         if(hostname) {
        //             return `${protocol}://${hostname}${value}`;
        //         }
        //         return `${enpont}${value}`;
        //     }
        // }
        // if(hostname) {
        //     return `${protocol}://${hostname}${value}}`;
        // }
        return `${value}`;
    });
    envNunjucks.addFilter('image_placeholder', (value) => {
        return new nunjucks.runtime.SafeString(placeholders[value] || placeholders['default']);
    });
    envNunjucks.addFilter('merge', (value, newvalue) => {
        return { ...(value || {}), ...(newvalue || {}) };
    });
    envNunjucks.addFilter('renderString', (editerTemplate, options) => {
        return envNunjucks.renderString(editerTemplate, options);
    });
    envNunjucks.addFilter('image', function(data, options) {
        try {
            if(!data) {
                if(options.placholder_url) {
                    `<img class="${options.class || ""}" src="${options.placholder_url}" />`
                }
                if(!options.placholder) {
                    return ""
                }
                return new nunjucks.runtime.SafeString(
                    `<div class="${options.class || ""}">${placeholders[options.placholder] || placeholders['default']}</div>`
                );
            } else {
                return new nunjucks.runtime.SafeString(
                    `<img class="${options.class || ""}" src="${tanqoryEnv.URL_STORAGE}/${data}" />`
                );
            }
            
        } catch (error) {
            return error.message;
        }
    });
    envNunjucks.addFilter('content', function(data, limit) {
        try {
            if(typeof data !== 'string') {
                return ""
            }
            if(limit) {
                return data
                    .replace(/<[^>]*>/g, '')
                    .slice(0, limit)
            }
            const transformed = data
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '</br>')
                .replace(/<h1/g, '<span class="text-4xl"')
                .replace(/<\/h1>/g, '</span></br>')
                .replace(/<h2/g, '<span class="text-3xl"')
                .replace(/<\/h2>/g, '</span></br>')
                .replace(/<h3/g, '<span class="text-2xl"')
                .replace(/<\/h3>/g, '</span></br>')
                .replace(/<h4/g, '<span class="text-xl"')
                .replace(/<\/h4>/g, '</span></br>')
                .replace(/<h5/g, '<span class="text-lg"')
                .replace(/<\/h5>/g, '</span></br>')
                .replace(/<h6/g, '<span class="text-base"')
                .replace(/<\/h6>/g, '</span></br>')
            return new nunjucks.runtime.SafeString(transformed);
        } catch (error) {
            return error.message;
        }
    });
    envNunjucks.addFilter('date', function(dateString, format = 'dd/mm/yyyy') {
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return 'Invalid date';

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return format
                .replace('dd', day)
                .replace('mm', month)
                .replace('yyyy', year);
        } catch (error) {
            return error.message;
        }
    });
    envNunjucks.addFilter('json', function(dataObject) {
        try {
            return new nunjucks.runtime.SafeString(dataObject ? JSON.stringify(dataObject, null, 2) : '');
        } catch (error) {
            return error.message;
        }
    });


    envNunjucks.addExtension("RenderForm",new RenderForm());
    envNunjucks.addExtension("RenderExtension",new RenderExtension(components));

    function RenderExtension(components) {
        this.tags = ['render'];
      
        this.parse = function (parser, nodes) {
            // The first node is the sum node.
            // With nextToken we "jump over" sum node to 5,6
            const sumNode = parser.nextToken();
      
            // Nujucks parser offers a methode parseSignature which helps to parse arguments of a tag
            // 5 and 6 are now parsed as argumen nodes.
            const argNodes = parser.parseSignature(null, true);
      
            // We say to the parser that he can move to the end of the line to parse next things.
            parser.advanceAfterBlockEnd(sumNode.value);
      
            // The CallExtension method on the nodes is a helper which compiles
            // the argument nodes. The second argument is the name of the method to
            // pass the compiled code.
            return new nodes.CallExtension(this, 'run', argNodes, []);
        };
      
        this.run = function (environment, leftOperand, rightOperand) {
            try {
                const html = nunjucks.renderString(components[leftOperand], rightOperand);
                return new nunjucks.runtime.SafeString(`${html}`);
            } catch (error) {
                return new nunjucks.runtime.SafeString(`<div>${error.message}</div>`);
            }
        };
    }
    
    return envNunjucks;
};

function mapData(content, block, _data, exampleProducts) {
    try {
        if(!content) {
            console.log("WANING", "mapData()", "No content");
            return content;
        }
        let data = { ..._data };
        for(let blockId in block.model?.fields) {
            let field = block.model.fields[blockId];
            if(field?.type === "collection") {
                if(content?.props?.[field.id]) {
                    let collection = data?.collections.find(i => i.id === content.props[field.id]);
                    collection.products = collection?.conditions?.map(pid => {
                        let product = data?.products?.find(i => i._id === pid);
                        return product;
                    });
                    content.props[field.id] = collection;
                } else {
                    // let collection = data?.collections.find(i => i.id === content.props[field.id]);
                    // collection.products = exampleProducts;
                    // content.props[field.id] = collection;
                    content.props[field.id] = {
                        products: exampleProducts
                    };
                }
            } else if(field?.type === "menu") {
                if(content?.props?.[field.id]) {
                    let menu = data?.menus.find(i => i.id?.toString() === content.props[field.id]);
                    content.props[field.id] = menu;
                }
            } else if(field?.type === "blog") {
                if(content?.props?.[field.id]) {
                    let blog = data?.blogs.find(i => i.id?.toString() === content.props[field.id]);
                    // content.props[field.id] = menu;
                    if(blog) {
                        let posts = data?.posts.filter(p => p.blog == blog.id.toString());
                        content.props[field.id] = {
                            blog: blog,
                            posts: posts,
                        }
                    }
                }
            }
        }
        if(content.components && block.model.components) {
            for(let i in content.components) {
                if(content.components[i]) {
                    const compopnent = block.model.components.find(c => c.type === content.components[i].type);
                    if(compopnent) {
                        content.components[i] = mapData(content.components[i], { model: compopnent }, data, exampleProducts);
                    }
                }
            }
        }
        return content;
    } catch (error) {
        console.log("ERROR", "mapData()", error.message);
        return content;
    }
}

module.exports = {
    setupNunjucks,
    mapData,
};

