(() => {
  const topics = [
    ['🛡️', '稳定抗封锁专线榜', 'stable'],
    ['💎', '平价高性价比机场榜', 'value'],
    ['⚡', 'IEPL / IPLC 顶级专线榜', 'premium'],
    ['💰', '10元内平价月付合集', 'budget'],
    ['⏱️', '按量计费与不限时套餐', 'payg'],
    ['🎟️', '2026 最新独家优惠码', 'discounts'],
    ['🎁', '免费试用与一元体验', 'trials']
  ];

  function installStyles() {
    if (document.getElementById('airportDropdownStyles')) return;
    const style = document.createElement('style');
    style.id = 'airportDropdownStyles';
    style.textContent = `
      .airport-dropdown-panel{opacity:0;visibility:hidden;transform:translate(-50%,-6px);transition:opacity .18s ease,transform .18s ease,visibility 0s linear .18s}
      .airport-dropdown:hover .airport-dropdown-panel,.airport-dropdown:focus-within .airport-dropdown-panel{opacity:1;visibility:visible;transform:translate(-50%,0);transition-delay:0s}
    `;
    document.head.appendChild(style);
  }

  function topicLinks() {
    return topics.map(([icon, label, topic]) => `
      <a href="airport-topic.html?topic=${topic}" class="block rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
        <span class="mr-2">${icon}</span>${label}
      </a>`).join('');
  }

  function installDesktopMenus() {
    document.querySelectorAll('header nav:not(#mobileMenu)').forEach((nav) => {
      let airportLink = [...nav.querySelectorAll('a')].find((link) => /(^|\/)airports\.html(?:$|[?#])/.test(link.getAttribute('href') || ''));
      if (!airportLink) {
        airportLink = document.createElement('a');
        airportLink.href = 'airports.html';
        airportLink.textContent = '机场推荐';
        const homeLink = [...nav.querySelectorAll('a')].find((link) => /(^|\/)index\.html(?:$|[?#])/.test(link.getAttribute('href') || ''));
        homeLink?.after(airportLink);
      }
      if (!airportLink || airportLink.closest('.dropdown, .airport-dropdown')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'airport-dropdown relative flex h-full items-center';
      airportLink.before(wrapper);
      wrapper.appendChild(airportLink);
      airportLink.classList.add('flex', 'items-center', 'gap-1');
      airportLink.setAttribute('aria-haspopup', 'true');
      airportLink.insertAdjacentHTML('beforeend', '<span class="text-[10px] leading-none" aria-hidden="true">⌄</span>');
      wrapper.insertAdjacentHTML('beforeend', `
        <div class="airport-dropdown-panel absolute left-1/2 top-full z-[100] w-80 pt-3">
          <div class="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <p class="px-3 pb-2 pt-1 text-xs font-bold text-gray-500">2026 年度综合排行榜</p>
            <div class="grid gap-0.5 text-sm">${topicLinks()}</div>
          </div>
        </div>`);
    });
  }

  const menuTargets = () => [
    ...document.querySelectorAll('.dropdown-panel .grid'),
    ...document.querySelectorAll('#airportMobileMenu .grid')
  ];

  async function loadBrands() {
    const targets = menuTargets();
    if (!targets.length) return;

    try {
      const response = await fetch('airports.html');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      const documentCopy = new DOMParser().parseFromString(source, 'text/html');
      const brands = [...documentCopy.querySelectorAll('main article h3')]
        .map((heading) => heading.textContent.trim())
        .filter((brand, index, all) => brand && all.indexOf(brand) === index);

      targets.forEach((target) => {
        if (target.querySelector('[data-auto-airport-brands]')) return;

        const group = document.createElement('div');
        group.dataset.autoAirportBrands = '';
        group.className = 'mt-2 border-t border-gray-200 pt-2';
        group.innerHTML = `
          <p class="px-3 pb-1 pt-1 text-xs font-bold text-gray-500">已收录品牌</p>
          <div class="grid grid-cols-2 gap-0.5">
            ${brands.map((brand) => `
              <a href="airports.html?brand=${encodeURIComponent(brand)}" class="truncate rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100">${brand}</a>
            `).join('')}
          </div>
        `;
        target.appendChild(group);
      });
    } catch (error) {
      console.warn('Airport brands could not be loaded:', error);
    }
  }

  function init() {
    installStyles();
    installDesktopMenus();
    loadBrands();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
