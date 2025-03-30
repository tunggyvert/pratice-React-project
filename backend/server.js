const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 4000;

// เชื่อมต่อ MongoDB
const mongoUrl = 'mongodb+srv://admin:1234@dormage.m1sid.mongodb.net/auth?retryWrites=true&w=majority&appName=Dormage';

const Contract = require('./models/Contract');
const MonthlyPayment = require('./models/MonthlyPayment');
mongoose.connect(mongoUrl)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ MongoDB error:', err));

// Middleware
app.use(cors());
app.use(express.json());


// ใช้ routes ที่แยกไว้
app.use('/uploads', express.static('uploads'));
app.use('/', authRoutes);
// ก่อน app.listen()
app.use('/uploads', express.static('uploads'));


// เริ่ม server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
