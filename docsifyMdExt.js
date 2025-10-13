(function () {
    // Docsify 插件注册
    function docsifyMdExt(hook, vm) {
        // 默认样式配置
        const defaultOptions = {
            markedpadding: '0 0',
            markedmargin: '0px',
            markedbg: 'rgba(66,185,131,.1)',
            markedradius: '0px',
            markedcolor: 'var(--content-color)',
            selectionBg: '#42B983',
            selectionColor: '#fff',
            underlineFontColor: 'var(--content-color)',
            underlineColor: '#42B983'
        };

        // 从 window.$docsify 获取用户的自定义配置
        const userOptions = vm.config.mdext || {};
        const options = { ...defaultOptions, ...userOptions };

        // 将样式写入到页面的 <style> 标签中
        const style = document.createElement('style');
        style.innerHTML = `
        mark.highlight {
            display: inline;
            padding: ${options.markedpadding};
            margin: ${options.markedmargin};
            background-color: ${options.markedbg};
            border-radius: ${options.markedradius};
            color: ${options.markedcolor};
        }
        u {
            text-decoration: underline;
            text-decoration-color: ${options.underlineColor};
            color: ${options.underlineFontColor};
        }
        ::selection {
            background-color: ${options.selectionBg};
            color: ${options.selectionColor};
        }

        del {
            opacity: 0.5;
        }
        `;
        document.head.appendChild(style);

        // 钩子函数处理 Markdown 内容
        hook.beforeEach(function (content) {
            const result = [];
            let start = 0;

            // 正则匹配 KaTeX 公式
            const katexRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g;
            let match;

            // 遍历内容，处理非公式部分
            while ((match = katexRegex.exec(content)) !== null) {
                // 处理公式前的普通文本
                if (match.index > start) {
                    result.push(processText(content.slice(start, match.index)));
                }
                // 添加公式部分，直接跳过处理
                result.push(match[0]);
                start = match.index + match[0].length;
            }

            // 处理剩余的普通文本
            if (start < content.length) {
                result.push(processText(content.slice(start)));
            }

            return result.join('');
        });

        function processText(text) {
            // 替换 ::text:: 为高亮文本
            text = text.replace(/::(.*?)::/g, function (_, text) {
                return `<mark class="highlight">${text}</mark>`;
            });

            // 替换 __text__ 为下划线斜体
            text = text.replace(/__(.*?)__/g, function (_, text) {
                return `<u><em>${text}</em></u>`;
            });

            // 替换 _text_ 为下划线
            text = text.replace(/_(.*?)_/g, function (_, text) {
                return `<u>${text}</u>`;
            });

            return text;
        }

    }

    // 将插件挂载到 Docsify
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(docsifyMdExt);
    console.log('docsifyMdExt, and selection styles loaded');
})();
