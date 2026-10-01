/**
 * WAFFLE HOUSE - Artisanal Belgian Liege Boutique (India)
 * Main Application Controller
 * Features:
 * 1. 8-Step Luxury Food Commercial Intro (Batter → Press → Heat → Steam → Reveal → Brand → Enter)
 * 2. Continuous Scroll-Story: Hero → Waffle Grid → Waffle Press → Menu Background Morph
 * 3. Speed-Sensitive Marquee Ticker (Velocity-responsive ticker)
 * 4. Staggered Menu Product Reveal with IntersectionObserver & 3D Glass Hover
 * 5. FLIP Product Card Expansion to Centered Detail Showcase
 * 6. 3-Layer Parallax Depth (Background / Decorative / Product)
 * 7. India Boutique Selection (18 Indian Waffle varieties + Beverages in ₹ INR)
 */

// Comprehensive 18-Product Indian Waffle Boutique Catalog + Beverages in ₹ INR
const WAFFLE_CATALOG = [
  {
    id: 'prod-classic-belgian',
    category: 'classic',
    name: 'Classic Belgian Waffle',
    description: 'Authentic 48-hour fermented brioche waffle infused with crunchy Wallonia pearl sugar and a pat of French salted butter.',
    price: 180,
    image: 'assets/images/classic-waffle.jpg',
    badge: 'Heritage',
    tags: ['48h Brioche', 'Pearl Sugar', 'Eggless Avail.'],
    customPreset: { base: 'classic', sauces: ['pure-maple'], toppings: ['sprinkles'], icecream: 'none' }
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
    customPreset: { base: 'chocolate', sauces: ['dark-chocolate'], toppings: ['oreos'], icecream: 'belgian-choc' }
  },
  {
    id: 'prod-nutella-chocolate',
    category: 'chocolate',
    name: 'Nutella Chocolate Waffle',
    description: 'Heavily smothered in warm, velvety Italian Nutella hazelnut spread, crushed roasted hazelnuts, and powdered sugar snow.',
    price: 280,
    image: 'assets/images/waffle-nutella-biscoff.jpg',
    badge: 'Bestseller',
    tags: ['Authentic Nutella', 'Roasted Hazelnuts', 'Rich & Creamy'],
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
    customPreset: { base: 'classic', sauces: ['pure-maple'], toppings: ['sprinkles'], icecream: 'none' }
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
    customPreset: { base: 'classic', sauces: ['dark-chocolate'], toppings: ['almonds'], icecream: 'vanilla' }
  },
  // Beverages
  {
    id: 'prod-caramel-latte',
    category: 'drinks',
    name: 'Signature Caramel Waffle Latte',
    description: 'Artisanal single-origin Chikmagalur espresso pulled over steamed whole milk and house-made salted waffle caramel.',
    price: 190,
    image: 'assets/images/drink-latte.jpg',
    badge: 'Barista Special',
    tags: ['Chikmagalur Arabica', 'House Caramel', 'Hot / Iced'],
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
    customPreset: null
  }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAmbientParticles();
  initNavbar();
  initMenuGrid();
  initWafflePressScroll();
  initSpeedMarquee();
  initProductCardFlip();
  initParallaxDepth();
  initScrollAnimations();
  initContactForm();
  initNewsletter();
});

