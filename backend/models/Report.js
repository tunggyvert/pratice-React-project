const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  title: { type: String, required: true },
  detail: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
