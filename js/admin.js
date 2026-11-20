/**
 * Prabhat Maharjan Portfolio - Admin Panel Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.cmsStore;

  // DOM Elements
  const authScreen = document.getElementById('auth-screen');
  const adminApp = document.getElementById('admin-app');
  const authForm = document.getElementById('auth-form');
  const adminPinInput = document.getElementById('admin-pin-input');
  const btnLogout = document.getElementById('btn-logout');

  // KPI elements
  const kpiBookings = document.getElementById('kpi-bookings-count');
  const kpiPending = document.getElementById('kpi-pending-count');
  const kpiShows = document.getElementById('kpi-shows-count');
  const kpiTracks = document.getElementById('kpi-tracks-count');
  const kpiGallery = document.getElementById('kpi-gallery-count');

  // Toast
  const toast = document.getElementById('admin-toast');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(message, type = 'success') {
    toastMsg.textContent = message;
    toast.style.borderColor = type === 'error' ? 'var(--admin-red)' : 'var(--admin-gold)';
    toast.style.display = 'flex';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Auth Handling
  function checkAuth() {
    if (store.isLoggedIn()) {
      authScreen.style.display = 'none';
      adminApp.style.display = 'flex';
      loadDashboard();
    } else {
      authScreen.style.display = 'flex';
      adminApp.style.display = 'none';
    }
  }

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = adminPinInput.value.trim();
    if (store.login(pin)) {
      adminPinInput.value = '';
      checkAuth();
      showToast('Welcome back, Prabhat ji! Studio CMS unlocked.');
    } else {
      showToast('Invalid PIN / Password. Please try again.', 'error');
      adminPinInput.classList.add('error');
      setTimeout(() => adminPinInput.classList.remove('error'), 1000);
    }
  });

  // Eye toggle for password visibility
  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  if (btnTogglePwd) {
    btnTogglePwd.addEventListener('click', () => {
      const type = adminPinInput.getAttribute('type') === 'password' ? 'text' : 'password';
      adminPinInput.setAttribute('type', type);
      btnTogglePwd.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Forgot Password Recovery Handler
  const btnForgotPwd = document.getElementById('btn-forgot-pwd');
  if (btnForgotPwd) {
    btnForgotPwd.addEventListener('click', (e) => {
      e.preventDefault();
      const recoveryInput = prompt(
        "🔐 Studio Password Recovery\n\nPlease enter Prabhat's registered studio email (prabhatmaharjan97@gmail.com) or phone number (9840515079) to reset the password:"
      );
      if (!recoveryInput) return;

      const cleanInput = recoveryInput.trim().toLowerCase().replace(/[\s\-\+]/g, '');
      const validEmail = 'prabhatmaharjan97@gmail.com';
      const validPhone = '9840515079';
      const validPhoneInt = '9779840515079';

      if (cleanInput === validEmail || cleanInput === validPhone || cleanInput === validPhoneInt) {
        const settings = store.getSettings();
        settings.adminPin = 'studio@2026';
        store.saveSettings(settings);
        alert("✅ Security Verification Successful!\n\nYour Admin Password has been reset to default: studio@2026\nYou can now log in and set a custom password anytime from Studio Settings.");
        adminPinInput.value = 'studio@2026';
        adminPinInput.focus();
      } else {
        alert("❌ Verification Failed!\n\nThe credentials entered do not match Prabhat Maharjan's studio records.\nPlease check the number/email or contact directly.");
      }
    });
  }

  btnLogout.addEventListener('click', () => {
    store.logout();
    checkAuth();
    showToast('Logged out of Studio CMS.');
  });

  // Tabs & Sidebar Navigation
  const navItems = document.querySelectorAll('.sidebar-nav-item, .cms-tab-btn');
  const tabPanes = document.querySelectorAll('.cms-pane');
  const currentTabTitle = document.getElementById('current-tab-title');
  const sidebarPendingBadge = document.getElementById('sidebar-pending-badge');

  // Mobile Sidebar Elements
  const sidebar = document.getElementById('admin-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Tab Switching
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      navItems.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      // Update Topbar Title
      const navTextEl = btn.querySelector('.nav-text');
      if (currentTabTitle && navTextEl) {
        currentTabTitle.textContent = navTextEl.textContent.trim();
      }

      // Close mobile drawer after selection
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Modal Handlers
  function setupModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.btn-close-modal');

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modals.forEach(m => m.classList.remove('open'));
      });
    });

    modals.forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('open');
      });
    });

    document.getElementById('btn-add-booking-modal').addEventListener('click', () => {
      document.getElementById('modal-booking').classList.add('open');
    });

    document.getElementById('btn-add-show-modal').addEventListener('click', () => {
      document.getElementById('modal-show').classList.add('open');
    });

    document.getElementById('btn-add-track-modal').addEventListener('click', () => {
      document.getElementById('modal-track').classList.add('open');
    });

    document.getElementById('btn-add-photo-modal').addEventListener('click', () => {
      document.getElementById('modal-photo').classList.add('open');
    });
  }

  // Dashboard Loader
  function loadDashboard() {
    updateKPIs();
    renderBookings();
    renderShows();
    renderTracks();
    renderGallery();
    loadSettings();
  }

  function updateKPIs() {
    const bookings = store.getBookings();
    const pending = bookings.filter(b => b.status === 'Pending').length;
    kpiBookings.textContent = bookings.length;
    kpiPending.textContent = `${pending} pending`;

    if (sidebarPendingBadge) {
      sidebarPendingBadge.textContent = pending;
      sidebarPendingBadge.style.display = pending > 0 ? 'inline-block' : 'none';
    }

    kpiShows.textContent = store.getShows().length;
    kpiTracks.textContent = store.getTracks().length;
    kpiGallery.textContent = store.getGallery().length;
  }

  // 1. BOOKINGS CRM
  function renderBookings() {
    const tbody = document.getElementById('bookings-table-body');
    const searchVal = (document.getElementById('bookings-search-input').value || '').toLowerCase();
    const statusVal = document.getElementById('bookings-status-filter').value;
    const settings = store.getSettings();

    let bookings = store.getBookings();

    if (statusVal !== 'all') {
      bookings = bookings.filter(b => b.status === statusVal);
    }

    if (searchVal) {
      bookings = bookings.filter(b => 
        (b.clientName && b.clientName.toLowerCase().includes(searchVal)) ||
        (b.service && b.service.toLowerCase().includes(searchVal)) ||
        (b.phone && b.phone.includes(searchVal)) ||
        (b.id && b.id.toLowerCase().includes(searchVal))
      );
    }

    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 30px;">No bookings match your filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = bookings.map(b => {
      const statusClass = b.status === 'Confirmed' ? 'badge-confirmed' :
                          b.status === 'Completed' ? 'badge-completed' :
                          b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending';

      const waText = encodeURIComponent(
        `Namaste ${b.clientName}! 🎵\nThis is Prabhat Maharjan from Sound Studio Kathmandu regarding your appointment for ${b.service} (Ref: ${b.id}) on ${b.date}. Your session is confirmed!`
      );
      const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');

      return `
        <tr>
          <td>
            <strong style="color: var(--admin-gold); font-family: monospace;">${b.id || 'N/A'}</strong><br>
            <small style="color: #64748b;">${b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}</small>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${b.clientName || 'Anonymous'}</div>
            <div style="color: #94a3b8; font-size: 0.8rem;">${b.phone || ''}</div>
            <div style="color: #64748b; font-size: 0.75rem;">${b.email || ''}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: #e2e8f0;">${b.service || 'Studio Session'}</span>
          </td>
          <td>
            <div style="color: #fff; font-weight: 600;">${b.date || 'Flexible'}</div>
            <div style="color: #94a3b8; font-size: 0.8rem;">${b.timeSlot || ''}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: #cbd5e1;">${b.location || 'Studio'}</div>
            <div style="font-size: 0.75rem; color: #64748b; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${b.notes || ''}">
              ${b.notes || 'No notes provided'}
            </div>
          </td>
          <td>
            <select class="status-select ${statusClass}" onchange="updateBookingStatus('${b.id}', this.value)">
              <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              ${cleanPhone ? `
                <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="padding: 6px 10px; font-size: 0.75rem;" title="Message Client on WhatsApp">
                  💬 WhatsApp
                </a>
              ` : ''}
              <button onclick="deleteBooking('${b.id}')" class="btn btn-secondary btn-sm" style="padding: 6px 8px; color: #ef4444;" title="Delete Booking">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.updateBookingStatus = (id, newStatus) => {
    store.updateBookingStatus(id, newStatus);
    updateKPIs();
    renderBookings();
    showToast(`Booking ${id} marked as ${newStatus}`);
  };

  window.deleteBooking = (id) => {
    if (confirm(`Are you sure you want to delete booking ${id}?`)) {
      store.deleteBooking(id);
      updateKPIs();
      renderBookings();
      showToast('Booking deleted.');
    }
  };

  document.getElementById('bookings-search-input').addEventListener('input', renderBookings);
  document.getElementById('bookings-status-filter').addEventListener('change', renderBookings);

  document.getElementById('btn-export-csv').addEventListener('click', () => {
    if (store.exportBookingsCsv()) {
      showToast('Bookings CSV downloaded successfully.');
    } else {
      showToast('No bookings to export.', 'error');
    }
  });

  document.getElementById('form-add-booking').addEventListener('submit', (e) => {
    e.preventDefault();
    const newBooking = {
      id: `PRABHAT-${Math.floor(10000 + Math.random() * 90000)}`,
      clientName: document.getElementById('mb-name').value.trim(),
      phone: document.getElementById('mb-phone').value.trim(),
      email: document.getElementById('mb-email').value.trim(),
      service: document.getElementById('mb-service').value,
      date: document.getElementById('mb-date').value,
      timeSlot: document.getElementById('mb-slot').value.trim(),
      notes: document.getElementById('mb-notes').value.trim(),
      location: 'In-Studio (Sound Studio, Patan)',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    store.addBooking(newBooking);
    document.getElementById('modal-booking').classList.remove('open');
    document.getElementById('form-add-booking').reset();
    updateKPIs();
    renderBookings();
    showToast('Manual booking created successfully.');
  });

  // 2. SHOWS & CONCERTS
  function renderShows() {
    const grid = document.getElementById('shows-items-grid');
    const shows = store.getShows();

    grid.innerHTML = shows.map(s => {
      return `
        <div class="item-card">
          <div class="item-card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span class="badge-status badge-pending" style="text-transform: uppercase;">${s.categoryLabel || s.category}</span>
              <span class="badge-status ${s.status === 'Sold Out' ? 'badge-cancelled' : 'badge-confirmed'}">${s.status}</span>
            </div>
            <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 8px;">${s.title}</h4>
            <div style="color: var(--admin-gold); font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
              📅 ${s.month || ''} ${s.day || ''}, ${s.year || ''} • ⏰ ${s.time || ''}
            </div>
            <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 12px;">
              📍 ${s.venue}
            </div>
            <p style="color: #64748b; font-size: 0.8rem; line-height: 1.4;">${s.description || ''}</p>
          </div>
          <div class="item-card-footer">
            <a href="shows.html" target="_blank" style="color: var(--admin-gold); font-size: 0.8rem; text-decoration: none;">View on Shows Page ↗</a>
            <button onclick="deleteShow('${s.id}')" class="btn btn-secondary btn-sm" style="color: #ef4444; padding: 4px 10px;">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.deleteShow = (id) => {
    if (confirm('Delete this show from the schedule?')) {
      store.deleteShow(id);
      updateKPIs();
      renderShows();
      showToast('Show deleted.');
    }
  };

  document.getElementById('form-add-show').addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = document.getElementById('show-date').value;
    const dateObj = new Date(dateInput);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const newShow = {
      id: `show-${Date.now()}`,
      title: document.getElementById('show-title').value.trim(),
      date: dateInput,
      month: months[dateObj.getMonth()],
      day: String(dateObj.getDate()).padStart(2, '0'),
      year: String(dateObj.getFullYear()),
      time: document.getElementById('show-time').value.trim(),
      venue: document.getElementById('show-venue').value.trim(),
      category: document.getElementById('show-category').value,
      categoryLabel: document.getElementById('show-category').selectedOptions[0].text,
      status: document.getElementById('show-status').value,
      description: document.getElementById('show-desc').value.trim(),
      ticketText: 'Reserve Seats',
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(document.getElementById('show-venue').value)}`
    };

    store.addShow(newShow);
    document.getElementById('modal-show').classList.remove('open');
    document.getElementById('form-add-show').reset();
    updateKPIs();
    renderShows();
    showToast('New live show added to schedule.');
  });

  // 3. TRACKS MANAGER
  function renderTracks() {
    const grid = document.getElementById('tracks-items-grid');
    const tracks = store.getTracks();

    grid.innerHTML = tracks.map(t => {
      return `
        <div class="item-card">
          <div style="height: 140px; overflow: hidden; position: relative;">
            <img src="${t.cover || 'assets/images/hero-artist.jpg'}" alt="${t.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; color: #fff;">
              ${t.audioUrl ? '🎵 Real Audio' : '🎼 Synthesized'} • ⏱ ${t.duration || '03:30'}
            </div>
          </div>
          <div class="item-card-body">
            <span class="badge-status badge-confirmed" style="margin-bottom: 8px; font-size: 0.7rem;">${t.category}</span>
            <h4 style="color: #fff; font-size: 1.05rem; margin-bottom: 6px;">${t.title}</h4>
            <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 8px;">Key: ${t.key || 'N/A'} • ${t.bpm ? t.bpm + ' BPM' : ''}</div>
            <p style="color: #64748b; font-size: 0.8rem; line-height: 1.4;">${t.description || ''}</p>
          </div>
          <div class="item-card-footer" style="display: flex; gap: 6px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <button onclick="triggerAudioReplace('${t.id}')" class="btn btn-primary btn-sm" id="btn-rep-${t.id}" style="padding: 5px 10px; font-size: 0.76rem; background: ${t.audioUrl ? '#059669' : '#d97706'}; border: none; font-weight: 600;">
                🎵 ${t.audioUrl ? 'Change Audio' : 'Upload Audio'}
              </button>
              <button onclick="triggerCoverReplace('${t.id}')" class="btn btn-secondary btn-sm" id="btn-cov-${t.id}" style="padding: 5px 10px; font-size: 0.76rem; border: 1px solid var(--admin-border);" title="Browse & Change Album Cover">
                🖼️ Cover
              </button>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a href="index.html#audio-player" target="_blank" style="color: var(--admin-gold); font-size: 0.8rem; text-decoration: none;">Test ↗</a>
              <button onclick="deleteTrack('${t.id}')" class="btn btn-secondary btn-sm" style="color: #ef4444; padding: 4px 8px;">✕</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.deleteTrack = (id) => {
    if (confirm('Remove this track from the playlist?')) {
      store.deleteTrack(id);
      updateKPIs();
      renderTracks();
      showToast('Track removed from playlist.');
    }
  };

  // 1-Click Replace Audio directly on any existing track
  let replaceTargetTrackId = null;
  const replaceAudioInput = document.createElement('input');
  replaceAudioInput.type = 'file';
  replaceAudioInput.accept = '.mp3,.wav,.ogg,audio/*';
  replaceAudioInput.style.display = 'none';
  document.body.appendChild(replaceAudioInput);

  window.triggerAudioReplace = (trackId) => {
    if (!window.FIREBASE_READY) {
      alert('Firebase Storage is not configured. Please verify js/firebase-config.js');
      return;
    }
    replaceTargetTrackId = trackId;
    replaceAudioInput.value = '';
    replaceAudioInput.click();
  };

  replaceAudioInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !replaceTargetTrackId) return;

    const trackId = replaceTargetTrackId;
    const btn = document.getElementById(`btn-rep-${trackId}`);
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Uploading 0%...';
    }
    showToast(`Uploading audio for track (${file.name})...`);

    try {
      const audioUrl = await window.uploadAudioToFirebase(file, trackId, (pct) => {
        if (btn) btn.textContent = `⏳ ${pct}%`;
      });
      store.updateTrack(trackId, { audioUrl });
      renderTracks();
      showToast('🎵 Audio replaced successfully! Test in player.');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🎵 Upload Audio';
      }
    }
  });

  // 1-Click Replace Cover Art directly on any existing track
  let replaceTargetCoverTrackId = null;
  const replaceCoverInput = document.createElement('input');
  replaceCoverInput.type = 'file';
  replaceCoverInput.accept = 'image/png,image/jpeg,image/jpg,image/webp';
  replaceCoverInput.style.display = 'none';
  document.body.appendChild(replaceCoverInput);

  window.triggerCoverReplace = (trackId) => {
    replaceTargetCoverTrackId = trackId;
    replaceCoverInput.value = '';
    replaceCoverInput.click();
  };

  replaceCoverInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !replaceTargetCoverTrackId) return;

    const trackId = replaceTargetCoverTrackId;
    const btn = document.getElementById(`btn-cov-${trackId}`);
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Uploading...';
    }
    showToast(`Uploading cover image for track...`);

    try {
      let coverUrl = '';
      if (window.FIREBASE_READY && window.uploadCoverToFirebase) {
        coverUrl = await window.uploadCoverToFirebase(file, trackId);
      } else {
        coverUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      }
      store.updateTrack(trackId, { cover: coverUrl });
      renderTracks();
      showToast('🖼️ Cover art updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Cover upload failed: ' + err.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🖼️ Cover';
      }
    }
  });

  // Modal Track: Audio file select feedback
  const trackAudioFileInput = document.getElementById('track-audio-file');
  const trackAudioFilename = document.getElementById('track-audio-filename');
  if (trackAudioFileInput) {
    trackAudioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && trackAudioFilename) {
        trackAudioFilename.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
        trackAudioFilename.style.color = '#22c55e';
      }
    });
  }

  // Modal Track: Cover Art Local Browse & Auto-Upload
  const trackCoverFileInput = document.getElementById('track-cover-file');
  const trackCoverPreview = document.getElementById('track-cover-preview');
  const trackCoverStatus = document.getElementById('track-cover-status');
  const trackCoverInput = document.getElementById('track-cover');

  if (trackCoverFileInput) {
    trackCoverFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // 1. Instant local preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (trackCoverPreview) trackCoverPreview.src = ev.target.result;
        if (trackCoverInput) trackCoverInput.value = ev.target.result;
      };
      reader.readAsDataURL(file);

      // 2. Upload to Firebase Cloud Storage if connected
      if (window.FIREBASE_READY && window.uploadCoverToFirebase) {
        if (trackCoverStatus) {
          trackCoverStatus.textContent = '⏳ Uploading cover...';
          trackCoverStatus.style.color = 'var(--admin-gold)';
        }
        try {
          const cloudUrl = await window.uploadCoverToFirebase(file, `cover_${Date.now()}`);
          if (trackCoverInput) trackCoverInput.value = cloudUrl;
          if (trackCoverStatus) {
            trackCoverStatus.textContent = '🟢 Cloud cover saved!';
            trackCoverStatus.style.color = '#22c55e';
          }
          showToast('Cover art uploaded to Cloud Storage!');
        } catch (err) {
          console.warn('Cover upload fallback:', err);
          if (trackCoverStatus) {
            trackCoverStatus.textContent = '🟡 Local preview saved';
            trackCoverStatus.style.color = '#eab308';
          }
        }
      } else {
        if (trackCoverStatus) {
          trackCoverStatus.textContent = '🟢 Local image selected';
          trackCoverStatus.style.color = '#22c55e';
        }
      }
    });
  }

  // Form: Add New Track Submit
  document.getElementById('form-add-track').addEventListener('submit', async (e) => {
    e.preventDefault();
    const trackId = `track-${Date.now()}`;
    const saveBtn = document.getElementById('btn-save-track');
    const audioFile = trackAudioFileInput && trackAudioFileInput.files[0];
    const progressWrap = document.getElementById('modal-audio-progress-wrap');
    const progressBar = document.getElementById('modal-audio-progress-bar');
    const progressPct = document.getElementById('modal-audio-pct');

    let audioUrl = '';

    // Upload audio file if selected
    if (audioFile) {
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Uploading Audio...';
      }
      if (progressWrap) progressWrap.style.display = 'block';

      try {
        if (window.FIREBASE_READY && window.uploadAudioToFirebase) {
          audioUrl = await window.uploadAudioToFirebase(audioFile, trackId, (pct) => {
            if (progressBar) progressBar.style.width = pct + '%';
            if (progressPct) progressPct.textContent = pct + '%';
          });
        }
      } catch (err) {
        console.error('Audio upload error:', err);
        alert('Audio upload failed: ' + err.message);
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Track';
        }
        return;
      }
    }

    // Parse duration to seconds
    const durStr = document.getElementById('track-duration').value.trim();
    const durParts = durStr.split(':');
    const durationSec = durParts.length === 2 ? parseInt(durParts[0]) * 60 + parseInt(durParts[1]) : 210;

    const newTrack = {
      id: trackId,
      title: document.getElementById('track-title').value.trim(),
      category: document.getElementById('track-category').value.trim(),
      duration: durStr,
      durationSec,
      key: document.getElementById('track-key').value.trim(),
      bpm: 80,
      cover: document.getElementById('track-cover').value.trim() || 'assets/images/hero-artist.jpg',
      description: document.getElementById('track-desc').value.trim(),
      style: 'guitar-vocal',
      ...(audioUrl && { audioUrl })
    };

    store.addTrack(newTrack);
    document.getElementById('modal-track').classList.remove('open');
    document.getElementById('form-add-track').reset();
    if (trackAudioFileInput) trackAudioFileInput.value = '';
    if (trackCoverFileInput) trackCoverFileInput.value = '';
    if (trackAudioFilename) {
      trackAudioFilename.textContent = 'Optional — select MP3 file from device';
      trackAudioFilename.style.color = '#94a3b8';
    }
    if (trackCoverStatus) {
      trackCoverStatus.textContent = 'Choose image from device';
      trackCoverStatus.style.color = '#94a3b8';
    }
    if (trackCoverPreview) trackCoverPreview.src = 'assets/images/hero-artist.jpg';
    if (progressWrap) progressWrap.style.display = 'none';
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Track';
    }

    updateKPIs();
    renderTracks();
    showToast(audioUrl ? '🎵 Track & Audio uploaded successfully!' : 'New audio track added.');
  });

  // Modal Gallery Photo: Local Browse & Upload
  const photoFileInput = document.getElementById('photo-file-input');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const photoPlaceholder = document.getElementById('photo-preview-placeholder');
  const photoUploadStatus = document.getElementById('photo-upload-status');
  const photoSrcInput = document.getElementById('photo-src');

  if (photoFileInput) {
    photoFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // 1. Instant local preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (photoPreviewImg) {
          photoPreviewImg.src = ev.target.result;
          photoPreviewImg.style.display = 'block';
        }
        if (photoPlaceholder) photoPlaceholder.style.display = 'none';
        if (photoSrcInput) photoSrcInput.value = ev.target.result;
      };
      reader.readAsDataURL(file);

      // 2. Upload to Firebase Storage if available
      if (window.FIREBASE_READY && window.uploadCoverToFirebase) {
        if (photoUploadStatus) {
          photoUploadStatus.textContent = '⏳ Uploading to cloud...';
          photoUploadStatus.style.color = 'var(--admin-gold)';
        }
        try {
          const cloudUrl = await window.uploadCoverToFirebase(file, `gallery_${Date.now()}`);
          if (photoSrcInput) photoSrcInput.value = cloudUrl;
          if (photoUploadStatus) {
            photoUploadStatus.textContent = '🟢 Cloud photo saved!';
            photoUploadStatus.style.color = '#22c55e';
          }
          showToast('Gallery photo uploaded to Cloud Storage!');
        } catch (err) {
          console.warn('Gallery upload fallback:', err);
          if (photoUploadStatus) {
            photoUploadStatus.textContent = '🟡 Local preview saved';
            photoUploadStatus.style.color = '#eab308';
          }
        }
      } else {
        if (photoUploadStatus) {
          photoUploadStatus.textContent = '🟢 Local image selected';
          photoUploadStatus.style.color = '#22c55e';
        }
      }
    });
  }

  // 4. GALLERY MANAGER
  function renderGallery() {
    const grid = document.getElementById('gallery-items-grid');
    const items = store.getGallery();

    grid.innerHTML = items.map(g => {
      return `
        <div class="item-card">
          <div style="height: 180px; overflow: hidden; position: relative;">
            <img src="${g.src}" alt="${g.caption}" style="width: 100%; height: 100%; object-fit: cover;">
            <span class="badge-status badge-pending" style="position: absolute; top: 10px; left: 10px; text-transform: uppercase;">
              ${g.category}
            </span>
          </div>
          <div class="item-card-body">
            <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.4; margin-bottom: 10px;">${g.caption}</p>
            <div style="color: #64748b; font-size: 0.8rem;">❤️ ${g.likes || 0} Likes</div>
          </div>
          <div class="item-card-footer">
            <a href="gallery.html" target="_blank" style="color: var(--admin-gold); font-size: 0.8rem; text-decoration: none;">View in Gallery ↗</a>
            <button onclick="deleteGalleryPhoto('${g.id}')" class="btn btn-secondary btn-sm" style="color: #ef4444; padding: 4px 10px;">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.deleteGalleryPhoto = (id) => {
    if (confirm('Delete this photo from the gallery?')) {
      store.deletePhoto(id);
      updateKPIs();
      renderGallery();
      showToast('Photo removed from gallery.');
    }
  };

  document.getElementById('form-add-photo').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPhoto = {
      id: `gal-${Date.now()}`,
      src: document.getElementById('photo-src').value.trim(),
      category: document.getElementById('photo-category').value,
      caption: document.getElementById('photo-caption').value.trim(),
      likes: Math.floor(100 + Math.random() * 400),
      comments: Math.floor(10 + Math.random() * 50)
    };

    store.addPhoto(newPhoto);
    document.getElementById('modal-photo').classList.remove('open');
    document.getElementById('form-add-photo').reset();
    if (photoPreviewImg) { photoPreviewImg.src = ''; photoPreviewImg.style.display = 'none'; }
    if (photoPlaceholder) photoPlaceholder.style.display = 'block';
    if (photoUploadStatus) { photoUploadStatus.textContent = 'Choose image from device'; photoUploadStatus.style.color = '#94a3b8'; }
    if (photoFileInput) photoFileInput.value = '';
    updateKPIs();
    renderGallery();
    showToast('Photo added to gallery.');
  });

  // 5. SETTINGS
  function loadSettings() {
    const s = store.getSettings();
    document.getElementById('set-whatsapp').value = s.whatsappNumber || '9779840515079';
    document.getElementById('set-email').value = s.studioEmail || 'prabhatmaharjan97@gmail.com';
    document.getElementById('set-address').value = s.studioAddress || '';
    document.getElementById('set-instagram').value = s.instagramUrl || '';
    document.getElementById('set-youtube').value = s.youtubeUrl || '';
  }

  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = document.getElementById('set-pin').value.trim();

    const updated = {
      whatsappNumber: document.getElementById('set-whatsapp').value.trim().replace(/[^0-9]/g, ''),
      studioEmail: document.getElementById('set-email').value.trim(),
      studioAddress: document.getElementById('set-address').value.trim(),
      instagramUrl: document.getElementById('set-instagram').value.trim(),
      youtubeUrl: document.getElementById('set-youtube').value.trim()
    };

    if (pin) {
      updated.adminPin = pin;
    }

    store.updateSettings(updated);
    showToast('Studio settings updated successfully.');
  });

  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('WARNING: Reset all live CMS data back to initial demo seeds?')) {
      store.resetAllData();
      loadDashboard();
      showToast('CMS data reset to defaults.');
    }
  });

  // Initialize
  setupModals();
  checkAuth();
});

