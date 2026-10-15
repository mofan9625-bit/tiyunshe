const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('[Nav-Cleaner] 开始执行全站导航栏去重与布局规范重构...');

// 标准 PC 端【品牌测评】下拉菜单
function renderDesktopBrandDropdown(prefix = '') {
  return `<div class="dropdown relative flex h-20 items-center">
          <button type="button" class="nav-link flex items-center gap-1" aria-haspopup="true">
            品牌测评 <i data-lucide="chevron-down" class="h-3.5 w-3.5"></i>
          </button>
          <div class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-2">
            <div class="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
              <p class="px-3 pb-2 pt-1 font-mono text-[11px] font-bold uppercase text-gray-400">Independent Audits / 单品审计</p>
              <div class="grid gap-0.5 text-sm">
                <a href="${prefix}posts/yunjiexian-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">云界线 · 可用率审计</span>
                  <span class="font-mono text-xs text-muted">IEPL专线</span>
                </a>
                <a href="${prefix}posts/dalaoyun-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">大佬云 · 长连接分析</span>
                  <span class="font-mono text-xs text-muted">多设备并发</span>
                </a>
                <a href="${prefix}posts/huanqiuti-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">环球梯 · 协议抗拥塞</span>
                  <span class="font-mono text-xs text-muted">弱网韧性</span>
                </a>
                <a href="${prefix}posts/liulianyun-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">榴莲云 · 大吞吐负载</span>
                  <span class="font-mono text-xs text-muted">高码率流媒体</span>
                </a>
                <a href="${prefix}posts/shandianshu-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">闪电鼠 · 接入点测试</span>
                  <span class="font-mono text-xs text-muted">低延迟敏感</span>
                </a>
                <a href="${prefix}posts/shenxing-audit-2026/" class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <span class="font-medium text-ink">神行加速 · 按量长连接</span>
                  <span class="font-mono text-xs text-muted">备用方案</span>
                </a>
              </div>
            </div>
          </div>
        </div>`;
}

// 标准移动端【品牌测评】折叠菜单
function renderMobileBrandItem(prefix = '') {
  return `<div>
          <button id="brandMenuButton" type="button" class="flex w-full items-center justify-between text-left" aria-expanded="false" aria-controls="brandMobileMenu">
            <span>品牌测评</span><i data-lucide="chevron-down" class="h-4 w-4 transition-transform"></i>
          </button>
          <div id="brandMobileMenu" class="mt-3 hidden border-l border-line pl-4">
            <p class="pb-2 text-xs font-bold text-muted">单品深度审计实测</p>
            <div class="grid gap-1 text-sm font-normal">
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/yunjiexian-audit-2026/"><span>云界线 · 可用率审计</span><span class="font-mono text-xs text-muted">IEPL专线</span></a>
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/dalaoyun-audit-2026/"><span>大佬云 · 长连接分析</span><span class="font-mono text-xs text-muted">多设备并发</span></a>
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/huanqiuti-audit-2026/"><span>环球梯 · 协议抗拥塞</span><span class="font-mono text-xs text-muted">弱网韧性</span></a>
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/liulianyun-audit-2026/"><span>榴莲云 · 大吞吐负载</span><span class="font-mono text-xs text-muted">高码率流媒体</span></a>
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/shandianshu-audit-2026/"><span>闪电鼠 · 接入点测试</span><span class="font-mono text-xs text-muted">低延迟敏感</span></a>
              <a class="py-1.5 flex items-center justify-between" href="${prefix}posts/shenxing-audit-2026/"><span>神行加速 · 按量长连接</span><span class="font-mono text-xs text-muted">备用方案</span></a>
            </div>
          </div>
        </div>`;
}

// 标准 PC 端【机场推荐】下拉菜单
function renderDesktopAirportDropdown(prefix = '') {
  return `<div class="dropdown relative flex h-20 items-center">
          <a class="nav-link flex items-center gap-1" href="${prefix}airports.html" aria-haspopup="true">机场推荐 <i data-lucide="chevron-down" class="h-3.5 w-3.5"></i></a>
          <div class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-2">
            <div class="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
              <p class="px-3 pb-2 pt-1 text-xs font-bold text-gray-500">精选服务商导航 · 06 BRANDS</p>
              <div class="grid gap-0.5 text-sm">
                <a href="${prefix}airports.html" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">🏆</span>年度综合推荐榜</a>
                <a href="${prefix}airport-topic.html?topic=premium" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">⚡</span>IEPL / IPLC 顶级专线精选</a>
                <a href="${prefix}airport-topic.html?topic=value" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">💎</span>平价月付与不限时按量合集</a>
                <a href="${prefix}airport-topic.html?topic=discounts" class="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"><span class="mr-2">🎟️</span>2026 独家优惠码清单</a>
              </div>
            </div>
          </div>
        </div>`;
}

