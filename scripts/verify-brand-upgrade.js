const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// 1. 检查 assets/posts-data.js
const postsDataPath = path.join(root, 'assets', 'posts-data.js');
const postsDataContent = fs.readFileSync(postsDataPath, 'utf8');
const sandbox = {};
const fn = new Function('window', postsDataContent);
fn(sandbox);
const posts = sandbox.TIYUN_POSTS || [];

const auditSlugs = [
  'yunjiexian-audit-2026',
  'dalaoyun-audit-2026',
  'huanqiuti-audit-2026',
  'liulianyun-audit-2026',
  'shandianshu-audit-2026',
  'shenxing-audit-2026'
];

console.log('--- 1. 验证 6 篇品牌审计文章的标签 ---');
auditSlugs.forEach(slug => {
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    console.error(`[FAIL] 未找到文章: ${slug}`);
  } else {
    const hasTag = (post.tags || []).includes('品牌审计');
    console.log(`[${hasTag ? 'PASS' : 'FAIL'}] ${slug}: tags =`, post.tags);
  }
});

// 2. 验证各 HTML 页面的导航栏
console.log('\n--- 2. 验证全站 HTML 页面的导航栏 ---');
const filesToCheck = [
  'index.html',
  'airports.html',
  'airport-topic.html',
  'knowledge.html',
  'tools.html',
  'article.html',
  'posts/global-iplc-benchmark-2026.html'
];

filesToCheck.forEach(f => {
  const p = path.join(root, f);
  const s = fs.readFileSync(p, 'utf8');
  const hasDesktopBrand = s.includes('品牌测评') && s.includes('Independent Audits / 单品审计');
  const hasMobileBrand = s.includes('brandMenuButton');
  const orderCorrect = /机场推荐[\s\S]*?品牌测评[\s\S]*?工具使用/.test(s);
  console.log(`[${f}]`);
  console.log(`  - PC端品牌测评下拉: ${hasDesktopBrand ? 'PASS' : 'FAIL'}`);
  console.log(`  - 顺序(机场推荐->品牌测评->工具使用): ${orderCorrect ? 'PASS' : 'FAIL'}`);
  console.log(`  - 移动端品牌测评抽屉: ${hasMobileBrand ? 'PASS' : 'FAIL'}`);
});
