/* صفحه اصلی و صفحه همه کتاب‌ها */
layout();

const isAllBooks = document.getElementById('all-grid');
const grid = isAllBooks ? document.getElementById('all-grid') : document.getElementById('grid');
const catGroup = document.getElementById('cat-group');
const sortSelect = document.getElementById('sort-select');
const pagination = document.getElementById('pagination');

let q = (new URLSearchParams(location.search).get('q') || '').trim();
let curCat = '';
let curSort = 'default';
let curPage = 1;
const PER_PAGE = 12;

if (catGroup) {
  catGroup.innerHTML = `<button class="chip" data-c="">همه</button>` + CATEGORIES.map(c => `<button class="chip" data-c="${c.name}">${c.icon} ${c.name}</button>`).join('');
}

if (!isAllBooks) {
  const catsEl = document.getElementById('cats');
  if (catsEl) catsEl.innerHTML = CATEGORIES.map(c => `<button class="cat-card reveal" data-c="${c.name}"><span class="ic">${c.icon}</span><span class="ct">${c.name}</span></button>`).join('');
}

function getFilteredBooks() {
  let list = BOOKS.filter(b => (!curCat || b.category === curCat || (curCat === 'کتاب‌های تازه منتشرشده' && b.isNew)) && (!q || (b.title + b.author).includes(q)));
  
  switch (curSort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'newest': list.sort((a, b) => b.publishYear - a.publishYear); break;
    case 'title': list.sort((a, b) => a.title.localeCompare(b.title, 'fa')); break;
  }
  return list;
}

function show() {
  if (!grid) return;
  const list = getFilteredBooks();
  
  if (isAllBooks) {
    const totalPages = Math.ceil(list.length / PER_PAGE);
    if (curPage > totalPages) curPage = totalPages || 1;
    const start = (curPage - 1) * PER_PAGE;
    const pageBooks = list.slice(start, start + PER_PAGE);
    grid.innerHTML = pageBooks.length ? pageBooks.map(cardHTML).join('') : '<p class="none">کتابی یافت نشد.</p>';
    renderPagination(totalPages);
  } else {
    const featuredBooks = list.slice(0, 8);
    grid.innerHTML = featuredBooks.length ? featuredBooks.map(cardHTML).join('') : '<p class="none">کتابی یافت نشد.</p>';
  }
  observeReveal();
}

function renderPagination(totalPages) {
  if (!pagination) return;
  if (totalPages <= 1) { pagination.innerHTML = ''; return; }
  let html = '';
  if (curPage > 1) html += `<button class="btn ghost sm" data-page="${curPage - 1}">قبلی</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= curPage - 1 && i <= curPage + 1)) {
      html += `<button class="btn sm ${i === curPage ? 'gold' : 'ghost'}" data-page="${i}">${i}</button>`;
    } else if (i === curPage - 2 || i === curPage + 2) {
      html += '<span class="dots">…</span>';
    }
  }
  if (curPage < totalPages) html += `<button class="btn ghost sm" data-page="${curPage + 1}">بعدی</button>`;
  pagination.innerHTML = html;
  pagination.onclick = e => {
    const btn = e.target.closest('[data-page]');
    if (btn) { curPage = +btn.dataset.page; show(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
}

function setCat(c) {
  curCat = c;
  curPage = 1;
  if (catGroup) catGroup.querySelectorAll('.chip').forEach(b => b.classList.toggle('active', b.dataset.c === c && c !== ''));
  show();
}

if (catGroup) {
  catGroup.onclick = e => { const b = e.target.closest('[data-c]'); if (b) { const c = b.dataset.c; setCat(curCat === c ? '' : c); } };
}

if (document.getElementById('cats')) {
  document.getElementById('cats').onclick = e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    setCat(b.dataset.c);
    q = '';
    const booksSection = document.getElementById('books');
    if (booksSection) booksSection.scrollIntoView({ behavior: 'smooth' });
  };
}

if (sortSelect) {
  sortSelect.onchange = e => { curSort = e.target.value; curPage = 1; show(); };
}

const sl = document.getElementById('slider');
if (sl) {
  sl.innerHTML = BOOKS.filter(b => b.isNew || b.featured).map(cardHTML).join('');
  document.querySelectorAll('[data-slide]').forEach(b => b.onclick = () => sl.scrollBy({ left: +b.dataset.slide * 300, behavior: 'smooth' }));
}

const hero = document.querySelector('.hero');
if (hero) {
  addEventListener('scroll', () => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) hero.style.backgroundPosition = `center calc(50% + ${Math.min(scrollY, 400) * .06}px)`; }, { passive: true });
}

show();