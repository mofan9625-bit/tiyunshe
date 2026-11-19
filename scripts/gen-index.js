const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputFile = path.join(root, 'CONTENT_INDEX.md');

// 扫描目标目录：涵盖项目实际的 posts, docs/posts 以及标准约定的 src/content, src/pages
const candidateDirs = [
  path.join(root, 'posts'),
  path.join(root, 'docs', 'posts'),
  path.join(root, 'src', 'content'),
  path.join(root, 'src', 'pages')
].filter(fs.existsSync);

function parseFrontMatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(':');
    if (separator < 0) return;
    const key = line.slice(0, separator).trim();
    let val = line.slice(separator + 1).trim();
    val = val.replace(/^['"]|['"]$/g, '');
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

function extractFirstH1(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (/\.(md|mdx)$/i.test(dirent.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const seenSlugs = new Set();
const articles = [];

for (const dir of candidateDirs) {
  const files = getMarkdownFiles(dir);
  for (const file of files) {
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    const content = fs.readFileSync(file, 'utf8');
    const { meta, body } = parseFrontMatter(content);

    const slug = meta.slug || fileNameWithoutExt;
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const title = meta.title || extractFirstH1(body) || slug;
    const rawDate = meta.date || meta.pubDate || '1970-01-01';
    const date = String(rawDate).replace(/\./g, '-').trim();

    // 提取 tags 或 keywords
    let rawTags = meta.tags || meta.keywords || meta.category || '';
    if (typeof rawTags === 'string') {
      rawTags = rawTags.replace(/[\[\]'"]/g, '').split(',').map(t => t.trim()).filter(Boolean);
    } else if (!Array.isArray(rawTags)) {
      rawTags = [];
    }
    const tagsText = rawTags.length > 0 ? rawTags.join(', ') : '无';

    const relativeUrl = `posts/${encodeURIComponent(slug)}/`;

    articles.push({
      date,
      title,
      slug,
      url: relativeUrl,
      keywords: tagsText
    });
  }
}

// 按日期倒序排列，日期相同则按标题字母序
articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// 生成 CONTENT_INDEX.md 内容
const header = `# 梯云社全站文章索引与内链指引 (CONTENT_INDEX.md)

> ⚠️ **强制规范**：每次规划或撰写新文章前，必须先通读本文件进行**选题查重**与**内链闭环匹配**。严禁编写与既有文章标题/核心词高度重合的内容。
> **自动化维护**：本文件由 \`node scripts/gen-index.js\` 自动扫描生成。
> **当前收录文章总数**：${articles.length} 篇 | **最后生成时间**：${new Date().toISOString().slice(0, 10)}

---

## 全站文章清单（按发布日期倒序）

`;

const lines = articles.map(a => `- [${a.date}] [${a.title}](${a.url}) | 关键词: ${a.keywords}`);
const finalContent = header + lines.join('\n') + '\n';

fs.writeFileSync(outputFile, finalContent, 'utf8');
console.log(`[Success] 已成功提取 ${articles.length} 篇文章索引，并按日期倒序写入: CONTENT_INDEX.md`);
