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
// 1. 验证服务器重定向与路由规则 (_redirects & nginx.conf.example)
// -----------------------------------------------------------------------------
console.log('--- 任务 1：服务端 301 重定向与 Clean URL 规则验证 ---');
const redirectsPath = path.resolve(__dirname, '..', '_redirects');
assert('_redirects 文件存在', fs.existsSync(redirectsPath));
if (fs.existsSync(redirectsPath)) {
  const content = fs.readFileSync(redirectsPath, 'utf8');
  assert('_redirects 包含 /article.html -> /article 301!', content.includes('/article.html         /article         301!'));
  assert('_redirects 包含 /airport-topic.html -> /airport-topic 301!', content.includes('/airport-topic.html   /airport-topic   301!'));
  assert('_redirects 包含 /article 200 rewrite 回退', content.includes('/article              /article.html         200'));
  assert('_redirects 包含 /airport-topic 200 rewrite 回退', content.includes('/airport-topic        /airport-topic.html   200'));
}

const nginxPath = path.resolve(__dirname, '..', 'nginx.conf.example');
assert('nginx.conf.example 文件存在', fs.existsSync(nginxPath));
if (fs.existsSync(nginxPath)) {
  const content = fs.readFileSync(nginxPath, 'utf8');
  assert('Nginx 配置包含 /article.html 301 规则 (保留 query: $is_args$args)', content.includes('return 301 /article$is_args$args;'));
  assert('Nginx 配置包含 /airport-topic.html 301 规则 (保留 query: $is_args$args)', content.includes('return 301 /airport-topic$is_args$args;'));
  assert('Nginx 配置包含 Clean URLs try_files 回退', content.includes('try_files $uri $uri.html $uri/ /index.html =404;'));
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
// 4. 静态降级目录检查
// -----------------------------------------------------------------------------
console.log('\n--- 附加：静态目录 Clean URL 回退目录检查 ---');
assert('article/index.html 存在', fs.existsSync(path.resolve(__dirname, '..', 'article', 'index.html')));
assert('airport-topic/index.html 存在', fs.existsSync(path.resolve(__dirname, '..', 'airport-topic', 'index.html')));

console.log('\n================================================================');
console.log(`回归测试结果：通过 ${passCount} 项，失败 ${failCount} 项`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
