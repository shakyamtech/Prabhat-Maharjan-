/**
 * Prabhat Maharjan - Main UI Interactions & Features
 * Handles multi-page navigation, active links, concert countdown,
 * live shows filtering, Instagram lightbox modal, mastering comparison, and UI toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initConcertCountdown();
  initShowsFilter();
  initGalleryFilter();
  initMasteringSlider();
  initInstagramLightbox();
  initFaqAccordion();
  initContactForm();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   NAVBAR & ACTIVE LINK HIGHLIGHTING
-------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky navbar shadow on scroll
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

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

  // Auto-detect and set active class based on current page filename
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const pagePart = href.split('#')[0];
      if (pagePart === currentPath || (currentPath === 'index.html' && (pagePart === '' || pagePart === 'index.html') && !href.includes('#'))) {
        link.classList.add('active');
      }
    }
  });

  // Active link scroll spy (only for on-page hash links on index.html)
  if (currentPath === 'index.html' || currentPath === '') {
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset + 140;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');
        const targetNav = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (targetNav) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            targetNav.classList.add('active');
          }
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   CONCERT COUNTDOWN TIMER (Kathmandu Acoustic Echoes)
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
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   UPCOMING LIVE SHOWS / GIGS FILTERING & TICKET ACTIONS
-------------------------------------------------------------------------- */
function initShowsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter], .shows-filter-btn');
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

  // Ticket reservation buttons
  const ticketBtns = document.querySelectorAll('.btn-ticket, .btn-rsvp');
  ticketBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const showTitle = btn.dataset.show || 'Upcoming Concert';
      showToast(`🎟️ Reserving seats for "${showTitle}"... Redirecting to booking.`);
      setTimeout(() => {
        window.location.href = `booking.html?show=${encodeURIComponent(showTitle)}`;
      }, 1000);
    });
  });
}

/* --------------------------------------------------------------------------
   VISUAL GALLERY CATEGORY FILTERING
-------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = document.querySelectorAll('#full-gallery-grid .insta-card');

  if (!filterBtns.length || !galleryCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.galleryFilter;

      galleryCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   BEFORE & AFTER MASTERING AUDIO / VISUAL COMPARISON SLIDER
-------------------------------------------------------------------------- */
function initMasteringSlider() {
  const container = document.getElementById('split-container');
  const overlay = document.getElementById('split-overlay');
  const divider = document.getElementById('split-divider');
  const toggleBtn = document.getElementById('ab-toggle-btn');
  const modeLabel = document.getElementById('ab-current-mode');

  if (!container || !overlay || !divider) return;

  let isDragging = false;

  function setSplitPosition(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    overlay.style.width = `${clamped}%`;
    divider.style.left = `${clamped}%`;
  }

  function handleMove(clientX) {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSplitPosition(percent);
  }

  divider.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) handleMove(e.clientX);
  });

  // Touch support for mobile devices
  divider.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
  }, { passive: true });

  // Instant A/B Toggle Button
  if (toggleBtn && modeLabel) {
    let isMastered = true;
    toggleBtn.addEventListener('click', () => {
      isMastered = !isMastered;
      if (isMastered) {
        setSplitPosition(100);
        modeLabel.textContent = 'MASTERED';
        modeLabel.style.color = 'var(--accent-gold)';
        showToast('🔊 Switched to Analog Mastered Chain (SSL + Neve Tape)');
      } else {
        setSplitPosition(0);
        modeLabel.textContent = 'ROUGH MIX';
        modeLabel.style.color = '#ef4444';
        showToast('🔉 Switched to Before: Raw Flat Mix');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   INSTAGRAM FEED LIGHTBOX MODAL
-------------------------------------------------------------------------- */
function initInstagramLightbox() {
  const instaItems = document.querySelectorAll('.insta-card');
  const modal = document.getElementById('lightbox-modal') || document.getElementById('insta-lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalLikes = document.getElementById('lightbox-likes');
  const closeBtn = document.getElementById('lightbox-close') || document.getElementById('close-insta-modal');
  const backdrop = document.getElementById('lightbox-backdrop');

  if (!modal || !modalImg) return;

  instaItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const imgSrc = img.src;
      const caption = item.dataset.caption || img.alt || 'Prabhat Maharjan in Kathmandu.';
      const likes = item.dataset.likes || '540';

      modalImg.src = imgSrc;
      if (modalCaption) modalCaption.textContent = caption;
      if (modalLikes) modalLikes.textContent = `❤️ ${likes} likes`;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
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
        q.setAttribute('aria-expanded', 'true');
      } else {
        q.setAttribute('aria-expanded', 'false');
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
    const nameInput = form.querySelector('[name="name"]');
    const name = nameInput ? nameInput.value : 'Friend';

    showToast(`Thank you ${name}! Your inquiry has been sent to Prabhat Maharjan.`);
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
    <button class="toast-close" aria-label="Close alert">&times;</button>
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
    rootMargin: '0px 0px -40px 0px'
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
