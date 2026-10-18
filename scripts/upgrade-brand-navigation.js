const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('[Brand-Nav] 开始执行全站导航栏升级与品牌审计标签更新...');

// 1. 更新 6 篇 Markdown 文件的 front matter tags，添加 "品牌审计"
const auditSlugs = [
  'yunjiexian-audit-2026',
  'dalaoyun-audit-2026',
  'huanqiuti-audit-2026',
  'liulianyun-audit-2026',
  'shandianshu-audit-2026',
  'shenxing-audit-2026'
];

const targetDirs = ['posts', path.join('docs', 'posts')];

targetDirs.forEach((dirRel) => {
  const dirPath = path.join(root, dirRel);
  if (!fs.existsSync(dirPath)) return;

  auditSlugs.forEach((slug) => {
    const mdFile = path.join(dirPath, `${slug}.md`);
    if (fs.existsSync(mdFile)) {
      let content = fs.readFileSync(mdFile, 'utf8');
      content = content.replace(/^tags:\s*\[(.*?)\]/m, (match, inner) => {
        const tags = inner.split(',').map((t) => t.trim()).filter(Boolean);
        if (!tags.includes('品牌审计')) {
          tags.unshift('品牌审计');
        }
        return `tags: [${tags.join(', ')}]`;
      });
      fs.writeFileSync(mdFile, content, 'utf8');
      console.log(`[Brand-Nav] 已在 ${dirRel}/${slug}.md 中注入 "品牌审计" 标签`);
    }
  });
});

// 2. 更新 scripts/build-content.js，支持 meta.tags 解析与 "品牌审计" 关键字
const buildContentPath = path.join(root, 'scripts', 'build-content.js');
let buildContentSource = fs.readFileSync(buildContentPath, 'utf8');

if (!buildContentSource.includes("'品牌审计'")) {
  buildContentSource = buildContentSource.replace(
    "const keywordTags = [",
    "const keywordTags = [\n  ['品牌审计', /品牌审计|单品审计|深度观察|可用率审计|协议韧性审计|大吞吐负载测试|专线延迟与接入点测试|轻量与备用方案实测/i],"
  );
}

if (!buildContentSource.includes('declaredTags')) {
  buildContentSource = buildContentSource.replace(
    "const postSlug = meta.slug || slug;",
    `let declaredTags = [];
    if (meta.tags) {
      declaredTags = String(meta.tags).replace(/[\\[\\]\\s'"]/g, '').split(',').map(t => t.trim()).filter(Boolean);
    }
    const postSlug = meta.slug || slug;`
  );
  buildContentSource = buildContentSource.replace(
    "const tags = [meta.category, ...keywordTags.filter(([, pattern]) => pattern.test(searchText)).map(([tag]) => tag)]",
    "const autoTags = keywordTags.filter(([, pattern]) => pattern.test(searchText)).map(([tag]) => tag);\n    const tags = [meta.category, ...declaredTags, ...autoTags]"
  );
}

fs.writeFileSync(buildContentPath, buildContentSource, 'utf8');
console.log('[Brand-Nav] 已更新 scripts/build-content.js');

// 3. 创建 dalaocloud / liuliancloud 兼容重定向文件
const compatFiles = [
  { file: 'dalaocloud-audit-2026.html', target: 'dalaoyun-audit-2026' },
  { file: 'liuliancloud-audit-2026.html', target: 'liulianyun-audit-2026' }
];

compatFiles.forEach(({ file, target }) => {
  const filePath = path.join(root, 'posts', file);
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>正在跳转至审计报告</title>
  <meta http-equiv="refresh" content="0; url=/posts/${target}/">
  <script>location.replace("/posts/${target}/");</script>
</head>
<body>
  <p>正在前往 <a href="/posts/${target}/">审计报告</a>...</p>
</body>
</html>
`;
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[Brand-Nav] 创建兼容重定向文件：posts/${file}`);
});

// 4. 更新 assets/airport-menu.js 增加菜单全量折叠监听
const airportMenuPath = path.join(root, 'assets', 'airport-menu.js');
let airportMenuSource = fs.readFileSync(airportMenuPath, 'utf8');

const fullMobileHandler = `
  function installMobileMenuHandlers() {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuButton && mobileMenu && !menuButton.__hasMenuListener) {
      menuButton.__hasMenuListener = true;
      menuButton.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('hidden') === false;
        menuButton.setAttribute('aria-expanded', String(open));
      });
    }

    const airportMenuButton = document.getElementById('airportMenuButton');
    const airportMobileMenu = document.getElementById('airportMobileMenu');
    if (airportMenuButton && airportMobileMenu && !airportMenuButton.__hasAirportListener) {
      airportMenuButton.__hasAirportListener = true;
      airportMenuButton.addEventListener('click', () => {
        const open = airportMobileMenu.classList.toggle('hidden') === false;
        airportMenuButton.setAttribute('aria-expanded', String(open));
        airportMenuButton.querySelector('svg')?.classList.toggle('rotate-180', open);
      });
    }

    const brandMenuButton = document.getElementById('brandMenuButton');
    const brandMobileMenu = document.getElementById('brandMobileMenu');
    if (brandMenuButton && brandMobileMenu && !brandMenuButton.__hasBrandListener) {
      brandMenuButton.__hasBrandListener = true;
      brandMenuButton.addEventListener('click', () => {
        const open = brandMobileMenu.classList.toggle('hidden') === false;
        brandMenuButton.setAttribute('aria-expanded', String(open));
        brandMenuButton.querySelector('svg')?.classList.toggle('rotate-180', open);
      });
    }
  }
`;

