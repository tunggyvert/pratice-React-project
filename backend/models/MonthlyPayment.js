const mongoose = require('mongoose');

const MonthlyPayment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  month: { type: String, required: true }, // เช่น "เมษายน 2025"
  roomPrice: { type: Number, required: true },
  waterFee: { type: Number, default: 0 },
  electricityFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'confirmed'], default: 'unpaid' },
  receiptImage: { type: String },
  uploadedAt: { type: Date },
  paidAt: { type: Date },
  adminMessage: { type: String }, // ข้อความแจ้งเตือนจาก Admin
  qrImageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonthlyPayment', MonthlyPayment);
