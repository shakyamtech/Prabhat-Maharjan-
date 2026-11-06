/**
 * Prabhat Maharjan - Appointment & Studio Booking System
 * Multi-step session scheduling, URL query auto-selection,
 * date picker, time slots, WhatsApp direct link, and .ics export.
 */

class BookingSystem {
  constructor() {
    this.selectedService = 'Mixing & Mastering';
    this.selectedDate = null;
    this.selectedTimeSlot = '10:00 AM - 01:00 PM';
    this.selectedPrice = 'From Rs. 3,500 / $35';
    this.bookingsKey = 'prabhat_maharjan_client_bookings';

    this.init();
  }

  init() {
    this.initUrlParams();
    this.initWizardNavigation();
    this.initServiceSelectors();
    this.initDatePicker();
    this.initTimeSlots();
    this.initFormSubmit();
    this.renderExistingBookingsBadge();
  }

  initUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const showParam = params.get('show');

    if (showParam) {
      this.selectedService = `Live Show Reservation: ${decodeURIComponent(showParam)}`;
      const liveCard = document.querySelector('input[name="service"][value="live-gig"]');
      if (liveCard) {
        liveCard.checked = true;
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        liveCard.closest('.service-card').classList.add('active');
      }
      const notesEl = document.getElementById('client-notes');
      if (notesEl) {
        notesEl.value = `I would like to reserve seats / inquire about the upcoming show: ${decodeURIComponent(showParam)}.`;
      }
    } else if (serviceParam) {
      const radio = document.querySelector(`input[name="service"][value="${serviceParam}"]`);
      if (radio) {
        radio.checked = true;
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        radio.closest('.service-card').classList.add('active');
      }
    }
  }

  initWizardNavigation() {
    const btnToStep2 = document.getElementById('btn-to-step-2');
    const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
    const btnToStep3 = document.getElementById('btn-to-step-3');
    const btnBackToStep2 = document.getElementById('btn-back-to-step-2');
    const btnBookAnother = document.getElementById('btn-book-another');

    if (btnToStep2) btnToStep2.onclick = () => this.goToStep(2);
    if (btnBackToStep1) btnBackToStep1.onclick = () => this.goToStep(1);
    if (btnToStep3) btnToStep3.onclick = () => this.goToStep(3);
    if (btnBackToStep2) btnBackToStep2.onclick = () => this.goToStep(2);

    if (btnBookAnother) {
      btnBookAnother.onclick = () => {
        const form = document.getElementById('booking-form');
        if (form) form.reset();
        this.goToStep(1);
      };
    }
  }

  goToStep(stepNum) {
    // Hide all panels
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
    // Deactivate all step indicators
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));

    const targetPanel = document.getElementById(`panel-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add('active');

    for (let i = 1; i <= stepNum; i++) {
      const indicator = document.getElementById(`step-indicator-${i}`);
      if (indicator) indicator.classList.add('active');
    }

    window.scrollTo({ top: targetPanel.offsetTop - 120, behavior: 'smooth' });
  }

  initServiceSelectors() {
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    serviceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        const card = radio.closest('.service-card');
        if (card) {
          card.classList.add('active');
          const title = card.querySelector('h4');
          if (title) this.selectedService = title.textContent.trim();
        }
      });
    });
  }

  initDatePicker() {
    const dateInput = document.getElementById('booking-date');
    if (!dateInput) return;

    // Minimum date is tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Default to 2 days from now
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 2);
    dateInput.value = defaultDate.toISOString().split('T')[0];
    this.selectedDate = dateInput.value;

    dateInput.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
    });
  }

  initTimeSlots() {
    const slotRadios = document.querySelectorAll('input[name="time_slot"]');
    slotRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('active'));
        const pill = radio.closest('.slot-pill');
        if (pill) {
          pill.classList.add('active');
          this.selectedTimeSlot = radio.value;
        }
      });
    });
  }

  initFormSubmit() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const location = document.getElementById('client-location').value;
      const notes = document.getElementById('client-notes').value.trim();

      if (!name || !phone || !email) {
        alert('Please provide your name, email, and phone/WhatsApp number.');
        return;
      }

      const bookingId = 'PM-2026-' + Math.floor(1000 + Math.random() * 9000);
      const bookingData = {
        id: bookingId,
        clientName: name,
        phone: phone,
        email: email,
        service: this.selectedService,
        date: this.selectedDate,
        timeSlot: this.selectedTimeSlot,
        location: location,
        notes: notes,
        timestamp: new Date().toISOString(),
        status: 'Confirmed'
      };

      this.saveBooking(bookingData);
      this.renderConfirmation(bookingData);
      this.goToStep(4);
    });
  }

  renderConfirmation(data) {
    const idEl = document.getElementById('confirmed-booking-id');
    const serviceEl = document.getElementById('summary-service-name');
    const dtEl = document.getElementById('summary-datetime');
    const nameEl = document.getElementById('summary-client-name');
    const locEl = document.getElementById('summary-location');

    if (idEl) idEl.textContent = data.id;
    if (serviceEl) serviceEl.textContent = data.service;
    if (dtEl) dtEl.textContent = `${this.formatDate(data.date)} • ${data.timeSlot}`;
    if (nameEl) nameEl.textContent = data.clientName;
    if (locEl) {
      locEl.textContent = data.location === 'in-studio' ? 'In-Person Studio (Patan)' :
                          data.location === 'remote-online' ? 'Remote Online (Stems by Drive)' : 'On-Venue Performance';
    }

    // Direct WhatsApp Link
    const waText = encodeURIComponent(
      `Namaste Prabhat ji! 🎵\n\nI have scheduled an appointment on your official website:\n- Reference ID: ${data.id}\n- Name: ${data.clientName}\n- Service: ${data.service}\n- Date & Slot: ${this.formatDate(data.date)} (${data.timeSlot})\n- Format: ${data.location}\n- Contact: ${data.phone} / ${data.email}\n${data.notes ? '- Project Notes: ' + data.notes + '\n' : ''}\nLooking forward to collaborating with you!`
    );

    const waBtn = document.getElementById('btn-whatsapp-direct');
    if (waBtn) {
      waBtn.href = `https://wa.me/9779841000000?text=${waText}`;
    }

    // Calendar .ics export
    const calBtn = document.getElementById('btn-download-ics');
    if (calBtn) {
      calBtn.onclick = () => this.generateIcsFile(data);
    }
  }

  saveBooking(booking) {
    let list = [];
    try {
      const existing = localStorage.getItem(this.bookingsKey);
      if (existing) list = JSON.parse(existing);
    } catch (e) {
      list = [];
    }
    list.unshift(booking);
    localStorage.setItem(this.bookingsKey, JSON.stringify(list));
    this.renderExistingBookingsBadge();
  }

  renderExistingBookingsBadge() {
    const badge = document.getElementById('my-bookings-counter');
    if (!badge) return;
    try {
      const list = JSON.parse(localStorage.getItem(this.bookingsKey) || '[]');
      if (list.length > 0) {
        badge.style.display = 'inline-flex';
        badge.textContent = `${list.length} Session${list.length > 1 ? 's' : ''} Booked`;
      } else {
        badge.style.display = 'none';
      }
    } catch (e) {
      badge.style.display = 'none';
    }
  }

  generateIcsFile(data) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Prabhat Maharjan Studio//Session Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Prabhat Maharjan Studio Session - ${data.service}`,
      `DESCRIPTION:Booking ID: ${data.id}\\nService: ${data.service}\\nClient: ${data.clientName}\\nSlot: ${data.timeSlot}`,
      'LOCATION:Prabhat Maharjan Sound Studio, Patan, Kathmandu, Nepal',
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Studio_Session_${data.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(dateStr) {
    if (!dateStr) return 'Not selected';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

// Global booking system initialization
document.addEventListener('DOMContentLoaded', () => {
  window.bookingApp = new BookingSystem();
});
