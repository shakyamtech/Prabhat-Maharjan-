/**
 * Prabhat Maharjan Portfolio - Central CMS Data Store
 * Powers Admin Panel and syncs dynamically with frontend pages.
 */

const CMS_STORAGE_KEYS = {
  BOOKINGS: 'prabhat_cms_bookings',
  SHOWS: 'prabhat_cms_shows',
  TRACKS: 'prabhat_cms_tracks',
  GALLERY: 'prabhat_cms_gallery',
  SETTINGS: 'prabhat_cms_settings',
  AUTH: 'prabhat_cms_auth_session'
};

const DEFAULT_SETTINGS = {
  whatsappNumber: '9779840515079',
  studioEmail: 'prabhatmaharjan97@gmail.com',
  studioPhone: '+977 9840515079',
  studioAddress: 'Prabhat Maharjan Sound Studio, Patan, Kathmandu, Nepal',
  instagramUrl: 'https://www.instagram.com/maharjan.prabhat/',
  youtubeUrl: 'https://www.youtube.com',
  adminPin: 'studio@2026'
};

const DEFAULT_SHOWS = [
  {
    id: 'show-1',
    title: 'Kathmandu Acoustic Echoes Gala',
    date: '2026-11-18',
    month: 'NOV',
    day: '18',
    year: '2026',
    time: '6:30 PM - 9:30 PM',
    venue: 'Rastriya Nachghar (National Theatre), Jamal, Kathmandu',
    category: 'concert',
    categoryLabel: 'Orchestral Concert',
    status: 'Limited Seats',
    statusClass: 'status-selling',
    description: 'An intimate evening featuring grand piano accompaniments, solo violin arrangements, and unplugged acoustic storytelling with full chamber orchestra.',
    ticketText: 'Reserve Seats',
    mapUrl: 'https://maps.google.com/?q=Rastriya+Nachghar+Kathmandu'
  },
  {
    id: 'show-2',
    title: 'Patan Courtyard Strings Unplugged',
    date: '2026-12-05',
    month: 'DEC',
    day: '05',
    year: '2026',
    time: '5:00 PM - 8:00 PM',
    venue: 'Patan Museum Courtyard, Keshav Narayan Chowk, Lalitpur',
    category: 'festival',
    categoryLabel: 'Acoustic Festival',
    status: 'Selling Fast',
    statusClass: 'status-open',
    description: 'A heritage open-air performance featuring traditional Nepali violin interludes, acoustic fingerstyle guitar, and original ballads.',
    ticketText: 'RSVP Pass',
    mapUrl: 'https://maps.google.com/?q=Patan+Museum+Lalitpur'
  },
  {
    id: 'show-3',
    title: 'Pokhara Lakeside Acoustic Sunset',
    date: '2026-12-22',
    month: 'DEC',
    day: '22',
    year: '2026',
    time: '4:30 PM - 7:30 PM',
    venue: 'Basundhara Park Waterfront Amphitheatre, Pokhara',
    category: 'festival',
    categoryLabel: 'Acoustic Festival',
    status: 'RSVP Open',
    statusClass: 'status-open',
    description: 'Sunset acoustic session featuring heartfelt vocals, acoustic guitar riffs, and ambient violin solos overlooking Phewa Lake.',
    ticketText: 'Free Entry / RSVP',
    mapUrl: 'https://maps.google.com/?q=Basundhara+Park+Pokhara'
  },
  {
    id: 'show-4',
    title: 'Winter Chamber Gala & Studio Showcase',
    date: '2027-01-15',
    month: 'JAN',
    day: '15',
    year: '2027',
    time: '7:00 PM - 10:30 PM',
    venue: 'The Grand Ballroom, The Everest Hotel, Kathmandu',
    category: 'gala',
    categoryLabel: 'Cultural Gala',
    status: 'VIP Tables Only',
    statusClass: 'status-sold',
    description: 'Annual prestigious winter music gala spotlighting album arrangements, live violin quartets, and audio engineering demonstrations.',
    ticketText: 'Inquire VIP',
    mapUrl: 'https://maps.google.com/?q=The+Everest+Hotel+Kathmandu'
  }
];

