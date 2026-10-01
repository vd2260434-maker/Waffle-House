/**
 * WAFFLE HOUSE - Central Data Store & State Management
 * Shared across Customer Website and Admin Panel via localStorage.
 * Ensures that changes made in Admin (products, prices, orders, offers, locations)
 * are immediately reflected on the Customer website and vice-versa.
 */

const DEFAULT_STORE_DATA = {
  products: [
    {
      id: 'prod-classic-belgian',
      category: 'classic',
      name: 'Classic Belgian Waffle',
      description: 'Authentic 48-hour fermented brioche waffle infused with crunchy Wallonia pearl sugar and a pat of French salted butter.',
      price: 180,
      image: 'assets/images/classic-waffle.jpg',
      badge: 'Heritage',
      tags: ['48h Brioche', 'Pearl Sugar', 'Eggless Avail.'],
      available: true,
      customPreset: { base: 'classic', sauces: ['pure-honey'], toppings: ['sprinkles'], icecream: 'none' }
    },
    {
      id: 'prod-chocolate-waffle',
      category: 'chocolate',
      name: 'Chocolate Waffle',
      description: 'Golden griddled waffle generously enrobed in smooth Belgian milk chocolate drizzle and delicate chocolate curls.',
      price: 220,
      image: 'assets/images/chocolate-waffle.jpg',
      badge: 'Popular',
      tags: ['Belgian Cocoa', 'Silky Milk Chocolate', 'Warm Drizzle'],
      available: true,
      customPreset: { base: 'classic', sauces: ['dark-chocolate'], toppings: ['sprinkles'], icecream: 'none' }
    },
    {
      id: 'prod-chocolate-overload',
      category: 'chocolate',
      name: 'Chocolate Overload',
      description: 'Dark Dutch cocoa waffle base, drenched in molten 72% dark ganache, milk chocolate sauce, and Valrhona roasted cocoa nibs.',
      price: 260,
      image: 'assets/images/waffle-stage-chocolate.jpg',
      badge: 'Decadence',
      tags: ['Double Cocoa', '72% Dark Ganache', 'Crunchy Nibs'],
      available: true,
      customPreset: { base: 'chocolate', sauces: ['dark-chocolate'], toppings: ['oreos'], icecream: 'belgian-choc' }
    },
    {
      id: 'prod-nutella-waffle',
      category: 'chocolate',
      name: 'Nutella Waffle',
      description: 'Heavily smothered in warm, velvety Italian Nutella hazelnut spread, crushed roasted hazelnuts, and powdered sugar snow.',
      price: 280,
      image: 'assets/images/waffle-nutella-biscoff.jpg',
      badge: 'Bestseller',
      tags: ['Authentic Nutella', 'Roasted Hazelnuts', 'Rich & Creamy'],
      available: true,
      customPreset: { base: 'classic', sauces: ['nutella'], toppings: ['almonds'], icecream: 'none' }
    },
    {
      id: 'prod-oreo-waffle',
      category: 'chocolate',
      name: 'Oreo Waffle',
      description: 'Crisp waffle loaded with dark Oreo cookie crumble, sweet cream cheese drizzle, and crushed chocolate biscuit dust.',
      price: 240,
      image: 'assets/images/waffle-oreo-kitkat.jpg',
      badge: 'Crunchy',
      tags: ['Oreo Cookie', 'Cookies & Cream', 'Kids Favorite'],
      available: true,
      customPreset: { base: 'chocolate', sauces: ['white-chocolate'], toppings: ['oreos'], icecream: 'vanilla' }
    },
    {
      id: 'prod-kitkat-waffle',
      category: 'chocolate',
      name: 'KitKat Waffle',
      description: 'Layers of crispy wafer KitKat fingers, melted milk chocolate ganache, and chocolate drizzle on a golden waffle.',
      price: 250,
      image: 'assets/images/waffle-oreo-kitkat.jpg',
      badge: 'Crispy',
      tags: ['KitKat Wafers', 'Milk Chocolate', 'Crisp Snap'],
      available: true,
      customPreset: { base: 'classic', sauces: ['dark-chocolate'], toppings: ['oreos'], icecream: 'none' }
    },
    {
      id: 'prod-brownie-waffle',
      category: 'chocolate',
      name: 'Brownie Waffle',
      description: 'Warm, fudgy chocolate walnut brownie chunks scattered across molten chocolate and dusted with cocoa.',
      price: 270,
      image: 'assets/images/chocolate-waffle.jpg',
      badge: 'Chef Special',
      tags: ['Fudge Brownie', 'Walnuts', 'Ultra Rich'],
      available: true,
      customPreset: { base: 'chocolate', sauces: ['dark-chocolate'], toppings: ['almonds'], icecream: 'vanilla' }
    },
    {
      id: 'prod-choco-banana',
      category: 'fruit',
      name: 'Choco Banana Waffle',
      description: 'Fresh caramelized Robusta banana slices arranged over warm dark chocolate and roasted almond flakes.',
      price: 250,
      image: 'assets/images/waffle-stage-chocolate.jpg',
      badge: 'Classic Pair',
      tags: ['Fresh Banana', 'Dark Ganache', 'Almonds'],
      available: true,
      customPreset: { base: 'classic', sauces: ['dark-chocolate'], toppings: ['bananas', 'almonds'], icecream: 'none' }
    },
    {
      id: 'prod-strawberry-cream',
      category: 'fruit',
      name: 'Strawberry Cream Waffle',
      description: 'Fresh farm Mahabaleshwar strawberries sliced over light vanilla chantilly whipped cream and strawberry coulis.',
      price: 260,
      image: 'assets/images/fruit-waffle.jpg',
      badge: 'Farm Fresh',
      tags: ['Mahabaleshwar Berries', 'Vanilla Chantilly', 'Fresh'],
      available: true,
      customPreset: { base: 'classic', sauces: ['berry-coulis'], toppings: ['strawberries', 'whipped-cream'], icecream: 'strawberry' }
    },
    {
      id: 'prod-blueberry-waffle',
      category: 'fruit',
      name: 'Blueberry Waffle',
      description: 'Tart and sweet Canadian blueberries simmered in natural fruit glaze, topped with Philadelphia cream cheese.',
      price: 280,
      image: 'assets/images/waffle-stage-masterpiece.jpg',
      badge: 'Gourmet',
      tags: ['Wild Blueberries', 'Cream Cheese', 'Antioxidants'],
      available: true,
      customPreset: { base: 'classic', sauces: ['berry-coulis'], toppings: ['whipped-cream'], icecream: 'vanilla' }
    },
    {
      id: 'prod-honey-waffle',
      category: 'classic',
      name: 'Honey Waffle',
      description: 'Drizzled with 100% pure organic Himalayan multi-flora raw honey and sprinkled with toasted sesame and butter.',
      price: 210,
      image: 'assets/images/waffle-stage-clean.jpg',
      badge: 'Natural',
      tags: ['Himalayan Raw Honey', 'Pure Butter', 'Golden Crisp'],
      available: true,
      customPreset: { base: 'classic', sauces: ['pure-honey'], toppings: ['sprinkles'], icecream: 'none' }
    },
    {
      id: 'prod-caramel-waffle',
      category: 'classic',
      name: 'Caramel Waffle',
      description: 'Deep, rich salted caramel cooked in copper pots with Brittany sea salt crystals and roasted pecan slivers.',
      price: 220,
      image: 'assets/images/classic-waffle.jpg',
      badge: 'Sweet & Salty',
      tags: ['Salted Butter Caramel', 'Sea Salt', 'Warm Caramel'],
      available: true,
      customPreset: { base: 'classic', sauces: ['salted-caramel'], toppings: ['almonds'], icecream: 'none' }
    },
    {
      id: 'prod-white-chocolate',
      category: 'chocolate',
      name: 'White Chocolate Waffle',
      description: 'Silky smooth Swiss ivory white chocolate ganache, roasted pistachio nibs, and edible gold flakes.',
      price: 240,
      image: 'assets/images/waffle-stage-clean.jpg',
      badge: 'Smooth',
      tags: ['Swiss White Chocolate', 'Pistachios', 'Creamy'],
      available: true,
      customPreset: { base: 'classic', sauces: ['white-chocolate'], toppings: ['sprinkles'], icecream: 'none' }
    },
    {
      id: 'prod-red-velvet',
      category: 'special',
      name: 'Red Velvet Waffle',
      description: 'Vibrant ruby red cocoa waffle layered with tangy Philadelphia cream cheese frosting and white chocolate pearls.',
      price: 260,
      image: 'assets/images/waffle-red-velvet.jpg',
      badge: 'Signature',
      tags: ['Ruby Red Cocoa', 'Cream Cheese', 'White Chocolate'],
      available: true,
      customPreset: { base: 'redvelvet', sauces: ['white-chocolate'], toppings: ['whipped-cream'], icecream: 'vanilla' }
    },
    {
      id: 'prod-lotus-biscoff',
      category: 'special',
      name: 'Lotus Biscoff Waffle',
      description: 'Belgian speculoos biscuit spread, crushed caramelized Lotus Biscoff biscuit crunch, and salted caramel glaze.',
      price: 290,
      image: 'assets/images/waffle-nutella-biscoff.jpg',
      badge: 'Top Rated',
      tags: ['Speculoos Biscoff', 'Crunchy Biscuit', 'Caramelized'],
      available: true,
      customPreset: { base: 'classic', sauces: ['salted-caramel'], toppings: ['oreos'], icecream: 'salted-caramel' }
    },
    {
      id: 'prod-ferrero-rocher',
      category: 'special',
      name: 'Ferrero Rocher Waffle',
      description: 'Whole Ferrero Rocher truffles, warm hazelnut gianduja chocolate, chopped hazelnuts, and 24K edible gold dust.',
      price: 320,
      image: 'assets/images/chocolate-waffle.jpg',
      badge: 'Royal Indulgence',
      tags: ['Ferrero Rocher', 'Hazelnut Gianduja', 'Luxury'],
      available: true,
      customPreset: { base: 'chocolate', sauces: ['nutella'], toppings: ['almonds'], icecream: 'belgian-choc' }
    },
    {
      id: 'prod-fruit-cream',
      category: 'fruit',
      name: 'Fruit & Cream Waffle',
      description: 'A bountiful medley of fresh strawberries, ripe bananas, kiwi slices, blueberries, and cloud chantilly cream.',
      price: 270,
      image: 'assets/images/fruit-waffle.jpg',
      badge: 'Fresh Mix',
      tags: ['Exotic Fruits', 'Chantilly Cream', 'Vibrant'],
      available: true,
      customPreset: { base: 'classic', sauces: ['berry-coulis'], toppings: ['strawberries', 'bananas', 'whipped-cream'], icecream: 'strawberry' }
    },
    {
      id: 'prod-ice-cream-waffle',
      category: 'icecream',
      name: 'Ice Cream Waffle',
      description: 'Dual towers of artisanal Madagascar vanilla gelato & dark chocolate fudge gelato on a smoking hot waffle.',
      price: 260,
      image: 'assets/images/icecream-waffle.jpg',
      badge: 'Hot & Cold',
      tags: ['French Gelato', 'Dual Scoop', 'Hot-Cold Contrast'],
      available: true,
      customPreset: { base: 'classic', sauces: ['dark-chocolate'], toppings: ['almonds'], icecream: 'vanilla' }
    },
    {
      id: 'prod-caramel-latte',
      category: 'drinks',
      name: 'Signature Caramel Waffle Latte',
      description: 'Artisanal single-origin Chikmagalur espresso pulled over steamed whole milk and house-made salted waffle caramel.',
      price: 190,
      image: 'assets/images/drink-latte.jpg',
      badge: 'Barista Special',
      tags: ['Chikmagalur Arabica', 'House Caramel', 'Hot / Iced'],
      available: true,
      customPreset: null
    },
    {
      id: 'prod-hot-cocoa',
      category: 'drinks',
      name: 'Molten Belgian Drinking Cocoa',
      description: 'Ultra-dense 72% Callebaut dark chocolate melted with cream, cinnamon bark, and a torched artisan marshmallow.',
      price: 220,
      image: 'assets/images/drink-hot-chocolate.jpg',
      badge: 'Decadent',
      tags: ['72% Callebaut', 'Torched Marshmallow', 'Pure Cocoa'],
      available: true,
      customPreset: null
    }
  ],

  categories: [
    { id: 'all', name: 'All Flavors', icon: 'fa-border-all', active: true },
    { id: 'classic', name: 'Classic Waffles', icon: 'fa-stroopwafel', active: true },
    { id: 'chocolate', name: 'Chocolate Decadence', icon: 'fa-cookie', active: true },
    { id: 'special', name: 'Chef Specials & Biscoff', icon: 'fa-wand-magic-sparkles', active: true },
    { id: 'fruit', name: 'Fruit & Berry', icon: 'fa-apple-whole', active: true },
    { id: 'icecream', name: 'Ice Cream Towers', icon: 'fa-ice-cream', active: true },
    { id: 'drinks', name: 'Drinks & Cocoa', icon: 'fa-mug-hot', active: true }
  ],

  orders: [
    {
      id: '#WH-IND-84291',
      customer: 'Aarav Mehta',
      phone: '+91 98201 44521',
      email: 'aarav.mehta@gmail.com',
      address: 'Flat 402, Sea Green Apts, Linking Road, Bandra West, Mumbai',
      items: [
        { name: 'Chocolate Overload', price: 260, quantity: 2 },
        { name: 'Signature Caramel Waffle Latte', price: 190, quantity: 1 }
      ],
      total: 735,
      date: '2026-10-01 15:42',
      paymentMethod: 'UPI (GPay)',
      paymentStatus: 'Paid',
      status: 'Preparing'
    },
    {
      id: '#WH-IND-84288',
      customer: 'Priya Sharma',
      phone: '+91 99302 18944',
      email: 'priya.s@yahoo.co.in',
      address: '100ft Road, Indiranagar, Bengaluru',
      items: [
        { name: 'Lotus Biscoff Waffle', price: 290, quantity: 1 },
        { name: 'Strawberry Cream Waffle', price: 260, quantity: 1 }
      ],
      total: 580,
      date: '2026-10-01 14:15',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      status: 'Ready'
    },
    {
      id: '#WH-IND-84275',
      customer: 'Rohan Gupta',
      phone: '+91 98110 57239',
      email: 'rohan.gupta@outlook.com',
      address: 'Block B, Connaught Place, New Delhi',
      items: [
        { name: 'Ferrero Rocher Waffle', price: 320, quantity: 1 }
      ],
      total: 361,
      date: '2026-10-01 13:08',
      paymentMethod: 'UPI (PhonePe)',
      paymentStatus: 'Paid',
      status: 'Completed'
    },
    {
      id: '#WH-IND-84260',
      customer: 'Ananya Iyer',
      phone: '+91 97412 88902',
      email: 'ananya.iyer@gmail.com',
      address: 'Koramangala 4th Block, Bengaluru',
      items: [
        { name: 'Classic Belgian Waffle', price: 180, quantity: 2 },
        { name: 'Molten Belgian Drinking Cocoa', price: 220, quantity: 2 }
      ],
      total: 865,
      date: '2026-10-01 11:20',
      paymentMethod: 'Card on Delivery',
      paymentStatus: 'Paid',
      status: 'Completed'
    }
  ],

  customers: [
    {
      id: 'CUST-1001',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      phone: '+91 98201 44521',
      city: 'Mumbai',
      ordersCount: 4,
      totalSpent: 2840,
      status: 'Active',
      registered: '2026-08-14'
    },
    {
      id: 'CUST-1002',
      name: 'Priya Sharma',
      email: 'priya.s@yahoo.co.in',
      phone: '+91 99302 18944',
      city: 'Bengaluru',
      ordersCount: 3,
      totalSpent: 1720,
      status: 'Active',
      registered: '2026-08-28'
    },
    {
      id: 'CUST-1003',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@outlook.com',
      phone: '+91 98110 57239',
      city: 'New Delhi',
      ordersCount: 6,
      totalSpent: 3950,
      status: 'VIP',
      registered: '2026-07-02'
    },
    {
      id: 'CUST-1004',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@gmail.com',
      phone: '+91 97412 88902',
      city: 'Bengaluru',
      ordersCount: 2,
      totalSpent: 1485,
      status: 'Active',
      registered: '2026-09-05'
    }
  ],

  offers: [
    {
      id: 'OFFER-1',
      code: 'CRISPY20',
      title: '20% Grand Inaugural Discount',
      discountType: 'percentage',
      discountValue: 20,
      minOrder: 250,
      active: true,
      expiry: '2026-12-31'
    },
    {
      id: 'OFFER-2',
      code: 'WAFFLE50',
      title: '₹50 Flat Waffle Love',
      discountType: 'fixed',
      discountValue: 50,
      minOrder: 300,
      active: true,
      expiry: '2026-11-30'
    },
    {
      id: 'OFFER-3',
      code: 'FIRST100',
      title: '₹100 Off First Luxury Order',
      discountType: 'fixed',
      discountValue: 100,
      minOrder: 500,
      active: true,
      expiry: '2026-12-31'
    }
  ],

  locations: [
    {
      id: 'LOC-1',
      name: 'Bandra West Flagship',
      city: 'Mumbai',
      address: '742 Linking Road, Opposite National College, Bandra West, Mumbai 400050',
      phone: '+91 98200 92335',
      hours: 'Mon-Sun: 9:00 AM - 1:00 AM',
      active: true,
      isFlagship: true
    },
    {
      id: 'LOC-2',
      name: 'Indiranagar Boutique',
      city: 'Bengaluru',
      address: '584, 100ft Road, Near CMH Junction, Indiranagar, Bengaluru 560038',
      phone: '+91 80 4120 9233',
      hours: 'Mon-Sun: 9:00 AM - 12:30 AM',
      active: true,
      isFlagship: false
    },
    {
      id: 'LOC-3',
      name: 'Connaught Place Lounge',
      city: 'New Delhi',
      address: 'Block B, Inner Circle, Connaught Place, New Delhi 110001',
      phone: '+91 11 2341 9233',
      hours: 'Mon-Sun: 10:00 AM - 12:00 AM',
      active: true,
      isFlagship: false
    }
  ],

  reviews: [
    {
      id: 'REV-1',
      author: 'Sameer Kapadia (Mumbai)',
      rating: 5,
      date: '2026-09-24',
      product: 'Nutella Chocolate Waffle',
      comment: 'Hands down the most authentic Belgian Liege waffle in India. The pearl sugar crunch is heavenly!',
      approved: true
    },
    {
      id: 'REV-2',
      author: 'Dr. Meera Nambiar (Bengaluru)',
      rating: 5,
      date: '2026-09-28',
      product: 'Lotus Biscoff Waffle',
      comment: 'Warm, gooey speculoos with the cold vanilla gelato is an extraordinary combination. 10/10.',
      approved: true
    },
    {
      id: 'REV-3',
      author: 'Vikramaditya Rao (Delhi)',
      rating: 5,
      date: '2026-09-30',
      product: 'Classic Belgian Waffle',
      comment: 'Proper brioche dough ferment, perfectly balanced with salted butter. Truly world-class.',
      approved: true
    }
  ],

  settings: {
    brandName: 'WAFFLE HOUSE',
    tagline: 'Artisanal Belgian Liege Boutique • India',
    currency: '₹',
    gstRate: 5,
    deliveryFee: 25,
    supportEmail: 'namaste@wafflehouse.in',
    supportPhone: '+91 98200 WAFFLE (92335)',
    operatingHours: '9:00 AM – 1:00 AM',
    theme: 'Dark Cocoa Luxury'
  }
};

