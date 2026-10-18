const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('[Fix-Dropdown] 开始全站排查并修复下拉菜单位置与 CSS 样式...');

// 规范的 CSS 样式定义
const standardDropdownCss = `.dropdown-panel {
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

// 需要修复的核心 HTML 页面
const htmlFiles = [
  'index.html',
  'airports.html',
  'airport-topic.html',
  'knowledge.html',
  'tools.html',
  'article.html',
  'disclaimer.html',
  'trial.html',
  'posts/global-iplc-benchmark-2026/index.html'
];

htmlFiles.forEach((file) => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 修复 <style> 中的 .dropdown-panel 定义
  if (html.includes('.dropdown-panel')) {
    // 替换已有的 .dropdown-panel 和 hover 规则
    html = html.replace(
      /\.dropdown-panel\s*\{[\s\S]*?\}\s*\.dropdown:hover\s*\.dropdown-panel[\s\S]*?transition-delay:\s*0s;\s*\}/g,
      standardDropdownCss
    );
    modified = true;
  } else if (html.includes('</style>')) {
    // 注入标准样式
    html = html.replace('</style>', `    ${standardDropdownCss}\n  </style>`);
    modified = true;
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `  <style>\n    ${standardDropdownCss}\n  </style>\n</head>`);
    modified = true;
  }

  // 2. 确保外层容器带有 dropdown relative flex h-20 items-center
  // 3. 确保 .dropdown-panel 类名为 class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-2"
  html = html.replace(
    /<div class="dropdown\s+relative\s+flex\s+h-20\s+items-center">\s*(?:<button|<a)[^>]*?>\s*(?:品牌测评|机场推荐)[\s\S]*?class="dropdown-panel\s+absolute\s+left-1\/2\s+top-full\s+z-\[100\]\s+w-80\s+-translate-x-1\/2\s+pt-3"/g,
    (match) => match.replace('pt-3"', 'pt-2"')
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[Fix-Dropdown] 已检查并修复页面：${file}`);
});

// 4. 更新 assets/airport-menu.js 中的样式注入，提供双保险
const airportMenuPath = path.join(root, 'assets', 'airport-menu.js');
if (fs.existsSync(airportMenuPath)) {
  let airportMenuSource = fs.readFileSync(airportMenuPath, 'utf8');
  const patchedCss = `
      .dropdown-panel{position:absolute;top:100%;left:50%;opacity:0;visibility:hidden;transform:translateX(-50%) translateY(-6px);transition:opacity .18s ease,transform .18s ease,visibility 0s linear .18s}
      .dropdown:hover .dropdown-panel,.dropdown:focus-within .dropdown-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);transition-delay:0s}
      .airport-dropdown-panel{opacity:0;visibility:hidden;transform:translate(-50%,-6px);transition:opacity .18s ease,transform .18s ease,visibility 0s linear .18s}
      .airport-dropdown:hover .airport-dropdown-panel,.airport-dropdown:focus-within .airport-dropdown-panel{opacity:1;visibility:visible;transform:translate(-50%,0);transition-delay:0s}
  `;
  airportMenuSource = airportMenuSource.replace(
    /\.airport-dropdown-panel\{opacity:0;visibility:hidden;transform:translate\(-50%,-6px\);[\s\S]*?transition-delay:0s\}/,
    patchedCss.trim()
  );
  fs.writeFileSync(airportMenuPath, airportMenuSource, 'utf8');
  console.log('[Fix-Dropdown] 已更新 assets/airport-menu.js 样式定义');
}

// 5. 更新 scripts/upgrade-brand-navigation.js 模板
const upgradeScriptPath = path.join(root, 'scripts', 'upgrade-brand-navigation.js');
if (fs.existsSync(upgradeScriptPath)) {
  let scriptContent = fs.readFileSync(upgradeScriptPath, 'utf8');
  scriptContent = scriptContent.replace(
    /\.dropdown-panel\s*\{\s*opacity:\s*0;\s*visibility:\s*hidden;\s*transform:\s*translateY\(-6px\);[\s\S]*?transition-delay:\s*0s;\s*\}/g,
    standardDropdownCss
  );
  scriptContent = scriptContent.replace(
    /class="dropdown-panel absolute left-1\/2 top-full z-\[100\] w-80 -translate-x-1\/2 pt-3"/g,
    'class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-2"'
  );
  fs.writeFileSync(upgradeScriptPath, scriptContent, 'utf8');
  console.log('[Fix-Dropdown] 已更新 scripts/upgrade-brand-navigation.js');
}

// 6. 更新 scripts/seo-prerender.js 模板
const seoPrerenderPath = path.join(root, 'scripts', 'seo-prerender.js');
if (fs.existsSync(seoPrerenderPath)) {
  let prerenderContent = fs.readFileSync(seoPrerenderPath, 'utf8');
  prerenderContent = prerenderContent.replace(
    /\.dropdown-panel\s*\{\s*opacity:\s*0;\s*visibility:\s*hidden;\s*transform:\s*translateY\(-6px\);[\s\S]*?transition-delay:\s*0s;\s*\}/g,
    standardDropdownCss
  );
  prerenderContent = prerenderContent.replace(
    /class="dropdown-panel absolute left-1\/2 top-full z-\[100\] w-80 -translate-x-1\/2 pt-3"/g,
    'class="dropdown-panel absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 pt-2"'
  );
  fs.writeFileSync(seoPrerenderPath, prerenderContent, 'utf8');
  console.log('[Fix-Dropdown] 已更新 scripts/seo-prerender.js');
}

console.log('[Fix-Dropdown] 全部修复完成！');
