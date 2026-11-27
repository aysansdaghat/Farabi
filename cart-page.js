/* ================================
   CART PAGE FUNCTIONALITY
=============================== */

const CartPage = {
    init() {
        this.render();
        this.attachEvents();
        this.createCheckoutModal();
    },

    getCart() {
        try {
            return JSON.parse(localStorage.getItem('farabi_cart')) || [];
        } catch {
            return [];
        }
    },

    save(cart) {
        try {
            localStorage.setItem('farabi_cart', JSON.stringify(cart));
        } catch {}
        this.render();
        Cart.render(); // Update header count
    },

    changeQty(id, delta) {
        const cart = this.getCart();
        const item = cart.find(x => x.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty < 1) {
                const idx = cart.indexOf(item);
                cart.splice(idx, 1);
            }
            this.save(cart);
        }
    },

    remove(id) {
        const cart = this.getCart().filter(x => x.id !== id);
        this.save(cart);
    },

    render() {
        const table = document.getElementById('cart-table');
        const empty = document.getElementById('cart-empty');
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!table) return;

        const cart = this.getCart();

        if (cart.length === 0) {
            table.style.display = 'none';
            if (empty) empty.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        table.style.display = 'block';
        if (empty) empty.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;

        let subtotal = 0;
        table.innerHTML = `
            <div class="cart-header">
                <span>کتاب</span>
                <span>قیمت</span>
                <span>تعداد</span>
                <span>مجموع</span>
                <span></span>
            </div>
        ` + cart.map(item => {
            const book = BOOKS.find(b => b.id === item.id);
            if (!book) return '';
            const itemTotal = book.price * item.qty;
            subtotal += itemTotal;
            return `
                <div class="cart-item" data-id="${book.id}">
                    <div class="item-info">
                        <img class="item-img" src="${coverOf(book)}" alt="${book.title}">
                        <div class="item-details">
                            <h4>${book.title}</h4>
                            <div class="item-meta">${book.author}${book.translator ? ' · ترجمه ' + book.translator : ''}</div>
                        </div>
                    </div>
                    <div class="item-price">${fmtPrice(book.price)}</div>
                    <div class="item-qty">
                        <button class="qty-btn" data-qty="${book.id}:-1" aria-label="کاهش">−</button>
                        <span class="qty-value">${item.qty.toLocaleString('fa-IR')}</span>
                        <button class="qty-btn" data-qty="${book.id}:1" aria-label="افزایش">+</button>
                    </div>
                    <div class="item-total">${fmtPrice(itemTotal)}</div>
                    <button class="item-remove" data-remove="${book.id}" aria-label="حذف">✕</button>
                </div>
            `;
        }).join('');

        if (subtotalEl) subtotalEl.textContent = fmtPrice(subtotal);
        if (totalEl) totalEl.textContent = fmtPrice(subtotal);
    },

    attachEvents() {
        const table = document.getElementById('cart-table');
        if (!table) return;

        table.addEventListener('click', e => {
            const qtyBtn = e.target.closest('[data-qty]');
            const removeBtn = e.target.closest('[data-remove]');

            if (qtyBtn) {
                const [id, delta] = qtyBtn.dataset.qty.split(':');
                this.changeQty(+id, +delta);
            }

            if (removeBtn) {
                this.remove(+removeBtn.dataset.remove);
            }
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => this.openCheckoutModal();
        }
    },

    createCheckoutModal() {
        const modalHTML = `
            <div class="checkout-modal" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
                <div class="checkout-overlay"></div>
                <div class="checkout-panel">
                    <div class="checkout-header">
                        <h3 id="checkoutTitle">اطلاعات مشتری و پرداخت</h3>
                        <button class="checkout-close" aria-label="بستن">✕</button>
                    </div>
                    <form class="checkout-form" id="checkoutForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fullName">نام و نام خانوادگی <span class="required">*</span></label>
                                <input type="text" id="fullName" name="fullName" required placeholder="مثال: علی احمدی">
                            </div>
                            <div class="form-group">
                                <label for="phone">شماره تماس <span class="required">*</span></label>
                                <input type="tel" id="phone" name="phone" required placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹" pattern="09\\d{9}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">ایمیل</label>
                                <input type="email" id="email" name="email" placeholder="مثال: ali@example.com">
                            </div>
                            <div class="form-group">
                                <label for="postalCode">کد پستی <span class="required">*</span></label>
                                <input type="text" id="postalCode" name="postalCode" required placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰" pattern="\\d{10}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="address">آدرس کامل <span class="required">*</span></label>
                            <textarea id="address" name="address" required rows="3" placeholder="استان، شهر، خیابان، پلاک، واحد"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">شهر <span class="required">*</span></label>
                                <input type="text" id="city" name="city" required placeholder="مثال: تهران">
                            </div>
                            <div class="form-group">
                                <label for="province">استان <span class="required">*</span></label>
                                <input type="text" id="province" name="province" required placeholder="مثال: تهران">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="terms" name="terms" required>
                                <span>شرایط و قوانین خرید را مطالعه کرده و قبول دارم</span>
                            </label>
                        </div>
                        <div class="checkout-summary">
                            <div class="summary-row"><span>مجموع کالا</span><span id="modal-subtotal">۰ تومان</span></div>
                            <div class="summary-row"><span>هزینه ارسال</span><span id="modal-shipping">رایگان</span></div>
                            <div class="summary-row total"><span>مبلغ قابل پرداخت</span><span id="modal-total">۰ تومان</span></div>
                        </div>
                        <div class="checkout-actions">
                            <button type="button" class="btn ghost" id="cancelCheckout">انصراف</button>
                            <button type="submit" class="btn gold" id="submitOrder">تایید و پرداخت</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    openCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;

        // Update totals in modal
        const cart = this.getCart();
        let subtotal = 0;
        cart.forEach(item => {
            const book = BOOKS.find(b => b.id === item.id);
            if (book) subtotal += book.price * item.qty;
        });

        const modalSubtotal = document.getElementById('modal-subtotal');
        const modalTotal = document.getElementById('modal-total');
        if (modalSubtotal) modalSubtotal.textContent = fmtPrice(subtotal);
        if (modalTotal) modalTotal.textContent = fmtPrice(subtotal);

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[required]');
            if (firstInput) firstInput.focus();
        }, 100);
    },

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    },

    submitOrder(formData) {
        // TODO: Send to backend API
        console.log('Order submitted:', formData);
        toast('سفارش شما با موفقیت ثبت شد. به درگاه پرداخت منتقل می‌شوید...');
        this.closeCheckoutModal();
        
        // Clear cart after successful order
        localStorage.removeItem('farabi_cart');
        this.render();
        Cart.render();
        
        // Redirect to success page or payment gateway
        setTimeout(() => {
            window.location.href = 'order-success.html'; // Create this page if needed
        }, 2000);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    CartPage.init();
});

// Modal event delegation
document.addEventListener('click', e => {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    const closeBtn = e.target.closest('.checkout-close, .checkout-overlay, #cancelCheckout');
    if (closeBtn) {
        CartPage.closeCheckoutModal();
    }
});

document.addEventListener('submit', e => {
    if (e.target.id === 'checkoutForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        CartPage.submitOrder(data);
    }
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        CartPage.closeCheckoutModal();
    }
});