# Docsilab 插件使用规范 v1.5.0

**Docsilab** 是专为 Docsify 文档设计的交互式实验嵌入插件。它允许在文档中无缝嵌入 HTML/Iframe 内容，并提供沉浸式的聚焦模式、自动样式修复和参数注入功能。

## 1\. 核心特性

  * **无缝融合 (Seamless)**：自动消除 Iframe 边框、空隙及内部页面的 Body 边距，视觉上与文档融为一体。
  * **聚焦模式 (Focus Mode)**：一键全屏，并提供 ESC 键退出监听，防止页面结构错乱。
  * **懒加载 (Lazy Load)**：默认显示“点击运行”遮罩层，提升文档初始加载速度。
  * **参数注入 (Injection)**：支持通过 Markdown 配置将参数透传给子页面 URL。
  * **主题同步**：自动跟随 Docsify 的全局 `themeColor`。

-----

## 2\. 安装与集成

将插件代码保存为 `docsilab.js`，并在 Docsify 的 `index.html` 中引入：

```html
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>

<script src="./path/to/docsilab.js"></script>
```

-----

## 3\. 全局配置

在 `index.html` 的 `window.$docsify` 对象中进行全局设置。

```javascript
window.$docsify = {
  // 1. 主题色 (插件会自动读取此颜色作为按钮和强调色)
  themeColor: '#42b983', 

  // 2. 插件专用配置
  docsilab: {
    // 全局默认高度 (当 Markdown 中未指定 height 或 ratio 时使用)
    height: '600px', 
    
    // (可选) 强制指定插件颜色，覆盖 themeColor
    // accent: '#ff5722' 
  }
};
```

-----

## 4\. 写作语法 (Markdown)

插件使用自定义的代码块语法 ` ```docsilab `。配置采用类 YAML 的键值对格式（`Key: Value`）。

### 4.1 基础用法

````markdown
```docsilab
title: 牛顿第二定律实验
src: experiments/newton.html
height: 500px
````

````

### 4.2 进阶用法 (宽高比与参数传递)

```markdown
```docsilab
title: 粒子碰撞模拟
src: experiments/collision.html
ratio: 16:9
mass: 50
velocity: 100
debug: true
````

````

**生成的 URL 示例：**
`experiments/collision.html?mass=50&velocity=100&debug=true`

---

## 5. 配置项详解

| 字段名 | 必填 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| **`src`** | **是** | 嵌入页面的路径（相对或绝对路径）。会自动修正 Windows 路径分隔符。 | `lab/demo.html` |
| **`title`** | 否 | 顶部 Header 显示的标题。默认为 "Interactive Lab"。 | `数据可视化` |
| **`ratio`** | 否 | **推荐**。设置宽高比。设置此项后 `height` 将失效。 | `16:9`, `4:3`, `1/1` |
| **`height`** | 否 | 固定高度。若未设置 `ratio` 且未设置此项，使用全局配置。 | `400px`, `50vh` |
| **`...`** | 否 | 其他任意字段将作为 URL Query 参数拼接到 `src` 后面。 | `id=123` |

---

## 6. 交互功能说明

### 6.1 运行机制
* **初始状态**：显示白色遮罩层与“Click to Run”按钮。Iframe 不会加载，节省资源。
* **点击运行**：点击遮罩后，显示 Loading 动画，Iframe 开始加载。加载完毕后自动清除内部 HTML 的 `margin` 和 `padding`。

### 6.2 顶部控制栏
* **刷新 (Reload ↻)**：强制重新加载 Iframe 内容。适用于重置实验状态。
* **新窗口打开 (New Tab ↗)**：在浏览器新标签页中打开当前 URL。
* **聚焦模式 (Focus ⛶)**：
    * 进入全屏，隐藏文档侧边栏和导航。
    * **退出方式**：再次点击按钮，或按键盘 **`ESC`** 键。

---

## 7. 开发与注意事项

### 7.1 同源策略 (CORS)
插件的“**自动去除边距**”功能（Zero-Gap Fix）依赖于 JavaScript 访问 Iframe 内部 DOM。
* **同源 (Same Origin)**：如果 `src` 指向同域名下的文件（如本地文件或相同服务器），插件会自动将内部页面的 `body { margin: 0 }`。
* **跨域 (Cross Origin)**：如果 `src` 指向外部网站（如 `https://example.com`），JS 无法注入样式。**此时你需要手动确保该外部网页没有 Body Margin**，否则可能会出现滚动条或白边。

### 7.2 内部页面规范
为了获得最佳的嵌入效果，建议嵌入的 HTML 页面遵循以下 CSS 规范：

```css
/* 建议在你的实验页面 newton.html 中包含 */
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* 防止出现双重滚动条 */
}
````

*(注：如果不想手动加，插件在同源情况下会自动帮你加，但手动加上是最保险的)*

### 7.3 全屏层级

全屏模式下，容器层级为 `z-index: 2147483647`（CSS 最大值）。如果有其他全局弹窗（如 SweetAlert）被遮挡，请确保将其实例化在全屏容器内部，或检查浏览器的全屏 API 限制。