# Prabhat Maharjan — Official Artist & Studio Portfolio Website

An ultra-premium, dark-themed responsive web application built for Nepali singer, multi-instrumentalist, composer, and audio mixing & mastering engineer **Prabhat Maharjan**.

---

## 🌟 Key Highlights & Features

1. **Singer & Multi-Talent Showcase**:
   - **Lead & Harmony Vocals**: Dynamic Nepali folk & modern indie pop showcase.
   - **Instruments**: Dedicated spotlights for **Acoustic/Electric Guitar** (fingerstyle & leads), **Grand Piano & Keys**, and **Violin & String Arranging**.
   - **Song Composing**: Full arrangements, cinematic scoring, and songwriting.

2. **Mixing & Mastering Audio Engineering Suite**:
   - **Interactive A/B Audio Comparison**: Real-time slider and toggle between **Raw Flat Mix** and **Mastered Pro Studio Sound**.
   - **Studio Gear Highlights**: SSL consoles, Neve 1073, Genelec monitors, UAD plugins, FabFilter, and -14 LUFS streaming loudness targets.

3. **Built-in Web Audio Player & Real-time Canvas Visualizer**:
   - Web Audio API generative synthesis for acoustic guitar plucks, piano chords, and weeping bowed violin solos.
   - Live animated frequency equalizer on HTML5 `<canvas>`.
   - Complete playlist navigation with time tracking, volume slider, and track scrubbing.

4. **Client Appointment & Session Booking System**:
   - Multi-step interactive booking form (Composing, Vocal Feature, Instrument Session, Mixing & Mastering, Concert Gig).
   - Date selector & available time slot buttons (Morning, Afternoon, Evening, Night).
   - Instant confirmation modal with unique **Booking Reference ID**.
   - Direct **WhatsApp link generator** pre-filled with session details.
   - **Add to Google Calendar / Apple iCal (.ics)** export.
   - Local storage persistence with header notification badge.

5. **Upcoming Live Shows & Tour Dates**:
   - Live countdown timer to the next upcoming show (*Acoustic Echoes Unplugged Night* at Purple Haze Rock Bar, Kathmandu).
   - Interactive category filtering (*Concerts & Festivals*, *Acoustic Unplugged*, *Studio Workshops*).
   - One-click RSVP and reminder system with toast notifications.

6. **Instagram Integration & Media Gallery**:
   - Connected directly to [@maharjan.prabhat](https://www.instagram.com/maharjan.prabhat/).
   - 8-tile interactive gallery grid with like/comment overlay.
   - High-resolution Lightbox modal with captions and direct link to Instagram.

---

## 📁 Project Structure

```
d:/Developing/Prabhat Maharjan/
├── index.html              # Main Home Landing page (Hero, Talents, Audio Player)
├── mixing-mastering.html   # Dedicated Audio Engineering Suite & A/B Mastering
├── shows.html              # Dedicated Live Shows, Concerts & Tour Dates
├── gallery.html            # Dedicated High-Res Visual Gallery & Instagram Feed
├── booking.html            # Dedicated Session Appointment Booking & Scheduler
├── README.md               # Documentation and usage guide
├── css/
│   └── style.css           # Vanilla CSS design system (Acoustic Amber & Electric Violet)
├── js/
│   ├── main.js             # Nav, mobile menu, countdown, lightbox, toasts, FAQ
│   ├── player.js           # Web Audio synthesizer & canvas visualizer engine
│   └── booking.js          # Appointment system, WhatsApp booking, and .ics export
└── assets/
    └── images/
        ├── hero-artist.jpg           # Official studio portrait of Prabhat Maharjan
        ├── single-timi-kaha.jpg      # Official release poster for 'तिमी कहाँ'
        ├── piano-performance.jpg     # Prabhat singing live while playing piano keyboard
        ├── live-concert.jpg          # Prabhat on stage with full symphony orchestra & violins
        ├── violin-solo.jpg           # Prabhat playing acoustic violin into studio condenser mic
        ├── guitar-fingerstyle.jpg    # Prabhat with acoustic guitar, bansuri and tabla ensemble
        ├── vocal-booth.jpg           # Prabhat in studio vocal condenser booth
        ├── lifestyle-songwriter.jpg  # Prabhat candid portrait in Kathmandu
        ├── backstage-maestro.jpg     # Prabhat backstage with senior music director
        ├── gala-hall.jpg             # Prabhat at grand chandelier gala evening
        └── insta-1.jpg .. insta-8.jpg # Curated 8-tile visual feed from @maharjan.prabhat
```

---

## 🚀 How to Run Locally

You can run this project with any local HTTP server:

```powershell
# Using Python
python -m http.server 8080 --directory "d:\Developing\Prabhat Maharjan"

# Or using Node / npx
npx serve "d:\Developing\Prabhat Maharjan"
```

Open `http://localhost:8080` in your web browser.

---

## ⚙️ Customization Guide

- **Update Instagram Profile**: Change the link in `index.html` or `js/main.js` from `https://www.instagram.com/maharjan.prabhat/`.
- **Change Photos**: Simply replace the `.jpg` files inside `assets/images/` with your own high-resolution pictures using the same filenames.
- **Add Real Audio Files**: In `js/player.js`, you can add `audioUrl: 'path/to/song.mp3'` to the `this.tracks` array to play actual MP3/WAV files.
- **Update WhatsApp Number**: In `js/booking.js`, replace `9779841000000` with Prabhat's actual WhatsApp mobile number.

---
© 2026 Prabhat Maharjan. All rights reserved.