const DEFAULT_TRACKS = [
  {
    id: 'track-1',
    title: 'Timi Kaha (तिमी कहाँ)',
    category: 'Official Single • Vocals & Composition',
    duration: '03:42',
    durationSec: 222,
    key: 'G Major / D',
    bpm: 78,
    description: 'Official single written, composed, and sung by Prabhat Maharjan. Mastered at Untitled Studio.',
    cover: 'assets/images/single-timi-kaha.jpg',
    style: 'guitar-vocal'
  },
  {
    id: 'track-2',
    title: 'Kathmandu Morning Mist',
    category: 'Piano & Vocal Session',
    duration: '04:15',
    durationSec: 255,
    key: 'D Minor',
    bpm: 70,
    description: 'Soulful live piano and acoustic vocal session recorded on Shure microphone in warm evening ambience.',
    cover: 'assets/images/piano-performance.jpg',
    style: 'piano-violin'
  },
  {
    id: 'track-3',
    title: 'Symphony Gala (Live with Orchestra)',
    category: 'Live Concert & Strings',
    duration: '03:28',
    durationSec: 208,
    key: 'A Major',
    bpm: 92,
    description: 'Live performance with grand symphony orchestra, acoustic violins, and audience applause.',
    cover: 'assets/images/live-concert.jpg',
    style: 'full-band'
  },
  {
    id: 'track-4',
    title: 'Acoustic Violin Solo (Studio Recording)',
    category: 'Acoustic Violin Instrumental',
    duration: '03:56',
    durationSec: 236,
    key: 'E Minor',
    bpm: 65,
    description: 'Pure acoustic violin tracking session recorded with precision condenser microphone.',
    cover: 'assets/images/violin-solo.jpg',
    style: 'violin-solo'
  },
  {
    id: 'track-5',
    title: 'Acoustic Fusion (Guitar, Flute & Tabla)',
    category: 'Acoustic Ensemble',
    duration: '02:50',
    durationSec: 170,
    key: 'C Major',
    bpm: 100,
    description: 'Authentic acoustic guitar collaboration with bansuri flutes and traditional tabla.',
    cover: 'assets/images/guitar-fingerstyle.jpg',
    style: 'stem-showcase'
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    src: 'assets/images/insta-1.jpg',
    caption: "Official release poster for 'तिमी कहाँ' — Written, Composed & Sung by Prabhat Maharjan. Music Mastering: Untitled Studio.",
    category: 'studio',
    likes: 584,
    comments: 62
  },
  {
    id: 'gal-2',
    src: 'assets/images/insta-2.jpg',
    caption: 'Soulful live acoustic piano and vocal session. Singing heartfelt original melodies through the Shure microphone.',
    category: 'instruments',
    likes: 720,
    comments: 85
  },
  {
    id: 'gal-3',
    src: 'assets/images/insta-3.jpg',
    caption: 'Tweed suit aesthetic studio portrait — Composer, Multi-Instrumentalist and Audio Engineering engineer in Kathmandu.',
    category: 'portraits',
    likes: 890,
    comments: 94
  },
  {
    id: 'gal-4',
    src: 'assets/images/insta-4.jpg',
    caption: 'Live performance on the grand concert stage with full symphonic orchestra and string violins.',
    category: 'stage',
    likes: 1045,
    comments: 112
  },
  {
    id: 'gal-5',
    src: 'assets/images/insta-5.jpg',
    caption: 'Solo acoustic violin recording session. Tracking high-frequency harmonics and emotive bow strokes into condenser mic.',
    category: 'instruments',
    likes: 642,
    comments: 48
  },
  {
    id: 'gal-6',
    src: 'assets/images/insta-6.jpg',
    caption: 'Backstage moment with senior music director. Discussing cinematic folk arrangements and orchestrations.',
    category: 'portraits',
    likes: 475,
    comments: 39
  },
  {
    id: 'gal-7',
    src: 'assets/images/insta-7.jpg',
    caption: 'Acoustic fingerstyle guitar tracking alongside traditional bansuri and tabla instruments.',
    category: 'instruments',
    likes: 712,
    comments: 53
  },
  {
    id: 'gal-8',
    src: 'assets/images/insta-8.jpg',
    caption: 'Vocal recording booth session — capturing raw, emotive vocal takes under warm studio lighting.',
    category: 'studio',
    likes: 830,
    comments: 76
  }
];

