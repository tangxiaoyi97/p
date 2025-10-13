(function () {
    const supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

    function isImageFile(path) {
        const extension = path.split('.').pop().toLowerCase();
        return supportedImageFormats.includes(extension);
    }

    function renderImage(url) {
        // 清空内容并插入图片
        const mainElement = document.querySelector('#main');
        if (mainElement) {
            mainElement.innerHTML = `<div style="text-align: center; margin-top: 20px;">
                                    <img src="${url}" style="max-width: 100%; height: auto;" alt="Image"/>
                                    </div>`;
        }
    }

    // Docsify 插件
    function imagePlugin(hook, vm) {
        hook.beforeEach(function (content, next) {
            const path = vm.route.file;
            if (isImageFile(path)) {
                // 替换内容为图片渲染
                renderImage(path);
                next('');
            } else {
                next(content);
            }
        });
    }

    // 注册插件
    window.$docsify.plugins = [].concat(imagePlugin, window.$docsify.plugins || []);
})();
