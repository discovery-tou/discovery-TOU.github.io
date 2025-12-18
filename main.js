// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

// Close menu when clicking a link (mobile)
navList?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navList.classList.remove('show');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scroll offset for sticky header
const header = document.querySelector('.site-header');
const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - (headerH + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.pushState(null, '', id);
  });
});

// ===== Auto Scroll Gallery (vanilla) =====
(() => {
  const wrap = document.querySelector('.auto-scroll-gallery');
  if (!wrap) return;
  const track = wrap.querySelector('.track');
  const speed = Number(wrap.dataset.speed || 40); // px / sec

  // 画像列を複製してトラックを十分な幅に（継ぎ目のない無限ループ）
  function fillTrack() {
    if (!track) return;
    // 一旦初期セットを記録
    const originals = Array.from(track.children).map(n => n.cloneNode(true));
    // 幅が2倍分になるまで複製
    let safety = 0;
    while (track.scrollWidth < wrap.clientWidth * 2 && safety < 10) {
      originals.forEach(node => track.appendChild(node.cloneNode(true)));
      safety++;
    }
  }

  // アニメーション（requestAnimationFrameで時間基準に移動）
  let raf = null;
  let last = 0;
  let offset = 0;

  function step(ts) {
    if (!last) last = ts;
    const dt = (ts - last) / 1000; // 秒
    last = ts;

    const pxPerSec = speed;        // 速度
    offset -= pxPerSec * dt;

    const half = track.scrollWidth / 2;
    if (-offset >= half) offset += half; // 半分動いたら巻き戻し

    track.style.transform = `translateX(${offset}px)`;
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (raf) return;
    last = 0; raf = requestAnimationFrame(step);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf); raf = null;
  }

  // 初期化
  fillTrack();
  start();

  // ホバーで一時停止（PC）
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);

  // タブ非アクティブ時は停止
  window.addEventListener('blur', stop);
  window.addEventListener('focus', start);

  // リサイズ時に再計算
  let rto;
  window.addEventListener('resize', () => {
    clearTimeout(rto);
    rto = setTimeout(() => {
      stop();
      track.style.transform = 'translateX(0)';
      offset = 0;
      // 一度だけ再構築（既存複製分はそのままでもOK）
      start();
    }, 150);
  });
})();

// ===== Nav dropdown toggle =====
const navDrop = document.getElementById('navDrop');
const navDropBtn = document.getElementById('navDropBtn');
const navSublist = document.getElementById('nav-sublist');

function closeDropdown() {
  if (!navDrop || !navDropBtn) return;
  navDrop.classList.remove('open');
  navDropBtn.setAttribute('aria-expanded', 'false');
}

function toggleDropdown() {
  if (!navDrop || !navDropBtn) return;
  const isOpen = navDrop.classList.toggle('open');
  navDropBtn.setAttribute('aria-expanded', String(isOpen));
}

if (navDrop && navDropBtn) {
  navDropBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDropdown();
  });

  // dropdown内リンクを押したら閉じる（＋モバイルメニューも閉じる）
  navSublist?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      closeDropdown();
      navList?.classList.remove('show');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // 外側クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!navDrop.contains(e.target)) closeDropdown();
  });

  // ESCで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}