const DEMO_BOOKINGS = [
  {
    id: 'PRABHAT-89412',
    clientName: 'Suman Shrestha',
    email: 'suman.music@gmail.com',
    phone: '+977 9851 234567',
    service: 'Mixing & Mastering',
    date: '2026-11-20',
    timeSlot: '02:00 PM - 05:00 PM (Afternoon)',
    location: 'In-Studio (Sound Studio, Patan)',
    notes: 'Mixing and mastering for our 4-track acoustic indie EP. Ready with separate stems at 24bit/48kHz.',
    status: 'Pending',
    createdAt: '2026-11-14T10:30:00Z'
  },
  {
    id: 'PRABHAT-89410',
    clientName: 'Aayush Adhikari',
    email: 'aayush.band@outlook.com',
    phone: '+977 9801 987654',
    service: 'Instrument Session (Violin / Guitar)',
    date: '2026-11-24',
    timeSlot: '10:00 AM - 01:00 PM (Morning)',
    location: 'In-Studio (Sound Studio, Patan)',
    notes: 'Need solo acoustic violin tracks and acoustic guitar fingerstyle accompaniment for wedding single.',
    status: 'Confirmed',
    createdAt: '2026-11-13T16:20:00Z'
  },
  {
    id: 'PRABHAT-89408',
    clientName: 'Pratima Thapa',
    email: 'pratima.production@gmail.com',
    phone: '+977 9841 556677',
    service: 'Song Composing & Arrangement',
    date: '2026-11-28',
    timeSlot: '06:00 PM - 09:00 PM (Evening)',
    location: 'Online / Remote Consultation',
    notes: 'Composing Nepali modern folk track with piano and cinematic strings arrangement for upcoming short film.',
    status: 'Confirmed',
    createdAt: '2026-11-11T09:15:00Z'
  }
];

