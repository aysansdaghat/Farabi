/* سبد خرید + هدر/فوتر/پنل مشترک بین همه صفحات (ذخیره در LocalStorage) */
const Cart = {
  key: 'farabi_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  save(c) { try { localStorage.setItem(this.key, JSON.stringify(c)); } catch {} this.render(); },
  add(id) { const c = this.get(), i = c.find(x => x.id == id); i ? i.qty++ : c.push({ id: +id, qty: 1 }); this.save(c); toast('کتاب به سبد خرید اضافه شد ✓'); const b = document.querySelector('.cart-btn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); },
  change(id, d) { const c = this.get(), i = c.find(x => x.id == id); if (i) { i.qty += d; if (i.qty < 1) c.splice(c.indexOf(i), 1); } this.save(c); },
  remove(id) { this.save(this.get().filter(x => x.id != id)); },
  render() {
    const c = this.get(), count = c.reduce((s, x) => s + x.qty, 0);
    const countEl = document.querySelector('.cart-count');
    if (countEl) countEl.textContent = count.toLocaleString('fa-IR');
    
    const itemsEl = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.cart-total');
    if (!itemsEl || !totalEl) return;
    
    let total = 0;
    itemsEl.innerHTML = c.length ? c.map(x => { const b = BOOKS.find(k => k.id == x.id); if (!b) return ''; total += b.price * x.qty;
      return `<li><img src="${coverOf(b)}" alt=""><div><strong>${b.title}</strong><small>${fmtPrice(b.price)}</small>
      <div class="qty"><button data-q="${b.id}:-1" aria-label="کاهش">−</button><span>${x.qty.toLocaleString('fa-IR')}</span><button data-q="${b.id}:1" aria-label="افزایش">+</button><button class="del" data-del="${b.id}">حذف</button></div></div></li>`; }).join('') : '<li class="empty">سبد خرید شما خالی است.</li>';
    totalEl.textContent = fmtPrice(total);
  }
};
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function layout() {
  document.getElementById('site-header').innerHTML = `
  <div class="topbar">به دنیای کتاب‌های سینمایی فارابی خوش آمدید</div>
  <header class="header"><div class="wrap hrow">
    <a class="brand" href="index.html"><img src="assets/images/logo.svg" alt="لوگوی بنیاد سینمایی فارابی"><span>بنیاد سینمایی فارابی<b>انتشارات</b></span></a>
    <button class="burger" aria-label="منو" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="منوی اصلی"><a href="index.html">خانه</a><a href="all-books.html">همه کتاب‌ها</a><a href="index.html#new">تازه‌های نشر</a><a href="about.html">درباره انتشارات</a></nav>
    <div class="tools">
      <form class="search" action="all-books.html"><input name="q" type="search" placeholder="جستجو در کتاب‌ها..." aria-label="جستجو"><button aria-label="جستجو">🔍</button></form>
      <a class="cart-btn" href="cart.html" aria-label="سبد خرید">🛒<span class="cart-count">۰</span></a>
      <a class="btn sm login" href="#" onclick="toast('ورود به حساب کاربری به‌زودی فعال می‌شود');return false">ورود / ثبت‌نام</a>
    </div></div></header>`;
  const isIndex = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.endsWith('/farab/') || location.pathname.endsWith('\\farab\\');
  document.getElementById('site-footer').innerHTML = `
  <section class="newsletter${isIndex ? ' newsletter--cream' : ''}"><div class="wrap"><h2>از تازه‌های نشر جا نمانید</h2>
  <form id="nl"><input type="email" required placeholder="ایمیل خود را وارد کنید" aria-label="ایمیل"><button class="btn gold">عضویت</button></form></div></section>
  <footer class="footer"><div class="wrap frow">
    <div><a class="brand light" href="index.html"><img src="assets/images/logo.svg" alt=""><span>انتشارات بنیاد سینمایی فارابی</span></a><p>روایت سینما، در قاب کتاب.</p></div>
    <div><h4>پیوندها</h4><a href="all-books.html">همه کتاب‌ها</a><a href="index.html#new">تازه‌های نشر</a><a href="about.html">درباره ما</a></div>
    <div><h4>تماس</h4><p>تهران، خیابان ولیعصر (عج)، بالاتر از پارک ساعی، نرسیده به توانیر، نبش کوچه لنگران، ساختمان شماره 3، بنیاد سینمایی فارابی</p><p>پلاک: 2452</p><p>کد پستی: 1434843619</p><p>تلفن فروشگاه: ۰۲۱-۸۸۸۸۰۳۲۶</p><p>تلفن انتشارات: ۰۲۱-۸۸۲۰۸۹۰۳</p></div>
    <div><h4>شبکه‌های اجتماعی</h4><a href="https://instagram.com/fcf.ir" target="_blank">اینستاگرام @fcf.ir</a><a href="#" onclick="toast('لینک تلگرام به‌زودی اضافه می‌شود');return false">تلگرام</a></div>
  </div><p class="copy">© تمامی حقوق برای بنیاد سینمایی فارابی محفوظ است.</p></footer>
<div id="toast" role="status"></div>`;
const h = document.querySelector('.header');
const onScroll = () => { const st = scrollY > 40; h.classList.toggle('stuck', st); document.getElementById('site-header').classList.toggle('is-stuck', st); };
addEventListener('scroll', onScroll, { passive: true }); onScroll();
document.querySelector('.burger').onclick = e => { const o = document.querySelector('.nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); };
document.getElementById('nl').onsubmit = e => { e.preventDefault(); toast('عضویت شما با موفقیت ثبت شد ✓'); e.target.reset(); };
document.addEventListener('click', e => { const a = e.target.closest('[data-add]'); if (a) Cart.add(a.dataset.add); });
Cart.render();
  const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add('in'), io.unobserve(x.target))), { threshold: .12 });
  window.observeReveal = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}
