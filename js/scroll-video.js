/**
 * WAFFLE HOUSE - Scroll-Driven Cinematic Experience Engine
 * 
 * Replaces automatic video playback with a 100% user-scroll-controlled,
 * buttery-smooth, fully reversible 5-stage cinematic animation.
 * 
 * 5 SCROLL STAGES:
 * STAGE 1 (0% to 20%):   Several waffle pieces floating separately in 3D air.
 *                        As user scrolls down, pieces slowly move toward the center.
 * STAGE 2 (20% to 40%):  Pieces gradually connect together with realistic rotation,
 *                        depth and smooth cubic easing, snapping into alignment with a golden flash.
 * STAGE 3 (40% to 60%):  Waffle becomes completely assembled. Camera slowly zooms toward the waffle.
 * STAGE 4 (60% to 80%):  Melted 72% Belgian chocolate pours from above, spreading over the waffle
 *                        in a smooth, viscous liquid animation with ripples and edge drips.
 * STAGE 5 (80% to 100%): Chocolate finishes covering the waffle, steam rises from the hot crust,
 *                        strawberries, berries & toppings drop into place, the final waffle
 *                        becomes centered and the "ORDER NOW" button appears.
 */

class WaffleCinematicHero {
  constructor() {
    // 1. Core DOM References
    this.track = document.getElementById('home');
    this.stickyFrame = document.getElementById('hero-sticky-frame');
    this.chamber = document.getElementById('waffle-assembly-chamber');
    
    // Stage 1 & 2 Quarters
    this.pieceTL = document.getElementById('piece-tl');
    this.pieceTR = document.getElementById('piece-tr');
    this.pieceBL = document.getElementById('piece-bl');
    this.pieceBR = document.getElementById('piece-br');
    this.snapFlash = document.getElementById('assembly-snap-flash');
    
    // Stage 3 Base
    this.assembledBase = document.getElementById('waffle-assembled-base');
    this.pocketShimmer = document.getElementById('waffle-pocket-shimmer');
    
    // Stage 4 Chocolate
    this.chocLayer = document.getElementById('waffle-chocolate-layer');
    this.pourRig = document.getElementById('chocolate-pour-rig');
    this.pourColumn = document.getElementById('pour-stream-column');
    this.chocCanvas = document.getElementById('chocolate-liquid-canvas');
    this.chocCtx = this.chocCanvas ? this.chocCanvas.getContext('2d') : null;
    
    // Stage 5 Masterpiece, Steam & Toppings
    this.masterpieceLayer = document.getElementById('waffle-masterpiece-layer');
    this.steamCanvas = document.getElementById('stage-steam-canvas');
    this.steamCtx = this.steamCanvas ? this.steamCanvas.getContext('2d') : null;
    this.toppingRig = document.getElementById('topping-elements-rig');
    this.fs1 = document.getElementById('fs-1');
    this.fs2 = document.getElementById('fs-2');
    this.fcc1 = document.getElementById('fcc-1');
    this.fr1 = document.getElementById('fr-1');
    this.sugarSnow = document.getElementById('sugar-snow-fall');
    
    // HUD & UI Elements
    this.stageCards = document.querySelectorAll('.cinematic-stage-card');
    this.stageDots = document.querySelectorAll('.stage-dot');
    this.progressFill = document.getElementById('hud-progress-fill');
    this.progressPct = document.getElementById('hud-progress-pct');
    this.stageTitle = document.getElementById('hud-stage-title');
    this.bottomPrompt = document.getElementById('sticky-scroll-prompt');

    this.stageNames = [
      'Stage 1: Floating Pieces',
      'Stage 2: Convergence',
      'Stage 3: Crispy Assembly',
      'Stage 4: Chocolate Cascade',
      'Stage 5: Masterpiece Complete'
    ];

    // Scroll Interpolation State
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.activeStageIndex = 1;
    this.hasSnapped = false;
    
    // Interactive mouse tilt
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;

    // Steam particle pool for Stage 5
    this.steamParticles = [];
    this.initSteamParticles();

    // Liquid ripple wave timing
    this.clock = 0;
    this.lastTime = performance.now();
    this.rafId = null;

    if (!this.track || !this.chamber) return;

    this.initCanvases();
    this.bindEvents();
    this.startLoop();
  }

