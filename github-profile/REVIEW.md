# GitHub 主页发布记录

## 当前版本

当前主页聚焦 AI Products / Vibe Coding。按用户最新要求，中文名「焦博文」融入顶部蓝色 Ryan 横幅，移除横幅下重复的独立姓名标题；下方以打字动画显示 `Exploring AI. Building ideas.`。侧栏简介采用英文，横幅底部为 `AI PRODUCTS / SKILLS / VIBE CODING`。

Projects 区域位于 Working stack 上方，按当前真实置顶顺序展示六个项目。使用统一 350×148 SVG 小卡片，宽屏并排、窄屏单列；标题、简介和标签均使用共同基线，整张卡片可点击，支持深浅主题。LifeOS 个人分支和上游仓库明确区分。旧版大幅项目封面和验证说明仍保留在 `deferred/` 所列目录；未修改真实 GitHub 的置顶状态。顶部整张 Ryan 横幅可点击进入个人网站。

顶部只保留 Website 和小红书按钮，已按用户要求移除紫色 Email 按钮。

Working stack 采用 Daily / AI / Focus 三行结构，Focus 为普通文字。macOS 与 AIGC 不再出现在当前主页；仍保留在历史稿与未引用素材中。

## 文件

- `profile/README.md` 是已发布到 `BMBWaveforms/BMBWaveforms` 的主页内容源稿。
- `profile/notes/` 包含网站结构调整记录和角色提示词方法说明。
- `profile-settings.json` 包含姓名、简介、网站与社交信息；当前 `pins` 为空。
- `preview.html` 是本地预览，正文使用 GitHub Markdown API 渲染，外围布局模拟 GitHub 主页。
- `design/` 保存 Ryan 视觉源稿与导出脚本，`profile/assets/` 保存实际用于 README 的图像。
- `versions/v1-text/` 保存本轮改动前的完整文字版草稿。

## 社交账号

公众号名称为用户提供的「碳基推理中」。已接入用户提供的 430×430 官方二维码，原图保存为 `profile/assets/wechat-qr.jpg`，解码载荷为 `http://weixin.qq.com/r/mp/QyfC2jbE3WuirXK593JR`。原图按字节保留，来源摘要与 SHA-256 记录在 `design/social-qr.json`；未把解码结果当作已完成登录后的账号验证。

当前「Writing & Sharing」使用深灰双二维码卡片，按用户要求去掉大标题和口号。公众号配文为「微信扫码关注公众号」，小红书显示「在小红书见 / 扫码访问主页」并使用原始分享链接生成的二维码；桌面两栏、手机上下排列。卡片下保留公众号名称搜索说明、两张二维码原图入口和小红书可点击链接。

小红书已接入用户提供的 `https://xhslink.cn/o/13OQAkBmW7Q`。2026 年 10 月 19 日检查时，短链解析到用户主页 `66e721b2000000001d0233d9`，未登录访问被引导至登录页；未核实主页昵称或内容。公开入口保留原分享链接。

## 信息依据

2026 年 10 月 19 日读取了 GitHub 当前个人资料、四个项目的 README、国漫角色 Skill 的完整示例和手动验收文件，以及当前置顶列表。

个人网站结构说明来自工作区 `DESIGN.md`，检查结果来自 `.taste-skill/refinement-v2/qa.json` 和 `final-check.json`。这些是本轮已有检查记录，未改写成用户测试或业务收益。

Agent 分析 Skill 的 README 明确注明尚未完成真实案例试跑。国漫 Skill 仓库提供提示词示例与测试定义，不包含对应生成图片，方法说明保持这一边界。

## 关联修正

Agent 分析 README 中关于竞品分析 Skill 尚未发布的段落已经过时。对应补丁单独放在 `changes/`，不涉及 Skill 执行规则。

## 发布状态

2026 年 10 月 19 日已按用户要求发布至 https://github.com/BMBWaveforms ，公开主页仓库为 https://github.com/BMBWaveforms/BMBWaveforms ，默认分支 main，提交 `61fde2f`。本地独立仓库位于 `/Users/bmb/AI/Projects/个人网站/GitHub-Profile`。

已更新显示名 Ryan、英文简介 `Exploring AI products. Learning through vibe coding.` 及个人网站链接。头像交由用户自行上传，本轮未更改头像、置顶或其他仓库。

本地模拟预览仍使用 R 字标占位头像；线上保留用户原头像。

已发布内容为 `profile/README.md` 及其引用的横幅、动画标语、徽章、社交卡片和两张二维码原图。项目笔记与封面先留作后续素材；预览页面、设置快照、检查文件和脚本不属于公开 Profile 内容。

## 预览检查

对齐与整体样式更新见 `verification-projects/aligned-cards.json`：Safari 本地 840px 预览为两列，390px 与 320px 为单列；六张图片全部加载，无页面横向溢出，所有同排卡片等高。使用固定内部排版消除了长标题导致的标签错位；卡片间采用统一换行间距。已发布提交 `6a168dd`，在 Safari 公开主页检查了全部六张卡片的实际显示；远端 README 与十二张深浅主题 SVG 均已回读匹配，详见 `deployment/projects-style-update.json`。

