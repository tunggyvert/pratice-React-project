
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  size: { type: String, enum: ['M', 'L', 'XL'], required: true },
  price: { type: String }, // จะกำหนดจาก size
  moveInDate: { type: String, default: '1 เมษายน, 2025' },
  amenities: {
    type: [String],
    default: [
      "Internet Free 30Mbps",
      "ใกล้ 7-Eleven",
      "ตู้น้ำหยอดเหรียญ",
      "มีกล้องวงจรปิด",
      "เครื่องซักผ้าหยอดเหรียญ"
    ]
  }
});

module.exports = mongoose.model('Room', roomSchema);
