/**
 * VeloPeak Cycles - Interactive Bike Finder
 * 3-step guided selection returning tailored bike categories & models
 */

document.addEventListener('DOMContentLoaded', () => {
  initBikeFinder();
});

function initBikeFinder() {
  const finderForm = document.getElementById('bike-finder-form');
  if (!finderForm) return;

  const steps = finderForm.querySelectorAll('.finder-step');
  const nextBtns = finderForm.querySelectorAll('.finder-next-btn');
  const prevBtns = finderForm.querySelectorAll('.finder-prev-btn');
  const resultCard = document.getElementById('bike-finder-result');
  const stepIndicators = document.querySelectorAll('.finder-step-dot');

  let currentStep = 1;
  const userAnswers = {
    terrain: 'roads',
    priority: 'speed',
    experience: 'intermediate'
  };

  // Option selection
  finderForm.querySelectorAll('.finder-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.finder-options-grid');
      parent.querySelectorAll('.finder-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const field = btn.dataset.field;
      const value = btn.dataset.value;
      if (field && value) {
        userAnswers[field] = value;
      }
    });
  });

  // Next Step
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep < steps.length) {
        currentStep++;
        updateSteps();
      } else {
        // Calculate recommendation
        showRecommendation();
      }
    });
  });

  // Prev Step
  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateSteps();
      }
    });
  });

  function updateSteps() {
    steps.forEach((step, idx) => {
      if (idx + 1 === currentStep) {
        step.classList.remove('d-none');
        step.classList.add('fade-in');
      } else {
        step.classList.add('d-none');
      }
    });

    stepIndicators.forEach((dot, idx) => {
      const isCurrent = idx + 1 === currentStep;
      dot.classList.toggle('active', isCurrent);
      dot.classList.toggle('bg-primary', isCurrent);
      dot.classList.toggle('bg-secondary', !isCurrent);

      if (isCurrent) {
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    if (resultCard) {
      resultCard.classList.add('d-none');
    }
  }

  updateSteps();

  function showRecommendation() {
    steps.forEach(s => s.classList.add('d-none'));
    if (!resultCard) return;

    let category = 'Road Bikes';
    let title = 'Apex R1 Performance Road Series';
    let desc = 'Engineered for smooth tarmac, climbing efficiency and aerodynamics. The perfect companion for endurance miles and fast road rides.';
    let link = 'bikes.html?type=road';
    let image = 'assets/images/bikes/road-apex-r1.jpg';

    if (userAnswers.priority === 'electric' || userAnswers.terrain === 'city' && userAnswers.priority === 'comfort') {
      category = 'Electric Commuter Bikes';
      title = 'VoltRide E2 Urban Mobility Series';
      desc = 'Effortless hill climbs, extended 85km battery range and integrated smart lighting. Designed to turn daily traffic into smooth cruising.';
      link = 'bikes.html?type=electric';
      image = 'assets/images/bikes/ebike-voltride.jpg';
    } else if (userAnswers.terrain === 'trails' || userAnswers.priority === 'offroad') {
      category = 'Mountain & Trail Bikes';
      title = 'Summit X7 Trail Series';
      desc = 'Rugged suspension, aggressive grip and dropper-post ready geometry for navigating steep drops, roots and rocky singletracks.';
      link = 'bikes.html?type=mountain';
      image = 'assets/images/bikes/mtb-summit-x7.jpg';
    } else if (userAnswers.terrain === 'mixed' || userAnswers.terrain === 'city') {
      category = 'Hybrid & Commuter Bikes';
      title = 'MetroFlow 3 All-Road Hybrid';
      desc = 'The ultimate balance of road speed and all-weather versatility with ergonomic flat bars and puncture-resistant tires.';
      link = 'bikes.html?type=hybrid';
      image = 'assets/images/bikes/hybrid-metroflow.jpg';
    } else if (userAnswers.terrain === 'family') {
      category = 'Kids & Family Bikes';
      title = 'Junior Trail 24 & Recreation Series';
      desc = 'Lightweight aluminum construction, dialed youth-specific reach and reliable safety disc brakes for growing adventurers.';
      link = 'bikes.html?type=kids';
      image = 'assets/images/bikes/kids-trail-24.jpg';
    }

    resultCard.innerHTML = `
      <div class="row align-items-center g-4">
        <div class="col-lg-5">
          <img src="${image}" alt="${title}" class="img-fluid rounded-3 shadow-sm" style="height: 240px; width: 100%; object-fit: contain; object-position: center; padding: 12px; background: var(--bg-secondary);">
        </div>
        <div class="col-lg-7">
          <div class="badge-custom badge-primary mb-2">${category} Match</div>
          <h3 class="mb-2">${title}</h3>
          <p class="text-body mb-3">${desc}</p>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <span class="badge bg-light text-dark border"><i class="bi bi-geo-alt text-primary"></i> ${userAnswers.terrain.toUpperCase()}</span>
            <span class="badge bg-light text-dark border"><i class="bi bi-lightning text-primary"></i> ${userAnswers.priority.toUpperCase()}</span>
            <span class="badge bg-light text-dark border"><i class="bi bi-person text-primary"></i> ${userAnswers.experience.toUpperCase()}</span>
          </div>
          <div class="d-flex gap-3">
            <a href="${link}" class="btn-custom btn-primary-custom">Explore ${category}</a>
            <button type="button" class="btn-custom btn-secondary-custom" id="finder-restart-btn">Retake Quiz</button>
          </div>
        </div>
      </div>
    `;

    resultCard.classList.remove('d-none');
    resultCard.classList.add('fade-in');

    const restartBtn = document.getElementById('finder-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        currentStep = 1;
        updateSteps();
      });
    }
  }
}
