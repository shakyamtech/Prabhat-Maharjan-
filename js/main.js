/**
 * Prabhat Maharjan - Main UI Interactions & Features
 * Handles multi-page navigation, active links, concert countdown,
 * live shows filtering, Instagram lightbox modal, mastering comparison, and UI toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSettingsSync();
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
   SETTINGS SYNCHRONIZATION (CMS STORE -> FRONTEND)
-------------------------------------------------------------------------- */
function initSettingsSync() {
  if (!window.cmsStore || !window.cmsStore.getSettings) return;
  const s = window.cmsStore.getSettings();

  // Sync Instagram links
  if (s.instagramUrl) {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
      a.href = s.instagramUrl;
    });
  }

  // Sync YouTube links
  if (s.youtubeUrl) {
    document.querySelectorAll('a[href*="youtube.com"]').forEach(a => {
      a.href = s.youtubeUrl;
    });
  }

  // Sync WhatsApp links & phone numbers
  if (s.whatsappNumber) {
    const cleanNum = s.whatsappNumber.replace(/[\s\-\+]/g, '');
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      a.href = `https://wa.me/${cleanNum}?text=Hello%20Prabhat%20ji,%20I%20am%20contacting%20you%20from%20your%20website.`;
    });
  }
}

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
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function findNextShow() {
    if (!window.cmsStore || !window.cmsStore.getShows) return null;
    const shows = window.cmsStore.getShows();
    const nowMs = Date.now();
    for (const s of shows) {
      if (!s.date) continue;
      const t = new Date(s.date + 'T19:00:00+05:45').getTime();
      if (t > nowMs) {
        return { targetDate: t, show: s };
      }
    }
    return null;
  }

  let nextInfo = findNextShow();

  function update() {
    const now = Date.now();

    // If no future show or current show just expired, try finding the next upcoming one
    if (!nextInfo || nextInfo.targetDate <= now) {
      nextInfo = findNextShow();
    }

    const cdBadge = document.querySelector('.cd-banner-info .section-tag');
    const cdTitle = document.querySelector('.cd-event-title, .countdown-title');
    const cdMeta = document.querySelector('.cd-event-meta, .countdown-venue');

    if (!nextInfo) {
      // If all shows have passed and none are scheduled
      if (cdBadge) cdBadge.textContent = 'STAY TUNED';
      if (cdTitle) cdTitle.textContent = 'New Concert Tour Dates Announcing Soon';
      if (cdMeta) cdMeta.textContent = 'Follow @maharjan.prabhat on Instagram for upcoming live announcements';
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    // Update banner texts with active upcoming show
    if (cdBadge) cdBadge.textContent = 'NEXT LIVE SHOW';
    if (cdTitle) cdTitle.textContent = nextInfo.show.title;
    if (cdMeta) {
      cdMeta.textContent = `${nextInfo.show.month || 'NOV'} ${nextInfo.show.day || '28'}, ${nextInfo.show.year || '2026'} • ${nextInfo.show.venue || 'Kathmandu, Nepal'}`;
    }

    const distance = nextInfo.targetDate - now;
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
  const showsContainers = document.querySelectorAll('#shows-grid, #shows-list, .shows-list');
  if (showsContainers.length > 0 && window.cmsStore && window.cmsStore.getShows) {
    const shows = window.cmsStore.getShows();
    if (shows && shows.length > 0) {
      const nowMs = Date.now();
      const showsHTML = shows.map(s => {
        const eventTime = s.date ? new Date(s.date + 'T23:59:59+05:45').getTime() : 0;
        const isPast = eventTime > 0 && eventTime < nowMs;

        let badgeClass = 'status-available';
        let badgeText = s.status || 'Tickets Available';
        let buttonText = s.ticketText || 'Reserve Seats';
        let buttonAttr = '';

        if (isPast) {
          badgeClass = 'status-sold';
          badgeText = 'Concert Concluded';
          buttonText = 'Concert Past';
          buttonAttr = 'style="opacity: 0.6; cursor: not-allowed;" disabled';
        } else if (s.status === 'Sold Out') {
          badgeClass = 'status-sold';
          buttonText = 'Sold Out';
          buttonAttr = 'style="opacity: 0.6; cursor: not-allowed;" disabled';
        } else if (s.status === 'Limited Seats' || s.status === 'Selling Fast') {
          badgeClass = 'status-selling';
        }

        return `
        <div class="show-card ${isPast ? 'show-card-past' : ''}" data-category="${s.category || 'concert'}">
          <div class="show-date-badge">
            <span class="show-month">${s.month || 'NOV'}</span>
            <span class="show-day">${s.day || '01'}</span>
            <span class="show-year">${s.year || '2026'}</span>
          </div>
          <div class="show-details">
            <div class="show-status-badge ${badgeClass}">${badgeText}</div>
            <h3 class="show-title">${s.title}</h3>
            <div class="show-venue">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>${s.venue || 'Kathmandu, Nepal'}</span>
            </div>
            <p class="show-desc">${s.description || ''}</p>
          </div>
          <div class="show-actions">
            <button class="btn btn-primary btn-sm btn-ticket" data-show="${s.title} (${s.month} ${s.day}, ${s.year})" ${buttonAttr}>${buttonText}</button>
            <a href="${s.mapUrl || 'https://maps.google.com'}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Venue Map</a>
          </div>
        </div>
      `;
      }).join('');

      showsContainers.forEach(container => {
        container.innerHTML = showsHTML;
      });
    }
  }

  const filterBtns = document.querySelectorAll('.filter-btn[data-filter], .shows-filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;

      const currentShowCards = document.querySelectorAll('.show-card');
      currentShowCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'grid';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Ticket reservation buttons (using event delegation for dynamic cards)
  document.addEventListener('click', (e) => {
    const ticketBtn = e.target.closest('.btn-ticket, .btn-rsvp');
    if (!ticketBtn) return;
    const showTitle = ticketBtn.dataset.show || 'Upcoming Concert';
    showToast(`🎟️ Reserving seats for "${showTitle}"... Redirecting to booking.`);
    setTimeout(() => {
      window.location.href = `booking.html?show=${encodeURIComponent(showTitle)}`;
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   VISUAL GALLERY CATEGORY FILTERING
-------------------------------------------------------------------------- */
function initGalleryFilter() {
  const fullGalleryGrid = document.getElementById('full-gallery-grid');
  if (fullGalleryGrid && window.cmsStore && window.cmsStore.getGallery) {
    const galleryItems = window.cmsStore.getGallery();
    if (galleryItems && galleryItems.length > 0) {
      fullGalleryGrid.innerHTML = galleryItems.map(g => `
        <div class="insta-card" data-category="${g.category}" data-caption="${(g.caption || '').replace(/"/g, '&quot;')}" data-likes="${g.likes || 0}">
          <img src="${g.src}" alt="${(g.caption || '').replace(/"/g, '&quot;')}">
          <div class="insta-overlay">
            <div class="insta-overlay-item">❤️ <span>${g.likes || 0}</span></div>
            <div class="insta-overlay-item">💬 <span>${g.comments || 0}</span></div>
          </div>
        </div>
      `).join('');
    }
  }

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
