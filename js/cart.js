/**
 * WAFFLE HOUSE - Cart & Checkout Engine (India)
 * Manages cart state, localStorage persistence, quantity updates,
 * promo code redemption in ₹ INR, 5% GST & ₹25 delivery packaging fees,
 * UPI/Card checkout flows, and cinematic order celebration.
 */

class WaffleCart {
  constructor() {
    this.items = this.loadCart();
    this.fulfillmentMode = 'dine-in';
    this.discountPercent = 0;
    this.discountFixed = 0;
    this.activePromoCode = '';
    this.taxRate = 0.05; // 5% Restaurant GST in India
    this.serviceFee = 25; // ₹25 delivery / packaging service fee

    this.initElements();
    this.render();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('waffle_cart_items_inr');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('waffle_cart_items_inr', JSON.stringify(this.items));
    } catch (e) {}
  }

  initElements() {
    // Cart open/close triggers
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const mobileCartBtn = document.getElementById('mobile-open-cart-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-drawer-overlay');
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal-overlay');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const successModal = document.getElementById('success-modal-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const fulfillmentTabs = document.querySelectorAll('.fulfillment-tab');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => this.openCart());
    if (mobileCartBtn) mobileCartBtn.addEventListener('click', () => {
      document.getElementById('mobile-nav-overlay')?.classList.remove('open');
      this.openCart();
    });
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => this.closeCart());
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeCart();
      });
    }

    // Fulfillment mode tabs
    fulfillmentTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        fulfillmentTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.fulfillmentMode = tab.dataset.mode;
        if (window.waffleAudio) window.waffleAudio.playClick();
        this.updateFulfillmentUI();
        this.render();
      });
    });

    // Promo code apply
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
    }

    // Checkout modal triggers
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          if (window.showToast) window.showToast('Your Cart is Empty', 'Add an artisanal waffle first!', 'error');
          return;
        }
        this.closeCart();
        this.openCheckoutModal();
      });
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => this.closeCheckoutModal());
    if (checkoutModal) {
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) this.closeCheckoutModal();
      });
    }

    // Payment method radio tabs in modal
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach((card) => {
      card.addEventListener('click', () => {
        paymentCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input');
        if (radio) radio.checked = true;
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });

    // Form submission
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.completeOrder();
      });
    }

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', () => {
        successModal?.classList.remove('open');
        document.body.classList.remove('drawer-open', 'loading-active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        const menuSec = document.getElementById('menu');
        if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Escape key closes success modal without locking scroll
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && successModal?.classList.contains('open')) {
        successModal.classList.remove('open');
        document.body.classList.remove('drawer-open', 'loading-active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    });
  }

  openCart() {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) {
      overlay.classList.add('open');
      document.body.classList.add('drawer-open');
    }
    if (window.waffleAudio) window.waffleAudio.playClick();
  }

  closeCart() {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
  }

  updateFulfillmentUI() {
    const addressLabel = document.getElementById('address-label');
    const addressInput = document.getElementById('order-address');
    if (!addressLabel || !addressInput) return;

    if (this.fulfillmentMode === 'dine-in') {
      addressLabel.textContent = 'Table Number *';
      addressInput.placeholder = 'e.g. Table #04 (Boutique Veranda)';
    } else if (this.fulfillmentMode === 'pickup') {
      addressLabel.textContent = 'Pickup Boutique / Counter Slot';
      addressInput.placeholder = 'e.g. Bandra Flagship Counter or Car Spot #2';
    } else {
      addressLabel.textContent = 'Delivery Address in India *';
      addressInput.placeholder = 'e.g. Flat 402, Sea Green Apts, Linking Road, Bandra West';
    }
  }

  addItem(item) {
    // item: { id, name, price, image, description, isCustom, customDetails }
    const existingIndex = this.items.findIndex((i) => {
      if (item.isCustom) {
        return i.id === item.id && JSON.stringify(i.customDetails) === JSON.stringify(item.customDetails);
      }
      return i.id === item.id;
    });

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += (item.quantity || 1);
    } else {
      this.items.push({
        ...item,
        quantity: item.quantity || 1,
        cartUid: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
      });
    }

    this.saveCart();
    this.render();
    this.triggerBadgeBounce();

    if (window.waffleAudio) window.waffleAudio.playAddToCart();
    if (window.showToast) {
      window.showToast(
        'Added to Order!',
        `${item.name} (₹${item.price}) added to your basket.`,
        'success',
        () => this.openCart()
      );
    }
  }

  updateQuantity(cartUid, delta) {
    const item = this.items.find((i) => i.cartUid === cartUid);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartUid);
      return;
    }

    this.saveCart();
    this.render();
    if (window.waffleAudio) window.waffleAudio.playClick();
  }

  removeItem(cartUid) {
    this.items = this.items.filter((i) => i.cartUid !== cartUid);
    this.saveCart();
    this.render();
    if (window.waffleAudio) window.waffleAudio.playClick();
  }

  triggerBadgeBounce() {
    const badges = [
      document.getElementById('nav-cart-badge'),
      document.getElementById('mobile-cart-badge')
    ];
    badges.forEach((b) => {
      if (!b) return;
      b.classList.remove('bounce');
      void b.offsetWidth; // trigger reflow
      b.classList.add('bounce');
    });
  }

  applyPromoCode() {
    const input = document.getElementById('promo-input');
    const msg = document.getElementById('promo-message');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.className = 'promo-message error';
      msg.textContent = 'Please enter a valid coupon code.';
      return;
    }

    if (code === 'CRISPY20') {
      this.discountPercent = 0.20;
      this.discountFixed = 0;
      this.activePromoCode = 'CRISPY20 (20% OFF)';
      msg.className = 'promo-message success';
      msg.textContent = '20% discount applied to your order!';
      if (window.waffleAudio) window.waffleAudio.playAddToCart();
    } else if (code === 'WAFFLE50') {
      this.discountPercent = 0;
      this.discountFixed = 50;
      this.activePromoCode = 'WAFFLE50 (₹50 OFF)';
      msg.className = 'promo-message success';
      msg.textContent = '₹50 flat waffle savings applied!';
      if (window.waffleAudio) window.waffleAudio.playAddToCart();
    } else if (code === 'FIRST100') {
      this.discountPercent = 0;
      this.discountFixed = 100;
      this.activePromoCode = 'FIRST100 (₹100 OFF)';
      msg.className = 'promo-message success';
      msg.textContent = '₹100 introductory discount applied!';
      if (window.waffleAudio) window.waffleAudio.playAddToCart();
    } else {
      msg.className = 'promo-message error';
      msg.textContent = 'Invalid code. Try "CRISPY20" or "WAFFLE50".';
      return;
    }

    this.render();
  }

  calculateTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (this.discountPercent > 0) {
      discount = Math.round(subtotal * this.discountPercent);
    } else if (this.discountFixed > 0) {
      discount = Math.min(subtotal, this.discountFixed);
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const serviceFee = this.items.length > 0 ? this.serviceFee : 0;
    const tax = Math.round(discountedSubtotal * this.taxRate);
    const total = discountedSubtotal > 0 ? discountedSubtotal + serviceFee + tax : 0;

    return {
      subtotal,
      discount,
      serviceFee,
      tax,
      total,
      totalCount: this.items.reduce((sum, i) => sum + i.quantity, 0)
    };
  }

  render() {
    const totals = this.calculateTotals();

    // Update Badges
    const navBadge = document.getElementById('nav-cart-badge');
    const mobileBadge = document.getElementById('mobile-cart-badge');
    const drawerCount = document.getElementById('drawer-total-items');

    if (navBadge) navBadge.textContent = totals.totalCount;
    if (mobileBadge) mobileBadge.textContent = totals.totalCount;
    if (drawerCount) drawerCount.textContent = `${totals.totalCount} ${totals.totalCount === 1 ? 'waffle' : 'waffles'}`;

    // Update Cart List
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('empty-cart-state');

    if (container) {
      if (this.items.length === 0) {
        container.innerHTML = '';
        if (emptyState) {
          container.appendChild(emptyState);
          emptyState.style.display = 'flex';
        }
      } else {
        container.innerHTML = this.items.map((item) => {
          let customTagHtml = '';
          if (item.isCustom && item.customDetails) {
            const d = item.customDetails;
            const parts = [];
            if (d.base) parts.push(`Base: ${d.base}`);
            if (d.sauces && d.sauces.length) parts.push(`Sauces: ${d.sauces.join(', ')}`);
            if (d.toppings && d.toppings.length) parts.push(`Toppings: ${d.toppings.join(', ')}`);
            if (d.icecream) parts.push(`Gelato: ${d.icecream}`);
            customTagHtml = `<div class="cart-item-custom-tags">${parts.join(' • ')}</div>`;
          } else if (item.description) {
            customTagHtml = `<div class="cart-item-custom-tags">${item.description}</div>`;
          }

          return `
            <div class="cart-item-card" data-uid="${item.cartUid}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/images/waffle-stage-clean.jpg'" />
              <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                ${customTagHtml}
                <div class="cart-item-bottom">
                  <div class="cart-item-price">₹${item.price * item.quantity}</div>
                  <div class="qty-control">
                    <button class="qty-btn" onclick="window.waffleCart.updateQuantity('${item.cartUid}', -1)" aria-label="Decrease quantity">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="window.waffleCart.updateQuantity('${item.cartUid}', 1)" aria-label="Increase quantity">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button class="item-delete-btn" onclick="window.waffleCart.removeItem('${item.cartUid}')" aria-label="Remove item">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          `;
        }).join('');
      }
    }

    // Update Totals breakdown in ₹ INR
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountRow = document.getElementById('cart-discount-row');
    const discountCodeName = document.getElementById('discount-code-name');
    const discountEl = document.getElementById('cart-discount');
    const serviceEl = document.getElementById('cart-service');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal}`;

    if (discountRow) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        if (discountCodeName) discountCodeName.textContent = this.activePromoCode;
        if (discountEl) discountEl.textContent = `-₹${totals.discount}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (serviceEl) serviceEl.textContent = `₹${totals.serviceFee}`;
    if (taxEl) taxEl.textContent = `₹${totals.tax}`;
    if (totalEl) totalEl.textContent = `₹${totals.total}`;
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal-overlay');
    const totals = this.calculateTotals();
    const modalCount = document.getElementById('modal-item-count');
    const modalTotal = document.getElementById('modal-final-total');

    if (modalCount) modalCount.textContent = `${totals.totalCount} items`;
    if (modalTotal) modalTotal.textContent = `₹${totals.total}`;

    this.updateFulfillmentUI();
    if (modal) {
      modal.classList.add('open');
      document.body.classList.add('drawer-open');
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal-overlay');
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
  }

  completeOrder() {
    const nameInput = document.getElementById('order-name');
    const customerName = nameInput ? nameInput.value.trim() : 'Valued Guest';
    const totals = this.calculateTotals();
    const orderId = '#WH-IND-' + Math.floor(10000 + Math.random() * 90000);

    // Close checkout modal and restore document scrolling
    this.closeCheckoutModal();
    document.body.classList.remove('drawer-open', 'loading-active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Populate cinematic order celebration screen
    const successName = document.getElementById('success-customer-name');
    const successOrderId = document.getElementById('success-order-id');
    const successTotal = document.getElementById('success-total-paid');
    const successModal = document.getElementById('success-modal-overlay');

    if (successName) successName.textContent = customerName;
    if (successOrderId) successOrderId.textContent = orderId;
    if (successTotal) successTotal.textContent = `₹${totals.total}`;

    // Save order into central WaffleStore
    if (window.WaffleStore) {
      window.WaffleStore.addOrder({
        id: orderId,
        customer: customerName,
        phone: document.getElementById('order-phone')?.value.trim() || '+91 98200 WAFFLE',
        email: document.getElementById('order-email')?.value.trim() || 'guest@wafflehouse.in',
        address: document.getElementById('order-address')?.value.trim() || (this.fulfillmentMode === 'dine-in' ? 'Table Order' : 'Store Pickup'),
        items: this.items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: totals.total,
        paymentMethod: document.querySelector('.payment-card.active input')?.value || 'UPI Verified'
      });
    }

    // Clear cart items
    this.items = [];
    this.saveCart();
    this.render();

    // Open cinematic success screen WITHOUT scroll-locking the page
    if (successModal) {
      successModal.classList.add('open');
      // Explicitly ensure normal page scrolling is maintained
      document.body.classList.remove('drawer-open', 'loading-active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Smoothly navigate viewport to the order confirmation screen so the customer sees it immediately
      successModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Trigger celebration effects
    if (window.waffleAudio) window.waffleAudio.playOrderSuccess();
    if (window.waffleConfetti) {
      window.waffleConfetti.burst(180);
      setTimeout(() => window.waffleConfetti.burst(140), 450);
    }
  }
}

window.waffleCart = new WaffleCart();
