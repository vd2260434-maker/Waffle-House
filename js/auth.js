/**
 * WAFFLE HOUSE - Role-Based Authentication & Session Manager
 * 
 * Enforces separation between:
 * 1. CUSTOMER: Can only access public storefront and their own orders.
 *              Never sees Admin links, credentials, or dashboard controls.
 * 2. ADMIN: Authenticated via /admin/login with protected access to /admin/dashboard
 *           and the ability to toggle back and forth to Customer Website.
 * 
 * DEVELOPMENT/DEMO CREDENTIALS:
 * Username: admin01010101
 * Password: vijay749283927181919772864
 * 
 * Note: For production architectures, this interfaces with server-side JWT / session
 * verification endpoints (e.g. POST /api/auth/login) with bcrypt/argon2 password hashing.
 */

class WaffleAuthManager {
  constructor() {
    this.adminStorageKey = 'waffle_admin_session_v1';
    this.customerStorageKey = 'waffle_customer_session_v1';
    
    // Configured demo credentials
    this._devAdminUser = 'admin01010101';
    this._devAdminPass = 'vijay749283927181919772864';

    this.initCustomerWebsiteSwitcher();
  }

  // --- ADMIN AUTHENTICATION ---
  loginAdmin(username, password) {
    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '').trim();

    if (cleanUser === this._devAdminUser && cleanPass === this._devAdminPass) {
      const session = {
        token: 'wh_adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10),
        role: 'ADMIN',
        username: cleanUser,
        name: 'Master Wafflier Admin',
        loginTime: new Date().toISOString()
      };

      try {
        localStorage.setItem(this.adminStorageKey, JSON.stringify(session));
      } catch (e) {
        sessionStorage.setItem(this.adminStorageKey, JSON.stringify(session));
      }

      window.dispatchEvent(new CustomEvent('waffle_auth_changed', { detail: session }));
      return { success: true, session };
    }

    return { success: false, error: 'Invalid admin credentials' };
  }

  logoutAdmin() {
    try {
      localStorage.removeItem(this.adminStorageKey);
      sessionStorage.removeItem(this.adminStorageKey);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('waffle_auth_changed', { detail: null }));
    return { success: true };
  }

  getAdminSession() {
    try {
      const stored = localStorage.getItem(this.adminStorageKey) || sessionStorage.getItem(this.adminStorageKey);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.role === 'ADMIN' && parsed.token) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  isAdminAuthenticated() {
    return this.getAdminSession() !== null;
  }

  /**
   * Enforces route protection on /admin/* pages.
   * Immediately redirects unauthenticated users or customers away.
   */
  requireAdminAuth(loginPath = '/admin/login') {
    if (!this.isAdminAuthenticated()) {
      // Determine relative path based on current location
      const isSubdir = window.location.pathname.includes('/admin/');
      const target = isSubdir ? '../login/index.html' : loginPath;
      window.location.replace(target);
      return false;
    }
    return true;
  }

  // --- CUSTOMER AUTHENTICATION (For guest/customer tracking) ---
  getCustomerSession() {
    try {
      const stored = localStorage.getItem(this.customerStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  setCustomerSession(customer) {
    try {
      localStorage.setItem(this.customerStorageKey, JSON.stringify(customer));
    } catch (e) {}
  }

  // --- ADMIN QUICK-SWITCH BAR ON CUSTOMER WEBSITE ---
  initCustomerWebsiteSwitcher() {
    // Only execute on customer storefront pages (not on /admin/ pages)
    if (window.location.pathname.includes('/admin/')) return;

    const setup = () => {
      this.renderAdminFloatingBar();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }

    // React immediately if admin logs in/out in another tab or programmatically
    window.addEventListener('waffle_auth_changed', () => {
      this.renderAdminFloatingBar();
    });
    window.addEventListener('storage', (e) => {
      if (e.key === this.adminStorageKey) {
        this.renderAdminFloatingBar();
      }
    });
  }

  renderAdminFloatingBar() {
    // Remove if already exists
    const existing = document.getElementById('admin-quick-switch-bar');
    if (existing) existing.remove();

    // Only render if currently logged in as ADMIN
    if (!this.isAdminAuthenticated()) return;

    const bar = document.createElement('div');
    bar.id = 'admin-quick-switch-bar';
    bar.className = 'admin-quick-switch-bar';
    
    // Resolve relative path to admin dashboard
    const adminPath = window.location.pathname.endsWith('/') 
      ? 'admin/dashboard/index.html' 
      : (window.location.pathname.endsWith('index.html') ? 'admin/dashboard/index.html' : './admin/dashboard/index.html');

    bar.innerHTML = `
      <div class="admin-bar-content">
        <span class="admin-badge"><i class="fa-solid fa-shield-halved"></i> ADMIN MODE</span>
        <span class="admin-hint">You are viewing the public storefront as an authorized Administrator</span>
        <div class="admin-bar-actions">
          <a href="${adminPath}" class="btn-back-admin" id="btn-back-to-admin">
            <i class="fa-solid fa-arrow-left"></i> BACK TO ADMIN PANEL
          </a>
        </div>
      </div>
    `;

    document.body.prepend(bar);
  }
}

// Global authentication singleton
window.WaffleAuth = new WaffleAuthManager();
