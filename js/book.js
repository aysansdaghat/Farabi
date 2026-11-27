/* صفحه جزئیات کتاب: book.html?id=1 */
layout();
const id = +new URLSearchParams(location.search).get('id'), b = BOOKS.find(x => x.id === id), root = document.getElementById('book');
if (!b) root.innerHTML = '<div class="wrap none"><p>کتاب مورد نظر پیدا نشد.</p><a class="btn" href="index.html">بازگشت به صفحه اصلی</a></div>';
else {
  document.title = b.title + ' | انتشارات فارابی';
  const rows = [['نویسنده', b.author], ['مترجم', b.translator || '—'], ['ناشر', b.publisher], ['سال انتشار', b.publishYear.toLocaleString('fa-IR', { useGrouping: false })], ['تعداد صفحات', b.pages.toLocaleString('fa-IR')], ['شابک', b.isbn], ['زبان', b.language], ['قطع', b.dimensions], ['دسته‌بندی', b.category]];
  const rel = BOOKS.filter(x => x.id !== b.id).sort((x, y) => (y.category === b.category) - (x.category === b.category)).slice(0, 4);
  root.innerHTML = `<div class="wrap detail"><div class="d-cover"><img id="bc" class="cover big" src="${coverOf(b)}" alt="جلد ${b.title}" tabindex="0"><small>برای بزرگ‌نمایی کلیک کنید</small></div>
  <div class="d-info"><p class="cat">${b.category}</p><h1>${b.title}</h1>
  <dl>${rows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>
  <p class="price big">${fmtPrice(b.price)}</p><p class="stock ${b.stock ? 'ok' : 'no'}">${b.stock ? 'موجود در انبار (' + b.stock.toLocaleString('fa-IR') + ' نسخه)' : 'ناموجود'}</p>
  <div class="actions"><button class="btn" data-add="${b.id}" ${b.stock ? '' : 'disabled'}>افزودن به سبد خرید</button><button class="btn ghost" onclick="toggleCart(true)">مشاهده سبد خرید</button></div></div></div>
  <section class="wrap sec"><h2 class="sec-title">معرفی و توضیحات کتاب</h2><p class="desc">${b.description}</p>
  <h2 class="sec-title">مشخصات فنی</h2><table class="spec">${rows.slice(2).map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</table></section>
  <section class="wrap sec"><h2 class="sec-title">کتاب‌های مرتبط</h2><div class="grid">${rel.map(cardHTML).join('')}</div>
  <p style="text-align:center;margin-top:2rem"><a class="btn ghost" href="index.html">بازگشت به صفحه اصلی</a></p></section>
  <div class="lightbox" id="lb"><img src="${coverOf(b)}" alt=""></div>`;
  const lb = document.getElementById('lb'), bc = document.getElementById('bc');
  bc.onclick = () => lb.classList.add('on'); bc.onkeydown = e => e.key === 'Enter' && lb.classList.add('on'); lb.onclick = () => lb.classList.remove('on');
  observeReveal();
}
