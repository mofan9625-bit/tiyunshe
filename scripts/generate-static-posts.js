const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsRoot = path.join(root, 'posts');
const postsDataPath = path.join(root, 'assets', 'posts-data.js');
const siteUrl = 'https://tiyunclub.com';

const sandbox = {};
new Function('window', fs.readFileSync(postsDataPath, 'utf8'))(sandbox);
const posts = sandbox.TIYUN_POSTS || [];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function normalizeHref(href) {
  const value = String(href || '').trim();
  if (!value || /^(?:https?:|mailto:|tel:|#|\/)/i.test(value)) return value;
  if (/^\.\.\//.test(value)) return `/${value.replace(/^(?:\.\.\/)+/, '')}`;
  if (/\.md(?:[?#].*)?$/i.test(value)) {
    const clean = value.split(/[?#]/)[0].replace(/\.md$/i, '');
    return `/posts/${path.basename(clean)}/`;
  }
  return value;
}

function renderInline(value) {
  let html = escapeHtml(value);
  html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
    (_, alt, src) => `<img src="${escapeHtml(normalizeHref(src))}" alt="${alt}" loading="lazy">`);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g, (_, label, href) => {
    const target = normalizeHref(href);
    const external = /^https?:/i.test(target);
    return `<a href="${escapeHtml(target)}"${external ? ' target="_blank" rel="noopener noreferrer sponsored"' : ''}>${label}</a>`;
  });
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html;
}

function renderMarkdown(markdown) {
  const lines = String(markdown || '').replace(/\r/g, '').split('\n');
  const output = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      output.push(`<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      if (level > 1) output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\|/.test(line) && index + 1 < lines.length && /^\|?[\s:|-]+\|/.test(lines[index + 1])) {
      const rows = [];
      while (index < lines.length && /^\|/.test(lines[index])) rows.push(lines[index++]);
      const parseRow = row => row.split('|').slice(1, -1).map(cell => cell.trim());
      const headers = parseRow(rows[0]);
      const bodyRows = rows.slice(2).map(parseRow);
      output.push(`<table><thead><tr>${headers.map(cell => `<th>${renderInline(cell)}</th>`).join('')}</tr></thead><tbody>${bodyRows.map(row => `<tr>${row.map(cell => `<td>${renderInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
      output.push(`<blockquote>${quote.map(renderInline).join('<br>')}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) items.push(lines[index++].replace(/^[-*]\s+/, ''));
      output.push(`<ul>${items.map(item => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) items.push(lines[index++].replace(/^\d+\.\s+/, ''));
      output.push(`<ol>${items.map(item => `<li>${renderInline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim()
      && !/^(?:#{1,3}\s|```|>\s?|[-*]\s+|\d+\.\s+|\|)/.test(lines[index])) {
      paragraph.push(lines[index++].trim());
    }
    output.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
  }

  return output.join('\n');
}

function pageFor(post) {
  const canonical = `${siteUrl}/posts/${encodeURIComponent(post.slug)}/`;
  const isTool = post.category === '工具使用';
  const backHref = isTool ? '/tools.html' : '/knowledge.html';
  const backLabel = isTool ? '← 返回工具使用' : '← 返回知识库';
  const body = renderMarkdown(post.body);
  const title = escapeHtml(post.title);
  const description = escapeHtml(post.description);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="梯云社 / TIYUN CLUB">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <title>${title}｜梯云社</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js" defer></script>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: '梯云社编辑部' },
    publisher: { '@type': 'Organization', name: '梯云社', url: `${siteUrl}/` },
    mainEntityOfPage: canonical
  }).replace(/</g, '\\u003c')}</script>
  <style>
    *{box-sizing:border-box}::selection{background:#111;color:#fff}
    .article-body{color:#1a1a1a;font-size:1.0625rem;line-height:1.9}.article-body>*+*{margin-top:1.6rem}
    .article-body h2{margin-top:4rem;padding-bottom:.65rem;border-bottom:1px solid #e5e7eb;font-size:1.8rem;line-height:1.35;font-weight:700}
    .article-body h3{margin-top:2.75rem;padding-bottom:.5rem;border-bottom:1px solid #e5e7eb;font-size:1.3rem;line-height:1.4;font-weight:700}
    .article-body a{text-decoration:underline;text-underline-offset:4px}.article-body blockquote{border-left:3px solid #111;padding:1rem 0 1rem 1.5rem;color:#374151;background:#fafafa}
    .article-body ul,.article-body ol{padding-left:1.5rem}.article-body ul{list-style:square}.article-body ol{list-style:decimal}.article-body li+li{margin-top:.55rem}
    .article-body code:not(pre code){background:#f3f4f6;padding:.15rem .35rem;font-family:monospace;font-size:.9em}.article-body pre{overflow-x:auto;background:#111;color:#f9fafb;padding:1.4rem;font-size:.875rem;line-height:1.7}
    .article-body table{display:block;overflow-x:auto;width:100%;min-width:42rem;border-collapse:collapse;border-top:1px solid #111;border-bottom:1px solid #111;font-size:.9rem}.article-body th,.article-body td{padding:.8rem .55rem;text-align:left;border-bottom:1px solid #e5e7eb;vertical-align:top}.article-body th{font-weight:700;background:#fafafa}
  </style>
</head>
<body class="bg-white text-[#111] antialiased">
  <header class="border-b border-gray-200 bg-white"><div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20"><a href="/" class="text-xl font-black">梯云社</a><nav class="flex items-center gap-5 text-sm"><a href="/airports.html">机场推荐</a><a href="/tools.html">工具使用</a><a href="/knowledge.html">知识库</a></nav></div></header>
  <main><article>
    <header class="border-b border-gray-200"><div class="mx-auto max-w-5xl px-5 py-14 md:py-24">
      <a href="${backHref}" class="text-sm text-gray-500 hover:text-black">${backLabel}</a>
      <div class="mt-10 flex flex-wrap items-center gap-3 text-xs text-gray-500"><span class="border border-gray-300 px-3 py-1 font-mono text-black">${escapeHtml(post.category || '文章')}</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(String(post.date || '').replaceAll('-', '.'))}</time><span>·</span><span>${Number(post.readingMinutes) || 5} MIN READ</span></div>
      <h1 class="mt-7 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">${title}</h1>
      <p class="mt-8 max-w-3xl text-lg leading-relaxed text-gray-600">${description}</p>
      <div class="mt-10 flex items-center gap-4 border-t border-gray-200 pt-5 text-sm"><div class="flex h-10 w-10 items-center justify-center bg-black font-bold text-white">TY</div><div><p class="font-semibold">梯云社编辑部</p><p class="text-xs text-gray-500">Network Research · 2026</p></div></div>
    </div></header>
    <div class="mx-auto max-w-3xl px-5 py-14 md:py-20"><div class="article-body">${body}</div></div>
  </article></main>
  <footer class="border-t border-gray-200 bg-[#fafafa] py-8"><div class="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 text-xs text-gray-500"><span>© 2026 TIYUN CLUB</span><a href="/sitemap.xml">SITEMAP</a></div></footer>
  <script>document.addEventListener('DOMContentLoaded',()=>{if(window.lucide)lucide.createIcons()});</script>
  <script src="/assets/airport-menu.js" defer></script>
</body>
</html>\n`;
}

for (const post of posts) {
  const outputDir = path.join(postsRoot, post.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), pageFor(post), 'utf8');
}

console.log(`Generated ${posts.length} crawlable static article pages.`);
