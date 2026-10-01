/**
 * WAFFLE HOUSE - Admin Dashboard Controller
 * Full CRUD management for Products, Categories, Orders, Customers, Pricing, Offers, Locations, Reviews, and Settings.
 */

class WaffleAdminDashboard {
  constructor() {
    this.currentTab = 'overview';
    this.editingProductId = null;
    this.editingCategoryId = null;
    this.editingOfferId = null;
    this.editingLocationId = null;

    this.init();
  }

  init() {
    // 1. Guard check
    if (!window.WaffleAuth || !window.WaffleAuth.isAdminAuthenticated()) {
      window.location.replace('../login/index.html');
      return;
    }

    this.bindNavigation();
    this.bindHeaderActions();
    this.bindModals();
    this.renderCurrentTab();

    // Listen for real-time store changes
    window.addEventListener('waffle_store_updated', () => {
      this.renderCurrentTab();
    });
  }

  bindNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-item button');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update title
    const titleEl = document.getElementById('header-page-title');
    const tabTitles = {
      overview: 'Executive Operations & Real-Time Metrics',
      products: 'Waffle Menu & Product Catalogue',
      categories: 'Menu Category Management',
      orders: 'Customer Order Management & Kitchen Tracking',
      customers: 'Customer Registry & Order History',
      pricing: 'Real-Time ₹ INR Price Configuration',
      offers: 'Promotional Offers & Voucher Codes',
      locations: 'Boutique Store Locations (India)',
      reviews: 'Customer Reviews & Moderation',
      settings: 'Boutique System Settings'
    };

    if (titleEl) titleEl.textContent = tabTitles[tabId] || 'Admin Dashboard';

    // Show panel
    document.querySelectorAll('.admin-tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    this.renderCurrentTab();
  }