/* ----------------------------------------------------
   1. LUXURY 8-STEP FOOD COMMERCIAL INTRO
   Sequence:
   1. Batter pours
   2. Waffle iron closes
   3. Heat/glow increases
   4. Waffle cooks
   5. Steam rises
   6. Waffle reveals
   7. WAFFLE HOUSE logo appears
   8. Enter website
   ---------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const num = document.getElementById('preloader-num');
  const stepPill = document.getElementById('intro-step-pill');
  const statusText = document.getElementById('intro-status-text');
  const tempGauge = document.getElementById('intro-iron-temp');
  const skipBtn = document.getElementById('skip-intro-btn');
  const enterBtn = document.getElementById('intro-enter-btn');

  // Commercial elements
  const batterPour = document.getElementById('intro-batter-pour');
  const ironLid = document.getElementById('intro-iron-lid');
  const ironBase = document.querySelector('.intro-iron-base');
  const topCoil = document.getElementById('intro-top-coil');
  const bottomCoil = document.getElementById('intro-bottom-coil');
  const waffleBake = document.getElementById('intro-waffle-bake');
  const steamGroup = document.getElementById('intro-steam-group');

  if (!preloader) return;

  let currentStep = 1;
  let progress = 0;
  let isExited = false;

  const steps = [
    { num: 1, text: 'Pouring 48-Hour Brioche Batter...', temp: 45, progress: 12 },
    { num: 2, text: 'Closing Cast-Iron Heavy Plates...', temp: 95, progress: 28 },
    { num: 3, text: 'Igniting 180°C Caramelization Heat...', temp: 150, progress: 44 },
    { num: 4, text: 'Caramelizing Belgian Pearl Sugar...', temp: 180, progress: 62 },
    { num: 5, text: 'Releasing Dense Aromatic Steam...', temp: 180, progress: 76 },
    { num: 6, text: 'Revealing Fresh Golden Belgian Waffle...', temp: 180, progress: 88 },
    { num: 7, text: 'WAFFLE HOUSE Artisanal Identity...', temp: 180, progress: 96 },
    { num: 8, text: 'Freshly Baked & Ready • Welcome to Waffle House', temp: 180, progress: 100 }
  ];

  function exitIntro() {
    if (isExited) return;
    isExited = true;
    preloader.classList.add('fade-out');
    document.body.classList.remove('loading-active');
    if (window.waffleAudio) window.waffleAudio.playClick();
  }

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      exitIntro();
    });
  }

  // Enter button click
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      exitIntro();
    });
  }

  // Commercial Sequence Timer Loop
  const stepInterval = setInterval(() => {
    if (isExited) {
      clearInterval(stepInterval);
      return;
    }

    if (currentStep <= steps.length) {
      const s = steps[currentStep - 1];
      if (stepPill) stepPill.textContent = `STEP ${s.num} OF 8`;
      if (statusText) statusText.textContent = s.text;
      if (bar) bar.style.width = `${s.progress}%`;
      if (num) num.textContent = `${s.progress}%`;
      if (tempGauge) tempGauge.textContent = `${s.temp}°C`;

      // Visual trigger state per step
      if (s.num === 1) {
        batterPour?.classList.add('active');
      } else if (s.num === 2) {
        batterPour?.classList.remove('active');
        ironLid?.classList.add('closed');
        ironBase?.classList.add('compressed');
      } else if (s.num === 3) {
        topCoil?.classList.add('glowing');
        bottomCoil?.classList.add('glowing');
        if (window.waffleAudio) window.waffleAudio.playSizzle();
      } else if (s.num === 4) {
        // Sugar pearl crackling
      } else if (s.num === 5) {
        ironLid?.classList.remove('closed');
        ironLid?.classList.add('open');
        steamGroup?.classList.add('active');
      } else if (s.num === 6) {
        waffleBake?.classList.add('revealed');
      } else if (s.num === 7) {
        // Brand focus
      } else if (s.num === 8) {
        if (enterBtn) enterBtn.style.display = 'inline-flex';
        clearInterval(stepInterval);
        // Automatically enter after a short pause if not clicked
        setTimeout(() => {
          if (!isExited) exitIntro();
        }, 1800);
      }

      currentStep++;
    }
  }, 620);
}

/* ----------------------------------------------------
   2. AMBIENT BACKGROUND PARTICLES
   ---------------------------------------------------- */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 34;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2.2,
      alpha: 0.15 + Math.random() * 0.45,
      speedY: -(0.2 + Math.random() * 0.4),
      speedX: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.4 ? '#F59E0B' : '#FAF3E6'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* ----------------------------------------------------
   3. NAVBAR & NAVIGATION SCROLL SPY
   ---------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateScrollSpy();
  }, { passive: true });

  // Mobile navigation drawer toggle
  if (mobileBtn && mobileOverlay) {
    mobileBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      if (window.waffleAudio) window.waffleAudio.playClick();
    });
  }

  if (closeMobileBtn && mobileOverlay) {
    closeMobileBtn.addEventListener('click', () => {
      mobileOverlay.classList.remove('open');
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        mobileOverlay.classList.remove('open');
      }
    });
  }

  // Smooth click & close mobile
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileOverlay?.classList.remove('open');
      if (window.waffleAudio) window.waffleAudio.playClick();
    });
  });

  // Quick filter links in footer
  document.querySelectorAll('[data-filter-link]').forEach((el) => {
    el.addEventListener('click', () => {
      const filter = el.dataset.filterLink;
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
      if (targetBtn) targetBtn.click();
    });
  });
}

function updateScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 180;

  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ----------------------------------------------------
   4. SCROLL STORY: WAFFLE PRESS & GRID MORPH CONTROLLER
   Controls the connected transition:
   Hero → Waffle Press → 180°C Golden Heat → Press Flash → Reveal → Menu Morph
   ---------------------------------------------------- */
function initWafflePressScroll() {
  const track = document.getElementById('press-story');
  if (!track) return;

  const topPlate = document.getElementById('plate-top');
  const bottomPlate = document.getElementById('plate-bottom');
  const topGlow = document.getElementById('plate-top-glow');
  const bottomGlow = document.getElementById('plate-bottom-glow');
  const flashBloom = document.getElementById('press-flash-bloom');
  const waffleReveal = document.getElementById('press-waffle-reveal');
  const steamWisps = document.getElementById('press-steam-wisps');
  const morphGrid = document.getElementById('press-grid-morph');
  const morphCells = document.querySelectorAll('.morph-cell');

  const stepBadge = document.getElementById('press-step-badge');
  const title = document.getElementById('press-title');
  const desc = document.getElementById('press-desc');
  const trackFill = document.getElementById('press-track-fill');
  const pctLabel = document.getElementById('press-pct-label');

  let hasFlashed = false;

  function updatePressStory() {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return;

    // Progress 0.0 to 1.0 through this section
    const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
    const pct = Math.round(progress * 100);

    if (trackFill) trackFill.style.width = `${pct}%`;
    if (pctLabel) pctLabel.textContent = `${pct}%`;

    // 1. Plates Movement
    if (progress <= 0.45) {
      // Closing down
      const closeNorm = progress / 0.45;
      const topY = -90 + (closeNorm * 90); // -90px to 0px
      const topRot = 24 - (closeNorm * 24); // 24deg to 0deg
      const botY = 35 - (closeNorm * 35); // 35px to 0px
      const botRot = -8 + (closeNorm * 8);

      if (topPlate) topPlate.style.transform = `translateY(${topY}px) rotateX(${topRot}deg)`;
      if (bottomPlate) bottomPlate.style.transform = `translateY(${botY}px) rotateX(${botRot}deg)`;

      // Heat glow intensifies
      const glowOpacity = Math.max(0, (progress - 0.2) / 0.25);
      if (topGlow) topGlow.style.opacity = glowOpacity;
      if (bottomGlow) bottomGlow.style.opacity = glowOpacity;

      if (waffleReveal) waffleReveal.classList.remove('active');
      if (steamWisps) steamWisps.classList.remove('active');

      if (stepBadge) stepBadge.textContent = 'STEP 1 • ALIGNMENT';
      if (title) title.textContent = 'Cast-Iron Plates Descending';
      if (desc) desc.textContent = 'The 180°C heavy grooved griddles converge toward the authentic Liege brioche dough.';
      hasFlashed = false;
    } else if (progress > 0.45 && progress <= 0.65) {
      // PRESSED!
      if (topPlate) topPlate.style.transform = `translateY(0px) rotateX(0deg)`;
      if (bottomPlate) bottomPlate.style.transform = `translateY(0px) rotateX(0deg)`;
      if (topGlow) topGlow.style.opacity = 1;
      if (bottomGlow) bottomGlow.style.opacity = 1;

      // Burst flash
      if (!hasFlashed && flashBloom) {
        hasFlashed = true;
        flashBloom.style.opacity = 0.85;
        setTimeout(() => { if (flashBloom) flashBloom.style.opacity = 0; }, 250);
        if (window.waffleAudio) window.waffleAudio.playSizzle();
      }

      if (stepBadge) stepBadge.textContent = 'STEP 2 • CARAMELIZE';
      if (title) title.textContent = 'High Pressure & 180°C Sizzle';
      if (desc) desc.textContent = 'Wallonia pearl sugar crystals melt and coat every deep pocket in crisp golden caramel.';
    } else if (progress > 0.65 && progress <= 0.85) {
      // OPEN & REVEAL WAFFLE
      const openNorm = (progress - 0.65) / 0.2;
      const topY = -(openNorm * 90);
      const topRot = (openNorm * 28);
      const botY = (openNorm * 35);

      if (topPlate) topPlate.style.transform = `translateY(${topY}px) rotateX(${topRot}deg)`;
      if (bottomPlate) bottomPlate.style.transform = `translateY(${botY}px) rotateX(0deg)`;

      if (waffleReveal) waffleReveal.classList.add('active');
      if (steamWisps) steamWisps.classList.add('active');

      if (stepBadge) stepBadge.textContent = 'STEP 3 • WAFFLE REVEAL';
      if (title) title.textContent = 'Crispy Outside. Soft Inside.';
      if (desc) desc.textContent = 'A pristine golden Belgian Liege waffle emerges with deep pockets and rising aroma.';
    } else {
      // 0.85 - 1.0: MORPH INTO MENU BACKGROUND
      const morphNorm = (progress - 0.85) / 0.15;
      if (morphGrid) morphGrid.style.opacity = 0.2 + (morphNorm * 0.45);
      
      morphCells.forEach((c, idx) => {
        const spread = (idx % 2 === 0 ? 1 : -1) * (morphNorm * 25);
        c.style.transform = `translateY(${spread}px) scale(${1 + morphNorm * 0.08})`;
        c.style.borderColor = `rgba(245, 158, 11, ${0.25 + morphNorm * 0.35})`;
      });

      if (stepBadge) stepBadge.textContent = 'STEP 4 • MENU MORPH';
      if (title) title.textContent = 'Grid Expands into the Boutique Menu';
      if (desc) desc.textContent = 'The caramelized waffle griddle architecture seamlessly unfolds into our handcrafted creations.';
    }
  }

  window.addEventListener('scroll', updatePressStory, { passive: true });
  updatePressStory();
}

