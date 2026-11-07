# Ryan · 焦博文

[个人网站 / Work](https://bmbwaveforms.github.io/Ryan-Home/) · [About](https://bmbwaveforms.github.io/Ryan-Home/about/)

Exploring What AI Can Do.<br>
Building What People Can Use.

## 页面

- Work：Text / Visual 双视图，银河漫游与三个项目占位；三个并排、一个通栏。分类为 Personal Agent、Work、Game、Video、Skill。银河漫游归入 Game / Video，使用黑色底色、真实节点画布界面与简洁文字组成封面，手机端完整显示界面，与 About 入口共用项目详情页。
- About：AI 产品观、四篇文章、经历、黑客松、公众号与小红书。使用个人黑白肖像，顶部介绍与工作经历根据 v1.2 简历整理，黑客松展示「银河漫游」并链接到项目页。
- 项目页：所有项目复用同一套 Workflow 风格模板、章节导航与动效；《银河漫游》是首个案例，包含试玩大图、五章项目内容、产品经理视角的 AI 协作取舍，以及现场回忆和照片。产品图与现场图分别横向浏览。[模板维护说明](docs/project-page-template.md)。面试准备稿见 `docs/galaxy-roaming-interview.md`。
- 旧入口 `个人主页.html` 自动跳转新版首页。

## 本地运行

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## 修改内容

- `src/data/work-placeholders.json`：项目、分类、封面与目标链接。
- `src/data/ryan-content.json`：About 介绍、文章和经历。
- `content/projects/<slug>/`：各项目的标题、简介与自由图文内容；`templates/project-page.html` 是共用外壳。运行 `npm run projects:build` 更新静态项目页，完整构建也会自动生成。
- `about/index.html`：照片位置；替换 `public/ryan/portrait-placeholder.svg` 对应的图片地址即可。
- `public/ryan/project-placeholders/`：四张项目占位图。

GitHub Pages 从 `main` 分支根目录发布。`.nojekyll` 保留原生 ES modules 和静态资源路径。Work / About 的布局参考 SHIFTBRAIN，页面使用 Ryan 的个人内容。
