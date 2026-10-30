/**
 * SPATIAL UI INTERACTION & AUDIO-VISUAL ENGINE
 * For SearchMixed / Israr Hussain Shah MQL5 Store
 */

(function () {
  "use strict";

  // Application State
  const state = {
    search: "",
    platform: "all", // "all", "5", "4"
    category: "all", // "all", "1", "2", "7"
    collection: "all", // "all", "smc", "deriv", "volume", "gold", "free"
    priceRange: "all", // "all", "free", "under50", "50to100", "over100"
    sortBy: "featured",
    soundEnabled: true,
    activeModalProduct: null
  };

  // DOM Elements Cache
  const elements = {
    canvas: document.getElementById("spatial-canvas"),
    cursorGlow: document.getElementById("cursor-glow"),
    grid: document.getElementById("spatial-products-grid"),
    resultsCount: document.getElementById("results-count"),
    searchInput: document.getElementById("spatial-search"),
    searchClear: document.getElementById("search-clear"),
    sortSelect: document.getElementById("sort-select"),
    audioToggle: document.getElementById("audio-toggle"),
    modalBackdrop: document.getElementById("spatial-modal"),
    modalClose: document.getElementById("modal-close"),
    modalBody: document.getElementById("modal-body"),
    toast: document.getElementById("spatial-toast"),
    toastText: document.getElementById("toast-text"),
    
    // Counter elements
    totalCountEl: document.getElementById("stat-total-tools"),
    mt5CountEl: document.getElementById("stat-mt5-count"),
    mt4CountEl: document.getElementById("stat-mt4-count"),
    freeCountEl: document.getElementById("stat-free-count")
  };

  // =========================================================================
  // 1. SPATIAL AUDIO SYNTHESIZER (Web Audio API)
  // Generates glass taps, tactile feedback, and holographic chimes
  // =========================================================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  const SoundFX = {
    tap: function () {
      if (!state.soundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } catch (e) {}
    },

    modalOpen: function () {
      if (!state.soundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        [587.33, 880, 1174.66].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.05, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.35);
        });
      } catch (e) {}
    },

    buyLaser: function () {
      if (!state.soundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {}
    }
  };

  // =========================================================================
  // 2. LUMINOUS SPATIAL NODES CANVAS
  // =========================================================================
  function initSpatialCanvas() {
    if (!elements.canvas) return;
    const ctx = elements.canvas.getContext("2d");
    let width = (elements.canvas.width = window.innerWidth);
    let height = (elements.canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = elements.canvas.width = window.innerWidth;
      height = elements.canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(55, Math.floor(width / 25));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.6 ? "#00f0ff" : Math.random() > 0.3 ? "#3a86ff" : "#a855f7"
      });
    }

    let mouse = { x: width / 2, y: height / 2 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (elements.cursorGlow) {
        elements.cursorGlow.style.left = e.clientX + "px";
        elements.cursorGlow.style.top = e.clientY + "px";
      }
    });

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection beams
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // =========================================================================
  // 3. 3D SPATIAL CARD TILT & SPECULAR SHINE ENGINE
  // =========================================================================
  function attachTiltEffects() {
    const cards = document.querySelectorAll(".spatial-card");

    cards.forEach((card) => {
      const glare = card.querySelector(".card-glare");

      card.addEventListener("mouseenter", () => {
        SoundFX.tap();
      });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

        if (glare) {
          glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  // =========================================================================
  // 4. FILTERING, SEARCHING & SORTING ENGINE
  // =========================================================================
  function filterProducts() {
    if (typeof PRODUCTS === "undefined") return [];

    let filtered = PRODUCTS.filter((item) => {
      // 1. Text Search
      if (state.search.trim()) {
        const query = state.search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // 2. Platform Filter
      if (state.platform !== "all") {
        if (String(item.mt) !== state.platform) return false;
      }

      // 3. Category Filter
      if (state.category !== "all") {
        if (String(item.category) !== state.category) return false;
      }

      // 4. Collection Filter
      if (state.collection !== "all") {
        const nameLower = item.name.toLowerCase();
        const descLower = item.description.toLowerCase();
        const tagsLower = item.tags.map((t) => t.toLowerCase());

        if (state.collection === "smc") {
          const isSmc =
            nameLower.includes("smc") ||
            nameLower.includes("smart money") ||
            tagsLower.includes("smc") ||
            descLower.includes("smart money concepts") ||
            descLower.includes("fair value gap") ||
            nameLower.includes("fvg") ||
            nameLower.includes("order block") ||
            nameLower.includes("liquidity");
          if (!isSmc) return false;
        } else if (state.collection === "deriv") {
          const isDeriv =
            nameLower.includes("deriv") ||
            nameLower.includes("boom") ||
            nameLower.includes("crash") ||
            nameLower.includes("spike") ||
            nameLower.includes("synthetics") ||
            tagsLower.includes("deriv") ||
            tagsLower.includes("boom & crash");
          if (!isDeriv) return false;
        } else if (state.collection === "volume") {
          const isVolume =
            nameLower.includes("volume") ||
            nameLower.includes("profile") ||
            nameLower.includes("delta") ||
            nameLower.includes("tpo") ||
            tagsLower.includes("volume profile") ||
            tagsLower.includes("order flow");
          if (!isVolume) return false;
        } else if (state.collection === "gold") {
          const isGold =
            nameLower.includes("gold") ||
            descLower.includes("xauusd") ||
            tagsLower.includes("xauusd");
          if (!isGold) return false;
        } else if (state.collection === "free") {
          if (item.price !== 0) return false;
        }
      }

      // 5. Price Range Filter
      if (state.priceRange !== "all") {
        if (state.priceRange === "free" && item.price !== 0) return false;
        if (state.priceRange === "under50" && (item.price === 0 || item.price >= 50)) return false;
        if (state.priceRange === "50to100" && (item.price < 50 || item.price > 100)) return false;
        if (state.priceRange === "over100" && item.price <= 100) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === "priceAsc") {
        return a.price - b.price;
      } else if (state.sortBy === "priceDesc") {
        return b.price - a.price;
      } else if (state.sortBy === "nameAsc") {
        return a.name.localeCompare(b.name);
      } else if (state.sortBy === "rating") {
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      }
      // Default: "featured" (order from catalog with ratings prioritized)
      return 0;
    });

    return filtered;
  }

  // =========================================================================
  // 5. RENDER PRODUCT CARDS
  // =========================================================================
  function renderProducts() {
    const products = filterProducts();

    if (elements.resultsCount) {
      elements.resultsCount.textContent = products.length;
    }

    if (!elements.grid) return;

    if (products.length === 0) {
      elements.grid.innerHTML = `
        <div class="empty-results-box">
          <div class="empty-icon">🪐</div>
          <h3 class="empty-title">No Matching Spatial Tools Found</h3>
          <p class="empty-subtitle">Try adjusting your search criteria, platform filter, or category selection.</p>
          <button class="btn-reset-filters" id="btn-reset-all">Reset All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById("btn-reset-all");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetFilters);
      }
      return;
    }

    elements.grid.innerHTML = products
      .map((item) => {
        const isFree = item.price === 0;
        const priceLabel = isFree ? "FREE" : `$${item.price.toFixed(2)}`;
        const platformBadgeClass = item.mt === 5 ? "mt5" : "mt4";
        const platformText = item.mt === 5 ? "MetaTrader 5" : "MetaTrader 4";
        const categoryTag =
          item.category === 1
            ? "Expert Advisor (EA)"
            : item.category === 7
            ? "Utility"
            : "Indicator";

        return `
          <div class="spatial-card-wrapper" data-id="${item.id}">
            <div class="spatial-card">
              <div class="card-glare"></div>

              <div class="card-header">
                <div class="card-logo-box">
                  <img class="card-logo-img" src="${item.logo}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://c.mql5.com/i/favicon4.ico'">
                </div>
                <div class="card-badges-col">
                  <span class="platform-badge ${platformBadgeClass}">${platformText}</span>
                  <span class="tag-badge">${categoryTag}</span>
                  ${item.badge ? `<span class="tag-badge" style="color: var(--cyan-neon);">${escapeHtml(item.badge)}</span>` : ""}
                </div>
              </div>

              <div class="card-body">
                <h3 class="card-title">${escapeHtml(item.name)}</h3>
                <p class="card-description">${escapeHtml(item.description)}</p>
                <div class="card-tags-list">
                  ${item.tags.slice(0, 3).map((t) => `<span class="card-tag-pill">${escapeHtml(t)}</span>`).join("")}
                </div>
              </div>

              <div class="card-footer">
                <div class="card-price-box">
                  <span class="card-price-label">MQL5 Price</span>
                  <span class="card-price-value ${isFree ? "free" : ""}">${priceLabel}</span>
                </div>

                <div class="card-actions-group">
                  <button class="btn-inspect" title="Inspect Tool Details" data-inspect-id="${item.id}" aria-label="Inspect ${escapeHtml(item.name)}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>

                  <a class="btn-buy-mql5 ${isFree ? "free-btn" : ""}" 
                     href="${item.url}" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     data-buy-id="${item.id}" 
                     title="Buy/Download on official MQL5 Market">
                    <span>${isFree ? "Get Free" : "Buy Now"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    attachTiltEffects();
    attachCardActionHandlers();
  }

  // Helper to escape HTML and prevent injection
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Card Event Listeners
  function attachCardActionHandlers() {
    // Inspect button clicks
    document.querySelectorAll("[data-inspect-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-inspect-id"), 10);
        openModal(id);
      });
    });

    // Entire card clicking opens inspection modal, unless clicking buy button
    document.querySelectorAll(".spatial-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-buy-mql5") || e.target.closest(".btn-inspect")) {
          return;
        }
        const wrapper = card.closest(".spatial-card-wrapper");
        if (wrapper) {
          const id = parseInt(wrapper.getAttribute("data-id"), 10);
          openModal(id);
        }
      });
    });

    // Track buy button clicks
    document.querySelectorAll(".btn-buy-mql5").forEach((btn) => {
      btn.addEventListener("click", () => {
        SoundFX.buyLaser();
      });
    });
  }

  // =========================================================================
  // 6. SPATIAL INSPECTION 3D MODAL
  // =========================================================================
  function openModal(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    state.activeModalProduct = product;
    SoundFX.modalOpen();

    const isFree = product.price === 0;
    const priceDisplay = isFree ? "FREE" : `$${product.price.toFixed(2)} USD`;
    const platformText = product.mt === 5 ? "MetaTrader 5" : "MetaTrader 4";
    const categoryText =
      product.category === 1
        ? "Expert Advisor (Automated EA)"
        : product.category === 7
        ? "Utility Script"
        : "Technical Indicator";

    elements.modalBody.innerHTML = `
      <div class="modal-header-deck">
        <div class="modal-logo-frame">
          <img class="modal-logo-img" src="${product.logo}" alt="${escapeHtml(product.name)}" onerror="this.src='https://c.mql5.com/i/favicon4.ico'">
        </div>
        <div class="modal-meta-box">
          <div class="modal-badges-row">
            <span class="platform-badge ${product.mt === 5 ? "mt5" : "mt4"}">${platformText}</span>
            <span class="tag-badge">${categoryText}</span>
            ${product.badge ? `<span class="tag-badge" style="color: var(--cyan-neon);">${escapeHtml(product.badge)}</span>` : ""}
          </div>
          <h2 class="modal-title">${escapeHtml(product.name)}</h2>
          <a class="modal-author-link" href="${SELLER_INFO.profileUrl}" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Seller: ${SELLER_INFO.name} (Verified)
          </a>
        </div>
      </div>

      <div class="modal-specs-grid">
        <div class="spec-tile">
          <div class="spec-label">Platform</div>
          <div class="spec-val">${platformText}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-label">Engine Category</div>
          <div class="spec-val">${categoryText}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-label">DLL Requirement</div>
          <div class="spec-val" style="color: var(--emerald-neon);">Zero (100% Native)</div>
        </div>
        <div class="spec-tile">
          <div class="spec-label">Repaint Status</div>
          <div class="spec-val" style="color: var(--cyan-neon);">Strict Non-Repainting</div>
        </div>
      </div>

      <div class="modal-desc-heading">Overview & Specifications</div>
      <div class="modal-description-full">${escapeHtml(product.description)}</div>

      <div class="modal-desc-heading">Intelligence Tags</div>
      <div class="modal-tags-list">
        ${product.tags.map((t) => `<span class="modal-tag-chip"># ${escapeHtml(t)}</span>`).join("")}
      </div>

      <div class="modal-checkout-deck">
        <div class="modal-price-display">
          <span class="modal-price-label">Marketplace Price</span>
          <span class="modal-price-num ${isFree ? "free" : ""}">${priceDisplay}</span>
        </div>

        <div class="modal-actions-right">
          <button class="btn-copy-link" id="btn-copy-product-link" title="Copy direct MQL5 product link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Link</span>
          </button>

          <a class="btn-copy-link" 
             style="background: rgba(37, 211, 102, 0.15); border-color: rgba(37, 211, 102, 0.4); color: #25D366;"
             href="https://wa.me/923121764052?text=Hello%20Israr,%20I%20am%20interested%20in%20your%20tool:%20${encodeURIComponent(product.name)}" 
             target="_blank" 
             rel="noopener noreferrer" 
             title="Ask question on WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.998.546 1.763.818 2.796.818 3.181 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.769-5.768-5.769zm10.009 5.765c-.002 5.541-4.509 10.048-10.05 10.048-1.758 0-3.411-.462-4.856-1.272l-5.134 1.346 1.371-5.006c-.896-1.503-1.37-3.239-1.37-5.116.002-5.541 4.51-10.048 10.051-10.048 5.541 0 10.048 4.507 10.048 10.048z"></path>
            </svg>
            <span>WhatsApp</span>
          </a>

          <a class="btn-modal-direct-buy ${isFree ? "free-modal-btn" : ""}" 
             href="${product.url}" 
             target="_blank" 
             rel="noopener noreferrer" 
             id="modal-direct-buy-link">
            <span>${isFree ? "Get Free on MQL5" : "Buy Now on MQL5 Market"}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `;

    // Copy button listener
    const copyBtn = document.getElementById("btn-copy-product-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(product.url).then(() => {
          showToast(`Copied official MQL5 link for "${product.name}"`);
        });
      });
    }

    // Direct Buy Click
    const directBuyBtn = document.getElementById("modal-direct-buy-link");
    if (directBuyBtn) {
      directBuyBtn.addEventListener("click", () => {
        SoundFX.buyLaser();
      });
    }

    elements.modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    elements.modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
    state.activeModalProduct = null;
    SoundFX.tap();
  }

  // =========================================================================
  // 7. SPATIAL TOAST SYSTEM
  // =========================================================================
  let toastTimer = null;
  function showToast(message) {
    if (!elements.toast || !elements.toastText) return;
    elements.toastText.textContent = message;
    elements.toast.classList.add("show");
    SoundFX.tap();

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3200);
  }

  // =========================================================================
  // 8. EVENT LISTENERS SETUP
  // =========================================================================
  function setupEventListeners() {
    // 1. Search input
    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", (e) => {
        state.search = e.target.value;
        if (elements.searchClear) {
          if (state.search.length > 0) {
            elements.searchClear.classList.add("active");
          } else {
            elements.searchClear.classList.remove("active");
          }
        }
        renderProducts();
      });

      // Keyboard shortcut: Press '/' to focus search
      window.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== elements.searchInput) {
          e.preventDefault();
          elements.searchInput.focus();
        }
        if (e.key === "Escape" && elements.modalBackdrop.classList.contains("active")) {
          closeModal();
        }
      });
    }

    // Search clear button
    if (elements.searchClear) {
      elements.searchClear.addEventListener("click", () => {
        state.search = "";
        elements.searchInput.value = "";
        elements.searchClear.classList.remove("active");
        renderProducts();
        elements.searchInput.focus();
      });
    }

    // 2. Sort select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // 3. Platform chips
    document.querySelectorAll("[data-filter-platform]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-platform]").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.platform = chip.getAttribute("data-filter-platform");
        SoundFX.tap();
        renderProducts();
      });
    });

    // 4. Collection chips
    document.querySelectorAll("[data-filter-collection]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-collection]").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.collection = chip.getAttribute("data-filter-collection");
        SoundFX.tap();
        renderProducts();
      });
    });

    // 5. Category chips
    document.querySelectorAll("[data-filter-category]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-category]").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.category = chip.getAttribute("data-filter-category");
        SoundFX.tap();
        renderProducts();
      });
    });

    // 6. Price chips
    document.querySelectorAll("[data-filter-price]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-price]").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.priceRange = chip.getAttribute("data-filter-price");
        SoundFX.tap();
        renderProducts();
      });
    });

    // 7. Audio toggle
    if (elements.audioToggle) {
      elements.audioToggle.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        elements.audioToggle.style.color = state.soundEnabled ? "var(--cyan-neon)" : "var(--text-dim)";
        elements.audioToggle.setAttribute(
          "title",
          state.soundEnabled ? "Audio Effects: ON" : "Audio Effects: OFF"
        );
        showToast(state.soundEnabled ? "Spatial sound enabled" : "Spatial sound muted");
      });
    }

    // 8. Modal close handlers
    if (elements.modalClose) {
      elements.modalClose.addEventListener("click", closeModal);
    }
    if (elements.modalBackdrop) {
      elements.modalBackdrop.addEventListener("click", (e) => {
        if (e.target === elements.modalBackdrop) {
          closeModal();
		  
        }
      });
    }
	
    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
    const dockLinks = document.getElementById("spatial-dock-links");

    function closeMobileMenu() {
      if (!dockLinks) return;
      dockLinks.classList.remove("mobile-open");
      mobileBackdrop?.classList.remove("active");
      mobileToggle?.setAttribute("aria-expanded", "false");
    }

    if (mobileToggle && dockLinks) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = dockLinks.classList.toggle("mobile-open");
        mobileBackdrop?.classList.toggle("active", isOpen);
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobileMenu);
    }

    dockLinks?.querySelectorAll(".dock-btn").forEach((btn) => {
      btn.addEventListener("click", closeMobileMenu);
    });

    let mobileResizeTimer = null;
    window.addEventListener("resize", () => {
      if (mobileResizeTimer) clearTimeout(mobileResizeTimer);
      mobileResizeTimer = setTimeout(() => {
        if (window.innerWidth > 900) closeMobileMenu();
      }, 120);
    });
  }

  function resetFilters() {
    state.search = "";
    state.platform = "all";
    state.category = "all";
    state.collection = "all";
    state.priceRange = "all";
    state.sortBy = "featured";

    if (elements.searchInput) elements.searchInput.value = "";
    if (elements.searchClear) elements.searchClear.classList.remove("active");
    if (elements.sortSelect) elements.sortSelect.value = "featured";

    document.querySelectorAll("[data-filter-platform]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-filter-platform") === "all");
    });
    document.querySelectorAll("[data-filter-collection]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-filter-collection") === "all");
    });
    document.querySelectorAll("[data-filter-category]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-filter-category") === "all");
    });
    document.querySelectorAll("[data-filter-price]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-filter-price") === "all");
    });

    SoundFX.tap();
    renderProducts();
  }

  // =========================================================================
  // 9. INITIALIZE METRIC STATS
  // =========================================================================
  function calculateStats() {
    if (typeof PRODUCTS === "undefined") return;

    const total = PRODUCTS.length;
    const mt5Count = PRODUCTS.filter((p) => p.mt === 5).length;
    const mt4Count = PRODUCTS.filter((p) => p.mt === 4).length;
    const freeCount = PRODUCTS.filter((p) => p.price === 0).length;

    if (elements.totalCountEl) elements.totalCountEl.textContent = total;
    if (elements.mt5CountEl) elements.mt5CountEl.textContent = mt5Count;
    if (elements.mt4CountEl) elements.mt4CountEl.textContent = mt4Count;
    if (elements.freeCountEl) elements.freeCountEl.textContent = freeCount;
  }

  // =========================================================================
  // 10. INITIALIZATION
  // =========================================================================
  function init() {
    initSpatialCanvas();
    calculateStats();
    setupEventListeners();
    renderProducts();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
