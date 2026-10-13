const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const postsDirPath = path.join(root, 'posts');
const postHtmlPath = path.join(postsDirPath, 'global-iplc-benchmark-2026.html');
const postsDataPath = path.join(root, 'assets', 'posts-data.js');
const buildContentPath = path.join(root, 'scripts', 'build-content.js');

console.log('[SEO-Prerender] 开始执行 SEO 规范重构与静态化改造流程...');

// 1. 读取 posts-data.js 数据
if (!fs.existsSync(postsDataPath)) {
  console.error('[Error] 未找到 assets/posts-data.js 文件');
  process.exit(1);
}

const postsDataContent = fs.readFileSync(postsDataPath, 'utf8');
const dataSandbox = {};
const evaluateData = new Function('window', postsDataContent);
evaluateData(dataSandbox);
const posts = dataSandbox.TIYUN_POSTS || [];
console.log(`[SEO-Prerender] 成功读取到 ${posts.length} 篇文章数据。`);

// 2. 创建 posts/global-iplc-benchmark-2026.html 独立静态页面
const postHtmlContent = `<!doctype html>
<html lang="zh-CN" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="历时 90 天，跨越 12 个地区、36 条跨境线路实测。我们重新定义了稳定性测试的基准：不迷信单机单线程峰值测速，以晚高峰可用率、P95 延迟与抖动建立综合评价模型。">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://tiyunclub.com/posts/global-iplc-benchmark-2026.html">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="梯云社 / TIYUN CLUB">
  <meta property="og:title" content="2026 全球专线横评：稳定，比峰值更重要 - 梯云社">
  <meta property="og:description" content="历时 90 天，跨越 12 个地区、36 条线路。我们重新定义了稳定性测试的基准。">
  <meta property="og:url" content="https://tiyunclub.com/posts/global-iplc-benchmark-2026.html">
  <meta property="og:image" content="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="2026 全球专线横评：稳定，比峰值更重要 - 梯云社">
  <meta name="twitter:description" content="历时 90 天，跨越 12 个地区、36 条线路。我们重新定义了稳定性测试的基准。">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85">

  <title>2026 全球专线横评：稳定，比峰值更重要 - 梯云社</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ink: '#111111',
            muted: '#6B7280',
            line: '#E5E7EB',
            paper: '#FAFAFA'
          },
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
            mono: ['"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'monospace']
          }
        }
      }
    }
  </script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js" defer></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "2026 全球专线横评：稳定，比峰值更重要",
    "description": "历时 90 天，跨越 12 个地区、36 条线路。我们重新定义了稳定性测试的基准。",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
    "datePublished": "2026-09-28T00:00:00+08:00",
    "dateModified": "2026-09-28T00:00:00+08:00",
    "author": {
      "@type": "Organization",
      "name": "梯云社编辑部",
      "url": "https://tiyunclub.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "梯云社",
      "url": "https://tiyunclub.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://tiyunclub.com/posts/global-iplc-benchmark-2026.html"
    }
  }
  </script>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { letter-spacing: 0; }
    ::selection { background: #111; color: #fff; }
    .nav-link, .text-link { position: relative; }
    .nav-link::after, .text-link::after {
      content: ""; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px;
      background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .25s ease;
    }
    .nav-link:hover::after, .text-link:hover::after { transform: scaleX(1); transform-origin: left; }
    .dropdown-panel { opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity .18s ease, transform .18s ease, visibility 0s linear .18s; }
    .dropdown:hover .dropdown-panel, .dropdown:focus-within .dropdown-panel { opacity: 1; visibility: visible; transform: translateY(0); transition-delay: 0s; }
    .prose-editorial { color: #1a1a1a; font-size: 1.0625rem; line-height: 1.9; }
    .prose-editorial > * + * { margin-top: 1.65rem; }
    .prose-editorial h2 { margin-top: 4rem; padding-bottom: .65rem; border-bottom: 1px solid #e5e7eb; font-size: 1.8rem; line-height: 1.3; font-weight: 700; }
    .prose-editorial h3 { margin-top: 2.75rem; padding-bottom: .5rem; border-bottom: 1px solid #e5e7eb; font-size: 1.3rem; line-height: 1.4; font-weight: 700; }
    .prose-editorial a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
    .prose-editorial blockquote { border-left: 3px solid #111; padding: .25rem 0 .25rem 1.5rem; color: #4b5563; font-size: 1.15rem; }
    .prose-editorial code:not(pre code) { background: #f3f4f6; padding: .15rem .35rem; font-family: monospace; font-size: .9em; }
    .prose-editorial pre { overflow-x: auto; background: #111; color: #f9fafb; padding: 1.4rem; font-size: .875rem; line-height: 1.7; }
    .prose-editorial table { width: 100%; border-collapse: collapse; border-top: 1px solid #111; border-bottom: 1px solid #111; font-size: .95rem; }
    .prose-editorial th, .prose-editorial td { padding: .8rem .5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .prose-editorial th { font-weight: 700; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
    input[type="search"]::-webkit-search-cancel-button { display: none; }
  </style>
</head>
<body class="bg-white font-sans text-ink antialiased">
  <header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
    <div class="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-5 md:h-20 md:px-10 xl:px-16">
      <a href="../index.html" class="flex items-baseline gap-2" aria-label="梯云社首页">
        <span class="text-xl font-black">梯云社</span>
        <span class="hidden text-[10px] font-bold uppercase tracking-widest text-muted sm:inline">Tiyun Club</span>
      </a>

      <nav class="hidden items-center gap-7 text-sm font-medium xl:flex" aria-label="主导航">
        <a class="nav-link" href="../index.html">首页</a>
        <div class="dropdown relative flex h-20 items-center">
          <a class="nav-link flex items-center gap-1" href="../airports.html" aria-haspopup="true">机场推荐 <i data-lucide="chevron-down" class="h-3.5 w-3.5"></i></a>
          <div class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-3">
            <div class="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
              <p class="px-3 pb-2 pt-1 text-xs font-bold text-gray-500">2026 年度综合排行榜</p>
              <div class="grid gap-0.5 text-sm">
                <a href="../airport-topic.html?topic=stable" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">🛡️</span>稳定抗封锁专线榜</a>
                <a href="../airport-topic.html?topic=value" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">💎</span>平价高性价比机场榜</a>
                <a href="../airport-topic.html?topic=premium" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">⚡</span>IEPL / IPLC 顶级专线榜</a>
                <a href="../airport-topic.html?topic=budget" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">💰</span>10元内平价月付合集</a>
                <a href="../airport-topic.html?topic=payg" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">⏱️</span>按量计费与不限时套餐</a>
                <a href="../airport-topic.html?topic=discounts" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">🎟️</span>2026 最新独家优惠码</a>
                <a href="../airport-topic.html?topic=trials" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">🎁</span>免费试用与一元体验</a>
              </div>
            </div>
          </div>
        </div>
        <a class="nav-link" href="../tools.html">工具使用</a>
        <a class="nav-link" href="../knowledge.html">知识库</a>
        <a class="nav-link" href="../index.html#about">关于</a>
        <button type="button" data-search-open class="p-2 transition-colors hover:bg-gray-100" aria-label="搜索">
          <i data-lucide="search" class="h-4 w-4"></i>
        </button>
        <a href="../disclaimer.html" class="nav-link text-xs">免责声明</a>
      </nav>

      <div class="flex items-center gap-1 xl:hidden">
        <button type="button" data-search-open class="p-2.5" aria-label="搜索"><i data-lucide="search" class="h-5 w-5"></i></button>
        <button id="menuButton" type="button" class="p-2.5" aria-expanded="false" aria-controls="mobileMenu" aria-label="打开菜单">
          <i data-lucide="menu" class="h-5 w-5"></i>
        </button>
      </div>
    </div>
    <nav id="mobileMenu" class="hidden border-t border-line bg-white px-5 py-5 xl:hidden" aria-label="移动端导航">
      <div class="grid gap-4 text-sm font-medium">
        <a href="../index.html">首页</a>
        <div><button id="airportMenuButton" type="button" class="flex w-full items-center justify-between text-left" aria-expanded="false" aria-controls="airportMobileMenu"><span>机场推荐</span><i data-lucide="chevron-down" class="h-4 w-4 transition-transform"></i></button><div id="airportMobileMenu" class="mt-3 hidden border-l border-line pl-4"><p class="pb-2 text-xs font-bold text-muted">2026 年度综合排行榜</p><div class="grid gap-1 text-sm font-normal"><a class="py-1.5 font-semibold" href="../airports.html">查看机场品牌排行榜 →</a><a class="py-1.5" href="../airport-topic.html?topic=stable">🛡️ 稳定抗封锁专线榜</a><a class="py-1.5" href="../airport-topic.html?topic=value">💎 平价高性价比机场榜</a><a class="py-1.5" href="../airport-topic.html?topic=premium">⚡ IEPL / IPLC 顶级专线榜</a><a class="py-1.5" href="../airport-topic.html?topic=budget">💰 10元内平价月付合集</a><a class="py-1.5" href="../airport-topic.html?topic=payg">⏱️ 按量计费与不限时套餐</a><a class="py-1.5" href="../airport-topic.html?topic=discounts">🎟️ 2026 最新独家优惠码</a><a class="py-1.5" href="../airport-topic.html?topic=trials">🎁 免费试用与一元体验</a></div></div></div>
        <a href="../tools.html">工具使用</a>
        <a href="../knowledge.html">知识库</a><a href="../index.html#about">关于</a><a href="../disclaimer.html">免责声明</a>
      </div>
    </nav>
  </header>

  <main>
    <article id="postArticle">
      <header class="border-b border-line">
        <div class="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
          <a href="../index.html" class="text-link text-sm text-muted">← 返回文章列表</a>
          <div class="mt-12 flex flex-wrap items-center gap-3 text-xs text-muted"><span class="border border-gray-300 px-3 py-1 font-mono text-ink">年度横评</span><span>UPDATED 2026.09.28</span><span>·</span><span>18 MIN READ</span></div>
          <h1 class="mt-7 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">2026 全球专线横评：稳定，比峰值更重要</h1>
          <p class="mt-8 max-w-3xl text-lg leading-relaxed text-gray-600">历时 90 天，跨越 12 个地区、36 条线路。我们重新定义了稳定性测试的基准。</p>
          <div class="mt-10 flex items-center gap-4 border-t border-line pt-5 text-sm"><div class="flex h-10 w-10 items-center justify-center bg-ink font-bold text-white">TY</div><div><p class="font-semibold">梯云社编辑部</p><p class="text-xs text-muted">Network Research · 2026</p></div></div>
        </div>
      </header>
      <figure class="mx-auto max-w-screen-xl px-5 py-8 md:px-10 md:py-12"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=90" alt="地球夜间网络连接的卫星视角" class="aspect-[16/8] w-full object-cover grayscale"><figcaption class="mt-3 font-mono text-xs text-muted">FIG. 01 — GLOBAL NETWORK / IMAGE: UNSPLASH</figcaption></figure>
      <div class="mx-auto max-w-3xl px-5 pb-24 pt-8 md:px-8 md:pb-32">
        <div class="prose-editorial">
          <p class="text-xl leading-relaxed">一条线路的价值，不在测速截图出现过多高的数字，而在你真正需要它时，是否依然保持稳定。过去三个月，我们以统一环境对 36 条跨境线路进行了持续采样。</p>
          <p>测试覆盖工作日与周末、白天与晚高峰。除吞吐量外，我们把抖动、丢包、路由变化与故障恢复时间纳入同一套评价模型。</p>
          <blockquote>峰值速度是广告语言，稳定性才是用户体验。一次漂亮的测速，无法代表一整个月的连接质量。</blockquote>
          <h2>01 / 测试方法</h2>
          <p>所有测试节点使用相同配置，并通过自动化任务每 15 分钟采集一次数据。原始结果以 <code>JSON Lines</code> 保存，再按小时聚合。</p>
          <pre><code>// simplified probe configuration
{
  "interval": "15m",
  "metrics": ["latency", "jitter", "loss", "throughput"],
  "regions": 12,
  "duration_days": 90
}</code></pre>
          <h3>评价权重</h3>
          <p>我们没有直接采用平均速度。极端峰值会扭曲结果，因此中位数、P95 延迟与晚高峰可用率获得更高权重。</p>
          <div class="overflow-x-auto"><table><thead><tr><th>指标</th><th>权重</th><th>合格线</th></tr></thead><tbody><tr><td>晚高峰可用率</td><td>35%</td><td>≥ 99.5%</td></tr><tr><td>P95 延迟</td><td>25%</td><td>≤ 180 ms</td></tr><tr><td>抖动</td><td>20%</td><td>≤ 12 ms</td></tr><tr><td>有效吞吐</td><td>20%</td><td>≥ 80 Mbps</td></tr></tbody></table></div>
          <h2>02 / 结论</h2>
          <p>优质线路的共同点不是永远最快，而是波动范围窄、路由切换克制、故障恢复迅速。对于远程办公与实时通信，这些特征比峰值带宽更有意义。</p>
          <p>完整原始数据与复现脚本将在整理后发布到 <a href="https://github.com/" target="_blank" rel="nofollow sponsored noopener noreferrer">GitHub 仓库</a>，方便读者独立验证。</p>
        </div>
        <footer class="mt-16 border-t border-ink pt-6"><div class="flex flex-wrap items-center justify-between gap-4"><p class="text-sm text-muted">本文最后更新于 2026 年 9 月 28 日</p><div class="flex gap-2"><button class="border border-line p-2.5 hover:border-ink" aria-label="复制链接" onclick="navigator.clipboard?.writeText(location.href)"><i data-lucide="link" class="h-4 w-4"></i></button><button class="border border-line p-2.5 hover:border-ink" aria-label="分享文章" onclick="if(navigator.share){navigator.share({title:document.title,url:location.href})}else{navigator.clipboard?.writeText(location.href)}"><i data-lucide="share-2" class="h-4 w-4"></i></button></div></div></footer>
      </div>
    </article>
  </main>

  <footer class="bg-paper">
    <div class="mx-auto max-w-screen-2xl px-5 py-10 md:px-10 xl:px-16">
      <div class="flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-end">
        <div><a href="../index.html" class="text-xl font-black">梯云社</a><p class="mt-3 max-w-md text-xs leading-relaxed text-muted">本站内容仅供技术研究与信息参考，不构成任何服务推荐或投资建议。</p></div>
        <div class="flex flex-wrap items-center gap-5 text-xs"><span class="text-muted">© 2026 TIYUN CLUB</span><a class="hover:text-muted" href="../sitemap.xml">SITEMAP</a><a class="hover:text-muted" href="../disclaimer.html">免责声明</a><a href="https://github.com/" target="_blank" rel="nofollow noopener noreferrer" aria-label="GitHub"><i data-lucide="github" class="h-4 w-4"></i></a><a href="https://x.com/" target="_blank" rel="nofollow noopener noreferrer" aria-label="X"><i data-lucide="twitter" class="h-4 w-4"></i></a></div>
      </div>
    </div>
  </footer>

  <div id="searchDialog" class="fixed inset-0 z-[200] hidden overflow-y-auto bg-white" role="dialog" aria-modal="true" aria-labelledby="searchTitle">
    <header class="border-b border-line"><div class="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-5 md:h-20 md:px-10 xl:px-16"><div><p class="text-lg font-black">梯云社</p><h2 id="searchTitle" class="font-mono text-[10px] uppercase text-muted">Search / 站内搜索</h2></div><button id="searchClose" type="button" class="flex h-10 w-10 items-center justify-center border border-transparent transition-colors hover:border-ink" aria-label="关闭搜索"><i data-lucide="x" class="h-5 w-5"></i></button></div></header>
    <div class="mx-auto max-w-5xl px-5 pb-20 pt-12 md:px-10 md:pt-20">
      <div class="flex items-end gap-4 border-b-2 border-ink pb-4"><i data-lucide="search" class="mb-1 h-5 w-5 shrink-0 md:h-6 md:w-6"></i><label for="searchInput" class="sr-only">搜索关键词</label><input id="searchInput" type="search" autocomplete="off" placeholder="输入文章、工具或问题" class="min-w-0 flex-1 bg-transparent text-3xl font-bold leading-tight outline-none placeholder:text-gray-300 md:text-5xl"><span id="searchCount" class="hidden shrink-0 pb-1 font-mono text-[11px] text-muted"></span></div>
      <div id="searchDefault" class="mt-10"><p class="font-mono text-[11px] uppercase text-muted">Quick Access / 快捷入口</p><div class="mt-4 grid border-l border-t border-line sm:grid-cols-3"><a href="../tools.html" class="group flex items-center justify-between border-b border-r border-line p-5 text-sm font-semibold hover:bg-gray-50">工具使用 <i data-lucide="arrow-up-right" class="h-4 w-4"></i></a><a href="../airports.html" class="group flex items-center justify-between border-b border-r border-line p-5 text-sm font-semibold hover:bg-gray-50">机场推荐 <i data-lucide="arrow-up-right" class="h-4 w-4"></i></a><a href="../knowledge.html" class="group flex items-center justify-between border-b border-r border-line p-5 text-sm font-semibold hover:bg-gray-50">全部文章 <i data-lucide="arrow-up-right" class="h-4 w-4"></i></a></div></div>
      <div id="searchResults" class="mt-10 hidden border-t border-ink"></div>
      <div id="searchEmpty" class="mt-16 hidden border-y border-line py-12"><p class="text-xl font-bold">没有找到相关文章</p><p class="mt-3 text-sm text-muted">换一个更短的关键词再试。</p></div>
    </div>
  </div>

  <script src="../assets/posts-data.js?v=4"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
      const menu = document.getElementById('mobileMenu');
      const menuButton = document.getElementById('menuButton');
      const airportMenuButton = document.getElementById('airportMenuButton');
      const airportMobileMenu = document.getElementById('airportMobileMenu');
      const searchDialog = document.getElementById('searchDialog');
      const searchInput = document.getElementById('searchInput');
      const searchDefault = document.getElementById('searchDefault');
      const searchResults = document.getElementById('searchResults');
      const searchEmpty = document.getElementById('searchEmpty');
      const searchCount = document.getElementById('searchCount');
      const posts = window.TIYUN_POSTS || [];

      menuButton?.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        menuButton.setAttribute('aria-expanded', String(open));
      });
      airportMenuButton?.addEventListener('click', () => {
        const open = airportMobileMenu.classList.toggle('hidden') === false;
        airportMenuButton.setAttribute('aria-expanded', String(open));
        airportMenuButton.querySelector('svg')?.classList.toggle('rotate-180', open);
      });

      const renderSearch = () => {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const matches = query ? posts.filter(post => \`\${post.title} \${post.description} \${(post.tags || []).join(' ')}\`.toLocaleLowerCase().includes(query)).slice(0, 12) : [];
        searchDefault.classList.toggle('hidden', Boolean(query));
        searchResults.classList.toggle('hidden', !query || !matches.length);
        searchEmpty.classList.toggle('hidden', !query || Boolean(matches.length));
        searchCount.classList.toggle('hidden', !query);
        searchCount.textContent = \`\${String(matches.length).padStart(2, '0')} RESULTS\`;
        searchResults.innerHTML = matches.map((post, index) => \`<a href="../\${post.url}" class="group grid gap-3 border-b border-line py-6 transition-colors hover:bg-gray-50 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:px-3"><span class="font-mono text-xs text-muted">\${String(index + 1).padStart(2, '0')}</span><span><span class="text-xs text-muted">\${post.category}</span><strong class="mt-1 block text-lg leading-snug md:text-xl">\${post.title}</strong><span class="mt-2 line-clamp-1 block text-sm text-gray-600">\${post.description}</span></span><span class="flex items-center gap-3 font-mono text-[11px] text-muted">\${post.readingMinutes} MIN <i data-lucide="arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1"></i></span></a>\`).join('');
        if (window.lucide) lucide.createIcons();
      };
      const openSearch = () => { searchDialog.classList.remove('hidden'); document.body.classList.add('overflow-hidden'); setTimeout(() => searchInput.focus(), 0); };
      const closeSearch = () => { searchDialog.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); searchInput.value = ''; renderSearch(); };
      document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', openSearch));
      document.getElementById('searchClose')?.addEventListener('click', closeSearch);
      searchInput?.addEventListener('input', renderSearch);
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSearch(); });
      if (new URLSearchParams(location.search).get('search') === '1') openSearch();
    });
  </script>
  <script src="../assets/airport-menu.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(postHtmlPath, postHtmlContent, 'utf8');
console.log(`[SEO-Prerender] 成功创建独立静态文章页面：${postHtmlPath}`);

// 3. 计算预渲染数据：前 5 篇最新文章与前 6 个热门标签
const topPosts = posts.slice(0, 5);
const recentPostsHtml = topPosts.map((post, index) => {
  const num = String(index + 1).padStart(2, '0');
  return `                <li class="flex gap-5 py-4"><span class="font-mono text-muted">${num}</span><a href="${post.url}" class="hover:text-muted">${post.title}</a></li>`;
}).join('\n');

const tagCounts = posts.flatMap(post => post.tags || []).reduce((counts, tag) => {
  counts[tag] = (counts[tag] || 0) + 1;
  return counts;
}, {});

const popularTagsHtml = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 6)
  .map(([tag, count]) => {
    const taggedPosts = posts.filter(post => (post.tags || []).includes(tag));
    const isToolTag = tag === '工具使用' || (taggedPosts.length > 0 && taggedPosts.every(post => post.category === '工具使用'));
    const href = isToolTag ? `tools.html${tag === '工具使用' ? '' : `?tag=${encodeURIComponent(tag)}`}` : `knowledge.html?tag=${encodeURIComponent(tag)}`;
    const countStr = String(count).padStart(2, '0');
    return `                <a href="${href}" class="group flex items-center justify-between py-3.5 text-sm transition-colors hover:text-muted"><span><span class="mr-3 font-mono text-xs text-muted">#</span>${tag}</span><span class="flex items-center gap-3 font-mono text-[11px] text-muted">${countStr} <i data-lucide="arrow-up-right" class="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i></span></a>`;
  }).join('\n');

