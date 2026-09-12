/**
 * VeloPeak Cycles - Gallery & Detail Interactivity
 * High-res thumbnail switching, frame size selection, modal enquiry
 */

document.addEventListener('DOMContentLoaded', () => {
  initGallerySwitcher();
  initSizeSelector();
  initEnquiryModal();
});

function initGallerySwitcher() {
  const mainImg = document.getElementById('gallery-main-image');
  const thumbs = document.querySelectorAll('.gallery-thumb-item');

  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const targetSrc = thumb.dataset.fullImg || thumb.querySelector('img')?.src;
      if (targetSrc) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = targetSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }
    });
  });
}

function initSizeSelector() {
  const sizePills = document.querySelectorAll('.detail-size-pill');
  const selectedSizeDisplay = document.getElementById('selected-size-label');

  if (sizePills.length === 0) return;

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      const sizeVal = pill.dataset.size || pill.textContent.trim();
      if (selectedSizeDisplay) {
        selectedSizeDisplay.textContent = sizeVal;
      }
    });
  });
}

function initEnquiryModal() {
  const form = document.getElementById('bike-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof showToast === 'function') {
      showToast('Enquiry sent! A VeloPeak bike specialist will get back to you within 2 hours.', 'success');
    }
    const modalEl = document.getElementById('enquiryModal');
    if (modalEl && window.bootstrap) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    form.reset();
  });
}