// 标准移动端【机场推荐】折叠菜单
function renderMobileAirportItem(prefix = '') {
  return `<div>
          <button id="airportMenuButton" type="button" class="flex w-full items-center justify-between text-left" aria-expanded="false" aria-controls="airportMobileMenu">
            <span>机场推荐</span><i data-lucide="chevron-down" class="h-4 w-4 transition-transform"></i>
          </button>
          <div id="airportMobileMenu" class="mt-3 hidden border-l border-line pl-4">
            <p class="pb-2 text-xs font-bold text-muted">精选服务商导航 · 06 BRANDS</p>
            <div class="grid gap-1 font-normal">
              <a class="py-1.5" href="${prefix}airports.html">🏆 年度综合推荐榜</a>
              <a class="py-1.5" href="${prefix}airport-topic.html?topic=premium">⚡ IEPL / IPLC 顶级专线精选</a>
              <a class="py-1.5" href="${prefix}airport-topic.html?topic=value">💎 平价月付与不限时按量合集</a>
              <a class="py-1.5" href="${prefix}airport-topic.html?topic=discounts">🎟️ 2026 独家优惠码清单</a>
            </div>
          </div>
        </div>`;
}

// 生成标准且干净的完整 Header HTML
function buildStandardHeader(pageKey, prefix = '') {
  const homeLink = pageKey === 'index.html' ? '#home' : `${prefix}index.html`;
  const isToolsActive = pageKey === 'tools.html';
  const isKnowledgeActive = pageKey === 'knowledge.html';
  const isAirportsActive = pageKey === 'airports.html';
  const aboutLink = pageKey === 'index.html' ? '#about' : `${prefix}index.html#about`;
  const searchBtn = pageKey === 'index.html'
    ? `<button type="button" data-search-open class="p-2 transition-colors hover:bg-gray-100" aria-label="搜索"><i data-lucide="search" class="h-4 w-4"></i></button>`
    : `<a href="${prefix}index.html?search=1" class="p-2 transition-colors hover:bg-gray-100" aria-label="搜索"><i data-lucide="search" class="h-4 w-4"></i></a>`;

  return `<header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
    <div class="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-5 md:h-20 md:px-10 xl:px-16">
      <a href="${homeLink}" class="flex items-baseline gap-2" aria-label="梯云社首页">
        <span class="text-xl font-black">梯云社</span>
        <span class="hidden text-[10px] font-bold uppercase tracking-widest text-muted sm:inline">Tiyun Club</span>
      </a>

      <nav class="hidden items-center gap-7 text-sm font-medium xl:flex" aria-label="主导航">
        <a class="nav-link" href="${homeLink}">首页</a>
        ${renderDesktopAirportDropdown(prefix)}
        ${renderDesktopBrandDropdown(prefix)}
        <a class="nav-link${isToolsActive ? ' font-bold' : ''}" href="${prefix}tools.html">工具使用</a>
        <a class="nav-link${isKnowledgeActive ? ' font-bold' : ''}" href="${prefix}knowledge.html">知识库</a>
        <a class="nav-link" href="${aboutLink}">关于</a>
        ${searchBtn}
        <a href="${prefix}disclaimer.html" class="nav-link text-xs">免责声明</a>
      </nav>

      <div class="flex items-center gap-1 xl:hidden">
        ${pageKey === 'index.html' 
          ? `<button type="button" data-search-open class="p-2.5" aria-label="搜索"><i data-lucide="search" class="h-5 w-5"></i></button>`
          : `<a href="${prefix}index.html?search=1" class="p-2.5" aria-label="搜索"><i data-lucide="search" class="h-5 w-5"></i></a>`}
        <button id="menuButton" type="button" class="p-2.5" aria-expanded="false" aria-controls="mobileMenu" aria-label="打开菜单">
          <i data-lucide="menu" class="h-5 w-5"></i>
        </button>
      </div>
    </div>
    <nav id="mobileMenu" class="hidden border-t border-line bg-white px-5 py-5 xl:hidden" aria-label="移动端导航">
      <div class="grid gap-4 text-sm font-medium">
        <a href="${homeLink}">首页</a>
        ${renderMobileAirportItem(prefix)}
        ${renderMobileBrandItem(prefix)}
        <a class="${isToolsActive ? 'font-bold' : ''}" href="${prefix}tools.html">工具使用</a>
        <a class="${isKnowledgeActive ? 'font-bold' : ''}" href="${prefix}knowledge.html">知识库</a>
        <a href="${aboutLink}">关于</a>
        <a href="${prefix}disclaimer.html">免责声明</a>
      </div>
    </nav>
  </header>`;
}

