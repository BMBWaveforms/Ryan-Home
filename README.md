# BMB 个人主页

直接用浏览器打开 `index.html`，无需安装依赖。请保留相邻的 `assets` 文件夹。

`个人主页.html` 是图片、字体全部内嵌的便携版本，可以单独复制或发送，离线打开。

## 可以替换的内容

- `index.html` 内的姓名、简介、关于我文案。
- 四个探索条目的标题、描述、图片。当前文案是基于 AI 产品、AIGC、知识管理、个人工具方向的展示初稿，未声称是已交付项目。
- 当前联系邮箱为用户提供的 `Ctaisobserving@gmail.com`。后续修改时，搜索并统一替换此地址，确保无 JavaScript 时邮件链接也正确。
- 配图在 `assets/images/`，字体在 `assets/fonts/`。照片为有署名的氛围素材，不代表个人作品。

## 功能

首屏双栏、全局导航、四个方向摘要常显、可展开的补充关注点、配图切换、邮箱复制与邮件链接。手机先显示个人介绍，配图随正文滚动。禁用 JavaScript 后介绍、原生条目展开和邮件链接仍可使用；支持减少动态效果偏好。

本轮调整前的版本保存在 `versions/个人主页-v1.html`，可以独立打开比较。

## 导出单文件

修改 `index.html` 后运行 `node export.mjs`，重新生成 `个人主页.html`。

初版视觉使用 `/Users/bmb/AI/Skills/community/design/design-taste-frontend`。本轮通过 `/Users/bmb/AI/Skills/community/design/impeccable-agents` 的 layout / polish 指引调整信息结构，保留 Stone and blueprint 配色与字体。具体取舍见 `DESIGN.md`。
