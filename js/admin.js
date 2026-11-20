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

  // Click-to-fill default pin badge
  const defaultPinBadge = document.getElementById('default-pin-badge');
  if (defaultPinBadge) {
    defaultPinBadge.addEventListener('click', () => {
      adminPinInput.value = 'prabhat@studio2026';
      adminPinInput.focus();
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
          <div class="item-card-footer">
            <a href="index.html#audio-player" target="_blank" style="color: var(--admin-gold); font-size: 0.8rem; text-decoration: none;">Test in Player ↗</a>
            <button onclick="deleteTrack('${t.id}')" class="btn btn-secondary btn-sm" style="color: #ef4444; padding: 4px 10px;">Remove</button>
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

  // Firebase upload UI setup
  const audioFileInput = document.getElementById('track-audio-file');
  const firebaseBadge = document.getElementById('firebase-status-badge');
  if (firebaseBadge) {
    firebaseBadge.textContent = window.FIREBASE_READY ? '🟢 Firebase Connected' : '⚪ Firebase not configured';
    firebaseBadge.style.color = window.FIREBASE_READY ? '#22c55e' : '#64748b';
  }

  if (audioFileInput) {
    audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      document.getElementById('upload-idle-state').style.display = 'none';
      document.getElementById('upload-file-selected').style.display = 'block';
      document.getElementById('selected-file-name').textContent = file.name;
      document.getElementById('upload-done-msg').style.display = 'none';
      document.getElementById('upload-err-msg').style.display = 'none';
      document.getElementById('track-audio-url').value = '';
    });
  }

  document.getElementById('form-add-track').addEventListener('submit', async (e) => {
    e.preventDefault();
    const trackId = `track-${Date.now()}`;
    const saveBtn = document.getElementById('btn-save-track');
    const audioFile = audioFileInput && audioFileInput.files[0];

    let audioUrl = '';

    // Upload audio file if selected
    if (audioFile) {
      if (!window.FIREBASE_READY) {
        document.getElementById('upload-err-msg').style.display = 'block';
        document.getElementById('upload-err-msg').textContent = '⚠ Firebase not configured. Please fill in js/firebase-config.js with your Firebase credentials.';
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Uploading...';
      document.getElementById('upload-progress-wrap').style.display = 'block';
      document.getElementById('upload-err-msg').style.display = 'none';

      try {
        audioUrl = await window.uploadAudioToFirebase(audioFile, trackId, (pct) => {
          document.getElementById('upload-progress-bar').style.width = pct + '%';
          document.getElementById('upload-pct').textContent = pct + '%';
        });
        document.getElementById('upload-progress-wrap').style.display = 'none';
        document.getElementById('upload-done-msg').style.display = 'block';
      } catch (err) {
        document.getElementById('upload-progress-wrap').style.display = 'none';
        document.getElementById('upload-err-msg').style.display = 'block';
        document.getElementById('upload-err-msg').textContent = '❌ Upload failed: ' + err.message;
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Track';
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
    if (audioFileInput) audioFileInput.value = '';
    document.getElementById('upload-idle-state').style.display = 'block';
    document.getElementById('upload-file-selected').style.display = 'none';
    document.getElementById('upload-done-msg').style.display = 'none';
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Track'; }
    updateKPIs();
    renderTracks();
    showToast(audioUrl ? '🎵 Track & audio uploaded successfully!' : 'New audio track added.');
  });

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