项目区与横幅链接本轮检查见 `verification-projects/checks.json`：六个链接与真实置顶顺序一致，GitHub Markdown API 保留表格、图标标签及横幅链接；Safari 本地 740px、390px 和 320px 预览均无页面或项目表格横向溢出。已发布提交 `810dbb3`，远端 README 和六张标签 SVG 均与本地一致；在 Safari 公开主页看到了完整项目区，实际点击横幅后打开个人网站。发布记录见 `deployment/projects-update.json`。

文章列表已发布，记录见 `deployment/articles-update.json`：在二维码卡片上方添加四篇文章，标题和链接均由用户提供，按给定顺序配对。已核对 GitHub Markdown 渲染后的文字及链接，检查 Safari 本地列表排版，并确认远端 README 与源稿一致。公众号正文受读取限制，未检验文章目的页，不添加未核实摘要。

紧凑版头已发布，记录见 `deployment/compact-header.json`：横幅从 1200×400 调整为 1200×280，占屏高度减少 30%，姓名和图案重新排版。远端 PNG 与本地一致，已在 GitHub 公开页面检查实际显示。分区图标版本记录见 `deployment/headings-update.json`。

发布核验见 `deployment/remote-checks.json`：远端 18 个文件的 Git blob 校验均与本地一致，仓库公开且默认分支为 main，账号名称、简介及网站均回读一致，头像 URL 未变。在 Chrome 的公开访客页面中已看到 Ryan 横幅、标语、工具徽章和暗色双二维码卡片；这是公开页面检查，未进行登录态管理页面或实体手机扫码验收。

暗色精简版结果见 `verification-v8/`：桌面深浅主题、390px 与 320px 页面均无溢出，所有图片加载正常，本地链接目标存在。已确认横幅含「焦博文」、独立姓名标题与顶部 Email 按钮均移除、社交卡片无大标题。桌面及手机两版卡片原图与四种浏览器截图中的两个二维码均通过程序解码；公众号二维码原始文件哈希保持一致。未进行真实手机扫码或远程发布。

双二维码版结果见 `verification-v7/`：桌面深浅主题、390px 与 320px 页面均无溢出，图片和本地链接正常；两版卡片原图及四种浏览器截图中的公众号、小红书二维码均能解码到对应原始载荷。已查看桌面与手机卡片截图，官方二维码原图哈希与下载文件一致。这些是程序解码与浏览器检查，尚未进行真实手机微信扫码验收或远程发布。

社交卡片版结果见 `verification-v6/`：深浅桌面主题、390px 与 320px 页面均无溢出，手机正确选用竖版卡片，所有图片加载且本地链接目标存在。二维码原图、两版卡片原图，以及四种浏览器截图均能解码为用户提供的小红书分享链接，详见 `qr-checks.json`；未将此等同于真实手机扫码或登录后的账号验收。

打字版结果见 `verification-v5/checks.json`：检查桌面深浅主题、390px 与 320px 窄屏，以及减少动态效果模式。普通模式两帧确有变化，图片边界保持不变；减少动态效果时选用静态 SVG，两帧一致。390px 场景使用浏览器 4 倍 CPU 降速模拟，未发现页面溢出或图片加载失败；这不代表实体低端设备测试。已查看完整桌面、手机、逐字过程与静态模式截图。GitHub Markdown API 保留了 picture/source，尚未在已发布的真实 Profile 上验收。

当前精简版检查结果见 `verification-v4/checks.json`：1440px 桌面深浅主题、390px 深色手机、320px 浅色手机均无横向溢出；13 枚徽章及其余图片全部加载，本地链接目标存在，项目区、置顶区、macOS 与 AIGC 均未显示。已查看桌面和手机截图，确认英文首屏及横幅中的 VIBE CODING 文案。截图保存在同一目录。

彩色徽章版已通过 GitHub Markdown API 重新渲染，并检查 1440px 桌面深浅主题、390px 深色手机和 320px 浅色手机。19 枚徽章及其余图片全部加载成功，徽章自然换行，未发现页面横向溢出，本地链接目标存在。结果见 `verification-v3/checks.json`，完整截图与徽章区域截图在同一目录；该检查针对本地模拟预览，尚未发布到真实 Profile 页面。

Ryan 视觉版已检查 1440px 桌面的深色、浅色主题，以及 390px 和 320px 手机宽度。页面与项目表格均未发现横向溢出，六张图片加载成功，本地目标文件存在；展开区可通过键盘空格打开，未捕获 JavaScript 异常。最终结果保存在 `verification-v2/checks-final.json`，对应截图在同一目录。

前一版检查记录保留在 `verification/`。视觉版首次检查发现预览容器在窄屏被图片撑开，已通过约束外围布局的最小宽度修正；README 没有增加预览专用 CSS。

正文沿用 human-writing 的事实边界与简洁措辞。项目卡片使用短段落，详细状态置于原生展开区。
