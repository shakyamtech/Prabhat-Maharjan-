/**
 * Prabhat Maharjan - Audio Player & Web Audio Synthesis Engine
 * Provides realistic audio generation for Guitar, Piano, Violin, and Vocals,
 * connected to an interactive real-time visualizer canvas.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.masteringFilter = null;
    this.masteringCompressor = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.currentTime = 0;
    this.duration = 184; // demo track duration in seconds
    this.timer = null;
    this.isMasteredMode = true; // For A/B testing
    this.activeNodes = [];

    this.tracks = [
      {
        id: 'track-1',
        title: 'Thamideuna Haat (Acoustic Unplugged)',
        category: 'Vocal & Acoustic Guitar',
        duration: '03:42',
        durationSec: 222,
        key: 'G Major / D',
        bpm: 78,
        description: 'Soulful Nepali vocals layered with intimate fingerstyle acoustic guitar and warm studio room ambience.',
        cover: 'assets/images/guitar-fingerstyle.jpg',
        style: 'guitar-vocal'
      },
      {
        id: 'track-2',
        title: 'Kathmandu Morning Mist',
        category: 'Piano & Violin Duet',
        duration: '04:15',
        durationSec: 255,
        key: 'D Minor',
        bpm: 70,
        description: 'Expressive Steinway grand piano arpeggios accompanied by emotional, weeping acoustic violin melodies.',
        cover: 'assets/images/piano-performance.jpg',
        style: 'piano-violin'
      },
      {
        id: 'track-3',
        title: 'Timro Yaadhama (Produced & Mastered)',
        category: 'Full Production / Modern Nepali Pop',
        duration: '03:28',
        durationSec: 208,
        key: 'A Major',
        bpm: 92,
        description: 'Commercial radio-ready mix featuring lush acoustic guitars, synths, stereo vocal harmonies, and punchy low-end.',
        cover: 'assets/images/mixing-console.jpg',
        style: 'full-band'
      },
      {
        id: 'track-4',
        title: 'Himalayan Twilight (Strings & Wood)',
        category: 'Cinematic Instrumental',
        duration: '03:56',
        durationSec: 236,
        key: 'E Minor',
        bpm: 65,
        description: 'Atmospheric strings, open-tuned acoustic guitar chords, and soaring violin lines evoking Nepal’s high ridges.',
        cover: 'assets/images/violin-solo.jpg',
        style: 'violin-solo'
      },
      {
        id: 'track-5',
        title: 'Studio Stem Showcase (A/B Test)',
        category: 'Mixing & Mastering Comparison',
        duration: '02:50',
        durationSec: 170,
        key: 'C Major',
        bpm: 100,
        description: 'Multi-track acoustic rock arrangement. Use the A/B toggle switch to hear before & after analog mastering!',
        cover: 'assets/images/hero-artist.jpg',
        style: 'stem-showcase'
      }
    ];

    this.initElements();
    this.initVisualizer();
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.6;

      // Mastering chain (Compressor + High Shelf EQ)
      this.masteringCompressor = this.ctx.createDynamicsCompressor();
      this.masteringCompressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.masteringCompressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.masteringCompressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.masteringCompressor.attack.setValueAtTime(0.015, this.ctx.currentTime);
      this.masteringCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masteringFilter = this.ctx.createBiquadFilter();
      this.masteringFilter.type = 'highshelf';
      this.masteringFilter.frequency.setValueAtTime(8000, this.ctx.currentTime);
      this.masteringFilter.gain.setValueAtTime(this.isMasteredMode ? 3.5 : 0, this.ctx.currentTime);

      // Connect: Sources -> Gain -> Analyser -> Filter -> Compressor -> Destination
      this.gainNode.connect(this.masteringFilter);
      this.masteringFilter.connect(this.masteringCompressor);
      this.masteringCompressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initElements() {
    this.playBtn = document.getElementById('play-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.trackTitle = document.getElementById('player-track-title');
    this.trackArtist = document.getElementById('player-track-artist');
    this.trackCover = document.getElementById('player-track-cover');
    this.progressBar = document.getElementById('player-progress');
    this.timeCurrent = document.getElementById('player-time-current');
    this.timeTotal = document.getElementById('player-time-total');
    this.volumeSlider = document.getElementById('player-volume');
    this.canvas = document.getElementById('visualizer-canvas');
    this.playlistContainer = document.getElementById('playlist-items');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevTrack());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextTrack());
    }
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.gainNode) {
          this.gainNode.gain.value = val;
        }
      });
    }
    if (this.progressBar) {
      this.progressBar.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        this.currentTime = (pct / 100) * this.tracks[this.currentTrackIndex].durationSec;
        this.updateTimeDisplay();
      });
    }

    // A/B Master switch
    const abToggle = document.getElementById('ab-master-toggle');
    if (abToggle) {
      abToggle.addEventListener('change', (e) => {
        this.setMasteringMode(e.target.checked);
      });
    }

    this.renderPlaylist();
    this.loadTrack(0, false);
  }

  setMasteringMode(isMastered) {
    this.isMasteredMode = isMastered;
    const label = document.getElementById('ab-status-text');
    if (label) {
      label.textContent = isMastered ? 'Mastered Audio (Pro Studio)' : 'Raw Mix (Pre-Mastering)';
      label.style.color = isMastered ? '#f59e0b' : '#94a3b8';
    }

    if (this.masteringFilter && this.ctx) {
      const now = this.ctx.currentTime;
      if (isMastered) {
        this.masteringFilter.gain.setTargetAtTime(3.8, now, 0.05);
        this.masteringCompressor.ratio.setTargetAtTime(3.8, now, 0.05);
        if (this.gainNode) this.gainNode.gain.setTargetAtTime(0.7, now, 0.05);
      } else {
        this.masteringFilter.gain.setTargetAtTime(-1.5, now, 0.05);
        this.masteringCompressor.ratio.setTargetAtTime(1.2, now, 0.05);
        if (this.gainNode) this.gainNode.gain.setTargetAtTime(0.45, now, 0.05);
      }
    }
  }

  renderPlaylist() {
    if (!this.playlistContainer) return;
    this.playlistContainer.innerHTML = '';

    this.tracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `playlist-track ${index === this.currentTrackIndex ? 'active' : ''}`;
      item.dataset.index = index;
      item.innerHTML = `
        <div class="playlist-track-num">
          <span class="num-text">${index + 1}</span>
          <span class="eq-bars"><span></span><span></span><span></span></span>
        </div>
        <div class="playlist-track-info">
          <h4 class="playlist-track-title">${track.title}</h4>
          <span class="playlist-track-tag">${track.category} • Key: ${track.key}</span>
        </div>
        <div class="playlist-track-duration">${track.duration}</div>
      `;
      item.addEventListener('click', () => {
        this.currentTrackIndex = index;
        this.loadTrack(index, true);
      });
      this.playlistContainer.appendChild(item);
    });
  }

  loadTrack(index, autoPlay = true) {
    this.currentTrackIndex = index;
    const track = this.tracks[index];

    if (this.trackTitle) this.trackTitle.textContent = track.title;
    if (this.trackArtist) this.trackArtist.textContent = `Prabhat Maharjan • ${track.category}`;
    if (this.trackCover) this.trackCover.src = track.cover;
    if (this.timeTotal) this.timeTotal.textContent = track.duration;

    this.currentTime = 0;
    this.updateTimeDisplay();

    // Update active highlight in playlist
    document.querySelectorAll('.playlist-track').forEach((el, idx) => {
      el.classList.toggle('active', idx === index);
    });

    if (autoPlay) {
      this.play();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initAudioContext();
    this.isPlaying = true;
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Pause Audio');
    }

    document.querySelectorAll('.playlist-track').forEach((el, idx) => {
      el.classList.toggle('playing', idx === this.currentTrackIndex && this.isPlaying);
    });

    this.startAudioLoop();
    this.startTimer();
  }

  pause() {
    this.isPlaying = false;
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Play Audio');
    }

    document.querySelectorAll('.playlist-track').forEach((el) => {
      el.classList.remove('playing');
    });

    this.stopAudioLoop();
    clearInterval(this.timer);
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(this.currentTrackIndex, this.isPlaying);
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack(this.currentTrackIndex, this.isPlaying);
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      const track = this.tracks[this.currentTrackIndex];
      this.currentTime++;

      if (this.currentTime >= track.durationSec) {
        this.nextTrack();
        return;
      }

      this.updateTimeDisplay();
    }, 1000);
  }

  updateTimeDisplay() {
    const track = this.tracks[this.currentTrackIndex];
    const mins = Math.floor(this.currentTime / 60);
    const secs = Math.floor(this.currentTime % 60);
    if (this.timeCurrent) {
      this.timeCurrent.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    if (this.progressBar) {
      const pct = (this.currentTime / track.durationSec) * 100;
      this.progressBar.value = pct;
      this.progressBar.style.setProperty('--val-pct', `${pct}%`);
    }
  }

  /* ----------------------------------------------------
     GENERATIVE SOUND SYNTHESIS FOR DEMO LISTENING
     Simulates acoustic guitar plucks, piano chords,
     and expressive violin notes tuned to harmonic scales
  ---------------------------------------------------- */
  startAudioLoop() {
    this.stopAudioLoop();
    const track = this.tracks[this.currentTrackIndex];

    // Scales for each style
    const noteFrequencies = {
      // G Major / Em acoustic guitar
      'guitar-vocal': [196.00, 246.94, 293.66, 392.00, 440.00, 493.88, 587.33],
      // D Minor piano / violin
      'piano-violin': [146.83, 174.61, 220.00, 261.63, 293.66, 349.23, 440.00, 523.25],
      // Pop A Major
      'full-band': [110.00, 164.81, 220.00, 277.18, 329.63, 440.00, 554.37],
      // Strings solo
      'violin-solo': [196.00, 293.66, 329.63, 440.00, 493.88, 659.25, 783.99],
      // Stem showcase
      'stem-showcase': [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25]
    };

    const notes = noteFrequencies[track.style] || noteFrequencies['guitar-vocal'];
    let step = 0;

    const intervalTime = (60 / track.bpm) * 500; // 8th note rhythm

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      step++;

      // Pluck or chord note
      const baseFreq = notes[step % notes.length];
      const rootFreq = notes[0];

      // Bass note every 4 beats
      if (step % 4 === 0) {
        this.playTone(rootFreq / 2, 'triangle', 1.4, 0.28, 0.05);
      }

      // Melody note
      if (track.style === 'piano-violin' || track.style === 'violin-solo') {
        // Violin expressive bowed tone (sawtooth + vibrato)
        this.playViolinTone(baseFreq, 1.2, 0.18);
        // Soft piano backing
        if (step % 2 === 0) {
          this.playPianoTone(notes[(step * 2) % notes.length], 0.8, 0.14);
        }
      } else {
        // Acoustic guitar pluck
        this.playGuitarPluck(baseFreq, 1.0, 0.22);
        if (step % 3 === 0) {
          this.playGuitarPluck(notes[(step + 2) % notes.length], 0.7, 0.16);
        }
      }
    }, intervalTime);
  }

  stopAudioLoop() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  playGuitarPluck(freq, decayTime = 1.0, vol = 0.2) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm acoustic guitar body filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + decayTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(vol, now + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + decayTime);
  }

  playPianoTone(freq, duration = 1.2, vol = 0.15) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(vol, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  playViolinTone(freq, duration = 1.6, vol = 0.16) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator(); // Vibrato
    const lfoGain = this.ctx.createGain();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // 5.5 Hz vibrato
    lfo.frequency.setValueAtTime(5.5, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(4.0, this.ctx.currentTime); // Pitch modulation depth
    lfo.connect(osc.frequency);

    // Violin resonant formant filter
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(vol, now + 0.15); // gentle bowed attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration);
    lfo.stop(now + duration);
  }

  playTone(freq, type, duration, vol, attack = 0.01) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(vol, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  /* ----------------------------------------------------
     AUDIO VISUALIZER CANVAS
     Draws dancing neon-amber frequency bars and wave
  ---------------------------------------------------- */
  initVisualizer() {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || 320;
      canvas.height = 64;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 32;
      const dataArray = new Uint8Array(bufferLength);

      if (this.isPlaying && this.analyser) {
        this.analyser.getByteFrequencyData(dataArray);
      } else {
        // Idle gentle animation
        const time = Date.now() * 0.002;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(time + i * 0.3) * 12 + 14;
        }
      }

      const barWidth = (width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.9 + 3;

        // Gradient from warm amber to electric violet
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
        grad.addColorStop(0.6, '#f59e0b');
        grad.addColorStop(1, '#a855f7');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, height - barHeight, Math.max(barWidth - 2, 2), barHeight, [2, 2, 0, 0]);
        ctx.fill();

        x += barWidth + 1;
      }
    };

    render();
  }
}

// Global player instance initialization
document.addEventListener('DOMContentLoaded', () => {
  window.artistAudio = new AudioEngine();
});