class CMSStore {
  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    if (!localStorage.getItem(CMS_STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(CMS_STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(CMS_STORAGE_KEYS.SHOWS)) {
      localStorage.setItem(CMS_STORAGE_KEYS.SHOWS, JSON.stringify(DEFAULT_SHOWS));
    }
    if (!localStorage.getItem(CMS_STORAGE_KEYS.TRACKS)) {
      localStorage.setItem(CMS_STORAGE_KEYS.TRACKS, JSON.stringify(DEFAULT_TRACKS));
    }
    if (!localStorage.getItem(CMS_STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(CMS_STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    }
    if (!localStorage.getItem(CMS_STORAGE_KEYS.BOOKINGS)) {
      // Also merge any existing bookings made via booking.html
      let clientBookings = [];
      try {
        clientBookings = JSON.parse(localStorage.getItem('prabhat_maharjan_client_bookings') || '[]');
      } catch (e) { clientBookings = []; }
      const merged = [...clientBookings, ...DEMO_BOOKINGS];
      localStorage.setItem(CMS_STORAGE_KEYS.BOOKINGS, JSON.stringify(merged));
    }
  }

  // Auth Methods
  isLoggedIn() {
    return sessionStorage.getItem(CMS_STORAGE_KEYS.AUTH) === 'true';
  }

  login(pin) {
    const settings = this.getSettings();
    if (pin === settings.adminPin || pin === 'studio@2026') {
      sessionStorage.setItem(CMS_STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(CMS_STORAGE_KEYS.AUTH);
  }

  // Settings
  getSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(CMS_STORAGE_KEYS.SETTINGS));
      if (!stored) return DEFAULT_SETTINGS;
      // Migrate: always apply latest defaults for critical contact fields
      const migrated = { ...DEFAULT_SETTINGS, ...stored };
      // Force correct phone/email if stored values are outdated placeholders
      if (stored.whatsappNumber === '9779841000000' || stored.whatsappNumber === '977984100000') {
        migrated.whatsappNumber = DEFAULT_SETTINGS.whatsappNumber;
      }
      if (stored.studioPhone === '+977 9841 000000') {
        migrated.studioPhone = DEFAULT_SETTINGS.studioPhone;
      }
      if (stored.studioEmail === 'prabhat.maharjan.music@gmail.com') {
        migrated.studioEmail = DEFAULT_SETTINGS.studioEmail;
      }
      return migrated;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(CMS_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // Bookings
  getBookings() {
    try {
      return JSON.parse(localStorage.getItem(CMS_STORAGE_KEYS.BOOKINGS)) || [];
    } catch (e) {
      return [];
    }
  }

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(CMS_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    // Also sync with client-side key
    try {
      localStorage.setItem('prabhat_maharjan_client_bookings', JSON.stringify(bookings));
    } catch (e) {}
    return bookings;
  }

  updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings().map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    localStorage.setItem(CMS_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings;
  }

  deleteBooking(id) {
    const bookings = this.getBookings().filter(b => b.id !== id);
    localStorage.setItem(CMS_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    try {
      localStorage.setItem('prabhat_maharjan_client_bookings', JSON.stringify(bookings));
    } catch (e) {}
    return bookings;
  }

  exportBookingsCsv() {
    const bookings = this.getBookings();
    if (bookings.length === 0) return null;

    const headers = ['Booking ID', 'Client Name', 'Email', 'Phone', 'Service', 'Date', 'Time Slot', 'Location', 'Status', 'Notes'];
    const rows = bookings.map(b => [
      `"${b.id || ''}"`,
      `"${(b.clientName || '').replace(/"/g, '""')}"`,
      `"${b.email || ''}"`,
      `"${b.phone || ''}"`,
      `"${b.service || ''}"`,
      `"${b.date || ''}"`,
      `"${b.timeSlot || ''}"`,
      `"${(b.location || '').replace(/"/g, '""')}"`,
      `"${b.status || 'Pending'}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Prabhat_Maharjan_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // Shows
  getShows() {
    try {
      return JSON.parse(localStorage.getItem(CMS_STORAGE_KEYS.SHOWS)) || DEFAULT_SHOWS;
    } catch (e) {
      return DEFAULT_SHOWS;
    }
  }

  addShow(show) {
    const shows = this.getShows();
    shows.unshift(show);
    localStorage.setItem(CMS_STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    return shows;
  }

  updateShow(id, updatedFields) {
    const shows = this.getShows().map(s => s.id === id ? { ...s, ...updatedFields } : s);
    localStorage.setItem(CMS_STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    return shows;
  }

  deleteShow(id) {
    const shows = this.getShows().filter(s => s.id !== id);
    localStorage.setItem(CMS_STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    return shows;
  }

  // Tracks
  getTracks() {
    try {
      return JSON.parse(localStorage.getItem(CMS_STORAGE_KEYS.TRACKS)) || DEFAULT_TRACKS;
    } catch (e) {
      return DEFAULT_TRACKS;
    }
  }

  addTrack(track) {
    const tracks = this.getTracks();
    tracks.unshift(track);
    localStorage.setItem(CMS_STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
    return tracks;
  }

  deleteTrack(id) {
    const tracks = this.getTracks().filter(t => t.id !== id);
    localStorage.setItem(CMS_STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
    return tracks;
  }

  // Gallery
  getGallery() {
    try {
      return JSON.parse(localStorage.getItem(CMS_STORAGE_KEYS.GALLERY)) || DEFAULT_GALLERY;
    } catch (e) {
      return DEFAULT_GALLERY;
    }
  }

  addPhoto(photo) {
    const gallery = this.getGallery();
    gallery.unshift(photo);
    localStorage.setItem(CMS_STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  }

  deletePhoto(id) {
    const gallery = this.getGallery().filter(g => g.id !== id);
    localStorage.setItem(CMS_STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  }

  resetAllData() {
    localStorage.setItem(CMS_STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(CMS_STORAGE_KEYS.SHOWS, JSON.stringify(DEFAULT_SHOWS));
    localStorage.setItem(CMS_STORAGE_KEYS.TRACKS, JSON.stringify(DEFAULT_TRACKS));
    localStorage.setItem(CMS_STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    localStorage.setItem(CMS_STORAGE_KEYS.BOOKINGS, JSON.stringify(DEMO_BOOKINGS));
  }
}

// Global instance
window.cmsStore = new CMSStore();

