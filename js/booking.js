/**
 * VeloPeak Cycles - Service Booking System
 * Validates appointment form, pre-fills package options, presents confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
});

function initBookingForm() {
  const form = document.getElementById('service-booking-form');
  if (!form) return;

  // Pre-fill service from URL if passed (e.g., services.html?package=complete)
  const urlParams = new URLSearchParams(window.location.search);
  const packageParam = urlParams.get('package');
  const serviceSelect = document.getElementById('booking-service-select');
  if (packageParam && serviceSelect) {
    if (packageParam === 'basic') serviceSelect.value = 'Basic Tune-Up ($65)';
    if (packageParam === 'complete') serviceSelect.value = 'Complete Performance Service ($145)';
    if (packageParam === 'full') serviceSelect.value = 'Full Master Workshop Overhaul ($260)';
    if (packageParam === 'custom') serviceSelect.value = 'Custom Individual Repair Diagnostic';
  }

  // Set min date to tomorrow
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate required fields
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!isValid) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all required booking details.', 'error');
      }
      return;
    }

    // Success response
    const name = form.querySelector('[name="full_name"]')?.value || 'Rider';
    const date = form.querySelector('[name="service_date"]')?.value || 'the requested date';
    const time = form.querySelector('[name="service_time"]')?.value || 'morning';

    // Show custom confirmation modal or notification
    if (typeof showToast === 'function') {
      showToast(`Appointment Confirmed for ${name} on ${date} (${time})! Our workshop manager will email your intake confirmation.`, 'success');
    }

    form.reset();
  });
}
