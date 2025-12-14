/**
 * Docsilab - Docsify Interactive Lab Plugin
 * Version: 1.6.2 (Stable / Bulletproof)
 * Features:
 * - Multi-line tag support (Regex Optimized)
 * - Zero-indentation HTML generation (Prevents Code-Block rendering bugs)
 * - Robust Event Handling
 */

(function () {
    // 防止重复初始化
    if (window.docsilabInitialized) return;
    window.docsilabInitialized = true;

    function getThemeColor() {
        return (window.$docsify && window.$docsify.themeColor) ? window.$docsify.themeColor : '#42b983';
    }

    // 全局控制器
    window.docsilab = {
        load: function (containerId, src) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const shield = container.querySelector('.docsilab-shield');
            const loader = container.querySelector('.docsilab-loader');
            const iframe = container.querySelector('iframe');

            if (iframe.getAttribute('src') && iframe.style.display !== 'none') return;

            if (shield) {
                shield.style.opacity = '0';
                setTimeout(() => shield.style.display = 'none', 300);
            }
            if (loader) loader.style.display = 'block';

            if (iframe) {
                iframe.style.display = 'block';
                iframe.src = src;

                iframe.onload = function () {
                    if (loader) loader.style.display = 'none';
                    // 尝试清除内部边距 (同源策略限制)
                    try {
                        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                        if (innerDoc && innerDoc.body) {
                            innerDoc.body.style.margin = '0';
                            innerDoc.body.style.padding = '0';
                            innerDoc.body.style.overflow = 'hidden';
                        }
                    } catch (e) { }
                };
            }
        },
        reload: function (containerId, src) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const iframe = container.querySelector('iframe');
            const loader = container.querySelector('.docsilab-loader');

            if (iframe.style.display !== 'none') {
                if (loader) loader.style.display = 'block';
                iframe.src = src;
                // 强制刷新
                setTimeout(() => { if (loader) loader.style.display = 'none'; }, 5000);
            }
        },
        toggleFullscreen: function (containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const isFullscreen = document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;

            if (!isFullscreen) {
                const req = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen;
                if (req) {
                    req.call(container).catch(e => console.error(e));
                    container.classList.add('is-fullscreen-mode');
                }
            } else {
                const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (exit) {
                    exit.call(document);
                    container.classList.remove('is-fullscreen-mode');
                }
            }
        }
    };

    // 解析属性 (支持宽松格式)
    function parseAttributes(attrString) {
        const config = {};
        // 正则：匹配 key="value" 或 key='value'，忽略前后空格
        const regex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
        let match;
        while ((match = regex.exec(attrString)) !== null) {
            // match[2] 是双引号内容, match[3] 是单引号内容
            config[match[1]] = match[2] || match[3] || "";
        }
        return config;
    }

    // 生成紧凑的 HTML 字符串 (关键：无缩进，无换行)
    function createTemplate(config, id, globalHeight) {
        const { src: rawSrc, title, height, ratio, ...params } = config;

        let finalSrc = rawSrc ? rawSrc.replace(/\\/g, '/') : '';
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        if (queryString && finalSrc) {
            finalSrc += (finalSrc.indexOf('?') === -1 ? '?' : '&') + queryString;
        }

        const displayTitle = title || 'Interactive Lab';

        let sizeStyle = '';
        if (ratio) {
            sizeStyle = `aspect-ratio: ${ratio}; width: 100%;`;
        } else {
            sizeStyle = `height: ${height || globalHeight};`;
        }

        // 构造单行 HTML 字符串，避免 Markdown 解析错误
        return `<div class="docsilab-container" id="${id}"><div class="docsilab-header"><div class="header-left"><span class="lab-tag">LAB</span><span class="lab-title" title="${displayTitle}">${displayTitle}</span></div><div class="controls"><button class="docsilab-btn" onclick="window.docsilab.reload('${id}', '${finalSrc}')" title="Reload"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></button><button class="docsilab-btn" onclick="window.open('${finalSrc}', '_blank')" title="New Tab"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></button><button class="docsilab-btn" onclick="window.docsilab.toggleFullscreen('${id}')" title="Focus Mode"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button></div></div><div class="docsilab-content" style="${sizeStyle}"><div class="docsilab-shield" onclick="window.docsilab.load('${id}', '${finalSrc}')"><div class="docsilab-shield-icon"></div><div class="docsilab-shield-text">Click to Run</div></div><div class="docsilab-loader"></div><iframe class="docsilab-iframe" loading="lazy" allowfullscreen sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-pointer-lock"></iframe></div></div>`;
    }

    function docsilab(hook, vm) {
        const defaultConfig = { height: '500px' };

        hook.init(function () {
            const themeColor = getThemeColor();

            // 全屏监听处理 (防止 ESC 不同步)
            function handleFullscreenChange() {
                const doc = window.document;
                if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
                    const activeContainers = document.querySelectorAll('.docsilab-container.is-fullscreen-mode');
                    activeContainers.forEach(el => el.classList.remove('is-fullscreen-mode'));
                }
            }

            // 绑定事件 (做个简单的去重检查虽然主要靠单例模式，但保险起见)
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.addEventListener('mozfullscreenchange', handleFullscreenChange);
            document.addEventListener('MSFullscreenChange', handleFullscreenChange);

            const style = document.createElement('style');
            style.innerHTML = `
                :root { --dl-bg: #ffffff; --dl-border: #f0f0f0; --dl-header-bg: #fafafa; --dl-text: #444; --dl-accent: ${themeColor}; }
                .docsilab-container { margin: 20px 0; width: 100%; background: var(--dl-bg); border: 1px solid var(--dl-border); border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box; }
                .docsilab-container * { box-sizing: border-box; }
                .docsilab-container.is-fullscreen-mode, .docsilab-container:fullscreen { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100vw !important; height: 100vh !important; margin: 0 !important; border: none !important; border-radius: 0 !important; z-index: 2147483647 !important; background: var(--dl-bg) !important; }
                .docsilab-container:fullscreen .docsilab-content { flex: 1 !important; height: auto !important; }
                .docsilab-header { flex: 0 0 38px; padding: 0 10px; background: var(--dl-header-bg); border-bottom: 1px solid var(--dl-border); display: flex; justify-content: space-between; align-items: center; }
                .lab-tag { background: var(--dl-accent); color: white; padding: 1px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; }
                .lab-title { font-size: 13px; color: var(--dl-text); margin-left: 6px; }
                .controls { display: flex; gap: 4px; }
                .docsilab-btn { border: none; background: transparent; width: 28px; height: 28px; cursor: pointer; color: #888; border-radius: 3px; display: flex; justify-content: center; align-items: center; }
                .docsilab-btn:hover { background: rgba(0,0,0,0.05); color: var(--dl-accent); }
                .docsilab-content { position: relative; width: 100%; padding: 0 !important; margin: 0 !important; display: flex; flex-direction: column; line-height: 0; font-size: 0; }
                .docsilab-iframe { border: 0 !important; width: 100%; height: 100%; display: block; flex: 1; background: #fff; margin: 0; padding: 0; }
                .docsilab-shield { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; font-size: 1rem; line-height: 1.5; }
                .docsilab-shield-icon { width: 44px; height: 44px; background: var(--dl-accent); border-radius: 50%; display: flex; justify-content: center; align-items: center; transition: transform 0.2s; }
                .docsilab-shield-icon::after { content: ''; margin-left: 3px; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 10px solid white; }
                .docsilab-shield-text { margin-top: 10px; font-size: 12px; color: #999; }
                .docsilab-loader { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 26px; height: 26px; border: 3px solid #eee; border-top-color: var(--dl-accent); border-radius: 50%; animation: dl-spin 0.8s linear infinite; z-index: 5; }
                @keyframes dl-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
            `;
            document.head.appendChild(style);
        });

        hook.beforeEach(function (content) {
            // 正则升级：[\s\S]*? 允许匹配换行符，实现多行属性支持
            const TAG_REGEX = /<docsilab\s+([\s\S]*?)(?:\/?>|<\/docsilab>)/gi;
            let index = 0;
            const globalHeight = (window.$docsify.docsilab && window.$docsify.docsilab.height) || defaultConfig.height;

            return content.replace(TAG_REGEX, function (match, attributes) {
                const config = parseAttributes(attributes);
                if (!config.src) return ''; // 失败时静默，不破坏页面
                return createTemplate(config, `docsilab-${index++}`, globalHeight);
            });
        });
    }

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(window.$docsify.plugins || [], docsilab);
})();