"""Render the local profile draft. This does not publish or update GitHub."""
from pathlib import Path
import concurrent.futures
import html
import json
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent
PROFILE = ROOT / "profile"
SETTINGS = json.loads((ROOT / "profile-settings.json").read_text())
GH = "/opt/homebrew/bin/gh"

CSS = """
:root{color-scheme:light dark;--bg:#fff;--panel:#f6f8fa;--fg:#1f2328;--muted:#59636e;--border:#d1d9e0;--blue:#0969da}
@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--panel:#151b23;--fg:#f0f6fc;--muted:#9198a1;--border:#3d444d;--blue:#4493f8}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}
a{color:var(--blue);text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}a:focus-visible{outline:2px solid var(--blue);outline-offset:4px}
.notice{padding:12px 24px;background:var(--panel);border-bottom:1px solid var(--border);font-size:13px;color:var(--muted)}
.layout{max-width:1200px;margin:36px auto 60px;padding:0 28px;display:grid;grid-template-columns:250px minmax(0,1fr);gap:32px}
aside img{width:210px;height:210px;border-radius:50%;border:1px solid var(--border)}aside h2{font-size:23px;line-height:1.3;margin:20px 0 2px}aside .username{font-size:19px;color:var(--muted)}aside p{margin:16px 0}aside small{color:var(--muted)}
.tabs{border-bottom:1px solid var(--border);margin-bottom:22px;padding:0 0 10px;font-size:14px}.tabs span{border-bottom:2px solid #fd8c73;padding:0 6px 12px;font-weight:600}
.readme{border:1px solid var(--border);border-radius:6px;padding:24px 32px}.filename{font:12px/1.5 ui-monospace,SFMono-Regular,monospace;color:var(--muted);margin-bottom:20px}
.markdown-body{overflow-wrap:anywhere}.markdown-body h1{font-size:30px;line-height:1.3;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid var(--border)}.markdown-body h2{font-size:22px;line-height:1.4;border-bottom:1px solid var(--border);padding-bottom:8px;margin:28px 0 16px}.markdown-body h3{font-size:17px;margin:24px 0 12px}.markdown-body p{margin:0 0 16px}.markdown-body ul{padding-left:24px}.markdown-body li{margin:8px 0}.markdown-body img{max-width:100%;height:auto;border-radius:4px}.markdown-body hr{height:1px;border:0;background:var(--border);margin:24px 0}.markdown-body .anchor{display:none}.markdown-body code{font-size:85%;background:var(--panel);padding:2px 5px;border-radius:4px}
.pin-heading{font-size:15px;font-weight:500;margin:24px 0 12px}.pins{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pin{border:1px solid var(--border);border-radius:6px;padding:16px;min-width:0}.pin a{font-weight:600;font-size:14px}.pin p{font-size:12px;color:var(--muted);margin-bottom:0}.note-layout{max-width:860px;margin:28px auto;padding:0 22px}.note-layout .readme{margin-top:24px}
.pending-social p{color:var(--muted);font-size:13px}
@media(max-width:760px){.layout{grid-template-columns:1fr;margin:24px auto;padding:0 18px;gap:24px}aside{display:grid;grid-template-columns:76px 1fr;column-gap:16px}aside img{width:76px;height:76px;grid-row:1/3}aside h2{margin:6px 0 0;font-size:22px}aside .username{font-size:16px}aside p,aside small{grid-column:1/-1;margin-bottom:0}.readme{padding:20px}.markdown-body h1{font-size:26px}.pins{grid-template-columns:1fr}.notice{padding:10px 18px}.note-layout .readme{padding:20px}}
"""

def shell_api(*args, body=None):
    return subprocess.run([GH, "api", *args], input=body, text=True, capture_output=True, check=True).stdout

def render(source):
    payload = json.dumps({"text": source.read_text(), "mode": "gfm"})
    return shell_api("markdown", "--input", "-", "-H", "Accept: text/html", body=payload)

def document(title, body):
    return f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><style>{CSS}</style></head><body>{body}</body></html>'

def main():
    (PROFILE / "assets").mkdir(exist_ok=True)
    shutil.copyfile(ROOT.parent / ".taste-skill/refinement-v2/desktop-fold.jpg", PROFILE / "assets/site-desktop.jpg")
    avatar = ROOT / "avatar.jpg"
    if not avatar.exists():
        subprocess.run(["curl", "--fail", "--silent", "--show-error", "--location", "--max-time", "20", "https://avatars.githubusercontent.com/u/194511364?v=4&s=420", "--output", str(avatar)], check=True)

    sources = [PROFILE / "README.md", *sorted((PROFILE / "notes").glob("*.md"))]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        rendered = list(pool.map(render, sources))

    readme = rendered[0]
    readme = re.sub(r'href="notes/([^"#]+)\.md"', r'href="preview/notes/\1.html"', readme)
    pins = "".join(f'<section class="pin"><a href="https://github.com/{p["repo"]}">{html.escape(p["repo"].split("/")[1])}</a><p>{html.escape(p["description"])}</p></section>' for p in SETTINGS["pins"])
    pending = ["公众号" if key == "wechat" else "小红书" for key, value in SETTINGS["social"].items() if not value["name"] and not value["url"]]
    status = " · 待补充 " + "、".join(pending) if pending else ""
    if pending:
        social_preview = '<section class="pending-social"><h2>写作与分享</h2><p>预留位置，等待' + '、'.join(pending) + '账号信息。此提示仅用于本地预览。</p></section>'
        readme = readme.replace('<hr>', social_preview + '<hr>', 1)
    body = f'''<div class="notice">本地预览 · 尚未发布到 GitHub{status} · 外围布局为模拟，正文经 GitHub Markdown API 渲染</div>
    <div class="layout"><aside><img src="avatar.jpg" alt="BMB 当前 GitHub 头像"><h2>{html.escape(SETTINGS['name'])}</h2><div class="username">BMBWaveforms</div><p>{html.escape(SETTINGS['bio'])}</p><small><a href="{SETTINGS['blog']}">个人网站 ↗</a></small></aside>
    <main><div class="tabs"><span>Overview</span></div><section class="readme"><div class="filename">BMBWaveforms / README.md</div><article class="markdown-body">{readme}</article></section><h2 class="pin-heading">Pinned · 拟置顶顺序</h2><div class="pins">{pins}</div></main></div>'''
    (ROOT / "preview.html").write_text(document("BMB · GitHub 主页预览", body))

    note_output = ROOT / "preview/notes"
    note_output.mkdir(parents=True, exist_ok=True)
    for source, content in zip(sources[1:], rendered[1:]):
        content = content.replace('src="../assets/', 'src="../../profile/assets/')
        content = content.replace('href="../assets/', 'href="../../profile/assets/')
        body = f'<div class="note-layout"><a href="../../preview.html">← 返回主页预览</a><section class="readme"><article class="markdown-body">{content}</article></section></div>'
        (note_output / (source.stem + ".html")).write_text(document(source.stem, body))
    print(json.dumps({"preview": str(ROOT / "preview.html"), "rendered_documents": len(sources)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
