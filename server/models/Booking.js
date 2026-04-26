const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  messenger: { type: String, required: true },
  projectDetails: { type: String, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'completed'], default: 'pending' },
  scheduledAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
