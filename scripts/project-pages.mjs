import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// Metadata defines the index; the two HTML fragments keep each story free-form.
// These are trusted, locally authored fragments, never visitor-supplied HTML.
export function renderProjectPage({template, project, hero, story}) {
  if (typeof project.title !== 'string' || !project.title.trim() || typeof project.description !== 'string' || !project.description.trim()) throw new Error('Project title and description are required');
  if (!Array.isArray(project.chapters) || !project.chapters.length) throw new Error('A project needs at least one chapter');
  const ids = project.chapters.map(chapter => chapter.id);
  if (ids.some(id => typeof id !== 'string' || !slugPattern.test(id)) || new Set(ids).size !== ids.length || project.chapters.some(chapter => typeof chapter.label !== 'string' || !chapter.label.trim())) {
    throw new Error('Chapter IDs must be unique slugs and each chapter needs a label');
  }
  const sections = [...story.matchAll(/<section\b[^>]*>/g)].filter(([tag]) => /\bclass="[^"]*\bproject-section\b/.test(tag));
  const sectionIds = sections.map(([tag]) => tag.match(/\bid="([^"]+)"/)?.[1]);
  if (JSON.stringify(ids) !== JSON.stringify(sectionIds)) throw new Error('Chapter index must match the story section IDs and order');
  const values = {
    pageTitle:escape(project.title + ' — Ryan'),
    description:escape(project.description),
    hero,
    story,
    chapterLinks:project.chapters.map((chapter, index) => `          <a${index === 0 ? ' class="is-current" aria-current="location"' : ''} href="#${chapter.id}">${escape(chapter.label)}</a>`).join('\n')
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error('Unknown project template slot: ' + key);
    return values[key];
  });
}

export async function loadProjectPage(root, slug) {
  if (!slugPattern.test(slug)) return null;
  const folder = resolve(root, 'content/projects', slug);
  let metadata;
  try { metadata = await readFile(resolve(folder, 'project.json'), 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  const [template, hero, story] = await Promise.all([
    readFile(resolve(root, 'templates/project-page.html'), 'utf8'),
    readFile(resolve(folder, 'hero.html'), 'utf8'),
    readFile(resolve(folder, 'story.html'), 'utf8')
  ]);
  try { return renderProjectPage({template, project:JSON.parse(metadata), hero, story}); }
  catch (error) { throw new Error(`Project ${slug}: ${error.message}`, {cause:error}); }
}

export async function buildProjectPages(root = resolve('.')) {
  const entries = await readdir(resolve(root, 'content/projects'), {withFileTypes:true});
  const slugs = entries.filter(entry => entry.isDirectory() && slugPattern.test(entry.name)).map(entry => entry.name).sort();
  for (const slug of slugs) {
    const html = await loadProjectPage(root, slug);
    if (html === null) throw new Error('Missing project.json for ' + slug);
    const folder = resolve(root, 'projects', slug);
    await mkdir(folder, {recursive:true});
    await writeFile(resolve(folder, 'index.html'), html);
  }
  return slugs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const slugs = await buildProjectPages();
  console.log(`Generated ${slugs.length} project page(s): ${slugs.join(', ')}`);
}