class WaffleStoreManager {
  constructor() {
    this.storageKey = 'waffle_house_master_store_v1';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      this.resetToDefaults();
    }
  }

  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : DEFAULT_STORE_DATA;
    } catch (e) {
      return DEFAULT_STORE_DATA;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('waffle_store_updated', { detail: data }));
    } catch (e) {
      console.error('Error saving waffle store data', e);
    }
  }

  resetToDefaults() {
    this.saveData(DEFAULT_STORE_DATA);
    return DEFAULT_STORE_DATA;
  }

  // --- PRODUCTS ---
  getProducts(onlyAvailable = false) {
    const data = this.getData();
    let prods = data.products || [];
    if (onlyAvailable) {
      prods = prods.filter(p => p.available !== false);
    }
    return prods;
  }

  getProductById(id) {
    const prods = this.getProducts();
    return prods.find(p => p.id === id);
  }

  addProduct(newProd) {
    const data = this.getData();
    const id = 'prod-' + Date.now();
    const product = {
      id,
      available: true,
      badge: newProd.badge || 'New',
      tags: newProd.tags || ['Artisanal', 'Handcrafted'],
      ...newProd
    };
    data.products.unshift(product);
    this.saveData(data);
    return product;
  }

  updateProduct(id, updates) {
    const data = this.getData();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.products[idx] = { ...data.products[idx], ...updates };
      this.saveData(data);
      return data.products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    const data = this.getData();
    data.products = data.products.filter(p => p.id !== id);
    this.saveData(data);
  }

  // --- CATEGORIES ---
  getCategories() {
    return this.getData().categories || [];
  }

  addCategory(category) {
    const data = this.getData();
    const id = 'cat-' + Date.now();
    const newCat = { id, active: true, ...category };
    data.categories.push(newCat);
    this.saveData(data);
    return newCat;
  }

  updateCategory(id, updates) {
    const data = this.getData();
    const idx = data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.categories[idx] = { ...data.categories[idx], ...updates };
      this.saveData(data);
      return data.categories[idx];
    }
    return null;
  }

  deleteCategory(id) {
    const data = this.getData();
    data.categories = data.categories.filter(c => c.id !== id);
    this.saveData(data);
  }

  // --- ORDERS ---
  getOrders() {
    return this.getData().orders || [];
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  }

  addOrder(orderData) {
    const data = this.getData();
    const orderId = orderData.id || ('#WH-IND-' + Math.floor(10000 + Math.random() * 90000));
    const newOrder = {
      id: orderId,
      customer: orderData.customer || 'Valued Guest',
      phone: orderData.phone || '+91 98200 WAFFLE',
      email: orderData.email || 'guest@wafflehouse.in',
      address: orderData.address || 'Table / Store Pickup',
      items: orderData.items || [],
      total: orderData.total || 0,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: orderData.paymentMethod || 'UPI Verified',
      paymentStatus: 'Paid',
      status: 'Pending',
      ...orderData
    };

    data.orders.unshift(newOrder);

    // Also update or add customer record
    this.recordCustomerOrder(newOrder, data);

    this.saveData(data);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const data = this.getData();
    const order = data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveData(data);
      return order;
    }
    return null;
  }

  recordCustomerOrder(order, data) {
    const existing = data.customers.find(c => c.email === order.email || c.name === order.customer);
    if (existing) {
      existing.ordersCount = (existing.ordersCount || 1) + 1;
      existing.totalSpent = (existing.totalSpent || 0) + order.total;
    } else {
      data.customers.unshift({
        id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
        name: order.customer,
        email: order.email,
        phone: order.phone,
        city: 'India',
        ordersCount: 1,
        totalSpent: order.total,
        status: 'Active',
        registered: new Date().toISOString().substring(0, 10)
      });
    }
  }

  // --- CUSTOMERS ---
  getCustomers() {
    return this.getData().customers || [];
  }

  // --- OFFERS ---
  getOffers(onlyActive = false) {
    const offers = this.getData().offers || [];
    return onlyActive ? offers.filter(o => o.active) : offers;
  }

  addOffer(offer) {
    const data = this.getData();
    const id = 'OFFER-' + Date.now();
    const newOffer = { id, active: true, ...offer };
    data.offers.unshift(newOffer);
    this.saveData(data);
    return newOffer;
  }

  updateOffer(id, updates) {
    const data = this.getData();
    const idx = data.offers.findIndex(o => o.id === id);
    if (idx !== -1) {
      data.offers[idx] = { ...data.offers[idx], ...updates };
      this.saveData(data);
      return data.offers[idx];
    }
    return null;
  }

  deleteOffer(id) {
    const data = this.getData();
    data.offers = data.offers.filter(o => o.id !== id);
    this.saveData(data);
  }

  // --- LOCATIONS ---
  getLocations(onlyActive = false) {
    const locs = this.getData().locations || [];
    return onlyActive ? locs.filter(l => l.active) : locs;
  }

  addLocation(loc) {
    const data = this.getData();
    const id = 'LOC-' + Date.now();
    const newLoc = { id, active: true, ...loc };
    data.locations.push(newLoc);
    this.saveData(data);
    return newLoc;
  }

  updateLocation(id, updates) {
    const data = this.getData();
    const idx = data.locations.findIndex(l => l.id === id);
    if (idx !== -1) {
      data.locations[idx] = { ...data.locations[idx], ...updates };
      this.saveData(data);
      return data.locations[idx];
    }
    return null;
  }

  deleteLocation(id) {
    const data = this.getData();
    data.locations = data.locations.filter(l => l.id !== id);
    this.saveData(data);
  }

  // --- REVIEWS ---
  getReviews() {
    return this.getData().reviews || [];
  }

  toggleReviewApproval(id) {
    const data = this.getData();
    const rev = data.reviews.find(r => r.id === id);
    if (rev) {
      rev.approved = !rev.approved;
      this.saveData(data);
      return rev;
    }
    return null;
  }

  deleteReview(id) {
    const data = this.getData();
    data.reviews = data.reviews.filter(r => r.id !== id);
    this.saveData(data);
  }

  // --- SETTINGS ---
  getSettings() {
    return this.getData().settings || DEFAULT_STORE_DATA.settings;
  }

  updateSettings(updates) {
    const data = this.getData();
    data.settings = { ...data.settings, ...updates };
    this.saveData(data);
    return data.settings;
  }

  // --- DASHBOARD OVERVIEW METRICS ---
  getDashboardMetrics() {
    const data = this.getData();
    const orders = data.orders || [];
    const products = data.products || [];
    const customers = data.customers || [];

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Confirmed').length;
    
    // Total revenue from all non-cancelled orders
    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const todayDateStr = new Date().toISOString().substring(0, 10);
    const todayOrders = orders.filter(o => o.date && o.date.startsWith(todayDateStr)).length;

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      completedOrders,
      totalCustomers: customers.length,
      totalProducts: products.length,
      revenue: totalRevenue
    };
  }
}

// Global singleton instance
window.WaffleStore = new WaffleStoreManager();
