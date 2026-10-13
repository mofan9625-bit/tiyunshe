const fs = require('fs');
const path = require('path');

const postsDataContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'posts-data.js'), 'utf8');
const sandbox = {};
new Function('window', postsDataContent)(sandbox);
const posts = sandbox.TIYUN_POSTS || [];

const toolPosts = posts.filter(p => p.category === '工具使用');
console.log('Total tools posts count:', toolPosts.length);

function stripPrefix(str) { return (str || '').replace(/^\d+[-_]/, ''); }
function findBundledPost(slugQuery) {
  if (!slugQuery) return null;
  const clean = decodeURIComponent(slugQuery).trim().toLowerCase().replace(/\.(html|md)$/i, '');
  const cleanNoNum = stripPrefix(clean);
  let hit = posts.find(p => (p.slug && p.slug.toLowerCase() === clean) || (p.source && p.source.toLowerCase().replace(/\.md$/, '') === clean));
  if (hit) return hit;
  hit = posts.find(p => Array.isArray(p.aliases) && p.aliases.some(a => a.toLowerCase() === clean));
  if (hit) return hit;
  hit = posts.find(p => {
    const postSlugNoNum = stripPrefix((p.slug || '').toLowerCase());
    const postSrcNoNum = stripPrefix((p.source || '').toLowerCase().replace(/\.md$/, ''));
    return postSlugNoNum === cleanNoNum || postSrcNoNum === cleanNoNum;
  });
  if (hit) return hit;
  hit = posts.find(p => Array.isArray(p.aliases) && p.aliases.some(a => stripPrefix(a.toLowerCase()) === cleanNoNum));
  if (hit) return hit;
  return null;
}

let allOk = true;
toolPosts.forEach((tp, i) => {
  const queryWithNum = tp.slug;
  const queryNoNum = stripPrefix(tp.slug);
  
  const m1 = findBundledPost(queryWithNum);
  const m2 = findBundledPost(queryNoNum);

  const fileExists = fs.existsSync(path.join(__dirname, '..', 'posts', tp.source));
  const hasBody = m1 && m1.body && m1.body.length > 500;
  
  if (!m1 || !m2 || !fileExists || !hasBody) {
    allOk = false;
    console.error(`[FAIL TOOL POST]: ${tp.slug}`, { m1: Boolean(m1), m2: Boolean(m2), fileExists, hasBody });
  } else {
    console.log(`[PASS ${String(i+1).padStart(2, '0')}/16]: ${tp.slug} (正文字数: ${m1.body.length}) => ${m1.title.slice(0, 26)}`);
  }
});

console.log('All 16 tool posts verified successfully:', allOk);
if (!allOk) process.exit(1);