// 4. 重构 index.html
let indexContent = fs.readFileSync(indexPath, 'utf8');

// (1) 替换 <title>
indexContent = indexContent.replace(
  /<title>.*?<\/title>/s,
  '<title>梯云社 - 2026 稳定网络专线实测与高质量机场节点评测指南</title>'
);

// (2) 优化 og:title 和 twitter:title
indexContent = indexContent.replace(
  /<meta\s+property="og:title"\s+content="[^"]*">/g,
  '<meta property="og:title" content="梯云社 - 2026 稳定网络专线实测与高质量机场节点评测指南">'
);
indexContent = indexContent.replace(
  /<meta\s+name="twitter:title"\s+content="[^"]*">/g,
  '<meta name="twitter:title" content="梯云社 - 2026 稳定网络专线实测与高质量机场节点评测指南">'
);

// (3) 添加 Schema.org JSON-LD
const schemaScript = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "梯云社",
    "alternateName": "TIYUN CLUB",
    "url": "https://tiyunclub.com/",
    "description": "专注高质量网络加速评测、稳定专线对比与协议解析。"
  }
  </script>`;

if (!indexContent.includes('application/ld+json')) {
  indexContent = indexContent.replace('</head>', `${schemaScript}\n</head>`);
}

// (4) 优化 H1 和主视觉小标
indexContent = indexContent.replace(
  /<p class="mb-7 flex items-center gap-3 text-xs font-semibold uppercase text-muted"><span class="h-px w-8 bg-ink"><\/span>[^<]*<\/p>\s*<h1 class="max-w-5xl text-5xl font-black leading-\[1\.06\] sm:text-6xl md:text-7xl">\s*不追逐峰值<br>只验证稳定\s*<\/h1>/s,
  `<p class="mb-7 flex items-center gap-3 text-xs font-semibold uppercase text-muted"><span class="h-px w-8 bg-ink"></span>2026 稳定网络专线实测与高质量节点指南</p>
              <h1 class="max-w-5xl text-5xl font-black leading-[1.06] sm:text-6xl md:text-7xl">
                <span class="sr-only">梯云社 2026 稳定专线与高质量机场节点实测指南 - </span>不追逐峰值<br>只验证稳定
              </h1>`
);

// (5) 将首页置顶精选等所有 #post 链接替换为真实静态路径 posts/global-iplc-benchmark-2026.html
indexContent = indexContent.replace(
  /<a href="#post" class="text-link hidden text-sm md:block">阅读完整评测<\/a>/g,
  '<a href="posts/global-iplc-benchmark-2026.html" class="text-link hidden text-sm md:block">阅读完整评测</a>'
);
indexContent = indexContent.replace(
  /<a href="#post" class="block min-h-72 overflow-hidden bg-gray-100 lg:col-span-7 lg:min-h-\[34rem\]" aria-label="阅读 2026 全球专线横评">/g,
  '<a href="posts/global-iplc-benchmark-2026.html" class="block min-h-72 overflow-hidden bg-gray-100 lg:col-span-7 lg:min-h-[34rem]" aria-label="阅读 2026 全球专线横评">'
);
indexContent = indexContent.replace(
  /<a href="#post">2026 全球专线横评：稳定，比峰值更重要<\/a>/g,
  '<a href="posts/global-iplc-benchmark-2026.html">2026 全球专线横评：稳定，比峰值更重要</a>'
);

// (6) 移除 <article id="postView" class="view"> 完整 DOM 结构
indexContent = indexContent.replace(
  /\s*<article id="postView" class="view">[\s\S]*?<\/article>/,
  ''
);

// (7) 移除 <section id="homeView" class="view is-active" aria-label="首页内容"> 中的 view is-active
indexContent = indexContent.replace(
  '<section id="homeView" class="view is-active" aria-label="首页内容">',
  '<section id="homeView" aria-label="首页内容">'
);

// (8) 移除不再需要的 CSS .view 规则
indexContent = indexContent.replace(/\s*\.view\s*\{\s*display:\s*none;\s*\}/g, '');
indexContent = indexContent.replace(/\s*\.view\.is-active\s*\{\s*display:\s*block;\s*\}/g, '');

// (9) 硬编码静态预渲染 recentPosts 和 popularTags
indexContent = indexContent.replace(
  /<ol id="recentPosts" class="divide-y divide-line text-sm"><\/ol>/,
  `<ol id="recentPosts" class="divide-y divide-line text-sm">\n${recentPostsHtml}\n              </ol>`
);
indexContent = indexContent.replace(
  /<div id="popularTags" class="divide-y divide-line"><\/div>/,
  `<div id="popularTags" class="divide-y divide-line">\n${popularTagsHtml}\n              </div>`
);

// (10) 重构首页 JS 脚本：清除 route() 伪单页单页逻辑，避免覆盖预渲染好的 HTML，保留搜索和移动菜单等交互
const oldScriptPattern = /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);\s*<\/script>/;
const newScript = `<script>
    document.addEventListener('DOMContentLoaded', () => {
      const posts = window.TIYUN_POSTS || [];
      const recentPostsEl = document.getElementById('recentPosts');
      if (recentPostsEl && !recentPostsEl.children.length) {
        recentPostsEl.innerHTML = posts.slice(0, 5).map((post, index) => \`
          <li class="flex gap-5 py-4"><span class="font-mono text-muted">\${String(index + 1).padStart(2, '0')}</span><a href="\${post.url}" class="hover:text-muted">\${post.title}</a></li>\`).join('');
      }

      const popularTagsEl = document.getElementById('popularTags');
      if (popularTagsEl && !popularTagsEl.children.length) {
        const tagCounts = posts.flatMap(post => post.tags || []).reduce((counts, tag) => (counts[tag] = (counts[tag] || 0) + 1, counts), {});
        popularTagsEl.innerHTML = Object.entries(tagCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6).map(([tag, count]) => {
          const taggedPosts = posts.filter((post) => (post.tags || []).includes(tag));
          const isToolTag = tag === '工具使用' || (taggedPosts.length > 0 && taggedPosts.every((post) => post.category === '工具使用'));
          const href = isToolTag ? \`tools.html\${tag === '工具使用' ? '' : \`?tag=\${encodeURIComponent(tag)}\`}\` : \`knowledge.html?tag=\${encodeURIComponent(tag)}\`;
          return \`<a href="\${href}" class="group flex items-center justify-between py-3.5 text-sm transition-colors hover:text-muted"><span><span class="mr-3 font-mono text-xs text-muted">#</span>\${tag}</span><span class="flex items-center gap-3 font-mono text-[11px] text-muted">\${String(count).padStart(2, '0')} <i data-lucide="arrow-up-right" class="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i></span></a>\`;
        }).join('');
      }

      if (window.lucide) lucide.createIcons();
      const menu = document.getElementById('mobileMenu');
      const menuButton = document.getElementById('menuButton');
      const airportMenuButton = document.getElementById('airportMenuButton');
      const airportMobileMenu = document.getElementById('airportMobileMenu');
      const searchDialog = document.getElementById('searchDialog');
      const searchInput = document.getElementById('searchInput');
      const searchDefault = document.getElementById('searchDefault');
      const searchResults = document.getElementById('searchResults');
      const searchEmpty = document.getElementById('searchEmpty');
      const searchCount = document.getElementById('searchCount');

      menuButton?.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        menuButton.setAttribute('aria-expanded', String(open));
      });
      airportMenuButton?.addEventListener('click', () => {
        const open = airportMobileMenu.classList.toggle('hidden') === false;
        airportMenuButton.setAttribute('aria-expanded', String(open));
        airportMenuButton.querySelector('svg')?.classList.toggle('rotate-180', open);
      });

      const renderSearch = () => {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const matches = query ? posts.filter(post => \`\${post.title} \${post.description} \${(post.tags || []).join(' ')}\`.toLocaleLowerCase().includes(query)).slice(0, 12) : [];
        searchDefault.classList.toggle('hidden', Boolean(query));
        searchResults.classList.toggle('hidden', !query || !matches.length);
        searchEmpty.classList.toggle('hidden', !query || Boolean(matches.length));
        searchCount.classList.toggle('hidden', !query);
        searchCount.textContent = \`\${String(matches.length).padStart(2, '0')} RESULTS\`;
        searchResults.innerHTML = matches.map((post, index) => \`<a href="\${post.url}" class="group grid gap-3 border-b border-line py-6 transition-colors hover:bg-gray-50 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:px-3"><span class="font-mono text-xs text-muted">\${String(index + 1).padStart(2, '0')}</span><span><span class="text-xs text-muted">\${post.category}</span><strong class="mt-1 block text-lg leading-snug md:text-xl">\${post.title}</strong><span class="mt-2 line-clamp-1 block text-sm text-gray-600">\${post.description}</span></span><span class="flex items-center gap-3 font-mono text-[11px] text-muted">\${post.readingMinutes} MIN <i data-lucide="arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1"></i></span></a>\`).join('');
        if (window.lucide) lucide.createIcons();
      };
      const openSearch = () => { searchDialog.classList.remove('hidden'); document.body.classList.add('overflow-hidden'); setTimeout(() => searchInput.focus(), 0); };
      const closeSearch = () => { searchDialog.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); searchInput.value = ''; renderSearch(); };
      document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', openSearch));
      document.getElementById('searchClose')?.addEventListener('click', closeSearch);
      searchInput?.addEventListener('input', renderSearch);
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSearch(); });
      if (new URLSearchParams(location.search).get('search') === '1') openSearch();
    });
  </script>`;

indexContent = indexContent.replace(oldScriptPattern, newScript);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('[SEO-Prerender] 成功重构并写入 index.html！');

// 5. 更新 scripts/build-content.js 中的 staticPages，使 sitemap.xml 包含 posts/global-iplc-benchmark-2026.html
let buildContentSource = fs.readFileSync(buildContentPath, 'utf8');
if (!buildContentSource.includes('posts/global-iplc-benchmark-2026.html')) {
  buildContentSource = buildContentSource.replace(
    "const staticPages = [\n  '',",
    "const staticPages = [\n  '', 'posts/global-iplc-benchmark-2026.html',"
  );
  fs.writeFileSync(buildContentPath, buildContentSource, 'utf8');
  console.log('[SEO-Prerender] 已将 posts/global-iplc-benchmark-2026.html 添加至 scripts/build-content.js staticPages。');
}

console.log('[SEO-Prerender] 处理完成！');
