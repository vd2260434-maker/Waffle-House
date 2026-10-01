/**
 * WAFFLE HOUSE - Interactive Waffle Builder (India)
 * Dynamic interactive preview with realistic topping animations:
 * - Viscous chocolate/honey drizzle streams
 * - Flying fresh strawberry slices settling onto the waffle
 * - Sliding banana rounds
 * - Dropping wild blueberries with bounce
 * - Naturally scattering roasted almonds & hazelnuts
 * - Scaling Madagascar gelato scoop
 * - Live price calculations in ₹ INR and flying cart animation
 */

class WaffleBuilder {
  constructor() {
    this.bases = [
      { id: 'classic', name: 'Belgian Golden Brioche', price: 180, icon: '🧇', class: '' },
      { id: 'chocolate', name: 'Dark Dutch Cocoa', price: 200, icon: '🍫', class: 'base-chocolate' },
      { id: 'redvelvet', name: 'Ruby Red Velvet', price: 210, icon: '❤️', class: 'base-redvelvet' },
      { id: 'matcha', name: 'Kyoto Ceremonial Matcha', price: 220, icon: '🍵', class: 'base-matcha' }
    ];

    this.sauces = [
      { id: 'dark-chocolate', name: 'Belgian Dark Ganache', price: 35, icon: '🍫', color: '#3A190C', highlight: '#5A2A14' },
      { id: 'salted-caramel', name: 'Warm Salted Caramel', price: 35, icon: '🍯', color: '#D97706', highlight: '#FBBF24' },
      { id: 'pure-honey', name: 'Himalayan Raw Honey', price: 35, icon: '🍯', color: '#B45309', highlight: '#F59E0B' },
      { id: 'white-chocolate', name: 'White Chocolate Ganache', price: 35, icon: '🥛', color: '#FAF5EE', highlight: '#FFFFFF' },
      { id: 'berry-coulis', name: 'Wild Strawberry Coulis', price: 35, icon: '🍓', color: '#BE123C', highlight: '#FB7185' },
      { id: 'nutella', name: 'Warm Nutella Melt', price: 45, icon: '🌰', color: '#4E2614', highlight: '#6B3920' }
    ];

    this.toppings = [
      { id: 'strawberries', name: 'Fresh Strawberries', price: 40, icon: '🍓', symbol: '🍓', animClass: 'topping-drop-strawberry', positions: [{top: '22%', left: '26%'}, {top: '64%', left: '60%'}, {top: '28%', left: '66%'}] },
      { id: 'bananas', name: 'Banana Slices', price: 30, icon: '🍌', symbol: '🍌', animClass: 'topping-drop-banana', positions: [{top: '32%', left: '48%'}, {top: '58%', left: '26%'}] },
      { id: 'blueberries', name: 'Wild Blueberries', price: 45, icon: '🫐', symbol: '🫐', animClass: 'topping-drop-blueberry', positions: [{top: '20%', left: '50%'}, {top: '46%', left: '22%'}, {top: '70%', left: '48%'}] },
      { id: 'almonds', name: 'Roasted Almonds & Hazelnuts', price: 40, icon: '🌰', symbol: '🌰', animClass: 'topping-drop-nut', positions: [{top: '42%', left: '22%'}, {top: '74%', left: '44%'}, {top: '18%', left: '42%'}] },
      { id: 'oreos', name: 'Crushed Oreo Crumbs', price: 35, icon: '🍪', symbol: '🍪', animClass: 'topping-drop-nut', positions: [{top: '36%', left: '72%'}, {top: '56%', left: '68%'}, {top: '68%', left: '24%'}] },
      { id: 'marshmallows', name: 'Fluffy Marshmallows', price: 35, icon: '🍥', symbol: '🍥', animClass: 'topping-drop-strawberry', positions: [{top: '38%', left: '32%'}, {top: '52%', left: '64%'}] },
      { id: 'sprinkles', name: 'Golden Sugar Flakes', price: 25, icon: '✨', symbol: '✨', animClass: 'topping-drop-nut', positions: [{top: '24%', left: '36%'}, {top: '66%', left: '36%'}, {top: '44%', left: '76%'}] },
      { id: 'whipped-cream', name: 'Chantilly Cream Cloud', price: 35, icon: '☁️', symbol: '☁️', animClass: 'topping-drop-banana', positions: [{top: '48%', left: '46%'}] }
    ];

    this.iceCreams = [
      { id: 'none', name: 'No Gelato', price: 0, icon: '🚫', color: 'transparent' },
      { id: 'vanilla', name: 'Madagascar Vanilla Bean', price: 60, icon: '🍨', color: '#FFFBEB', textColor: '#78350F' },
      { id: 'belgian-choc', name: 'Belgian Dark Chocolate', price: 60, icon: '🍫', color: '#35190C', textColor: '#FFFBEB' },
      { id: 'salted-caramel', name: 'Salted Butter Caramel', price: 60, icon: '🍮', color: '#D97706', textColor: '#FFFBEB' },
      { id: 'matcha', name: 'Ceremonial Uji Matcha', price: 65, icon: '🍵', color: '#4D7C0F', textColor: '#FFFBEB' },
      { id: 'strawberry', name: 'Wild Strawberry Swirl', price: 60, icon: '🍧', color: '#FB7185', textColor: '#881337' }
    ];

    // Current Active State
    this.selectedBase = this.bases[0];
    this.selectedSauces = [this.sauces[0]]; // Dark chocolate default
    this.selectedToppings = [this.toppings[0]]; // Strawberries default
    this.selectedIceCream = this.iceCreams[1]; // Vanilla default

    this.initControls();
    this.updatePreview();
  }

