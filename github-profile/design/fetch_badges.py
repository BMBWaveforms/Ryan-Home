"""Download static Shields badges for the profile; no runtime service dependency."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import subprocess
import urllib.parse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "profile/assets/badges"
BADGES = [
    ("html", "HTML5", "D94A27", "html5", ""),
    ("css", "CSS", "2454D8", "css", ""),
    ("javascript", "JavaScript", "F7DF1E", "javascript", ""),
    ("github", "GitHub", "24292F", "github", ""),
    ("macos", "macOS", "111111", "apple", ""),
    ("codex", "Codex", "171717", "", ""),
    ("skills", "Agent Skills", "7450BF", "", ""),
    ("prompt", "Prompt Engineering", "087F68", "", ""),
    ("aigc", "AIGC Experiments", "B94532", "", ""),
    ("product", "Product Research", "2463AC", "", ""),
    ("agent", "Agent Research", "6851AA", "", ""),
    ("opensource", "Open Source", "344D40", "github", ""),
    ("writing", "Writing", "916310", "", ""),
    ("website", "Website", "2450EA", "", ""),
    ("contact", "Email", "7450BF", "", ""),
    ("xiaohongshu-link", "小红书", "E32646", "xiaohongshu", ""),
    ("email", "Say Hello", "7450BF", "", "Email"),
    ("xiaohongshu", "我的主页", "E32646", "xiaohongshu", "小红书"),
    ("wechat", "碳基推理中", "078443", "wechat", "公众号"),
]


def fetch(badge):
    name, message, color, logo, label = badge
    parts = [label, message, color] if label else [message, color]
    path = "-".join(urllib.parse.quote(p.replace("-", "--"), safe="") for p in parts)
    query = {"style": "flat-square"}
    if logo:
        query.update(logo=logo, logoColor="111111" if name == "javascript" else "white")
    url = "https://img.shields.io/badge/" + path + "?" + urllib.parse.urlencode(query)
    data = subprocess.run(["/usr/bin/curl", "--fail", "--silent", "--show-error", "--location",
                           "--max-time", "30", "--retry", "1", url],
                          check=True, capture_output=True).stdout
    svg = ET.fromstring(data)
    if not svg.tag.endswith("svg") or b"badge not found" in data:
        raise ValueError(f"Invalid badge: {name}")
    (DEST / f"{name}.svg").write_bytes(data)
    # README uses width, preserving a 24px height in GitHub's responsive image CSS.
    return {"name": name, "label": svg.attrib.get("aria-label"), "url": url,
            "width": round(float(svg.attrib["width"]) * 1.2),
            "height": 24, "bytes": len(data)}


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        manifest = list(pool.map(fetch, BADGES))
    (ROOT / "design/badges.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(manifest, ensure_ascii=False))
