/**
 * VeloPeak Cycles - Catalog Filtering & Sorting
 * Supports real-time filtering, search, sorting and active filter tags
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogFilters();
});

function initCatalogFilters() {
  const catalogGrid = document.getElementById('catalog-products-grid');
  if (!catalogGrid) return;

  const productCards = Array.from(catalogGrid.querySelectorAll('.product-item-col'));
  const countDisplay = document.getElementById('catalog-count-display');
  const sortSelect = document.getElementById('catalog-sort-select');
  const searchInput = document.getElementById('catalog-search-input');
  const priceSlider = document.getElementById('filter-price-slider');
  const priceMaxVal = document.getElementById('price-max-display');
  const resetBtn = document.getElementById('filter-reset-btn');
  const activeTagsContainer = document.getElementById('active-filters-container');
  const filterForm = document.getElementById('catalog-filter-form');

  // Check URL params for initial category filtering (e.g. ?type=road)
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  if (typeParam && filterForm) {
    const matchingCheckbox = filterForm.querySelector(`input[name="category"][value="${typeParam}"]`);
    if (matchingCheckbox) {
      matchingCheckbox.checked = true;
    }
  }

  // Event Listeners
  if (filterForm) {
    filterForm.addEventListener('change', applyFilters);
  }

  if (priceSlider && priceMaxVal) {
    priceSlider.addEventListener('input', () => {
      priceMaxVal.textContent = `$${priceSlider.value}`;
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  if (resetBtn && filterForm) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterForm.reset();
      if (priceSlider) {
        priceSlider.value = priceSlider.max;
        if (priceMaxVal) priceMaxVal.textContent = `$${priceSlider.max}`;
      }
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  }

  function applyFilters() {
    let visibleCount = 0;
    const activeTags = [];

    // Selected categories
    const selectedCats = filterForm ? Array.from(filterForm.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value) : [];
    if (selectedCats.length > 0) activeTags.push(...selectedCats.map(c => `Type: ${c}`));

    // Selected frame sizes
    const selectedSizes = filterForm ? Array.from(filterForm.querySelectorAll('input[name="size"]:checked')).map(cb => cb.value) : [];
    if (selectedSizes.length > 0) activeTags.push(...selectedSizes.map(s => `Size: ${s}`));

    // Selected wheel sizes
    const selectedWheels = filterForm ? Array.from(filterForm.querySelectorAll('input[name="wheel"]:checked')).map(cb => cb.value) : [];
    if (selectedWheels.length > 0) activeTags.push(...selectedWheels.map(w => `Wheel: ${w}`));

    // Electric toggle
    const selectedElectric = filterForm ? Array.from(filterForm.querySelectorAll('input[name="electric"]:checked')).map(cb => cb.value) : [];
    if (selectedElectric.length > 0) activeTags.push(...selectedElectric.map(e => `Drive: ${e}`));

    // Price max
    const maxPrice = priceSlider ? parseFloat(priceSlider.value) : Infinity;

    // Search query
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Filter cards
    productCards.forEach(col => {
      const card = col.querySelector('.product-card, .accessory-card');
      if (!card) return;

      const category = card.dataset.category || '';
      const price = parseFloat(card.dataset.price || '0');
      const sizes = (card.dataset.sizes || '').split(',');
      const wheels = (card.dataset.wheels || '').split(',');
      const electric = card.dataset.electric || '';
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();

      let isMatch = true;

      // Category check
      if (selectedCats.length > 0 && !selectedCats.includes(category)) {
        isMatch = false;
      }

      // Size check
      if (selectedSizes.length > 0 && !selectedSizes.some(s => sizes.includes(s))) {
        isMatch = false;
      }

      // Wheel check
      if (selectedWheels.length > 0 && !selectedWheels.some(w => wheels.includes(w))) {
        isMatch = false;
      }

      // Electric check
      if (selectedElectric.length > 0 && !selectedElectric.includes(electric)) {
        isMatch = false;
      }

      // Price check
      if (price > maxPrice) {
        isMatch = false;
      }

      // Search query check
      if (query && !title.includes(query) && !desc.includes(query) && !category.includes(query)) {
        isMatch = false;
      }

      if (isMatch) {
        col.style.display = '';
        visibleCount++;
      } else {
        col.style.display = 'none';
      }
    });

    // Sort cards
    if (sortSelect) {
      const sortVal = sortSelect.value;
      const visibleCols = productCards.filter(c => c.style.display !== 'none');

      visibleCols.sort((a, b) => {
        const cardA = a.querySelector('.product-card, .accessory-card');
        const cardB = b.querySelector('.product-card, .accessory-card');
        const priceA = parseFloat(cardA.dataset.price || '0');
        const priceB = parseFloat(cardB.dataset.price || '0');
        const ratingA = parseFloat(cardA.dataset.rating || '0');
        const ratingB = parseFloat(cardB.dataset.rating || '0');

        if (sortVal === 'price-low') return priceA - priceB;
        if (sortVal === 'price-high') return priceB - priceA;
        if (sortVal === 'rating') return ratingB - ratingA;
        return 0; // default featured
      });

      visibleCols.forEach(col => catalogGrid.appendChild(col));
    }

    // Update count display
    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} products`;
    }

    // Update active filter tags
    if (activeTagsContainer) {
      activeTagsContainer.innerHTML = '';
      if (activeTags.length > 0) {
        activeTags.forEach(tag => {
          const tagEl = document.createElement('span');
          tagEl.className = 'active-filter-tag';
          tagEl.innerHTML = `${tag}`;
          activeTagsContainer.appendChild(tagEl);
        });
      }
    }
  }

  // Initial call
  applyFilters();
}
