# NOAH 个人网站 V4.4

> 重新理解生命，重新设计人生。

V4.4 是 NOAH 个人网站的轻量化、GitHub Pages 友好版本。核心原则：**先开源节流，再逐步增加交互和产品能力。**

## V4.4 做了什么

- 保留 V4.3 的整体视觉、动画和内容结构，不做大改版。
- Hero 增加身份定位：教育者 · 生命成长探索者 · LOS 发起人。
- “正在做什么”增加 BUILDING / ONGOING / EXPLORING / CREATING 状态。
- 全部本地图片转为 WebP，显著降低首屏与仓库体积。
- 保留本地 MP3，不依赖第三方音频服务。
- 增加 `.nojekyll`，方便直接使用 GitHub Pages 发布静态文件。
- 增加 favicon、基础 Open Graph 信息和页脚。
- **零后端、零数据库、零第三方运行时依赖。**

## 文件结构

```text
index.html
styles.css
script.js
favicon.svg
.nojekyll
assets/
  *.webp
  music/*.mp3
```

## 本地预览

直接打开 `index.html` 即可查看。若浏览器对本地文件的部分功能有限，也可以用任意静态 HTTP 服务预览。

## GitHub Pages

推荐建立一个仓库，并把本目录内容直接放在仓库根目录。然后：

1. GitHub → Repository → Settings
2. Pages
3. Build and deployment → Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，Folder 选择 `/ (root)`
5. 保存后等待部署

如果使用个人站点仓库，可以命名为：`你的GitHub用户名.github.io`。

## 后续 V4.5+

暂不急着加入复杂交互。下一阶段优先级：

1. LOS 内容结构化
2. Journal 知识库化
3. AI Action Coach 产品原型
4. 再考虑登录、数据库、动态内容和更复杂的交互

## 成本策略

当前版本不需要服务器、数据库或付费运行时。GitHub Pages 可以直接发布静态文件。需要注意：GitHub 官方对 Pages 的定位和使用限制仍需遵守，尤其不应把它作为主要用于在线交易或 SaaS 的免费托管服务。