  initControls() {
    this.renderBaseOptions();
    this.renderSauceOptions();
    this.renderToppingOptions();
    this.renderIceCreamOptions();

    // Reset button
    const resetBtn = document.getElementById('builder-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.selectedBase = this.bases[0];
        this.selectedSauces = [];
        this.selectedToppings = [];
        this.selectedIceCream = this.iceCreams[0];
        this.initControls();
        this.updatePreview();
        if (window.waffleAudio) window.waffleAudio.playClick();
        if (window.showToast) window.showToast('Waffle Reset', 'Ready for your artisanal spin!', 'info');
      });
    }

    // Surprise Me Randomizer
    const surpriseBtn = document.getElementById('builder-surprise-btn');
    if (surpriseBtn) {
      surpriseBtn.addEventListener('click', () => {
        this.randomize();
        if (window.waffleAudio) window.waffleAudio.playSizzle();
        if (window.showToast) window.showToast('Chef’s Indian Surprise!', 'Paired an eclectic gourmet selection.', 'success');
      });
    }

    // Add Custom Waffle to Cart button
    const addBtn = document.getElementById('add-custom-waffle-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addToCart(addBtn));
    }
  }

  randomize() {
    this.selectedBase = this.bases[Math.floor(Math.random() * this.bases.length)];
    
    // Pick 1-2 sauces
    const shuffledSauces = [...this.sauces].sort(() => 0.5 - Math.random());
    this.selectedSauces = shuffledSauces.slice(0, 1 + Math.floor(Math.random() * 2));

    // Pick 1-3 toppings
    const shuffledToppings = [...this.toppings].sort(() => 0.5 - Math.random());
    this.selectedToppings = shuffledToppings.slice(0, 1 + Math.floor(Math.random() * 3));

    // Pick 1 ice cream
    const availableIceCreams = this.iceCreams.filter(i => i.id !== 'none');
    this.selectedIceCream = availableIceCreams[Math.floor(Math.random() * availableIceCreams.length)];

    // Indian boutique gourmet names
    const prefixes = ['The Bandra Velvet', 'Indiranagar Royal', 'Midnight Cocoa', 'Mahabaleshwar Bliss', 'The Mumbai Pearl', 'Connaught Imperial'];
    const randomName = prefixes[Math.floor(Math.random() * prefixes.length)] + ' Waffle';
    const nameInput = document.getElementById('custom-waffle-name');
    if (nameInput) nameInput.value = randomName;

    this.renderBaseOptions();
    this.renderSauceOptions();
    this.renderToppingOptions();
    this.renderIceCreamOptions();
    this.updatePreview();
  }

  renderBaseOptions() {
    const container = document.getElementById('base-options-grid');
    if (!container) return;

    container.innerHTML = this.bases.map((base) => {
      const isSelected = this.selectedBase.id === base.id;
      return `
        <div class="builder-card-option ${isSelected ? 'selected' : ''}" data-base-id="${base.id}">
          <div class="option-check"><i class="fa-solid fa-check"></i></div>
          <span class="option-icon">${base.icon}</span>
          <span class="option-title">${base.name}</span>
          <span class="option-price-tag">₹${base.price}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.builder-card-option').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.baseId;
        this.selectedBase = this.bases.find((b) => b.id === id);
        this.renderBaseOptions();
        this.updatePreview();
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });
  }

  renderSauceOptions() {
    const container = document.getElementById('sauce-options-grid');
    if (!container) return;

    container.innerHTML = this.sauces.map((sauce) => {
      const isSelected = this.selectedSauces.some((s) => s.id === sauce.id);
      return `
        <div class="builder-card-option ${isSelected ? 'selected' : ''}" data-sauce-id="${sauce.id}">
          <div class="option-check"><i class="fa-solid fa-check"></i></div>
          <span class="option-icon">${sauce.icon}</span>
          <span class="option-title">${sauce.name}</span>
          <span class="option-price-tag">+₹${sauce.price}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.builder-card-option').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.sauceId;
        const index = this.selectedSauces.findIndex((s) => s.id === id);
        if (index > -1) {
          this.selectedSauces.splice(index, 1);
        } else {
          if (this.selectedSauces.length >= 2) {
            this.selectedSauces.shift(); // keep max 2 sauces
          }
          this.selectedSauces.push(this.sauces.find((s) => s.id === id));
        }
        this.renderSauceOptions();
        this.updatePreview();
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });
  }

  renderToppingOptions() {
    const container = document.getElementById('topping-options-grid');
    if (!container) return;

    container.innerHTML = this.toppings.map((top) => {
      const isSelected = this.selectedToppings.some((t) => t.id === top.id);
      return `
        <div class="builder-card-option ${isSelected ? 'selected' : ''}" data-topping-id="${top.id}">
          <div class="option-check"><i class="fa-solid fa-check"></i></div>
          <span class="option-icon">${top.icon}</span>
          <span class="option-title">${top.name}</span>
          <span class="option-price-tag">+₹${top.price}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.builder-card-option').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.toppingId;
        const index = this.selectedToppings.findIndex((t) => t.id === id);
        if (index > -1) {
          this.selectedToppings.splice(index, 1);
        } else {
          this.selectedToppings.push(this.toppings.find((t) => t.id === id));
        }
        this.renderToppingOptions();
        this.updatePreview();
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });
  }

  renderIceCreamOptions() {
    const container = document.getElementById('icecream-options-grid');
    if (!container) return;

    container.innerHTML = this.iceCreams.map((ice) => {
      const isSelected = this.selectedIceCream.id === ice.id;
      return `
        <div class="builder-card-option ${isSelected ? 'selected' : ''}" data-ice-id="${ice.id}">
          <div class="option-check"><i class="fa-solid fa-check"></i></div>
          <span class="option-icon">${ice.icon}</span>
          <span class="option-title">${ice.name}</span>
          <span class="option-price-tag">${ice.price > 0 ? '+₹' + ice.price : 'Free'}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.builder-card-option').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.iceId;
        this.selectedIceCream = this.iceCreams.find((i) => i.id === id);
        this.renderIceCreamOptions();
        this.updatePreview();
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });
  }

  calculatePrice() {
    let total = this.selectedBase.price;
    total += this.selectedSauces.reduce((sum, s) => sum + s.price, 0);
    total += this.selectedToppings.reduce((sum, t) => sum + t.price, 0);
    total += this.selectedIceCream.price;
    return total;
  }

  updatePreview() {
    // 1. Update Waffle Base Element class
    const waffleEl = document.getElementById('interactive-waffle');
    if (waffleEl) {
      waffleEl.className = 'interactive-waffle ' + (this.selectedBase.class || '');
    }

    // 2. Update Sauce Streams with Realistic Liquid Drizzle
    const sauceLayer = document.getElementById('interactive-sauce-layer');
    if (sauceLayer) {
      sauceLayer.innerHTML = '';
      this.selectedSauces.forEach((sauce, idx) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.setAttribute('class', 'sauce-stream');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';

        const pathData = idx === 0
          ? 'M15,40 Q60,95 100,50 T185,85 Q130,140 90,110 T20,165'
          : 'M40,15 Q95,70 50,115 T85,185 Q140,130 110,80 T165,20';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', sauce.color);
        path.setAttribute('stroke-width', '18');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))');

        const highlightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlightPath.setAttribute('d', pathData);
        highlightPath.setAttribute('fill', 'none');
        highlightPath.setAttribute('stroke', sauce.highlight);
        highlightPath.setAttribute('stroke-width', '4');
        highlightPath.setAttribute('stroke-linecap', 'round');
        highlightPath.setAttribute('opacity', '0.7');

        svg.appendChild(path);
        svg.appendChild(highlightPath);
        sauceLayer.appendChild(svg);
      });
    }

    // 3. Update Ice Cream Scoop with Scale Drop
    const iceLayer = document.getElementById('interactive-icecream-layer');
    if (iceLayer) {
      if (this.selectedIceCream && this.selectedIceCream.id !== 'none') {
        iceLayer.style.display = 'flex';
        iceLayer.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0%, ${this.selectedIceCream.color} 50%, rgba(0,0,0,0.2) 100%)`;
        iceLayer.innerHTML = `
          <div style="font-size: 2.2rem; transform: rotate(-5deg); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">${this.selectedIceCream.icon}</div>
        `;
      } else {
        iceLayer.style.display = 'none';
      }
    }

    // 4. Update Toppings with Realistic Dynamic Entrance Animations
    const toppingLayer = document.getElementById('interactive-toppings-layer');
    if (toppingLayer) {
      toppingLayer.innerHTML = '';
      this.selectedToppings.forEach((top) => {
        top.positions.forEach((pos) => {
          const drop = document.createElement('div');
          drop.className = `topping-drop ${top.animClass || ''}`;
          drop.style.top = pos.top;
          drop.style.left = pos.left;
          drop.textContent = top.symbol;
          toppingLayer.appendChild(drop);
        });
      });
    }

    // 5. Update Live Price in ₹ INR
    const priceEl = document.getElementById('builder-live-price');
    if (priceEl) {
      priceEl.textContent = `₹${this.calculatePrice()}`;
    }
  }

  addToCart(sourceBtn) {
    const nameInput = document.getElementById('custom-waffle-name');
    const notesInput = document.getElementById('custom-kitchen-notes');
    const customName = nameInput ? nameInput.value.trim() : 'Artisanal Custom Waffle';
    const notes = notesInput ? notesInput.value.trim() : '';

    const price = this.calculatePrice();

    const customItem = {
      id: 'custom-' + Date.now(),
      name: customName || 'Artisanal Custom Waffle',
      price: price,
      image: 'assets/images/waffle-stage-clean.jpg',
      isCustom: true,
      customDetails: {
        base: this.selectedBase.name,
        sauces: this.selectedSauces.map((s) => s.name),
        toppings: this.selectedToppings.map((t) => t.name),
        icecream: this.selectedIceCream.id !== 'none' ? this.selectedIceCream.name : null,
        notes: notes
      }
    };

    if (window.waffleCart) {
      window.waffleCart.addItem(customItem);
    }

    // Trigger Flying Waffle to Cart Animation
    if (sourceBtn && window.flyWaffleToCart) {
      window.flyWaffleToCart(sourceBtn, 'assets/images/waffle-stage-clean.jpg');
    }
  }
}

window.waffleBuilder = new WaffleBuilder();