/* ----------------------------------------------------
   5. SPEED-SENSITIVE MARQUEE TICKER
   Responds smoothly to scroll velocity
   ---------------------------------------------------- */
function initSpeedMarquee() {
  const marquee = document.getElementById('scroll-speed-marquee');
  const track = document.getElementById('marquee-track');
  if (!marquee || !track) return;

  let currentTranslate = 0;
  let baseSpeed = 1.1; // px per frame
  let targetSpeed = 1.1;
  let currentSpeed = 1.1;
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dt = Math.max(now - lastTime, 16);
    const dY = Math.abs(window.scrollY - lastScrollY);
    const scrollVelocity = (dY / dt) * 16; // scaled velocity

    targetSpeed = Math.min(baseSpeed + scrollVelocity * 0.45, 5.0);
    lastScrollY = window.scrollY;
    lastTime = now;
  }, { passive: true });

  function marqueeLoop() {
    // Smooth lerp speed back to baseSpeed
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    targetSpeed += (baseSpeed - targetSpeed) * 0.04;

    currentTranslate -= currentSpeed;
    const halfWidth = track.scrollWidth / 2;

    if (Math.abs(currentTranslate) >= halfWidth) {
      currentTranslate = 0;
    }

    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(marqueeLoop);
  }

  marqueeLoop();
}

