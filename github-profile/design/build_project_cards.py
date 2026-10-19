"""Build aligned, theme-aware GitHub project cards and update only their README block."""
from pathlib import Path
import html
import json
import re
import shutil
import unicodedata
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PUBLISH = ROOT.parent.parent / 'GitHub-Profile'
WIDTH, HEIGHT = 350, 148
MANIFEST = ROOT / 'design/projects.json'


def lines_for(text, limit=20):
    lines, line, units = [], '', 0
    for char in text:
        weight = 1 if unicodedata.east_asian_width(char) in ('W', 'F') else .55
        if units + weight > limit and line:
            lines.append(line.strip())
            line, units = '', 0
        line += char
        units += weight
    if line:
        lines.append(line.strip())
    assert len(lines) <= 2, text
    return lines


def svg_card(project, theme):
    palette = {
        'dark': {'bg': '#131a24', 'border': '#303d50', 'title': '#edf2fa', 'body': '#aeb9c9', 'arrow': '#a8bfff'},
        'light': {'bg': '#ffffff', 'border': '#d1d9e0', 'title': '#1f2328', 'body': '#59636e', 'arrow': '#2450ea'},
    }[theme]
    badge = (ROOT / 'profile' / project['badge']).read_text()
    # Reuse the established category color and authored icon; avoid embedded SVG namespaces.
    color = re.search(r'\.bg\{fill:(#[0-9a-fA-F]+)', badge).group(1)
    glyph = re.search(r'<g transform="translate\(6 4\) scale\(\.58\)".*?>(.*?)</g>', badge, re.S).group(1)
    body = ''.join(f'<text class="body" x="24" y="{70 + 19*i}">{html.escape(line)}</text>' for i,line in enumerate(lines_for(project['summary'])))
    label_width = project['badge_width']
    name = html.escape(project['display_name'])
    label = html.escape(project['label'])
    description = html.escape(project['summary'])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">
<title id="title">{name}</title><desc id="desc">{description} {label}</desc>
<style>text{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}}.title{{font-size:18px;font-weight:600;fill:{palette['title']}}}.body{{font-size:13px;fill:{palette['body']}}}.label{{font-size:11px;font-weight:600;fill:#fff}}</style>
<rect x="4.5" y="4.5" width="341" height="139" rx="8" fill="{palette['bg']}" stroke="{palette['border']}"/>
<text class="title" x="24" y="38">{name}</text>
<path d="M314 24h10v10m0-10-12 12" fill="none" stroke="{palette['arrow']}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
{body}
<g transform="translate(24 108)"><rect width="{label_width}" height="22" rx="4" fill="{color}"/>
<g transform="translate(6 4) scale(.58)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{glyph}</g>
<text class="label" x="26" y="14.8">{label}</text></g>
</svg>'''


def main():
    manifest = json.loads(MANIFEST.read_text())
    assets = ROOT / 'profile/assets/projects/cards'
    assets.mkdir(parents=True, exist_ok=True)
    links = []
    for project in manifest['projects']:
        slug = Path(project['badge']).stem
        for theme in ('dark', 'light'):
            card = assets / f'{slug}-{theme}.svg'
            card.write_text(svg_card(project, theme) + '\n')
            ET.parse(card)
        project['cards'] = {theme:f'assets/projects/cards/{slug}-{theme}.svg' for theme in ('dark', 'light')}
        alt = html.escape(f"{project['display_name']} — {project['summary']} {project['label']}", quote=True)
        links.append(f'''  <a href="{project['url']}" title="{project['nameWithOwner']}"><picture><source media="(prefers-color-scheme: light)" srcset="{project['cards']['light']}"><img src="{project['cards']['dark']}" alt="{alt}" width="{WIDTH}" height="{HEIGHT}"></picture></a>''')
    rows = ['<p>\n'+'\n'.join(links)+'\n</p>']
    block = '<!-- PROJECTS_START -->\n## 📂 Projects\n\n'+'\n\n'.join(rows)+'\n<!-- PROJECTS_END -->'
    readme = ROOT / 'profile/README.md'
    original = readme.read_text()
    updated, count = re.subn(r'<!-- PROJECTS_START -->.*?<!-- PROJECTS_END -->',lambda _:block,original,flags=re.S)
    assert count == 1
    readme.write_text(updated)
    manifest['layout'] = 'Six linked SVG cards at 350x148; shared title, two-line summary, and label baselines; natural inline wrap to one column on narrow screens; light and dark variants'
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    shutil.copyfile(readme, PUBLISH / 'README.md')
    shutil.copytree(assets, PUBLISH / 'assets/projects/cards', dirs_exist_ok=True)
    print(json.dumps({'cards':6,'theme_assets':12,'size':[WIDTH,HEIGHT],'publish_checkout':str(PUBLISH)},ensure_ascii=False))


if __name__ == '__main__':
    main()
