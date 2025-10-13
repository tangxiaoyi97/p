(() => {
    "use strict";

    // 默认配置
    const defaultFooterConfig = {
        position: "right", // 可选值: 'left' 或 'right'
        copyright: "Docfooter by ovw6u17", // 默认版权信息
        arr: false, // 是否显示 "All rights reserved"
        color: "var(--content-color)", // 默认字体颜色
        opacity: "0.4", // 默认透明度 60%
    };

    // 插件主函数
    const docsifyDocFooter = (hook, vm) => {
        // 合并用户配置和默认配置
        const footerConfig = {
            ...defaultFooterConfig,
            ...(window.$docsify.docfooter || {}),
        };

        // 渲染页脚
        const renderFooter = (footerText, ignoreBase) => {
            const footerStyle = `
            text-align: ${footerConfig.position};
            padding: 10px 0;
            color: ${footerConfig.color};
            opacity: ${footerConfig.opacity};
            font-size: 12px;
        `;
            const baseFooter = ignoreBase
                ? ""
                : `<br><div class="footer-copyright">
                ${footerConfig.copyright}${footerConfig.arr ? " - All rights reserved." : ""}
                </div>`;

            return `
            <footer style="${footerStyle}">
            <div class="footer-content">
                ${footerText ? footerText : ""}
            </div>
            ${baseFooter}
            </footer>
        `;
        };

        // 解析 docfooter 内容
        const parseDocFooter = (content) => {
            const match = content.match(/\{docfooter:\s*(.*?)\}/);

            if (!match) return { text: "", anchor: false, ignore: false };

            const parts = match[1].split(/\s+/);
            let footerText = "";
            let anchor = false;
            let ignore = false;

            parts.forEach((part) => {
                if (part === "anchor") anchor = true;
                else if (part === "ignore") ignore = true;
                else if (part.startsWith("text=")) footerText = part.replace(/^text=/, "").replace(/^["']|["']$/g, "");
            });

            return { text: footerText, anchor, ignore };
        };

        // 每次加载完成时插入页脚
        hook.afterEach((htmlContent, next) => {
            const { text: footerText, anchor, ignore } = parseDocFooter(htmlContent);

            // 生成页脚 HTML
            const footerHTML = renderFooter(footerText, ignore);

            // 替换或附加页脚
            if (anchor) {
                // 替换 {docfooter: ...} 为页脚 HTML
                const updatedContent = htmlContent.replace(/\{docfooter:\s*.+?\}/, footerHTML);
                next(updatedContent);
            } else {
                // 移除 {docfooter: ...} 并将页脚附加到文档末尾
                const sanitizedContent = htmlContent.replace(/\{docfooter:\s*.+?\}/, "");
                next(`${sanitizedContent}${footerHTML}`);
            }
        });
    };

    // 注册插件到 Docsify
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(docsifyDocFooter);
})();
