/**
 * Prabhat Maharjan - Appointment & Studio Booking System
 * Handles session service selection, interactive calendar,
 * time slots, WhatsApp integration, and .ics calendar generation.
 */

class BookingSystem {
  constructor() {
    this.selectedService = 'Song Composing & Music Production';
    this.selectedDate = null;
    this.selectedTimeSlot = '02:00 PM - 05:00 PM';
    this.selectedPrice = 'NPR 15,000 / $120';
    this.bookingsKey = 'prabhat_maharjan_client_bookings';

    this.init();
  }

  init() {
    this.initServiceSelectors();
    this.initDatePicker();
    this.initTimeSlots();
    this.initFormSubmit();
    this.renderExistingBookingsBadge();
  }

  initServiceSelectors() {
    const serviceCards = document.querySelectorAll('.service-select-card');
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.selectedService = card.dataset.service;
        this.selectedPrice = card.dataset.rate || 'Custom Quote';

        const summaryService = document.getElementById('summary-service-text');
        if (summaryService) summaryService.textContent = this.selectedService;

        const summaryPrice = document.getElementById('summary-price-text');
        if (summaryPrice) summaryPrice.textContent = this.selectedPrice;
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
    const minDateStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDateStr;

    // Default to 2 days from now
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 2);
    dateInput.value = defaultDate.toISOString().split('T')[0];
    this.selectedDate = dateInput.value;

    const summaryDate = document.getElementById('summary-date-text');
    if (summaryDate) summaryDate.textContent = this.formatDate(this.selectedDate);

    dateInput.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      if (summaryDate) summaryDate.textContent = this.formatDate(this.selectedDate);
    });
  }

  initTimeSlots() {
    const slotButtons = document.querySelectorAll('.slot-btn');
    slotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        slotButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedTimeSlot = btn.dataset.slot;

        const summaryTime = document.getElementById('summary-time-text');
        if (summaryTime) summaryTime.textContent = this.selectedTimeSlot;
      });
    });
  }

  initFormSubmit() {
    const form = document.getElementById('studio-booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const notes = document.getElementById('client-notes').value.trim();
      const refLink = document.getElementById('client-ref-link').value.trim();

      if (!name || !phone) {
        alert('Please provide your name and phone/WhatsApp number.');
        return;
      }

      const bookingId = 'PM-' + Math.floor(100000 + Math.random() * 900000);
      const bookingData = {
        id: bookingId,
        clientName: name,
        phone: phone,
        email: email,
        service: this.selectedService,
        date: this.selectedDate,
        timeSlot: this.selectedTimeSlot,
        rateEstimate: this.selectedPrice,
        notes: notes,
        refLink: refLink,
        timestamp: new Date().toISOString(),
        status: 'Confirmed'
      };

      this.saveBooking(bookingData);
      this.showConfirmationModal(bookingData);
    });
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

  showConfirmationModal(data) {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    document.getElementById('modal-booking-id').textContent = data.id;
    document.getElementById('modal-client-name').textContent = data.clientName;
    document.getElementById('modal-service-name').textContent = data.service;
    document.getElementById('modal-session-date').textContent = `${this.formatDate(data.date)} (${data.timeSlot})`;
    document.getElementById('modal-rate-estimate').textContent = data.rateEstimate;

    // WhatsApp Direct Link
    const waText = encodeURIComponent(
      `Namaste Prabhat ji! 🎵\n\nI have submitted a studio session booking:\n- Booking ID: ${data.id}\n- Name: ${data.clientName}\n- Service: ${data.service}\n- Date & Slot: ${this.formatDate(data.date)} (${data.timeSlot})\n- Contact: ${data.phone}\n${data.notes ? '- Project Note: ' + data.notes + '\n' : ''}${data.refLink ? '- Reference Link: ' + data.refLink + '\n' : ''}\nLooking forward to working together!`
    );
    const waBtn = document.getElementById('modal-whatsapp-link');
    if (waBtn) {
      // Prabhat's direct booking WhatsApp contact (Nepal country code +977)
      waBtn.href = `https://wa.me/9779841000000?text=${waText}`;
      waBtn.target = '_blank';
    }

    // Calendar .ics download
    const calBtn = document.getElementById('modal-download-ics');
    if (calBtn) {
      calBtn.onclick = () => this.generateIcsFile(data);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('close-booking-modal');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
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
      'LOCATION:Prabhat Maharjan Sound Studio, Kathmandu, Nepal',
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
