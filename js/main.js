/**
 * Prabhat Maharjan - Main UI Interactions & Features
 * Handles navigation, concert countdown, live shows filtering,
 * Instagram feed lightbox, mastering comparison slider, and UI toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initConcertCountdown();
  initShowsFilter();
  initMasteringSlider();
  initInstagramLightbox();
  initFaqAccordion();
  initContactForm();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   NAVBAR & MOBILE MENU
-------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   CONCERT COUNTDOWN TIMER (Kathmandu Acoustic Echoes - Nov 18, 2026)
-------------------------------------------------------------------------- */
function initConcertCountdown() {
  const targetDate = new Date('2026-11-18T20:00:00+05:45').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   UPCOMING LIVE SHOWS / GIGS FILTERING & RSVP
-------------------------------------------------------------------------- */
function initShowsFilter() {
  const filterBtns = document.querySelectorAll('.shows-filter-btn');
  const showCards = document.querySelectorAll('.show-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;

      showCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'grid';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // RSVP / Remind Me modal or triggers
  const rsvpBtns = document.querySelectorAll('.btn-rsvp');
  rsvpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const showTitle = btn.dataset.show || 'Upcoming Show';
      const venue = btn.dataset.venue || 'Kathmandu';
      showToast(`🎟️ RSVP Recorded for "${showTitle}" at ${venue}! We'll send you a reminder.`);
      btn.textContent = 'RSVP Confirmed ✓';
      btn.classList.add('confirmed');
    });
  });
}

/* --------------------------------------------------------------------------
   BEFORE & AFTER MASTERING AUDIO / VISUAL COMPARISON SLIDER
-------------------------------------------------------------------------- */
function initMasteringSlider() {
  const slider = document.getElementById('mastering-slider-range');
  const afterLayer = document.getElementById('mastering-after-layer');
  const handle = document.getElementById('slider-handle');

  if (!slider || !afterLayer) return;

  function updatePosition(val) {
    afterLayer.style.width = `${val}%`;
    if (handle) handle.style.left = `${val}%`;

    // Also trigger audio engine mastering intensity if playing
    if (window.artistAudio) {
      if (val > 50) {
        window.artistAudio.setMasteringMode(true);
      } else {
        window.artistAudio.setMasteringMode(false);
      }
    }
  }

  slider.addEventListener('input', (e) => {
    updatePosition(e.target.value);
  });
}

/* --------------------------------------------------------------------------
   INSTAGRAM FEED LIGHTBOX MODAL
-------------------------------------------------------------------------- */
function initInstagramLightbox() {
  const instaItems = document.querySelectorAll('.insta-card');
  const modal = document.getElementById('insta-lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalLikes = document.getElementById('lightbox-likes');
  const modalLink = document.getElementById('lightbox-insta-link');
  const closeBtn = document.getElementById('close-insta-modal');

  if (!modal) return;

  instaItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const caption = item.dataset.caption || 'Live from Kathmandu music studio.';
      const likes = item.dataset.likes || '482';

      modalImg.src = imgSrc;
      modalCaption.textContent = caption;
      modalLikes.textContent = `${likes} likes`;
      modalLink.href = 'https://www.instagram.com/maharjan.prabhat/';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   FAQ ACCORDION
-------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   CONTACT FORM SUBMISSION
-------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('general-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const msg = form.querySelector('[name="message"]').value;

    showToast(`Thank you ${name}! Your inquiry has been sent to Prabhat.`);
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPER
-------------------------------------------------------------------------- */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;

  toast.querySelector('.toast-close').onclick = () => {
    toast.remove();
  };

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATIONS
-------------------------------------------------------------------------- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
