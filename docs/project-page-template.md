# 共用项目详情页模板

2026-11-03：用户确认《银河漫游》的详情页样式平行复用到每一个项目。它是共用模板的第一个案例。

统一的是视觉与交互：R 标识、Ryan 名称、Work / About 导航、深色背景、窄正文与宽媒体、段落和章节留白、左侧锚点、手机横向目录、平滑滚动、入场与切页动效、图片浏览与放大、返回项目列表。

项目内容自由组合。标题、简介、封面、职责信息、章节名称和数量、图片数量、成果或技术细节都由实际材料决定；不要求每个项目套用黑客松的五章、奖项或团队介绍。有单图时使用单图，多图时使用横向图片组。可展开细节也是可选内容。

正文沿用 Workflow 的排版比例。每个主要内容块采用章节标题、简洁说明、灰色关键词，再接相关图片。长一些的解释可以放在图片之后的可展开内容中；有两个故事时，用 `.project-story-block` 分开叙述，各接自己的图片。

- 版头在大标题下方靠右放 `.project-introduction`，随后展示 `.project-hero-media`，`.project-facts` 独立放在大图之后。
- 单图使用 `figure.project-media`，宽度与横向相册的单张一致；多图继续使用 `.project-gallery`。
- 桌面与手机画面对照可在 `.project-media` 中使用 `.project-media-pair`，内部每张图分别放在 `.image-open` 按钮里，均可独立放大。
- 统一字号、图片宽度、图片间隔和章节留白由 `project.css` 的 `--project-*` 变量管理，避免每个项目另写一套排版。

## 维护入口

- `templates/project-page.html`：唯一共用页面外壳，包含导航、正文骨架、页尾、大图弹层和资源入口。
- `src/components/sites/ryan/project.css`、`src/project.js`：所有项目共用的排版和交互。
- `content/projects/<slug>/project.json`：页面标题、搜索摘要及章节索引。
- `content/projects/<slug>/hero.html`：该项目的标题、封面与开场介绍。
- `content/projects/<slug>/story.html`：该项目自由编排的图文正文。
- `projects/<slug>/index.html`：生成后的独立静态页面，支持直接打开、刷新及 GitHub Pages 子路径；通过内容源生成，不直接维护。

章节使用 `<section class="project-section" id="chapter-id">`，属性使用双引号。`project.json` 中的 `chapters` 与这些正文 ID、顺序一致，构建会检查重复和失效锚点。标题可带英文副标题，也可只写中文。

`hero.html` 和 `story.html` 是本地维护的可信 HTML，沿用共用样式类。正文可使用 `project-copy`、`project-gallery`、`project-photo`、`project-decisions` 等；已有案例可用作具体写法参考。

## 新增一个项目

```sh
cp -R templates/project-starter content/projects/my-project
```

1. 将 `my-project` 换成项目英文路径名，小写字母、数字和连字符。
2. 修改目录内三个内容文件，将真实图片放到 `public/ryan/my-project/`；内容中的图片路径使用 `../../public/ryan/my-project/...`。
3. 运行 `npm run projects:build` 生成静态页。
4. 资料准备完成后，在 `src/data/work-placeholders.json` 对应项目中设置 `url: "projects/my-project/"`；Work 的整卡和文字行均会进入该页。About 可按需要增加入口。
5. 运行 `npm run check`、`npm test`、`npm run build`。完整构建也会重新生成全部项目详情页。

开发服务器会按请求读取模板和内容，修改后刷新即可；`dist` 预览使用构建好的静态文件。提交时一并保留内容源、共用模板和生成的项目页面，兼容目前从仓库根目录发布的方式。

路由按 `/projects/<slug>/` 自动识别；新增项目不需要复制动效脚本、单独样式表或修改路由名单。起步文件只放在模板目录，当前未为其他占位项目生成公开详情页。

## 本次验证

《银河漫游》迁移前后比对了正文、标题和摘要、链接、图片与尺寸、章节顺序，内容一致。另一个两章项目通过测试夹具直接进入、切换到银河漫游、返回 Work 及历史返回，保持同一文档和一个滚动控制器；测试内容未加入公开目录。

11 项自动化检查、构建与差异空白检查通过。本地 HTTP 验证了实时渲染、生成页面与静态构建一致，以及规范 URL 跳转和不存在项目的 404；浏览器验证了项目 → About → Work 保持同一文档，离开项目时章节导航被清理。未发布。