/* ----------------------------------------------------
   6. MENU CATALOG & STAGGERED REVEALS
   ---------------------------------------------------- */
function getStoreProducts(onlyAvailable = true) {
  if (window.WaffleStore) {
    return window.WaffleStore.getProducts(onlyAvailable);
  }
  return WAFFLE_CATALOG;
}

function initMenuGrid() {
  const grid = document.getElementById('menu-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!grid) return;

  let currentCategory = 'all';

  function renderProducts(category = currentCategory) {
    currentCategory = category;
    const allProducts = getStoreProducts(true);
    const filtered = category === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === category);

    grid.innerHTML = filtered.map((item, index) => `
      <div class="product-card" data-product-id="${item.id}" data-category="${item.category}" style="transition-delay: ${(index % 6) * 75}ms;">
        <div class="product-image-wrap">
          <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy" onerror="this.src='assets/images/classic-waffle.jpg'" />
          ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
        </div>
        <div class="product-content">
          <div class="product-tags">
            ${(item.tags || []).map((t) => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
          <h3 class="product-title">${item.name}</h3>
          <p class="product-desc">${item.description}</p>
          <div class="product-footer">
            <span class="product-price">₹${item.price}</span>
            <div class="product-actions">
              ${item.customPreset ? `
                <button class="btn-customize-link" onclick="event.stopPropagation(); customizeFromMenu('${item.id}')" title="Customize this waffle in builder">
                  <i class="fa-solid fa-sliders"></i>
                </button>
              ` : ''}
              <button class="btn-add-cart" onclick="event.stopPropagation(); addCatalogItemToCart('${item.id}', this)">
                <i class="fa-solid fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listener for FLIP transformation
    grid.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.productId;
        openProductFlip(id, card);
      });
    });

    // Staggered reveal observer
    observeProductCards();
  }

  function observeProductCards() {
    const cards = grid.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    cards.forEach((card) => observer.observe(card));
  }

  // Filter tabs
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      renderProducts(cat);
      if (window.waffleAudio) window.waffleAudio.playClick();
    });
  });

  // Listen for admin changes in real time
  window.addEventListener('waffle_store_updated', () => {
    renderProducts(currentCategory);
  });

  // Initial render
  renderProducts('all');
}

/* ----------------------------------------------------
   7. PRODUCT CARD → DETAIL FLIP TRANSFORMATION
   Expands selected card into a centered showcase modal
   ---------------------------------------------------- */
function initProductCardFlip() {
  const backdrop = document.getElementById('product-flip-backdrop');
  const flipCard = document.getElementById('product-flip-card');
  const closeBtn = document.getElementById('flip-close-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeProductFlip);
  if (backdrop) backdrop.addEventListener('click', closeProductFlip);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && flipCard?.classList.contains('open')) {
      closeProductFlip();
    }
  });
}

function openProductFlip(productId, sourceCard) {
  const item = (window.WaffleStore && window.WaffleStore.getProductById(productId)) || WAFFLE_CATALOG.find((p) => p.id === productId);
  const backdrop = document.getElementById('product-flip-backdrop');
  const flipCard = document.getElementById('product-flip-card');
  const contentBody = document.getElementById('flip-content-body');

  if (!item || !flipCard || !contentBody) return;

  contentBody.innerHTML = `
    <div class="flip-detail-layout">
      <div class="flip-img-wrap">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/classic-waffle.jpg'" />
      </div>
      <div class="flip-info-wrap">
        <div class="product-tags">
          ${(item.tags || []).map((t) => `<span class="tag-pill">${t}</span>`).join('')}
        </div>
        <h2 class="flip-title">${item.name}</h2>
        <p class="flip-desc">${item.description}</p>
        <div class="flip-price-row">
          <div>
            <span style="font-size: 0.75rem; color: var(--cream-dim); text-transform: uppercase; display: block;">Artisanal Price</span>
            <span class="flip-price">₹${item.price}</span>
          </div>
          <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--gold-light); border: 1px solid var(--gold-primary); padding: 4px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 700;">100% Eggless Option</span>
        </div>
        <div class="flip-actions">
          <button class="btn btn-primary btn-lg" onclick="addCatalogItemToCart('${item.id}', this); closeProductFlip();">
            <i class="fa-solid fa-cart-plus"></i> Add to Order • ₹${item.price}
          </button>
          ${item.customPreset ? `
            <button class="btn btn-secondary btn-lg" onclick="customizeFromMenu('${item.id}'); closeProductFlip();">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Customize
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  backdrop?.classList.add('open');
  flipCard?.classList.add('open');
  document.body.classList.add('drawer-open');
  if (window.waffleAudio) window.waffleAudio.playClick();
}

function closeProductFlip() {
  const backdrop = document.getElementById('product-flip-backdrop');
  const flipCard = document.getElementById('product-flip-card');

  backdrop?.classList.remove('open');
  flipCard?.classList.remove('open');
  document.body.classList.remove('drawer-open');
}

/* ----------------------------------------------------
   8. 3-LAYER PARALLAX DEPTH CONTROLLER
   ---------------------------------------------------- */
function initParallaxDepth() {
  const slowItems = document.querySelectorAll('[data-parallax="slow"]');
  const medItems = document.querySelectorAll('[data-parallax="medium"]');
  const fastItems = document.querySelectorAll('[data-parallax="fast"]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    slowItems.forEach((el) => {
      el.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.08}px))`;
    });

    medItems.forEach((el) => {
      el.style.transform = `translateY(${scrollY * 0.14}px)`;
    });

    fastItems.forEach((el) => {
      el.style.transform = `translateY(${scrollY * 0.2}px)`;
    });
  }, { passive: true });
}

