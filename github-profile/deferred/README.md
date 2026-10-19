# 暂存的项目展示

此目录暂存旧版带大幅配图的项目展示及验证说明。当前主页已根据用户最新要求添加六个紧凑项目位置，数据来自真实置顶列表，见 `../design/projects.json`；不使用这里的旧版卡片。

- `projects.md` 保存项目区原文。以后有准备展示的项目时，更新内容后插入 `profile/README.md` 的 `## Working stack` 之前。
- `pins.json` 保存先前的置顶候选。需要恢复时，把确认过的条目加入 `profile-settings.json` 的 `pins`；预览会在列表非空时显示置顶区域。
- 项目配图与两篇笔记仍保留在 `profile/assets/` 和 `profile/notes/`，当前主页没有展示入口。
- 调整前的完整 README、设置和预览保存在 `versions/v3-with-projects/`。

更新后运行 `python3 github-profile/build_preview.py`。该命令只生成本地预览，不发布 GitHub。
