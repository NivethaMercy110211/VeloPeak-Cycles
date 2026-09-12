/**
 * VeloPeak Cycles - Main JavaScript
 * Handles Theme Toggle, RTL Switcher, Sticky Navbar, Cart Drawer, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initStickyHeader();
  initCart();
  initNewsletter();
  initScrollAnimations();
});

/* Shared reveal animations for banners, sections, headings, grids and footer */
function initScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const bannerSelectors = [
    '.hero-section', '.hero-banner', '.page-banner', '.inner-banner',
    '.cta-banner', '.cta-banner-section', '.auth-visual'
  ].join(',');
  const headingSelectors = [
    '.section-header', '.section-title', '.section-badge',
    'main section > .site-container > h2', 'main section > .container > h2'
  ].join(',');
  const cardSelectors = [
    '.feature-card', '.product-card', '.accessory-card', '.category-card',
    '.package-card', '.process-step-card', '.guide-card', '.brand-card',
    '.testimonial-card', '.stat-card', '.service-card', '.team-card',
    '.value-card', '.card', '.checklist-item', '.product-specs-item',
    '.accessory-spec-item', '.acc-cat-item', '.finder-step',
    '.repair-card-mobile-item', '.gallery-thumb-item'
  ].join(',');

  const banners = document.querySelectorAll(bannerSelectors);
  const sections = document.querySelectorAll('main > section');
  const headings = document.querySelectorAll(headingSelectors);
  const cards = document.querySelectorAll(cardSelectors);
  const footer = document.querySelector('.site-footer, footer');

  banners.forEach(element => element.classList.add('motion-banner'));
  sections.forEach(element => element.classList.add('motion-section'));
  headings.forEach(element => element.classList.add('motion-heading'));
  cards.forEach((element, index) => {
    element.classList.add('motion-card');
    element.style.setProperty('--motion-order', index % 8);
  });
  if (footer) footer.classList.add('motion-footer');

  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px'
  });

  document.querySelectorAll(
    '.motion-banner, .motion-section, .motion-heading, .motion-card, .motion-footer'
  ).forEach(element => observer.observe(element));
}

/* Theme Toggle (Dark / Light) */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('velopeak_theme') || 'light';
  
  applyTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('velopeak_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  });
}

/* RTL / LTR Switcher */
function initRTL() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const currentDir = localStorage.getItem('velopeak_dir') || 'ltr';

  applyDir(currentDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDir(newDir);
      localStorage.setItem('velopeak_dir', newDir);
    });
  });
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  const rtlTexts = document.querySelectorAll(
    '.rtl-toggle-btn span, .rtl-toggle-btn .offcanvas-control-value'
  );
  rtlTexts.forEach(span => {
    span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* Sticky Header Scroll Enhancement */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/* Cart & Wishlist Interaction */
let cartCount = 2;
let wishlistCount = 1;

function initCart() {
  const updateCartBadges = () => {
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = cartCount;
    });
  };
  updateCartBadges();

  // Add to cart buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      e.preventDefault();
      cartCount++;
      updateCartBadges();
      const productCard = btn.closest('.product-card, .accessory-card');
      const title = productCard ? (productCard.querySelector('.product-title, .accessory-title')?.textContent.trim() || 'Item') : 'Item';
      showToast(`Added <strong>${title}</strong> to your shopping cart!`, 'success');
    }

    const wishBtn = e.target.closest('.product-card-wishlist');
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle('active');
      const icon = wishBtn.querySelector('i');
      if (icon) {
        if (icon.classList.contains('bi-heart')) {
          icon.classList.replace('bi-heart', 'bi-heart-fill');
          icon.style.color = '#E85D2A';
          showToast('Added to your Wishlist!', 'info');
        } else {
          icon.classList.replace('bi-heart-fill', 'bi-heart');
          icon.style.color = '';
          showToast('Removed from Wishlist.', 'info');
        }
      }
    }
  });
}

/* Global Toast Notification */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container-custom');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container-custom position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white border-0 show mb-2';
  toastEl.style.backgroundColor = type === 'success' ? '#202426' : (type === 'error' ? '#D32F2F' : '#202426');
  toastEl.style.borderLeft = '4px solid #E85D2A';
  toastEl.style.borderRadius = '8px';
  toastEl.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2" style="font-weight: 600; font-size: 0.9rem;">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill text-primary' : 'info-circle-fill text-primary'}" style="color: #E85D2A !important;"></i>
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);
  toastEl.querySelector('.btn-close').addEventListener('click', () => toastEl.remove());

  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toastEl.remove(), 300);
  }, 3500);
}

/* Newsletter Subscription */
function initNewsletter() {
  const form = document.querySelector('.footer-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value.trim()) {
      showToast('Thank you for subscribing to VeloPeak Ride Notes!', 'success');
      input.value = '';
    }
  });
}