if (airportMenuSource.includes('function installBrandMobileToggle')) {
  airportMenuSource = airportMenuSource.replace(
    /function installBrandMobileToggle\(\) \{[\s\S]*?\}\s*function init\(\) \{[\s\S]*?installBrandMobileToggle\(\);/,
    `${fullMobileHandler}\n  function init() {\n    installMobileMenuHandlers();`
  );
} else if (!airportMenuSource.includes('installMobileMenuHandlers')) {
  airportMenuSource = airportMenuSource.replace(
    "function init() {",
    `${fullMobileHandler}\n  function init() {\n    installMobileMenuHandlers();`
  );
}
fs.writeFileSync(airportMenuPath, airportMenuSource, 'utf8');
console.log('[Brand-Nav] 已升级 assets/airport-menu.js 全量移动端菜单交互处理');

// 5. 生成标准【品牌测评】PC端下拉菜单与移动端菜单 HTML
function getDesktopBrandDropdown(prefix = '') {
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

function getFullMobileMenu(prefix = '') { return ''; }
function getMobileBrandItem(prefix = '') {
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

// 6. 遍历全站关键 HTML 页面并更新导航栏
const htmlPages = [
  { file: 'index.html', isSubdir: false },
  { file: 'airports.html', isSubdir: false },
  { file: 'airport-topic.html', isSubdir: false },
  { file: 'knowledge.html', isSubdir: false },
  { file: 'tools.html', isSubdir: false },
  { file: 'article.html', isSubdir: false },
  { file: 'posts/global-iplc-benchmark-2026/index.html', isSubdir: true }
];

htmlPages.forEach(({ file, isSubdir }) => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const prefix = isSubdir ? '../' : '';

  // 确保包含 .dropdown 与 .dropdown-panel 样式
  if (!html.includes('.dropdown-panel {') && !html.includes('.dropdown-panel{')) {
    const styleSnippet = `
    .dropdown-panel {
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
    }
  `;
    if (html.includes('</style>')) {
      html = html.replace('</style>', `${styleSnippet}\n  </style>`);
    }
  }

  // 更新 PC 端导航栏：将品牌测评插入在【机场推荐】与【工具使用】之间
  const desktopBrand = getDesktopBrandDropdown(prefix);

  if (!html.includes('品牌测评') && html.includes('tools.html')) {
    html = html.replace(
      /(<a[^>]*href="[^"]*tools\.html"[^>]*>工具使用<\/a>)/i,
      `${desktopBrand}\n        $1`
    );
  }

  // 更新移动端抽屉菜单
  if (html.includes('id="mobileMenu"')) {
    if (!html.includes('id="brandMenuButton"')) {
      const mobileBrandItem = getMobileBrandItem(prefix);
      html = html.replace(
        /(<a[^>]*href="[^"]*tools\.html"[^>]*>工具使用<\/a>)/i,
        `${mobileBrandItem}\n        $1`
      );
    }
  } else {
    // 页面没有 mobileMenu，补齐汉堡按钮与移动端全量抽屉
    const fullMobile = getFullMobileMenu(prefix);
    const mobileBtn = `<div class="flex items-center gap-1 xl:hidden">
        <a href="${prefix}index.html?search=1" class="p-2.5" aria-label="搜索"><i data-lucide="search" class="h-5 w-5"></i></a>
        <button id="menuButton" type="button" class="p-2.5" aria-expanded="false" aria-controls="mobileMenu" aria-label="打开菜单">
          <i data-lucide="menu" class="h-5 w-5"></i>
        </button>
      </div>`;

    // 替换原有的简化移动端按钮
    if (html.includes('class="flex items-center gap-1 xl:hidden"')) {
      html = html.replace(
        /<div class="flex items-center gap-1 xl:hidden">[\s\S]*?<\/div>/,
        mobileBtn
      );
    } else if (html.includes('class="text-sm font-semibold xl:hidden"')) {
      html = html.replace(
        /<a[^>]*class="[^"]*xl:hidden[^"]*"[^>]*>.*?<\/a>/,
        mobileBtn
      );
    }

    // 在 </header> 前插入 mobileMenu
    html = html.replace('</header>', `  ${fullMobile}\n  </header>`);
  }

  // 确保引入 airport-menu.js 脚本用于交互支持
  const airportScriptTag = isSubdir ? '<script src="../assets/airport-menu.js" defer></script>' : '<script src="assets/airport-menu.js" defer></script>';
  if (!html.includes('airport-menu.js') && html.includes('</body>')) {
    html = html.replace('</body>', `  ${airportScriptTag}\n</body>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[Brand-Nav] 成功升级页面导航栏：${file}`);
});

// 7. 更新 scripts/seo-prerender.js，确保以后重新执行 prerender 时保留品牌测评导航
const seoPrerenderPath = path.join(root, 'scripts', 'seo-prerender.js');
if (fs.existsSync(seoPrerenderPath)) {
  let prerenderContent = fs.readFileSync(seoPrerenderPath, 'utf8');
  if (!prerenderContent.includes('品牌测评')) {
    prerenderContent = prerenderContent.replace(
      /(<a[^>]*href="\.\.\/tools\.html"[^>]*>工具使用<\/a>)/g,
      `${getDesktopBrandDropdown('../')}\n        $1`
    );
    prerenderContent = prerenderContent.replace(
      /(<a href="\.\.\/tools\.html">工具使用<\/a>)/g,
      `${getMobileBrandItem('../')}\n        $1`
    );
    fs.writeFileSync(seoPrerenderPath, prerenderContent, 'utf8');
    console.log('[Brand-Nav] 已同步更新 scripts/seo-prerender.js');
  }
}

console.log('[Brand-Nav] 全站导航升级与标签注入完成！');
