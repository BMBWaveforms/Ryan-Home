# Ryan 主页视觉方向

展示名为 Ryan，当前主题为 AI Products 与 Vibe Coding。GitHub 用户名及现有社交 URL 保留真实地址。

## 当前结构

1. 整张横幅链接到个人网站 `https://bmbwaveforms.github.io/Ryan-Home/`。紧凑蓝色横幅，高度由 400px 缩减到 280px，减少 30% 的版头占屏；将大字 Ryan 与中文名「焦博文」排在同一画面，底部标签为 `AI PRODUCTS / SKILLS / VIBE CODING`。
2. 横幅下直接用打字动画展示标语 `Exploring AI. Building ideas.`，不再重复展示独立姓名标题。
3. 彩色网站与小红书入口；顶部 Email 按钮已移除。
4. Projects 放在 Working stack 上方，按真实置顶顺序展示六个项目。统一规格的小卡片在宽屏并排、窄屏逐张换行。标题、两行简介预留区和分类标签使用共同基线，整张卡片可点击；LifeOS 明确区分 My Fork 与 Upstream。来源与链接见 `projects.json`。
5. Working stack 按 Daily / AI / Focus 三行展示；前两行使用工具徽章，Focus 为普通文字。
6. Writing 区域先展示四篇文章，使用 01–04 小号编号与加粗标题链接，按用户提供顺序对应原始公众号链接，不额外编写内容摘要。标题及链接记录在 `articles.json`。
7. 深灰社交卡片，不设大标题或口号，直接展示公众号与小红书两组入口。桌面将公众号与小红书并排，手机改为上下排列；卡片外保留名称搜索说明、可点击主页及二维码大图入口。

当前项目区使用 350×148 SVG 小卡片替代原生表格，消除长标题换行造成的简介和标签错位；采用深灰底、细边框、浅色标题和彩色分类标签。旧版素材仍存于 `../deferred/README.md` 所列路径。真实 GitHub 置顶状态未修改。macOS 和 AIGC 徽章已移出当前 README。

## 参考怎样落到页面上

- [小普](https://github.com/xiaopu-ai) 及用户提供的截图用于 Daily / AI / Focus 三行布局、彩色工具徽章和独立社交入口。工具名称沿用当前草稿中与用户现有实践相关的条目。
- [Ruian](https://github.com/realruian) 的名字与打字标语结构用于首屏介绍。已读取其 README 和 `assets/motto-en.svg`，采用本地动画 SVG 的方式实现，标语与动画参数为 Ryan 单独编写。
- [Mads](https://github.com/MadsLorentzen) 的首屏影像承担个人记忆点。当前没有用户肖像素材，使用 Ryan 大字、字母头像与原创线形图案。

## 素材与发布

主色为 #2450EA，配暖白 #F5F4E9。字标使用已有 Gambarino，辅助英文为 General Sans，正文由 GitHub 原生字体呈现。

`artboards.html` 保存横幅、头像和暂存项目封面的源稿。通过 `node github-profile/design/export_artwork.mjs hero` 可单独导出横幅；不传参数会导出全部源稿。横幅为 1200×280，头像为 480×480。

当前主页使用 10 枚静态 SVG 徽章。其余徽章保留在素材目录，不在 README 引用。来源与尺寸见 `badges.json`，更新脚本为 `fetch_badges.py`。

`profile/assets/ryan-slogan.svg` 为 360×40 的动画标语，7.2 秒一轮：逐字出现、停留约 2.7 秒、退格后重播。动画仅改变 SVG 内部的 transform 与 opacity；图片尺寸保持固定。配色适配深浅主题；README 通过 picture 的 `prefers-reduced-motion` 条件切换到 `ryan-slogan-static.svg`，直接显示完整句子。动画 SVG 自身也保留减少动态效果的规则。两张 SVG 的文案、尺寸与字体保持一致。

公开 README 使用 GitHub Markdown API 可保留的原生 picture / img 引用，不依赖 JavaScript、外部动画服务或主页自定义 CSS。2026 年 10 月 19 日已发布到 GitHub 个人主页；已在实际公开页面检查横幅、标语及社交卡片。发布核验见 `../deployment/remote-checks.json`。

社交卡片沿用用户提供的二维码面板结构，按最新要求改为深灰底 #131A24、细框 #303D50、浅色正文 #EDF2FA 与淡蓝平台名 #A8BFFF；去掉大标题、下划线和底部口号。二维码继续使用白底黑码，确保对比。源稿为 `social-card.html`，通过 `node github-profile/design/export_social_card.mjs` 导出桌面与手机 PNG。小红书二维码编码用户原始分享链接，原图为 `profile/assets/xiaohongshu-qr.png`，内容记录在 `social-qr.json`。

公众号已使用用户提供的 430×430 官方二维码原图 `profile/assets/wechat-qr.jpg`，中央头像与二维码内容均保留。卡片中按 301×301 显示，配文为「微信扫码关注公众号」；手机竖版使用同样的完整二维码。README 保留公众号二维码原图入口和名称搜索说明。二维码载荷与原图 SHA-256 记录在 `social-qr.json`，原图文件未重绘或重新编码。

公众号与小红书二维码均已在卡片原图及桌面、手机渲染截图中通过程序解码核验，结果见 `../verification-v8/qr-checks.json`。小红书、网站、邮件使用用户已提供的入口。当前版本已发布到 GitHub，显示名、简介与网站已同步，头像由用户自行上传。

项目分类标签为六张本地 SVG，位于 `profile/assets/projects/`。使用固定色底与白色文字保证深浅主题对比，不依赖外部徽章服务。

项目卡片由 `build_project_cards.py` 生成，每张包含深浅两个主题版本。README 使用原生链接和 picture 引用，自然换行而不依赖 GitHub 会过滤的自定义 CSS；每张均保留名称、简介与分类的替代文字。
