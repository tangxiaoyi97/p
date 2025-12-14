# Docsilab 交互式实验设计规范 v1.0

**Docsilab Interactive Experiment Design System (DIEDS)**

## 1\. 设计哲学 (Design Philosophy)

所有 Docsilab 实验应遵循 **"现代实验室 (Modern Laboratory)"** 美学。

  * **理性 (Rational)**：界面服务于数据，而非装饰。优先展示数值、矢量和物理关系。
  * **通透 (Translucent)**：UI 悬浮于实验之上，使用毛玻璃效果（Glassmorphism），消除视觉阻隔，保持沉浸感。
  * **原生感 (Native Feel)**：模仿现代操作系统（iOS/macOS）的物理动效，拒绝廉价的网页感。
  * **触控优先 (Touch First)**：所有交互必须适配移动端，控制面板必须可折叠。

-----

## 2\. 色彩系统 (Color System)

严禁使用纯黑 (`#000000`) 或纯白 (`#ffffff` 用于背景)。请直接复制以下 CSS 变量。

### 2.1 核心调色板

| 变量名 | 色值 (Hex/RGBA) | 用途 | 说明 |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#fbfbfd` | 全局背景 | 极淡的冷灰白，模仿高档纸张 |
| `--bg-panel` | `rgba(255, 255, 255, 0.85)` | 控制面板背景 | 必须配合背景模糊使用 |
| `--text-main` | `#1d1d1f` | 主要文字 | 深炭灰，高对比度但不刺眼 |
| `--text-sub` | `#86868b` | 次要文字/标签 | 金属灰，用于单位说明 |
| `--grid-line` | `#eef1f5` | 坐标网格 | 极淡，仅供空间参考 |

### 2.2 功能色 (Functional Colors)

用于区分物理对象。

  * **主体 A (Primary Blue)**: `#007aff` (标准 iOS 蓝)
  * **主体 B (Science Green)**: `#34c759` (科学绿)
  * **主体 C (Alert Red)**: `#ff3b30` (警示/高能)
  * **矢量/辅助线**: `#c1c1c7` (中性灰)

-----

## 3\. 排版规范 (Typography)

### 3.1 字体栈

为了保证跨平台后的“系统原生感”，不引入 WebFont，使用系统字体栈。

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

### 3.2 数据显示

**强制规则**：所有动态变化的数值（力、距离、质量），必须使用**等宽字体**。这能避免数值跳动时的视觉抖动，并传达精密仪器的感觉。

```css
.data-value {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-weight: 700;
}
```

-----

## 4\. UI 组件规范 (Component Library)

### 4.1 悬浮控制面板 (The Glass Panel)

所有实验必须包含左上角的悬浮控制面板。

  * **外观**：
      * 圆角：`12px`
      * 阴影：`box-shadow: 0 8px 32px rgba(0,0,0,0.08);`
      * 特效：`backdrop-filter: blur(12px);` (必须)
      * 边框：`1px solid rgba(255,255,255,0.4);` (内发光质感)
  * **交互 (折叠)**：
      * **必须支持折叠**。
      * 折叠动画曲线：`cubic-bezier(0.16, 1, 0.3, 1)`。
      * 标题栏包含 Chevron 图标，展开时旋转 180°。
  * **移动端适配**：
      * 宽屏 (\>600px)：宽度固定 `280px`。
      * 窄屏 (\<600px)：宽度 `calc(100% - 30px)`，居中显示。

### 4.2 滑动条 (Sliders)

禁止使用浏览器默认滑动条。必须使用以下样式以保持统一：

  * **轨道 (Track)**: 高度 `4px`，圆角，颜色 `#e1e1e6`。
  * **滑块 (Thumb)**: 大小 `18px`，纯白，圆形，带轻微投影 `box-shadow: 0 2px 6px rgba(0,0,0,0.15)`。

-----

## 5\. 绘图与渲染规范 (Canvas & Physics)

### 5.1 空间参考 (Grid)

背景**必须**绘制网格线。

  * 间距：推荐 `50px`。
  * 颜色：`--grid-line`。
  * 作用：提供“米”或“像素”的直观比例尺。

### 5.2 实体渲染 (Entities)

禁止绘制扁平的纯色圆。物体必须具备体积感。

  * **填充**：使用 `Radial Gradient` (径向渐变)。圆心处亮，边缘处暗（模拟 3D 球体）。
  * **描边**：必须添加 `1px` - `3px` 的白色 (`#fff`) 描边。防止球体在复杂背景或重叠时轮廓丢失。
  * **交互反馈**：当鼠标/手指按下物体时，必须产生 `shadowBlur` (辉光) 效果。

### 5.3 矢量可视化 (Vectors)

  * **箭头**：用于表示速度、力或加速度。
  * **缩放策略**：
      * 严禁线性无限增长。
      * **推荐**：使用对数缩放 `Math.log()` 或 阈值钳位 `Math.min()`，防止箭头刺穿屏幕。

-----

## 6\. 代码架构规范 (Development Standards)

为了保证插件的轻量化和兼容性：

1.  **单文件交付**：HTML, CSS, JS 必须写在同一个 `.html` 文件中。
2.  **零依赖**：**严禁**引入 jQuery, React, Vue, Bootstrap 等外部库。
3.  **Docsilab 参数注入**：
      * 必须解析 `window.location.search`。
      * 所有物理常量（如重力 $g$、质量 $m$）必须可配置。
      * UI 滑动条的初始值必须读取自 URL 参数。

### 6.1 标准 Boilerplate (起手式模板)

新建实验时，**必须**复制此模板开始开发：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        /* CSS Variables - 严禁修改色值 */
        :root {
            --primary: #007aff;
            --accent: #34c759;
            --text-main: #1d1d1f;
            --text-sub: #86868b;
            --bg-canvas: #fbfbfd;
            --bg-panel: rgba(255, 255, 255, 0.85);
        }
        body { 
            margin: 0; overflow: hidden; background: var(--bg-canvas);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            touch-action: none; /* 关键：接管浏览器手势 */
        }
        /* ... 在此粘贴标准 UI CSS ... */
    </style>
</head>
<body>
    <div id="control-panel" class="expanded">
        <div class="panel-header" onclick="this.parentElement.classList.toggle('expanded')">
            <span class="title">Experiment Title</span>
            <svg class="icon" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
        </div>
        <div class="panel-content">
            </div>
    </div>
    <canvas id="sim"></canvas>
    <script>
        // 标准 Loop 结构
        const canvas = document.getElementById('sim');
        const ctx = canvas.getContext('2d');
        
        // 1. URL 参数解析
        const params = new URLSearchParams(window.location.search);
        
        // 2. 响应式 Resize
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.onresize = resize; resize();

        // 3. 统一交互处理 (Mouse + Touch)
        // ... 实现 handleStart, handleMove ...
        
        // 4. 渲染循环
        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw grid, entities, vectors
            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
```

-----

## 7\. 验收清单 (Checklist)

在提交任何新实验前，请自查：

  - [ ] **视觉**：背景是否为 `#fbfbfd`？是否有网格线？
  - [ ] **交互**：手机上能否正常拖拽？面板是否遮挡了实验主体（是否会自动避让或初始位置合理）？
  - [ ] **面板**：点击标题能否流畅折叠/展开？
  - [ ] **字体**：数值是否使用了 Monospace 字体？
  - [ ] **参数**：在 URL 中修改参数（如 `?mass=200`），刷新后滑动条和物体是否正确响应？
  - [ ] **矢量**：两个物体极度靠近时，箭头是否会无限变长导致穿模？（必须有 `Math.min` 限制）。

-----

**End of Specification**