// 规范的 CSS
const standardCss = `    .dropdown-panel {
      position: absolute;
      top: 100%;
      left: 50%;
      opacity: 0;
      visibility: hidden;
      transform: translateX(-50%) translateY(-6px);
      transition: opacity .18s ease, transform .18s ease, visibility 0s linear .18s;
    }
    .dropdown:hover .dropdown-panel,
    .dropdown:focus-within .dropdown-panel {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
      transition-delay: 0s;
    }`;

// 需要精确重构 Header 的页面清单
const targetPages = [
  { file: 'index.html', prefix: '' },
  { file: 'airports.html', prefix: '' },
  { file: 'airport-topic.html', prefix: '' },
  { file: 'knowledge.html', prefix: '' },
  { file: 'tools.html', prefix: '' },
  { file: 'article.html', prefix: '' },
  { file: 'posts/global-iplc-benchmark-2026.html', prefix: '../' }
];

const modifiedFiles = [];

targetPages.forEach(({ file, prefix }) => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 替换 <header> ... </header> 为标准去重无污染结构
  const newHeader = buildStandardHeader(file, prefix);
  content = content.replace(/<header[\s\S]*?<\/header>/i, newHeader);

  // 2. 确保 <style> 中具备规范的 .dropdown-panel
  if (content.includes('.dropdown-panel')) {
    content = content.replace(
      /\.dropdown-panel\s*\{[\s\S]*?\}\s*\.dropdown:hover\s*\.dropdown-panel[\s\S]*?transition-delay:\s*0s;\s*\}/g,
      standardCss
    );
  } else if (content.includes('</style>')) {
    content = content.replace('</style>', `${standardCss}\n  </style>`);
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `  <style>\n${standardCss}\n  </style>\n</head>`);
  }

  // 3. 确保引入 airport-menu.js 脚本
  const scriptTag = prefix ? '<script src="../assets/airport-menu.js" defer></script>' : '<script src="assets/airport-menu.js" defer></script>';
  if (!content.includes('airport-menu.js') && content.includes('</body>')) {
    content = content.replace('</body>', `  ${scriptTag}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  modifiedFiles.push(file);
  console.log(`[Nav-Cleaner] 成功重构并清理页面导航：${file}`);
});

// 4. 同步更新 scripts/seo-prerender.js，确保以后的构建不会生成重复项
const seoPrerenderPath = path.join(root, 'scripts', 'seo-prerender.js');
if (fs.existsSync(seoPrerenderPath)) {
  let prerenderContent = fs.readFileSync(seoPrerenderPath, 'utf8');
  // 确保其中的 global-iplc-benchmark-2026.html 头部也是干净的标准结构
  const cleanPostHeader = buildStandardHeader('posts/global-iplc-benchmark-2026.html', '../');
  prerenderContent = prerenderContent.replace(/<header class="sticky[\s\S]*?<\/header>/, cleanPostHeader);
  fs.writeFileSync(seoPrerenderPath, prerenderContent, 'utf8');
  modifiedFiles.push('scripts/seo-prerender.js');
  console.log('[Nav-Cleaner] 已同步更新 scripts/seo-prerender.js 模板');
}

// 5. 同步更新 scripts/upgrade-brand-navigation.js，消除历史正则隐患
const upgradeScriptPath = path.join(root, 'scripts', 'upgrade-brand-navigation.js');
if (fs.existsSync(upgradeScriptPath)) {
  let upgradeContent = fs.readFileSync(upgradeScriptPath, 'utf8');
  upgradeContent = upgradeContent.replace(
    /function getFullMobileMenu[\s\S]*?function getMobileBrandItem/,
    `function getFullMobileMenu(prefix = '') { return ''; }\nfunction getMobileBrandItem`
  );
  fs.writeFileSync(upgradeScriptPath, upgradeContent, 'utf8');
  modifiedFiles.push('scripts/upgrade-brand-navigation.js');
  console.log('[Nav-Cleaner] 已同步修正 scripts/upgrade-brand-navigation.js');
}

console.log('\n[Nav-Cleaner] 全部清理与重构完成！修改文件总数：', modifiedFiles.length);
modifiedFiles.forEach(f => console.log(' - ' + f));
