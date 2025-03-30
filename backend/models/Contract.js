const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  // เชื่อมกับ user โดยใช้ ObjectId ที่อ้างอิงจาก model User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // เชื่อมกับห้อง
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // optional ถ้าเช่ารายเดือนยืดได้
  monthlyRent: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'paid', 'confirmed'],
    default: 'unpaid'
  },
  paidAt: { type: Date },
  receiptImage: { type: String },     // path หรือ URL รูปใบเสร็จ
  uploadedAt: { type: Date },         // เวลาที่ผู้ใช้อัปโหลด
  adminNote: { type: String },        // แอดมินใส่หมายเหตุ (ถ้าปฏิเสธ)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
