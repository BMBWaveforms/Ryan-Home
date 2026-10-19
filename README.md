# Ryan · 焦博文

[个人网站 / Work](https://bmbwaveforms.github.io/Ryan-Home/) · [About](https://bmbwaveforms.github.io/Ryan-Home/about/)

Exploring What AI Can Do.<br>
Building What People Can Use.

## 页面

- Work：Text / Visual 双视图，四个项目占位；三个并排、一个通栏。分类为 Personal Agent、Work、Game、Video、Skill。
- About：AI 产品观、四篇文章、经历、黑客松、公众号与小红书。照片、经历和黑客松保留明确标记的占位/示例内容，待替换。
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
- `about/index.html`：照片位置；替换 `public/ryan/portrait-placeholder.svg` 对应的图片地址即可。
- `public/ryan/project-placeholders/`：四张项目占位图。

GitHub Pages 从 `main` 分支根目录发布。`.nojekyll` 保留原生 ES modules 和静态资源路径。Work / About 的布局参考 SHIFTBRAIN，页面使用 Ryan 的个人内容。
