(() => {
    "use strict";

    // ========= 默认配置 =========
    const defaultFooterConfig = {
        position: "right",                  // 'left' | 'right' | 'center'
        copyright: "Docfooter by ovw6u17",  // 默认版权
        arr: false,                         // 是否显示 " - All rights reserved."
        color: "var(--content-color)",      // 字体颜色
        opacity: "0.4",                     // 透明度
        enableDefault: true,                // 没写 {docfooter: ...} 时是否自动添加默认 footer
        footerClass: "docsify-docfooter",   // 根 footer 的 class，方便自定义 CSS
    };

    // 匹配 {docfooter: ...}
    const DOCFOOTER_RE = /\{docfooter:\s*([^}]+)\}/;

    // 去掉首尾引号 "xxx" / 'xxx'
    const unquote = (str) => str.replace(/^["']|["']$/g, "");

    // 简单处理 HTML 实体中的引号，解决 &quot; 问题
    const decodeHtmlEntitiesForArgs = (str) =>
        str
            .replace(/&quot;|&#34;/g, '"')
            .replace(/&#39;/g, "'");

    // 解析通用字符串参数: name=...
    const parseStringOption = (name, args) => {
        const re = new RegExp(
            name + '=("([^"]*)"|\'([^\']*)\'|([^\\s]+))'
        );
        const match = args.match(re);
        if (!match) return null;
        // match[2] / match[3] / match[4] 分别是 "xx" / 'xx' / 无引号形式
        const raw = match[2] || match[3] || match[4] || "";
        return unquote(raw);
    };

    // 解析布尔参数（支持多种写法）：arr=true / false / yes / no / 1 / 0
    const parseBooleanOption = (name, args) => {
        const re = new RegExp(name + "=(true|false|1|0|yes|no)", "i");
        const match = args.match(re);
        if (!match) return null;
        const val = match[1].toLowerCase();
        return val === "true" || val === "1" || val === "yes";
    };

    // 检查布尔开关（无等号），例如 anchor / ignore
    const hasFlag = (name, args) =>
        new RegExp("\\b" + name + "\\b").test(args);

    /**
     * 解析 {docfooter: ...} 中的参数
     * 支持：
     *   text="xxx xxx"
     *   copyright="&copy; Johanna S."
     *   position=left|right|center
     *   arr=true|false
     *   anchor
     *   ignore
     */
    const parseDocFooter = (content) => {
        const match = content.match(DOCFOOTER_RE);

        if (!match) {
            return {
                exists: false,
                text: "",
                anchor: false,
                ignore: false,
                copyright: null,
                position: null,
                arr: null,
            };
        }

        const rawArgs = match[1];
        const args = decodeHtmlEntitiesForArgs(rawArgs);

        const text = parseStringOption("text", args) || "";
        const copyright = parseStringOption("copyright", args);
        const position = parseStringOption("position", args); // left / right / center
        const arr = parseBooleanOption("arr", args);

        const anchor = hasFlag("anchor", args);
        const ignore = hasFlag("ignore", args);

        return {
            exists: true,
            text,
            anchor,
            ignore,
            copyright,
            position,
            arr,
        };
    };

    // 模板插值，目前支持 {{year}}
    const interpolateTemplate = (str) => {
        if (!str) return "";
        const year = new Date().getFullYear();
        return String(str).replace(/\{\{\s*year\s*\}\}/gi, year);
    };

    /**
     * Docsify 插件主体
     */
    const docsifyDocFooter = (hook, vm) => {
        // 合并全局配置
        const footerConfig = {
            ...defaultFooterConfig,
            ...(window.$docsify.docfooter || {}),
        };

        /**
         * 生成 footer 行内样式
         * position 可被单页覆盖
         */
        const buildFooterStyle = (positionOverride) => {
            const effectivePosition = positionOverride || footerConfig.position;
            return `
        text-align: ${effectivePosition};
        padding: 10px 0;
        color: ${footerConfig.color};
        opacity: ${footerConfig.opacity};
        font-size: 12px;
      `;
        };

        /**
         * 渲染页脚 HTML
         * @param {Object} options
         * @param {string} options.footerText
         * @param {boolean} options.ignoreBase
         * @param {string|null} options.customCopyright
         * @param {string|null} options.positionOverride
         * @param {boolean|null} options.arrOverride
         */
        const renderFooter = ({
            footerText = "",
            ignoreBase = false,
            customCopyright = null,
            positionOverride = null,
            arrOverride = null,
        } = {}) => {
            const footerStyle = buildFooterStyle(positionOverride).trim();
            const effectiveArr =
                typeof arrOverride === "boolean" ? arrOverride : footerConfig.arr;

            const effectiveCopyrightRaw =
                customCopyright != null ? customCopyright : footerConfig.copyright;

            const copyrightText = interpolateTemplate(effectiveCopyrightRaw);

            const baseFooter = ignoreBase
                ? ""
                : `
          <br>
          <div class="footer-copyright">
            ${copyrightText}${effectiveArr ? " - All rights reserved." : ""}
          </div>
        `;

            const contentText = interpolateTemplate(footerText);

            return `
        <footer class="${footerConfig.footerClass}" style="${footerStyle}">
          <div class="footer-content">
            ${contentText}
          </div>
          ${baseFooter}
        </footer>
      `;
        };

        // 每次页面渲染完成后插入 footer
        hook.afterEach((htmlContent, next) => {
            const {
                exists,
                text,
                anchor,
                ignore,
                copyright,
                position,
                arr,
            } = parseDocFooter(htmlContent);

            // 页面中使用了 {docfooter: ...}
            if (exists) {
                const footerHTML = renderFooter({
                    footerText: text,
                    ignoreBase: ignore,
                    customCopyright: copyright,
                    positionOverride: position,
                    arrOverride: arr,
                });

                if (anchor) {
                    // 把标签替换为 footer
                    const updatedContent = htmlContent.replace(DOCFOOTER_RE, footerHTML);
                    next(updatedContent);
                } else {
                    // 去掉标签本身，在结尾追加 footer
                    const sanitizedContent = htmlContent.replace(DOCFOOTER_RE, "");
                    next(`${sanitizedContent}${footerHTML}`);
                }
                return;
            }

            // 页面中没写 {docfooter: ...}，按配置决定是否添加默认 footer
            if (footerConfig.enableDefault) {
                const footerHTML = renderFooter({});
                next(`${htmlContent}${footerHTML}`);
            } else {
                next(htmlContent);
            }
        });
    };

    // 注册插件到 Docsify
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins =
        (window.$docsify.plugins || []).concat(docsifyDocFooter);
})();