  /* ----------------------------------------------------
     Canvas Sizing & Initialization
     ---------------------------------------------------- */
  initCanvases() {
    const resizeCanvases = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      if (this.chocCanvas && this.chocCtx) {
        const rect = this.chocCanvas.getBoundingClientRect();
        this.chocCanvas.width = (rect.width || 500) * dpr;
        this.chocCanvas.height = (rect.height || 500) * dpr;
        this.chocCtx.scale(dpr, dpr);
      }

      if (this.steamCanvas && this.steamCtx) {
        const rect = this.steamCanvas.getBoundingClientRect();
        this.steamCanvas.width = (rect.width || 600) * dpr;
        this.steamCanvas.height = (rect.height || 600) * dpr;
        this.steamCtx.scale(dpr, dpr);
      }
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
  }

  /* ----------------------------------------------------
     Steam Particle Pool (Stage 5)
     ---------------------------------------------------- */
  initSteamParticles() {
    const count = 28;
    this.steamParticles = [];
    for (let i = 0; i < count; i++) {
      this.steamParticles.push({
        x: 0.35 + Math.random() * 0.30, // relative to width
        y: 0.65 + Math.random() * 0.25, // start near waffle top/center
        baseX: 0.35 + Math.random() * 0.30,
        radius: 18 + Math.random() * 26,
        alpha: 0.12 + Math.random() * 0.22,
        speedY: 0.002 + Math.random() * 0.0035,
        speedX: (Math.random() - 0.5) * 0.0015,
        seed: Math.random() * Math.PI * 2,
        life: Math.random()
      });
    }
  }

  /* ----------------------------------------------------
     Event Listeners
     ---------------------------------------------------- */
  bindEvents() {
    // 1. Continuous scroll position mapping
    const onScroll = () => {
      if (!this.track) return;
      const rect = this.track.getBoundingClientRect();
      const scrollableDist = this.track.offsetHeight - window.innerHeight;

      if (scrollableDist <= 0) {
        this.targetProgress = 0;
        return;
      }

      const scrolled = -rect.top;
      this.targetProgress = Math.min(Math.max(scrolled / scrollableDist, 0), 1);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // 2. Interactive HUD Stage Dots Navigation
    this.stageDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const stageNum = parseInt(dot.dataset.stageTarget, 10);
        this.scrollToStage(stageNum);
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    });

    // 3. Bottom Prompter Click
    if (this.bottomPrompt) {
      this.bottomPrompt.addEventListener('click', () => {
        if (this.currentProgress < 0.88) {
          this.scrollToStage(this.activeStageIndex + 1);
        } else {
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.waffleAudio) window.waffleAudio.playClick();
      });
    }