/* ----------------------------------------------------
   9. ADD CATALOG ITEM TO CART WITH FLYING ANIMATION
   ---------------------------------------------------- */
window.addCatalogItemToCart = function(productId, triggerBtn) {
  const item = (window.WaffleStore && window.WaffleStore.getProductById(productId)) || WAFFLE_CATALOG.find((p) => p.id === productId);
  if (!item) return;

  if (window.waffleCart) {
    window.waffleCart.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      isCustom: false
    });
  }

  // Trigger Flying Waffle Animation
  if (triggerBtn) {
    flyWaffleToCart(triggerBtn, item.image);
  }
};

// Flying Waffle to Cart Animation with Golden Particle Trail
window.flyWaffleToCart = function(sourceElement, imageSrc = 'assets/images/waffle-stage-clean.jpg') {
  const cartIcon = document.getElementById('cart-toggle-btn') || document.querySelector('.cart-btn');
  if (!cartIcon || !sourceElement) return;

  const srcRect = sourceElement.getBoundingClientRect();
  const destRect = cartIcon.getBoundingClientRect();

  const flyEl = document.createElement('img');
  flyEl.src = imageSrc;
  flyEl.className = 'flying-waffle-clone';
  flyEl.style.left = `${srcRect.left + srcRect.width / 2 - 35}px`;
  flyEl.style.top = `${srcRect.top + srcRect.height / 2 - 35}px`;
  document.body.appendChild(flyEl);

  // Sparkle trail interval
  const trailInterval = setInterval(() => {
    const currentRect = flyEl.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    sparkle.style.left = `${currentRect.left + 20 + (Math.random() - 0.5) * 15}px`;
    sparkle.style.top = `${currentRect.top + 20 + (Math.random() - 0.5) * 15}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }, 45);

  requestAnimationFrame(() => {
    flyEl.style.left = `${destRect.left + destRect.width / 2 - 15}px`;
    flyEl.style.top = `${destRect.top + destRect.height / 2 - 15}px`;
    flyEl.style.transform = 'scale(0.18) rotate(360deg)';
    flyEl.style.opacity = '0.3';
  });

  setTimeout(() => {
    clearInterval(trailInterval);
    flyEl.remove();

    // Cart bounce
    cartIcon.classList.remove('bounce');
    void cartIcon.offsetWidth;
    cartIcon.classList.add('bounce');
    if (window.waffleAudio) window.waffleAudio.playAddToCart();
  }, 750);
};

// Deep link from menu into Waffle Builder with preset configuration
window.customizeFromMenu = function(productId) {
  const item = WAFFLE_CATALOG.find((p) => p.id === productId);
  if (!item || !item.customPreset || !window.waffleBuilder) return;

  const builder = window.waffleBuilder;
  const p = item.customPreset;

  const targetBase = builder.bases.find((b) => b.id === p.base);
  if (targetBase) builder.selectedBase = targetBase;

  if (p.sauces) {
    builder.selectedSauces = builder.sauces.filter((s) => p.sauces.includes(s.id));
  }
  if (p.toppings) {
    builder.selectedToppings = builder.toppings.filter((t) => p.toppings.includes(t.id));
  }
  if (p.icecream) {
    builder.selectedIceCream = builder.iceCreams.find((i) => i.id === p.icecream) || builder.iceCreams[0];
  }

  const nameInput = document.getElementById('custom-waffle-name');
  if (nameInput) nameInput.value = item.name + ' (Customized)';

  builder.renderBaseOptions();
  builder.renderSauceOptions();
  builder.renderToppingOptions();
  builder.renderIceCreamOptions();
  builder.updatePreview();

  // Smooth scroll to builder
  document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' });
  if (window.showToast) {
    window.showToast('Customizer Loaded', `Loaded recipe for ${item.name}. Craft your spin!`, 'info');
  }
};

/* ----------------------------------------------------
   10. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ---------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------
   11. INTERACTIVE CONTACT FORM
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    if (!name) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting inquiry...';
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Send Message';
      }

      if (window.waffleAudio) window.waffleAudio.playAddToCart();
      if (window.showToast) {
        window.showToast(
          'Message Received!',
          `Thank you, ${name}! Our Mumbai concierge will respond within 24 hours.`,
          'success'
        );
      }
    }, 850);
  });
}

/* ----------------------------------------------------
   12. NEWSLETTER SUBSCRIPTION
   ---------------------------------------------------- */
function initNewsletter() {
  const btn = document.getElementById('newsletter-btn');
  const input = document.getElementById('newsletter-email');

  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      if (window.showToast) window.showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    input.value = '';
    if (window.waffleAudio) window.waffleAudio.playAddToCart();
    if (window.showToast) {
      window.showToast(
        'Welcome to WAFFLE HOUSE India!',
        'Your 15% inaugural voucher has been dispatched to your email.',
        'success'
      );
    }
  });
}

/* ----------------------------------------------------
   13. GLOBAL TOAST NOTIFICATION SYSTEM
   ---------------------------------------------------- */
window.showToast = function(title, text, type = 'info', actionCallback = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconHtml = '<i class="fa-solid fa-bell"></i>';
  if (type === 'success') iconHtml = '<i class="fa-solid fa-check"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';

  let actionHtml = '';
  if (actionCallback) {
    actionHtml = `<button class="toast-action-btn">View Cart</button>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconHtml}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-text">${text}</div>
    </div>
    ${actionHtml}
  `;

  if (actionCallback) {
    toast.querySelector('.toast-action-btn')?.addEventListener('click', () => {
      actionCallback();
      toast.remove();
    });
  }

  container.appendChild(toast);

  // Trigger reveal animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 4.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
};
