const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('     梯云社 (tiyunclub.com) 404 与 GSC 收录修复全面回归验证');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`[PASS] ${description}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${description}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// 1. 验证重定向安全性与零死循环设计
// -----------------------------------------------------------------------------
console.log('--- 任务 1：零死循环安全配置验证 ---');
const redirectsPath = path.resolve(__dirname, '..', '_redirects');
if (fs.existsSync(redirectsPath)) {
  const content = fs.readFileSync(redirectsPath, 'utf8');
  assert('_redirects 严禁包含双向循环 200 rewrite', !content.includes('/article  /article.html  200') && !content.includes('/article /article.html 200'));
} else {
  assert('_redirects 循环规则已彻底移除，由平台原生静态Clean URL安全接管', true);
}

const nginxPath = path.resolve(__dirname, '..', 'nginx.conf.example');
assert('nginx.conf.example 文件存在', fs.existsSync(nginxPath));
if (fs.existsSync(nginxPath)) {
  const content = fs.readFileSync(nginxPath, 'utf8');
  assert('Nginx 配置包含防死循环 try_files 直出规则', content.includes('try_files $uri $uri.html /index.html =404;'));
  assert('Nginx 配置严禁包含导致 internal rewrite 死循环的自身 301 规则', !content.includes('location = /article.html {\n        return 301 /article$is_args$args;\n    }'));
}

// -----------------------------------------------------------------------------
// 2. 验证前端文章路由与18个指定 Slug 映射
// -----------------------------------------------------------------------------
console.log('\n--- 任务 2：前端路由兼容与 18 个文章 Slug 映射验证 ---');
const articlePath = path.resolve(__dirname, '..', 'article.html');
const articleContent = fs.readFileSync(articlePath, 'utf8');
assert('article.html 包含无刷新地址栏规范化 replaceState', articleContent.includes('window.history.replaceState'));
assert('article.html 包含强大的 findBundledPost 智能匹配函数', articleContent.includes('function findBundledPost'));
assert('article.html canonical 规范化为 clean URL /article', articleContent.includes('https://tiyunclub.com/article?post='));

const postsDataPath = path.resolve(__dirname, '..', 'assets', 'posts-data.js');
assert('assets/posts-data.js 存在', fs.existsSync(postsDataPath));

const postsDataContent = fs.readFileSync(postsDataPath, 'utf8');
const sandbox = {};
new Function('window', postsDataContent)(sandbox);
const posts = sandbox.TIYUN_POSTS || [];
assert(`成功载入打包文章数据 (共 ${posts.length} 篇)`, posts.length >= 50);

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

const targetSlugs = [
  '07-clash-timeout-troubleshooting',
  '10-shadowrocket-ios-guide',
  '11-clash-mi-guide',
  '12-v2rayn-guide',
  '13-shadowrocket-guide',
  '14-clash-verge-rev-complete-guide',
  '15-shadowrocket-ios-subscription-guide',
  '18-hotspot-proxy-sharing-windows-android',
  '19-clash-timeout-seven-step-fix',
  '22-tun-mode-explained',
  '24-hysteria2-lossy-network-analysis',
  '29-traffic-multiplier-explained',
  '35-telegram-connecting-mtproxy-fix',
  '40-pay-as-you-go-service-guide',
  '42-one-yuan-trial-objective-review',
  '43-discount-code-saving-guide',
  '45-three-network-optimization-guide',
  '51-service-shutdown-warning-signs'
];

targetSlugs.forEach(slug => {
  const matchDirect = findBundledPost(slug);
  const matchNoNum = findBundledPost(stripPrefix(slug));
  const fileExists = fs.existsSync(path.resolve(__dirname, '..', 'posts', `${slug}.md`));
  const isPublished = matchDirect && matchDirect.status === 'published';
  assert(`Slug [${slug}] 真实存在且带序号与不带序号均能双向匹配 (published: ${isPublished})`, 
    Boolean(matchDirect && matchNoNum && fileExists && isPublished));
});

// -----------------------------------------------------------------------------
// 3. 验证专题页面 topic 参数解析
// -----------------------------------------------------------------------------
console.log('\n--- 任务 3：专题页面 topic 参数解析与四大主题验证 ---');
const topicPath = path.resolve(__dirname, '..', 'airport-topic.html');
const topicContent = fs.readFileSync(topicPath, 'utf8');
assert('airport-topic.html 包含无刷新地址栏规范化 replaceState', topicContent.includes('window.history.replaceState'));
assert('airport-topic.html 包含规范 canonical /airport-topic', topicContent.includes('https://tiyunclub.com/airport-topic?topic='));

const topicTermsMap = {
  premium: ['IPLC','IEPL','专线','BGP','企业','顶级','低延迟','隧道'],
  trials: ['试用','一元','体验','月付','测试','验证','新手'],
  budget: ['10 元','月付','平价','一元','预算','便宜','低价','轻量','低门槛'],
  value: ['平价','性价比','低价','月付','一元','折扣','优惠','合集','省钱']
};

['premium', 'trials', 'budget', 'value'].forEach(t => {
  const terms = topicTermsMap[t];
  const matched = posts.map(post => ({
    post,
    score: terms.reduce((score, term) => score + (`${post.title} ${post.description} ${(post.tags || []).join(' ')}`.toLowerCase().includes(term.toLowerCase()) ? 1 : 0), 0)
  })).filter(item => item.score > 0);
  assert(`专题 [${t}] 能识别并渲染关联文章 (匹配数: ${matched.length})`, matched.length >= 4);
});

// -----------------------------------------------------------------------------
// 4. 冲突目录检查（严禁存在同名目录引发尾部斜杠301死循环）
// -----------------------------------------------------------------------------
console.log('\n--- 附加：无导致死循环的同名目录残留检查 ---');
assert('不存在 article/ 冲突目录', !fs.existsSync(path.resolve(__dirname, '..', 'article')));
assert('不存在 airport-topic/ 冲突目录', !fs.existsSync(path.resolve(__dirname, '..', 'airport-topic')));

console.log('\n================================================================');
console.log(`回归测试结果：通过 ${passCount} 项，失败 ${failCount} 项`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