    // 4. Interactive 3D Cursor Parallax on Desktop
    if (this.stickyFrame) {
      this.stickyFrame.addEventListener('mousemove', (e) => {
        const rect = this.stickyFrame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        this.targetTiltX = -y * 8; // degrees
        this.targetTiltY = x * 8;
      });

      this.stickyFrame.addEventListener('mouseleave', () => {
        this.targetTiltX = 0;
        this.targetTiltY = 0;
      });
    }
  }

  /* ----------------------------------------------------
     Smooth Stage Scrolling
     ---------------------------------------------------- */
  scrollToStage(stageNum) {
    if (!this.track) return;
    const scrollableDist = this.track.offsetHeight - window.innerHeight;
    const stageProgressMap = {
      1: 0.02,
      2: 0.25,
      3: 0.48,
      4: 0.70,
      5: 0.95
    };
    const targetP = stageProgressMap[stageNum] !== undefined ? stageProgressMap[stageNum] : 0;
    const targetScrollY = this.track.offsetTop + (targetP * scrollableDist);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  /* ----------------------------------------------------
     Main RAF Animation Loop
     ---------------------------------------------------- */
  startLoop() {
    const loop = (now) => {
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.clock += dt;

      // Smooth progress interpolation (0.13 lerp factor gives responsive, buttery inertia)
      const diff = this.targetProgress - this.currentProgress;
      this.currentProgress += diff * 0.13;
      if (Math.abs(diff) < 0.00015) {
        this.currentProgress = this.targetProgress;
      }

      // Smooth cursor tilt interpolation
      this.tiltX += (this.targetTiltX - this.tiltX) * 0.1;
      this.tiltY += (this.targetTiltY - this.tiltY) * 0.1;

      // Render the current visual state for all 5 stages
      this.render(this.currentProgress);

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /* ----------------------------------------------------
     Mathematical Easing Helpers
     ---------------------------------------------------- */
  clamp(val, min = 0, max = 1) {
    return Math.min(Math.max(val, min), max);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /* ----------------------------------------------------
     Master Render Method (Reversible for all 5 Stages)
     ---------------------------------------------------- */
  render(p) {
    // Determine active stage number:
    // Stage 1: 0% to 20%
    // Stage 2: 20% to 40%
    // Stage 3: 40% to 60%
    // Stage 4: 60% to 80%
    // Stage 5: 80% to 100%
    let stage = 1;
    if (p < 0.20) stage = 1;
    else if (p < 0.40) stage = 2;
    else if (p < 0.60) stage = 3;
    else if (p < 0.80) stage = 4;
    else stage = 5;

    if (stage !== this.activeStageIndex) {
      this.activeStageIndex = stage;
      if (window.waffleAudio) {
        window.waffleAudio.playClick();
      }
    }

    // 1. Update UI: Cards & HUD Dots
    this.updateHUDAndCards(stage, p);

    // 2. Camera Zoom & Chamber Transform Calculation
    this.updateCameraZoom(p);

    // 3. STAGES 1 & 2: Floating Quarters to Seamless Convergence
    this.renderQuartersAssembly(p);

    // 4. STAGE 3: Assembled Crispy Waffle Shimmer
    this.renderAssembledBase(p);

    // 5. STAGE 4: Molten Chocolate Pour Stream & Liquid Canvas Flow
    this.renderChocolateCascade(p);

    // 6. STAGE 5: Steam Canvas & Dynamic Toppings
    this.renderMasterpieceAndToppings(p);
  }

  /* ----------------------------------------------------
     1. UI / HUD / Cards Update
     ---------------------------------------------------- */
  updateHUDAndCards(stage, p) {
    // Active stage card
    this.stageCards.forEach((card) => {
      const cardStage = parseInt(card.dataset.stage, 10);
      if (cardStage === stage) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Active HUD dot
    this.stageDots.forEach((dot) => {
      const dotStage = parseInt(dot.dataset.stageTarget, 10);
      if (dotStage === stage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Progress bar & label
    const pct = Math.round(p * 100);
    if (this.progressFill) this.progressFill.style.height = `${pct}%`;
    if (this.progressPct) this.progressPct.textContent = `${pct}%`;
    if (this.stageTitle) this.stageTitle.textContent = this.stageNames[stage - 1];

    // Bottom prompter message
    if (this.bottomPrompt) {
      const textEl = this.bottomPrompt.querySelector('.prompt-text');
      if (p >= 0.94) {
        if (textEl) textEl.textContent = 'Explore Full Menu Below ↓';
        this.bottomPrompt.classList.add('ready-next');
      } else {
        if (textEl) textEl.textContent = `Stage ${stage} of 5 • Scroll to progress`;
        this.bottomPrompt.classList.remove('ready-next');
      }
    }
  }

  /* ----------------------------------------------------
     2. Camera Zoom & 3D Perspective Control
     ---------------------------------------------------- */
  updateCameraZoom(p) {
    if (!this.chamber) return;

    let zoom = 1.0;
    let panY = 0;

    if (p < 0.20) {
      // Stage 1: Standard viewport
      zoom = 1.0;
      panY = 0;
    } else if (p < 0.40) {
      // Stage 2: Slight push-in as pieces connect
      const t = (p - 0.20) / 0.20;
      zoom = 1.0 + (this.easeInOutQuad(t) * 0.05);
    } else if (p < 0.60) {
      // Stage 3: Cinematic camera zoom toward assembled waffle pockets
      const t = (p - 0.40) / 0.20;
      zoom = 1.05 + (this.easeInOutQuad(t) * 0.28); // Zooms from 1.05 up to 1.33!
      panY = this.easeInOutQuad(t) * -8; // subtle framing pan
    } else if (p < 0.80) {
      // Stage 4: Hold close-up for dramatic liquid chocolate pour
      const t = (p - 0.60) / 0.20;
      zoom = 1.33 - (t * 0.06); // 1.33 to 1.27
      panY = -8 + (t * 4);
    } else {
      // Stage 5: Settle camera back slightly to reveal complete plated masterpiece
      const t = (p - 0.80) / 0.20;
      zoom = 1.27 - (this.easeInOutQuad(t) * 0.20); // Settles back to ~1.07
      panY = -4 * (1 - t);
    }

    // Apply combined camera zoom + user mouse tilt
    this.chamber.style.transform = `
      translateY(${panY.toFixed(1)}px)
      scale(${zoom.toFixed(3)})
      rotateX(${this.tiltX.toFixed(2)}deg)
      rotateY(${this.tiltY.toFixed(2)}deg)
    `;
  }

  /* ----------------------------------------------------
     3. STAGES 1 & 2: Floating Quarters to Convergence
     ---------------------------------------------------- */
  renderQuartersAssembly(p) {
    if (!this.pieceTL || !this.pieceTR || !this.pieceBL || !this.pieceBR) return;

    // Organic ambient levitation drift (subtle sine wave)
    const drift1 = Math.sin(this.clock * 1.8) * 3;
    const drift2 = Math.cos(this.clock * 1.5) * 3;

    if (p <= 0.20) {
      // --- STAGE 1: 0% to 20% ---
      // Show pieces floating separately. As user scrolls down, slowly move toward center.
      const t = this.clamp(p / 0.20, 0, 1);
      const ease = this.easeInOutQuad(t);

      // Interpolate from wide floating separation to intermediate distance
      const factor = 1 - (ease * 0.50); // closes 50% of the distance

      // Top-Left Quarter
      this.pieceTL.style.transform = `
        translate3d(${(-135 * factor + drift1).toFixed(1)}px, ${(-105 * factor + drift2).toFixed(1)}px, ${(65 * factor).toFixed(1)}px)
        rotateX(${(16 * factor).toFixed(1)}deg)
        rotateY(${(-22 * factor).toFixed(1)}deg)
        rotateZ(${(-12 * factor).toFixed(1)}deg)
      `;
      // Top-Right Quarter
      this.pieceTR.style.transform = `
        translate3d(${(140 * factor - drift1).toFixed(1)}px, ${(-95 * factor + drift2).toFixed(1)}px, ${(-45 * factor).toFixed(1)}px)
        rotateX(${(-14 * factor).toFixed(1)}deg)
        rotateY(${(20 * factor).toFixed(1)}deg)
        rotateZ(${(12 * factor).toFixed(1)}deg)
      `;
      // Bottom-Left Quarter
      this.pieceBL.style.transform = `
        translate3d(${(-130 * factor + drift2).toFixed(1)}px, ${(115 * factor - drift1).toFixed(1)}px, ${(-55 * factor).toFixed(1)}px)
        rotateX(${(18 * factor).toFixed(1)}deg)
        rotateY(${(-16 * factor).toFixed(1)}deg)
        rotateZ(${(10 * factor).toFixed(1)}deg)
      `;
      // Bottom-Right Quarter
      this.pieceBR.style.transform = `
        translate3d(${(145 * factor - drift2).toFixed(1)}px, ${(110 * factor + drift1).toFixed(1)}px, ${(75 * factor).toFixed(1)}px)
        rotateX(${(-16 * factor).toFixed(1)}deg)
        rotateY(${(22 * factor).toFixed(1)}deg)
        rotateZ(${(-14 * factor).toFixed(1)}deg)
      `;

      this.pieceTL.style.opacity = '1';
      this.pieceTR.style.opacity = '1';
      this.pieceBL.style.opacity = '1';
      this.pieceBR.style.opacity = '1';

      if (this.snapFlash) this.snapFlash.style.opacity = '0';
      this.hasSnapped = false;

    } else if (p <= 0.40) {
      // --- STAGE 2: 20% to 40% ---
      // The waffle pieces gradually connect together.
      // Realistic rotation, depth, and smooth easing into lock position.
      const t = this.clamp((p - 0.20) / 0.20, 0, 1);
      const ease = this.easeOutCubic(t);
      const factor = (1 - ease) * 0.50; // remaining distance eases down to exactly 0

      this.pieceTL.style.transform = `
        translate3d(${(-135 * factor).toFixed(1)}px, ${(-105 * factor).toFixed(1)}px, ${(65 * factor).toFixed(1)}px)
        rotateX(${(16 * factor).toFixed(1)}deg)
        rotateY(${(-22 * factor).toFixed(1)}deg)
        rotateZ(${(-12 * factor).toFixed(1)}deg)
      `;
      this.pieceTR.style.transform = `
        translate3d(${(140 * factor).toFixed(1)}px, ${(-95 * factor).toFixed(1)}px, ${(-45 * factor).toFixed(1)}px)
        rotateX(${(-14 * factor).toFixed(1)}deg)
        rotateY(${(20 * factor).toFixed(1)}deg)
        rotateZ(${(12 * factor).toFixed(1)}deg)
      `;
      this.pieceBL.style.transform = `
        translate3d(${(-130 * factor).toFixed(1)}px, ${(115 * factor).toFixed(1)}px, ${(-55 * factor).toFixed(1)}px)
        rotateX(${(18 * factor).toFixed(1)}deg)
        rotateY(${(-16 * factor).toFixed(1)}deg)
        rotateZ(${(10 * factor).toFixed(1)}deg)
      `;
      this.pieceBR.style.transform = `
        translate3d(${(145 * factor).toFixed(1)}px, ${(110 * factor).toFixed(1)}px, ${(75 * factor).toFixed(1)}px)
        rotateX(${(-16 * factor).toFixed(1)}deg)
        rotateY(${(22 * factor).toFixed(1)}deg)
        rotateZ(${(-14 * factor).toFixed(1)}deg)
      `;

      // Seamless lock flash at 36%-40%
      if (t >= 0.82 && t <= 1.0) {
        const flashIntensity = Math.sin((t - 0.82) / 0.18 * Math.PI);
        if (this.snapFlash) {
          this.snapFlash.style.opacity = (flashIntensity * 0.95).toFixed(2);
          this.snapFlash.style.transform = `scale(${(0.9 + flashIntensity * 0.25).toFixed(2)})`;
        }

        // Trigger sound feedback once when snapping forward
        if (!this.hasSnapped && t > 0.90) {
          this.hasSnapped = true;
          if (window.waffleAudio && typeof window.waffleAudio.playAddToCart === 'function') {
            window.waffleAudio.playAddToCart();
          }
        }
      } else {
        if (this.snapFlash) this.snapFlash.style.opacity = '0';
        if (t < 0.70) this.hasSnapped = false;
      }

      this.pieceTL.style.opacity = '1';
      this.pieceTR.style.opacity = '1';
      this.pieceBL.style.opacity = '1';
      this.pieceBR.style.opacity = '1';

    } else {
      // Past Stage 2: Pieces are connected and hidden behind unified assembled base
      this.pieceTL.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0)';
      this.pieceTR.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0)';
      this.pieceBL.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0)';
      this.pieceBR.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0)';
      
      // Quarters fade out once assembled base takes over
      const fadeOut = this.clamp((p - 0.40) / 0.05, 0, 1);
      const quarterOpacity = (1 - fadeOut).toFixed(2);
      this.pieceTL.style.opacity = quarterOpacity;
      this.pieceTR.style.opacity = quarterOpacity;
      this.pieceBL.style.opacity = quarterOpacity;
      this.pieceBR.style.opacity = quarterOpacity;
      if (this.snapFlash) this.snapFlash.style.opacity = '0';
    }
  }

  /* ----------------------------------------------------
     4. STAGE 3: Assembled Crispy Waffle Shimmer
     ---------------------------------------------------- */
  renderAssembledBase(p) {
    if (!this.assembledBase) return;

    if (p < 0.35) {
      this.assembledBase.style.opacity = '0';
    } else if (p < 0.40) {
      // Cross-fade in as quarters lock
      const t = (p - 0.35) / 0.05;
      this.assembledBase.style.opacity = t.toFixed(2);
    } else {
      // Fully visible from Stage 3 onward
      this.assembledBase.style.opacity = '1';
    }

    // Deep pocket caramel shimmer sweep during Stage 3
    if (this.pocketShimmer) {
      if (p >= 0.40 && p <= 0.65) {
        const t = (p - 0.40) / 0.25;
        this.pocketShimmer.style.opacity = (Math.sin(t * Math.PI) * 0.6).toFixed(2);
        this.pocketShimmer.style.setProperty('--shimmer-pos', `${(t * 100).toFixed(0)}% ${(t * 100).toFixed(0)}%`);
      } else {
        this.pocketShimmer.style.opacity = '0';
      }
    }
  }

  /* ----------------------------------------------------
     5. STAGE 4: Molten Chocolate Liquid Pour & Canvas Flow
     ---------------------------------------------------- */
  renderChocolateCascade(p) {
    if (!this.chocLayer || !this.pourColumn) return;

    if (p < 0.58) {
      // Inactive before Stage 4
      this.chocLayer.style.opacity = '0';
      this.chocLayer.style.clipPath = 'circle(0% at 50% 50%)';
      this.pourColumn.style.opacity = '0';
      this.pourColumn.style.transform = 'translateX(-50%) scaleY(0)';
      if (this.chocCtx && this.chocCanvas) {
        this.chocCtx.clearRect(0, 0, this.chocCanvas.width, this.chocCanvas.height);
      }
      return;
    }

    // Normalize Stage 4 progress (0.60 to 0.80)
    const t = this.clamp((p - 0.60) / 0.20, 0, 1);

    // 1. Pour Stream from above
    if (t < 0.12) {
      // Stream plunges down to hit waffle center
      const streamLen = t / 0.12;
      this.pourColumn.style.opacity = (t / 0.03).toFixed(2);
      this.pourColumn.style.transform = `translateX(-50%) scaleY(${streamLen.toFixed(3)})`;
      this.pourColumn.style.width = '20px';
    } else if (t < 0.88) {
      // Active continuous pour stream with organic flow pulse
      this.pourColumn.style.opacity = '1';
      this.pourColumn.style.transform = 'translateX(-50%) scaleY(1)';
      const streamPulse = 20 + Math.sin(this.clock * 12) * 2.5;
      this.pourColumn.style.width = `${streamPulse.toFixed(1)}px`;
    } else if (t <= 1.0) {
      // Stream tapers and thins out as pouring completes
      const taper = (t - 0.88) / 0.12;
      const streamPulse = Math.max(20 * (1 - taper), 4);
      this.pourColumn.style.opacity = (1 - taper).toFixed(2);
      this.pourColumn.style.width = `${streamPulse.toFixed(1)}px`;
    } else {
      this.pourColumn.style.opacity = '0';
    }

    // 2. Chocolate Layer Flow Spread (Spreads from center pocket outward over waffle)
    this.chocLayer.style.opacity = '1';
    // Expands smoothly from 0% radius up to 88% (covering full waffle and spilling over edges)
    const spreadRadius = this.easeOutCubic(t) * 88;
    this.chocLayer.style.clipPath = `circle(${spreadRadius.toFixed(1)}% at 50% 50%)`;

    // 3. Liquid Canvas Dynamic Ripples & Specular Drips
    this.drawLiquidChocolateCanvas(t);
  }

  /* ----------------------------------------------------
     Liquid Chocolate Canvas Renderer
     ---------------------------------------------------- */
  drawLiquidChocolateCanvas(t) {
    if (!this.chocCtx || !this.chocCanvas) return;
    const ctx = this.chocCtx;
    const w = this.chocCanvas.width / (window.devicePixelRatio || 1);
    const h = this.chocCanvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.50;
    const cy = h * 0.50;
    const maxRadius = w * 0.42 * this.easeOutCubic(t);

    if (t <= 0.02) return;

    ctx.save();

    // 1. Concentric viscous impact wave ripples where chocolate hits waffle
    if (t > 0.08 && t < 0.95) {
      const rippleCount = 3;
      for (let i = 0; i < rippleCount; i++) {
        const ripplePhase = (this.clock * 2 + i * 0.35) % 1;
        const rippleR = 12 + ripplePhase * maxRadius * 0.65;
        const rippleAlpha = (1 - ripplePhase) * 0.45 * Math.min(t * 3, 1);

        ctx.beginPath();
        ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(254, 243, 199, ${rippleAlpha.toFixed(2)})`;
        ctx.lineWidth = 2.5 * (1 - ripplePhase);
        ctx.stroke();
      }
    }

    // 2. Liquid ganache center impact puddle
    const poolR = Math.max(14, maxRadius * 0.28);
    const poolGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, poolR);
    poolGrad.addColorStop(0, 'rgba(122, 47, 19, 0.7)');
    poolGrad.addColorStop(0.6, 'rgba(42, 14, 5, 0.85)');
    poolGrad.addColorStop(1, 'rgba(18, 4, 1, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, poolR, 0, Math.PI * 2);
    ctx.fillStyle = poolGrad;
    ctx.fill();

    // 3. Molten Drips Cascading Over the Rim (at t > 0.60)
    if (t > 0.60) {
      const dripProgress = (t - 0.60) / 0.40;
      const dripPositions = [
        { x: w * 0.34, y: h * 0.78, len: 38 * dripProgress, r: 6 },
        { x: w * 0.48, y: h * 0.84, len: 52 * dripProgress, r: 7.5 },
        { x: w * 0.64, y: h * 0.80, len: 42 * dripProgress, r: 6.5 }
      ];

      dripPositions.forEach((drip) => {
        ctx.beginPath();
        ctx.moveTo(drip.x - drip.r * 0.7, drip.y);
        ctx.lineTo(drip.x - drip.r, drip.y + drip.len);
        ctx.arc(drip.x, drip.y + drip.len, drip.r, Math.PI, 0, true);
        ctx.lineTo(drip.x + drip.r * 0.7, drip.y);
        ctx.fillStyle = '#220A03';
        ctx.fill();

        // Droplet specular highlight
        ctx.beginPath();
        ctx.arc(drip.x - 2, drip.y + drip.len - 2, drip.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(254, 243, 199, 0.45)';
        ctx.fill();
      });
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     6. STAGE 5: Steam Canvas & Dynamic Toppings
     ---------------------------------------------------- */
  renderMasterpieceAndToppings(p) {
    if (!this.masterpieceLayer) return;

    if (p < 0.75) {
      // Inactive before Stage 5
      this.masterpieceLayer.style.opacity = '0';
      if (this.steamCanvas) this.steamCanvas.style.opacity = '0';
      if (this.toppingRig) {
        if (this.fs1) this.fs1.style.opacity = '0';
        if (this.fs2) this.fs2.style.opacity = '0';
        if (this.fcc1) this.fcc1.style.opacity = '0';
        if (this.fr1) this.fr1.style.opacity = '0';
        if (this.sugarSnow) this.sugarSnow.style.opacity = '0';
      }
      return;
    }

    // Normalize Stage 5 progress (0.80 to 1.00)
    const t = this.clamp((p - 0.78) / 0.22, 0, 1);

    // 1. Cross-fade Masterpiece Dish (Fresh strawberries & ganache)
    const masterOpacity = this.clamp(t * 1.5, 0, 1);
    this.masterpieceLayer.style.opacity = masterOpacity.toFixed(2);

    // 2. Volumetric Rising Steam Canvas
    if (this.steamCanvas) {
      const steamOpacity = this.clamp(t * 1.4, 0, 0.95);
      this.steamCanvas.style.opacity = steamOpacity.toFixed(2);
      this.drawSteamCanvas(t);
    }

    // 3. Falling & Bouncing Fresh Toppings
    if (this.toppingRig) {
      // Strawberry 1 (drops from above with soft 3D bounce)
      if (this.fs1) {
        const t1 = this.clamp(t * 1.8, 0, 1);
        const ease1 = this.easeOutBack(t1);
        const dropY = -120 * (1 - ease1);
        const rot = 18 * (1 - ease1);
        this.fs1.style.opacity = this.clamp(t1 * 2, 0, 1).toFixed(2);
        this.fs1.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 40px) rotate(${rot.toFixed(1)}deg) scale(${ease1.toFixed(3)})`;
      }

      // Strawberry 2 (slight delay)
      if (this.fs2) {
        const t2 = this.clamp((t - 0.12) * 2.0, 0, 1);
        const ease2 = this.easeOutBack(t2);
        const dropY = -110 * (1 - ease2);
        const rot = -14 * (1 - ease2);
        this.fs2.style.opacity = this.clamp(t2 * 2, 0, 1).toFixed(2);
        this.fs2.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 30px) rotate(${rot.toFixed(1)}deg) scale(${ease2.toFixed(3)})`;
      }

      // Belgian Chocolate Curls
      if (this.fcc1) {
        const t3 = this.clamp((t - 0.20) * 2.2, 0, 1);
        const ease3 = this.easeOutBack(t3);
        const dropY = -100 * (1 - ease3);
        this.fcc1.style.opacity = this.clamp(t3 * 2, 0, 1).toFixed(2);
        this.fcc1.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 35px) scale(${ease3.toFixed(3)})`;
      }

      // Wild Raspberry
      if (this.fr1) {
        const t4 = this.clamp((t - 0.28) * 2.2, 0, 1);
        const ease4 = this.easeOutBack(t4);
        const dropY = -90 * (1 - ease4);
        this.fr1.style.opacity = this.clamp(t4 * 2, 0, 1).toFixed(2);
        this.fr1.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 25px) scale(${ease4.toFixed(3)})`;
      }

      // Powdered Sugar Snow Fall
      if (this.sugarSnow) {
        const snowOpacity = this.clamp((t - 0.35) * 1.5, 0, 0.45);
        this.sugarSnow.style.opacity = snowOpacity.toFixed(2);
      }
    }
  }

  /* ----------------------------------------------------
     Volumetric Steam Simulation (Canvas)
     ---------------------------------------------------- */
  drawSteamCanvas(t) {
    if (!this.steamCtx || !this.steamCanvas) return;
    const ctx = this.steamCtx;
    const w = this.steamCanvas.width / (window.devicePixelRatio || 1);
    const h = this.steamCanvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    ctx.save();

    this.steamParticles.forEach((p) => {
      // Rising thermal motion
      p.life += p.speedY * 1.8;
      if (p.life > 1) {
        p.life = 0;
        p.x = p.baseX + (Math.random() - 0.5) * 0.12;
      }

      // Horizontal subtle thermal sine drift
      const currentY = h * (0.80 - p.life * 0.65);
      const currentX = w * (p.x + Math.sin(this.clock * 2 + p.seed) * 0.04);
      const currentRadius = p.radius * (1 + p.life * 1.8);

      // Fade-in at base, fade-out at top
      let alpha = p.alpha * Math.sin(p.life * Math.PI) * Math.min(t * 1.5, 1);

      if (alpha > 0.005) {
        const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, currentRadius);
        grad.addColorStop(0, `rgba(255, 253, 248, ${(alpha * 0.85).toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(250, 243, 230, ${(alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(250, 243, 230, 0)');

        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    ctx.restore();
  }
}

// Bootstrap on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.waffleCinematicHero = new WaffleCinematicHero();
});