  bindHeaderActions() {
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to end your administrative session?')) {
          window.WaffleAuth.logoutAdmin();
          window.location.replace('../login/index.html');
        }
      });
    }
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case 'overview':
        this.renderOverview();
        break;
      case 'products':
        this.renderProducts();
        break;
      case 'categories':
        this.renderCategories();
        break;
      case 'orders':
        this.renderOrders();
        break;
      case 'customers':
        this.renderCustomers();
        break;
      case 'pricing':
        this.renderPricing();
        break;
      case 'offers':
        this.renderOffers();
        break;
      case 'locations':
        this.renderLocations();
        break;
      case 'reviews':
        this.renderReviews();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  }

  // ==============================================
  // 1. OVERVIEW PANEL
  // ==============================================
  renderOverview() {
    const metrics = window.WaffleStore.getDashboardMetrics();
    
    // Overview Metrics
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal('metric-revenue', `₹${metrics.revenue.toLocaleString('en-IN')}`);
    setVal('metric-total-orders', metrics.totalOrders);
    setVal('metric-today-orders', metrics.todayOrders);
    setVal('metric-pending-orders', metrics.pendingOrders);
    setVal('metric-completed-orders', metrics.completedOrders);
    setVal('metric-total-customers', metrics.totalCustomers);
    setVal('metric-total-products', metrics.totalProducts);

    // Recent 5 Orders Table
    const recentTable = document.getElementById('overview-recent-orders-tbody');
    if (recentTable) {
      const orders = window.WaffleStore.getOrders().slice(0, 5);
      if (orders.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--admin-cream-dim);">No orders logged yet.</td></tr>`;
      } else {
        recentTable.innerHTML = orders.map(o => `
          <tr>
            <td><strong style="color: var(--admin-gold-light); font-family: 'Space Grotesk', monospace;">${o.id}</strong></td>
            <td>
              <strong>${o.customer}</strong>
              <div style="font-size: 0.75rem; color: var(--admin-cream-dim);">${o.phone || ''}</div>
            </td>
            <td>${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
            <td><strong style="font-family: 'Space Grotesk', monospace;">₹${o.total}</strong></td>
            <td>
              <select class="status-select" onchange="waffleAdmin.updateOrderStatus('${o.id}', this.value)">
                <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
                <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
            <td><span style="font-size: 0.78rem; color: var(--admin-cream-muted);">${o.date}</span></td>
          </tr>
        `).join('');
      }
    }
  }

  // ==============================================
  // 2. PRODUCTS PANEL
  // ==============================================
  renderProducts() {
    const tbody = document.getElementById('products-table-tbody');
    if (!tbody) return;

    const products = window.WaffleStore.getProducts(false);
    const searchVal = (document.getElementById('product-search-input')?.value || '').toLowerCase();
    const catVal = document.getElementById('product-cat-filter')?.value || 'all';

    const filtered = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchVal) || (p.description || '').toLowerCase().includes(searchVal);
      const matchCat = catVal === 'all' || p.category === catVal;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--admin-cream-dim);">No matching waffle products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.src='../../assets/images/classic-waffle.jpg'" />
            <div>
              <strong style="color: var(--admin-cream);">${p.name}</strong>
              <div style="font-size: 0.75rem; color: var(--admin-cream-dim);">${p.badge || 'Artisanal'}</div>
            </div>
          </div>
        </td>
        <td><span style="text-transform: capitalize; color: var(--admin-gold-light);">${p.category}</span></td>
        <td><strong style="font-family: 'Space Grotesk', monospace; color: var(--admin-gold-light); font-size: 1rem;">₹${p.price}</strong></td>
        <td>
          <span style="font-size: 0.8rem; color: var(--admin-cream-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 280px;">
            ${p.description}
          </span>
        </td>
        <td>
          <button class="status-badge ${p.available !== false ? 'ready' : 'cancelled'}" onclick="waffleAdmin.toggleProductAvailability('${p.id}')" style="cursor: pointer; border: none;">
            ${p.available !== false ? 'Available' : 'Disabled'}
          </button>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" title="Edit Product" onclick="waffleAdmin.openEditProductModal('${p.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action delete" title="Delete Product" onclick="waffleAdmin.deleteProduct('${p.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openAddProductModal() {
    this.editingProductId = null;
    document.getElementById('product-modal-title').textContent = 'Add New Waffle Product';
    document.getElementById('product-form').reset();
    document.getElementById('prod-id-field').value = '';
    document.getElementById('modal-product').classList.add('open');
  }

  openEditProductModal(id) {
    const p = window.WaffleStore.getProductById(id);
    if (!p) return;

    this.editingProductId = id;
    document.getElementById('product-modal-title').textContent = 'Edit Waffle Product';
    document.getElementById('prod-id-field').value = p.id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-image').value = p.image;
    document.getElementById('prod-badge').value = p.badge || '';
    document.getElementById('prod-desc').value = p.description || '';
    document.getElementById('prod-tags').value = (p.tags || []).join(', ');

    document.getElementById('modal-product').classList.add('open');
  }

  saveProductForm(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id-field').value;
    const name = document.getElementById('prod-name').value.trim();
    const price = parseInt(document.getElementById('prod-price').value, 10);
    const category = document.getElementById('prod-category').value;
    const image = document.getElementById('prod-image').value.trim() || 'assets/images/classic-waffle.jpg';
    const badge = document.getElementById('prod-badge').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const tags = document.getElementById('prod-tags').value.split(',').map(t => t.trim()).filter(Boolean);

    if (id) {
      window.WaffleStore.updateProduct(id, { name, price, category, image, badge, description, tags });
    } else {
      window.WaffleStore.addProduct({ name, price, category, image, badge, description, tags, available: true });
    }

    this.closeModal('modal-product');
    this.renderProducts();
  }

  deleteProduct(id) {
    const p = window.WaffleStore.getProductById(id);
    if (confirm(`Are you sure you want to delete "${p?.name || 'this product'}"?`)) {
      window.WaffleStore.deleteProduct(id);
      this.renderProducts();
    }
  }

  toggleProductAvailability(id) {
    const p = window.WaffleStore.getProductById(id);
    if (p) {
      window.WaffleStore.updateProduct(id, { available: p.available === false });
      this.renderProducts();
    }
  }

  // ==============================================
  // 3. CATEGORIES PANEL
  // ==============================================
  renderCategories() {
    const tbody = document.getElementById('categories-table-tbody');
    if (!tbody) return;

    const categories = window.WaffleStore.getCategories();
    const products = window.WaffleStore.getProducts();

    tbody.innerHTML = categories.map(cat => {
      const count = products.filter(p => cat.id === 'all' || p.category === cat.id).length;
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); color: var(--admin-gold); display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid ${cat.icon || 'fa-tag'}"></i>
              </span>
              <strong>${cat.name}</strong>
            </div>
          </td>
          <td><code style="color: var(--admin-gold-light); font-size: 0.8rem;">${cat.id}</code></td>
          <td><strong style="font-family: 'Space Grotesk', monospace;">${count} waffles</strong></td>
          <td>
            <span class="status-badge ${cat.active !== false ? 'ready' : 'cancelled'}">
              ${cat.active !== false ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-icon-action" title="Toggle Category" onclick="waffleAdmin.toggleCategory('${cat.id}')">
                <i class="fa-solid fa-power-off"></i>
              </button>
              ${cat.id !== 'all' ? `
                <button class="btn-icon-action delete" title="Delete Category" onclick="waffleAdmin.deleteCategory('${cat.id}')">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openAddCategoryModal() {
    document.getElementById('category-form').reset();
    document.getElementById('modal-category').classList.add('open');
  }

  saveCategoryForm(e) {
    e.preventDefault();
    const id = document.getElementById('cat-id-field').value.trim().toLowerCase().replace(/\s+/g, '-');
    const name = document.getElementById('cat-name-field').value.trim();
    const icon = document.getElementById('cat-icon-field').value.trim() || 'fa-tag';

    if (id && name) {
      window.WaffleStore.addCategory({ id, name, icon, active: true });
      this.closeModal('modal-category');
      this.renderCategories();
    }
  }

  toggleCategory(id) {
    const cats = window.WaffleStore.getCategories();
    const c = cats.find(cat => cat.id === id);
    if (c) {
      window.WaffleStore.updateCategory(id, { active: c.active === false });
      this.renderCategories();
    }
  }

  deleteCategory(id) {
    if (confirm(`Are you sure you want to remove the "${id}" category?`)) {
      window.WaffleStore.deleteCategory(id);
      this.renderCategories();
    }
  }

  // ==============================================
  // 4. ORDERS PANEL
  // ==============================================
  renderOrders() {
    const tbody = document.getElementById('orders-table-tbody');
    if (!tbody) return;

    const orders = window.WaffleStore.getOrders();
    const searchVal = (document.getElementById('order-search-input')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('order-status-filter')?.value || 'all';

    const filtered = orders.filter(o => {
      const matchSearch = (o.id || '').toLowerCase().includes(searchVal) || (o.customer || '').toLowerCase().includes(searchVal);
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--admin-cream-dim);">No customer orders found matching filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(o => `
      <tr>
        <td>
          <strong style="color: var(--admin-gold-light); font-family: 'Space Grotesk', monospace;">${o.id}</strong>
          <div style="font-size: 0.74rem; color: var(--admin-cream-dim);">${o.date}</div>
        </td>
        <td>
          <strong>${o.customer}</strong>
          <div style="font-size: 0.75rem; color: var(--admin-cream-dim);">${o.phone || ''}</div>
          <div style="font-size: 0.75rem; color: var(--admin-cream-muted); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${o.address || ''}</div>
        </td>
        <td>
          <div style="font-size: 0.85rem;">
            ${(o.items || []).map(i => `<div>• ${i.name} <span style="color: var(--admin-gold);">(x${i.quantity})</span></div>`).join('')}
          </div>
        </td>
        <td>
          <strong style="font-family: 'Space Grotesk', monospace; color: var(--admin-gold); font-size: 1.05rem;">₹${o.total}</strong>
          <div style="font-size: 0.72rem; color: var(--admin-green);">${o.paymentMethod || 'UPI'} (${o.paymentStatus || 'Paid'})</div>
        </td>
        <td>
          <select class="status-select" onchange="waffleAdmin.updateOrderStatus('${o.id}', this.value)">
            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
            <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="admin-action-btn secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="waffleAdmin.viewOrderDetails('${o.id}')">
            <i class="fa-solid fa-eye"></i> Details
          </button>
        </td>
      </tr>
    `).join('');
  }

  updateOrderStatus(orderId, newStatus) {
    window.WaffleStore.updateOrderStatus(orderId, newStatus);
    if (this.currentTab === 'overview') this.renderOverview();
    else if (this.currentTab === 'orders') this.renderOrders();
  }

  viewOrderDetails(orderId) {
    const o = window.WaffleStore.getOrderById(orderId);
    if (!o) return;

    alert(
      `ORDER: ${o.id}\n` +
      `Customer: ${o.customer}\n` +
      `Contact: ${o.phone} | ${o.email}\n` +
      `Address: ${o.address}\n\n` +
      `Items:\n` +
      o.items.map(i => ` - ${i.name} x ${i.quantity} (₹${i.price * i.quantity})`).join('\n') +
      `\n\nTotal Paid: ₹${o.total} (${o.paymentMethod})\n` +
      `Current Status: ${o.status}`
    );
  }

  // ==============================================
  // 5. CUSTOMERS PANEL
  // ==============================================
  renderCustomers() {
    const tbody = document.getElementById('customers-table-tbody');
    if (!tbody) return;

    const customers = window.WaffleStore.getCustomers();
    const searchVal = (document.getElementById('customer-search-input')?.value || '').toLowerCase();

    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(searchVal) || 
      (c.email || '').toLowerCase().includes(searchVal) ||
      (c.phone || '').includes(searchVal)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--admin-cream-dim);">No customer records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong style="color: var(--admin-gold-light); font-family: 'Space Grotesk', monospace;">${c.id}</strong></td>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td>${c.phone || '-'}</td>
        <td><strong style="font-family: 'Space Grotesk', monospace;">${c.ordersCount || 1}</strong></td>
        <td><strong style="font-family: 'Space Grotesk', monospace; color: var(--admin-gold);">₹${c.totalSpent || 0}</strong></td>
        <td><span class="status-badge ${c.status === 'VIP' ? 'confirmed' : 'ready'}">${c.status || 'Active'}</span></td>
      </tr>
    `).join('');
  }

  // ==============================================
  // 6. PRICING PANEL (Quick Bulk Editor)
  // ==============================================
  renderPricing() {
    const tbody = document.getElementById('pricing-table-tbody');
    if (!tbody) return;

    const products = window.WaffleStore.getProducts();

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.src='../../assets/images/classic-waffle.jpg'" />
            <strong>${p.name}</strong>
          </div>
        </td>
        <td><span style="text-transform: capitalize; color: var(--admin-gold-light);">${p.category}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem; max-width: 140px;">
            <span style="font-size: 1.1rem; color: var(--admin-gold); font-weight: 800;">₹</span>
            <input type="number" id="price-input-${p.id}" value="${p.price}" style="width: 90px; padding: 6px 10px; background: rgba(0,0,0,0.4); border: 1px solid var(--admin-border); border-radius: 6px; color: var(--admin-cream); font-family: 'Space Grotesk', monospace; font-size: 1rem; font-weight: 700;" />
          </div>
        </td>
        <td>
          <button class="admin-action-btn primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="waffleAdmin.saveSinglePrice('${p.id}')">
            <i class="fa-solid fa-floppy-disk"></i> Update ₹
          </button>
        </td>
      </tr>
    `).join('');
  }

  saveSinglePrice(productId) {
    const input = document.getElementById(`price-input-${productId}`);
    if (!input) return;

    const newPrice = parseInt(input.value, 10);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price in ₹ INR.');
      return;
    }

    window.WaffleStore.updateProduct(productId, { price: newPrice });
    alert(`Price updated to ₹${newPrice}! The customer website will immediately show the new price.`);
  }

  // ==============================================
  // 7. OFFERS & COUPONS PANEL
  // ==============================================
  renderOffers() {
    const tbody = document.getElementById('offers-table-tbody');
    if (!tbody) return;

    const offers = window.WaffleStore.getOffers();

    tbody.innerHTML = offers.map(o => `
      <tr>
        <td><strong style="color: var(--admin-gold); font-family: 'Space Grotesk', monospace; letter-spacing: 0.08em;">${o.code}</strong></td>
        <td>${o.title}</td>
        <td>
          ${o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} FLAT`}
        </td>
        <td>₹${o.minOrder || 0}</td>
        <td>${o.expiry || 'Permanent'}</td>
        <td>
          <span class="status-badge ${o.active ? 'ready' : 'cancelled'}" onclick="waffleAdmin.toggleOffer('${o.id}')" style="cursor: pointer;">
            ${o.active ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action delete" title="Delete Offer" onclick="waffleAdmin.deleteOffer('${o.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openAddOfferModal() {
    document.getElementById('offer-form').reset();
    document.getElementById('modal-offer').classList.add('open');
  }

  saveOfferForm(e) {
    e.preventDefault();
    const code = document.getElementById('offer-code').value.trim().toUpperCase();
    const title = document.getElementById('offer-title').value.trim();
    const discountType = document.getElementById('offer-type').value;
    const discountValue = parseInt(document.getElementById('offer-val').value, 10);
    const minOrder = parseInt(document.getElementById('offer-min').value, 10) || 0;
    const expiry = document.getElementById('offer-expiry').value || '2026-12-31';

    if (code && title) {
      window.WaffleStore.addOffer({ code, title, discountType, discountValue, minOrder, expiry, active: true });
      this.closeModal('modal-offer');
      this.renderOffers();
    }
  }

  toggleOffer(id) {
    const offers = window.WaffleStore.getOffers();
    const o = offers.find(item => item.id === id);
    if (o) {
      window.WaffleStore.updateOffer(id, { active: !o.active });
      this.renderOffers();
    }
  }

  deleteOffer(id) {
    if (confirm('Delete this promo code?')) {
      window.WaffleStore.deleteOffer(id);
      this.renderOffers();
    }
  }

  // ==============================================
  // 8. LOCATIONS PANEL
  // ==============================================
  renderLocations() {
    const tbody = document.getElementById('locations-table-tbody');
    if (!tbody) return;

    const locs = window.WaffleStore.getLocations();

    tbody.innerHTML = locs.map(l => `
      <tr>
        <td>
          <strong>${l.name}</strong>
          ${l.isFlagship ? `<span style="font-size: 0.68rem; background: var(--admin-gold); color:#140A05; font-weight:800; padding:2px 6px; border-radius:4px; margin-left:6px;">FLAGSHIP</span>` : ''}
        </td>
        <td><strong style="color: var(--admin-gold-light);">${l.city}</strong></td>
        <td><span style="font-size: 0.85rem; color: var(--admin-cream-muted);">${l.address}</span></td>
        <td>${l.phone}</td>
        <td><span style="font-size: 0.82rem;">${l.hours}</span></td>
        <td>
          <span class="status-badge ${l.active ? 'ready' : 'cancelled'}" onclick="waffleAdmin.toggleLocation('${l.id}')" style="cursor: pointer;">
            ${l.active ? 'Open' : 'Closed'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action delete" title="Delete Location" onclick="waffleAdmin.deleteLocation('${l.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openAddLocationModal() {
    document.getElementById('location-form').reset();
    document.getElementById('modal-location').classList.add('open');
  }

  saveLocationForm(e) {
    e.preventDefault();
    const name = document.getElementById('loc-name').value.trim();
    const city = document.getElementById('loc-city').value.trim();
    const address = document.getElementById('loc-address').value.trim();
    const phone = document.getElementById('loc-phone').value.trim();
    const hours = document.getElementById('loc-hours').value.trim() || 'Mon-Sun: 9:00 AM - 1:00 AM';

    if (name && city) {
      window.WaffleStore.addLocation({ name, city, address, phone, hours, active: true, isFlagship: false });
      this.closeModal('modal-location');
      this.renderLocations();
    }
  }

  toggleLocation(id) {
    const locs = window.WaffleStore.getLocations();
    const l = locs.find(item => item.id === id);
    if (l) {
      window.WaffleStore.updateLocation(id, { active: !l.active });
      this.renderLocations();
    }
  }

  deleteLocation(id) {
    if (confirm('Delete this store location?')) {
      window.WaffleStore.deleteLocation(id);
      this.renderLocations();
    }
  }

  // ==============================================
  // 9. REVIEWS PANEL
  // ==============================================
  renderReviews() {
    const tbody = document.getElementById('reviews-table-tbody');
    if (!tbody) return;

    const reviews = window.WaffleStore.getReviews();

    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td><strong>${r.author}</strong></td>
        <td>
          <span style="color: var(--admin-gold);">
            ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
          </span>
        </td>
        <td><strong style="color: var(--admin-gold-light);">${r.product || 'Artisanal Waffle'}</strong></td>
        <td><span style="font-size: 0.85rem; color: var(--admin-cream-muted);">${r.comment}</span></td>
        <td>${r.date}</td>
        <td>
          <button class="status-badge ${r.approved ? 'ready' : 'cancelled'}" onclick="waffleAdmin.toggleReview('${r.id}')" style="cursor: pointer; border: none;">
            ${r.approved ? 'Approved' : 'Hidden'}
          </button>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action delete" title="Delete Review" onclick="waffleAdmin.deleteReview('${r.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  toggleReview(id) {
    window.WaffleStore.toggleReviewApproval(id);
    this.renderReviews();
  }

  deleteReview(id) {
    if (confirm('Delete this customer review?')) {
      window.WaffleStore.deleteReview(id);
      this.renderReviews();
    }
  }

  // ==============================================
  // 10. SETTINGS PANEL
  // ==============================================
  renderSettings() {
    const settings = window.WaffleStore.getSettings();

    document.getElementById('set-brand').value = settings.brandName || 'WAFFLE HOUSE';
    document.getElementById('set-tagline').value = settings.tagline || 'Artisanal Belgian Liege Boutique • India';
    document.getElementById('set-email').value = settings.supportEmail || 'namaste@wafflehouse.in';
    document.getElementById('set-phone').value = settings.supportPhone || '+91 98200 WAFFLE (92335)';
    document.getElementById('set-gst').value = settings.gstRate || 5;
    document.getElementById('set-delivery').value = settings.deliveryFee || 25;
    document.getElementById('set-hours').value = settings.operatingHours || '9:00 AM – 1:00 AM';
  }

  saveSettingsForm(e) {
    e.preventDefault();
    const brandName = document.getElementById('set-brand').value.trim();
    const tagline = document.getElementById('set-tagline').value.trim();
    const supportEmail = document.getElementById('set-email').value.trim();
    const supportPhone = document.getElementById('set-phone').value.trim();
    const gstRate = parseInt(document.getElementById('set-gst').value, 10);
    const deliveryFee = parseInt(document.getElementById('set-delivery').value, 10);
    const operatingHours = document.getElementById('set-hours').value.trim();

    window.WaffleStore.updateSettings({
      brandName,
      tagline,
      supportEmail,
      supportPhone,
      gstRate,
      deliveryFee,
      operatingHours
    });

    alert('System settings updated successfully!');
  }

  resetStoreDefaults() {
    if (confirm('Are you sure you want to reset all store data to factory defaults? This will restore original 18 waffles, demo orders, and settings.')) {
      window.WaffleStore.resetToDefaults();
      this.renderCurrentTab();
      alert('Store data reset to factory defaults.');
    }
  }

  // Modal helpers
  bindModals() {
    // Form submits
    document.getElementById('product-form')?.addEventListener('submit', (e) => this.saveProductForm(e));
    document.getElementById('category-form')?.addEventListener('submit', (e) => this.saveCategoryForm(e));
    document.getElementById('offer-form')?.addEventListener('submit', (e) => this.saveOfferForm(e));
    document.getElementById('location-form')?.addEventListener('submit', (e) => this.saveLocationForm(e));
    document.getElementById('settings-form')?.addEventListener('submit', (e) => this.saveSettingsForm(e));

    // Filter listeners
    document.getElementById('product-search-input')?.addEventListener('input', () => this.renderProducts());
    document.getElementById('product-cat-filter')?.addEventListener('change', () => this.renderProducts());
    document.getElementById('order-search-input')?.addEventListener('input', () => this.renderOrders());
    document.getElementById('order-status-filter')?.addEventListener('change', () => this.renderOrders());
    document.getElementById('customer-search-input')?.addEventListener('input', () => this.renderCustomers());
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.waffleAdmin = new WaffleAdminDashboard();
});
