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
