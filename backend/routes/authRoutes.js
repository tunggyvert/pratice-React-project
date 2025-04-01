const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');
const Report = require('../models/Report');
const Contract = require('../models/Contract');
const qr = require('qrcode');
const qrcode = require('qrcode');
const promptpay = require('promptpay-qr');
const nodemailer = require('nodemailer');
const upload = require('../middleware/uploadMiddleware');
const MonthlyPayment = require('../models/MonthlyPayment');

const crypto = require('crypto');
const router = express.Router();
const ResetToken = require('../models/resetToken');
const authMiddleware = require('../middleware/authMiddleware');



// 🔐 Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, tel,password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'มีผู้ใช้งานนี้แล้ว' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, tel,password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

// 🔑 Login
// 🔑 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'ไม่พบผู้ใช้งานนี้' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign({ userId: user._id ,role: user.role}, 'secretkey', { expiresIn: '1h' });

    // ✅ ส่งกลับ user ด้วย (แต่ควรไม่รวม password!)
    const { firstName, lastName, tel,email: userEmail,role } = user;

    res.json({
      token,
      user: { firstName, lastName, tel,email: userEmail,role }
    });

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});



// 🔁 Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('📨 ได้รับคำขอรีเซ็ตรหัสผ่าน:', req.body.email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'ไม่พบผู้ใช้งานนี้' });

    // 🔁 สร้าง token แบบ random
    const token = crypto.randomBytes(32).toString('hex');

    // ❌ ลบ token เก่าถ้ามี
    await ResetToken.deleteMany({ userId: user._id });

    // ✅ บันทึก token ใหม่
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 นาที
    await new ResetToken({ userId: user._id, token, expiresAt }).save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jakkapat.wut@gmail.com',
        pass: 'quaeyqqkgzwigfsg',
      },
    });

    const mailOptions = {
      from: '"Grove Residence" <jakkapat.wut@gmail.com>',
      to: email,
      subject: 'ลิงก์รีเซ็ตรหัสผ่านของคุณ',
      html: `
        <h2>คุณได้ขอรีเซ็ตรหัสผ่าน</h2>
        <p>คลิกลิงก์ด้านล่างเพื่อเปลี่ยนรหัสผ่านของคุณ:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><small>ลิงก์จะหมดอายุใน 15 นาที</small></p>
      `,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ ไม่สามารถส่งอีเมล:', err);
      } else {
        console.log('✅ อีเมลถูกส่งแล้ว:', info.response);
      }
    });
    console.log('✅ Email sent to:', email);
    res.json({ message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

// 🔐 Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const resetRecord = await ResetToken.findOne({ token });
    if (!resetRecord) return res.status(400).json({ error: 'ลิงก์หมดอายุหรือไม่ถูกต้อง' });

    if (resetRecord.expiresAt < new Date()) {
      await ResetToken.deleteOne({ _id: resetRecord._id });
      return res.status(400).json({ error: 'ลิงก์หมดอายุแล้ว' });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) return res.status(400).json({ error: 'ไม่พบผู้ใช้งาน' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // ✅ ลบ token ทิ้งหลังใช้งาน
    await ResetToken.deleteOne({ _id: resetRecord._id });

    res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

router.put('/update-profile', authMiddleware, async (req, res) => {
  console.log('📥 /update-profile called');
  const userId = req.user.userId;
  const { firstName, lastName, tel, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);

  // ✅ ถ้ามีการขอเปลี่ยนรหัส ต้องเช็กรหัสเดิม
  if (newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.tel = tel;

  const updatedUser = await user.save();

  const { password, ...userWithoutPassword } = updatedUser.toObject();

  res.json({ updatedUser: userWithoutPassword });
});

router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const users = await User.find().select('-password'); // ไม่ส่งรหัส
  res.json({ users });
});

router.put('/admin/update-password/:id', authMiddleware, async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'กรุณากรอกรหัสใหม่' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(req.params.id, { password: hashed });

  res.json({ message: 'เปลี่ยนรหัสสำเร็จ' });
});

router.delete('/admin/delete-user/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (err) {
    console.error('ลบผู้ใช้ล้มเหลว:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบ' });
  }
});

// GET ห้องทั้งหมด
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถโหลดห้องได้' });
  }
});

// POST เพิ่มห้องใหม่
router.post('/rooms/add', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const {
    roomNumber,
    size,
    moveInDate = '1 เมษายน, 2025',
    amenities
  } = req.body;

  const priceMap = {
    M: "7,000/เดือน",
    L: "7,500/เดือน",
    XL: "8,000/เดือน"
  };

  const price = priceMap[size];
  if (!price) return res.status(400).json({ error: 'ขนาดห้องไม่ถูกต้อง (M, L, XL)' });

  try {
    const newRoom = new Room({
      roomNumber,
      size,
      price,
      moveInDate,
      amenities
    });
    await newRoom.save();
    res.status(201).json({ message: 'เพิ่มห้องสำเร็จ' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE ลบห้อง
router.delete('/rooms/:roomNumber', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const room = await Room.findOneAndDelete({ roomNumber: req.params.roomNumber });
    if (room) {
      // ✅ ลบสัญญาที่เชื่อมกับห้องนี้ด้วย
      await Contract.deleteMany({ room: room._id });
    }

    res.json({ message: 'ลบห้องและสัญญาที่เกี่ยวข้องสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบห้อง' });
  }
});


// ------------------------ REPORT ROUTES ------------------------

// GET คำร้องทั้งหมด
router.get('/reports', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'โหลดคำร้องไม่สำเร็จ' });
  }
});

// POST สร้างคำร้อง
router.post('/reports/create', async (req, res) => {
  const { roomNumber, title, detail } = req.body;

  try {
    const report = new Report({ roomNumber, title, detail });
    await report.save();
    res.status(201).json({ message: 'ส่งคำร้องสำเร็จ' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET คำร้องเฉพาะห้อง
router.get('/reports/:roomNumber', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ roomNumber: req.params.roomNumber });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'โหลดคำร้องไม่สำเร็จ' });
  }
});

// PUT อัปเดตสถานะคำร้อง
router.put('/reports/status/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'อัปเดตสถานะไม่สำเร็จ' });
  }
});

router.delete('/reports/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบคำร้องสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบคำร้อง' });
  }
});


// เปลี่ยนสถานะห้อง (vacant ↔ occupied)
router.put('/rooms/status/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { status } = req.body;

  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'อัปเดตสถานะห้องไม่สำเร็จ' });
  }
});


// ✅ CREATE สัญญาใหม่
router.post('/create', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { roomId, startDate, monthlyRent, deposit } = req.body;

  try {
    const contract = new Contract({
      user: userId,
      room: roomId,
      startDate,
      monthlyRent,
      deposit
    });

    await contract.save();

    // เปลี่ยนสถานะห้องเป็น occupied
    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });

    res.status(201).json({ message: 'สร้างสัญญาเช่าสำเร็จ', contract });
  } catch (err) {
    console.error("🚨 ข้อผิดพลาดจาก backend:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET สัญญาของผู้ใช้ (ดูของตัวเอง)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const contracts = await Contract.find({ user: req.user.userId })
      .populate('room', 'roomNumber size')
      .sort({ createdAt: -1 });

      const validContracts = contracts.filter(contract => contract.room !== null);

      res.json(validContracts);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสัญญาได้' });
  }
});

// ✅ GET สัญญาทั้งหมด (admin)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const contracts = await Contract.find()
      .populate('user', 'firstName lastName email tel')
      .populate('room', 'roomNumber size')
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลสัญญาได้' });
  }
});

// ✅ CANCEL สัญญา (admin)
router.put('/cancel/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { status: 'canceled' },
      { new: true }
    );

    // เปลี่ยนห้องกลับเป็น vacant ด้วย
    await Room.findByIdAndUpdate(updated.room, { status: 'vacant' });

    res.json({ message: 'ยกเลิกสัญญาแล้ว', contract: updated });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยกเลิกสัญญา' });
  }
});

router.delete('/contracts/cancel-payment/:id', authMiddleware, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'ไม่พบสัญญา' });

    await Room.findByIdAndUpdate(contract.room, { status: 'vacant' });
    await Contract.findByIdAndDelete(req.params.id);

    res.json({ message: 'ยกเลิกสัญญาและคืนสถานะห้องสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยกเลิกสัญญา' });
  }
});


router.put('/contracts/mark-paid/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid', paidAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถอัปเดตสถานะได้' });
  }
});

// 📤 User upload receipt
router.post('/contracts/upload-receipt/:id', authMiddleware, upload.single('receipt'), async (req, res) => {
  console.log('🧾 FILE:', req.file); // log file
  console.log('📦 CONTRACT ID:', req.params.id); // log ID

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ไม่พบไฟล์ที่อัปโหลด' });
    }

    const filePath = req.file.path;

    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        receiptImage: filePath,
        paymentStatus: 'pending',
        uploadedAt: new Date()
      },
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({ error: 'ไม่พบสัญญาในระบบ' });
    }

    res.json({ message: 'อัปโหลดใบเสร็จสำเร็จ', contract });
  } catch (err) {
    console.error('❌ Error uploading receipt:', err);
    res.status(500).json({ error: 'ไม่สามารถอัปโหลดใบเสร็จได้' });
  }
});


// ✅ Admin verify receipt
router.put('/contracts/verify-receipt/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { status, adminNote } = req.body;
  if (!['paid', 'rejected'].includes(status)) return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });

  try {
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status, adminNote, 
        paidAt: status === 'paid' ? new Date() : null
      },
      
      { new: true }
    );
    res.json({ message: `อัปเดตสถานะใบเสร็จเป็น ${status}`, contract: updated });
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถอัปเดตสถานะได้' });
  }
});

// ✅ DELETE สัญญาออกจากระบบถาวร
router.delete('/contracts/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const deletedContract = await Contract.findByIdAndDelete(req.params.id);

    if (!deletedContract) {
      return res.status(404).json({ error: 'ไม่พบสัญญาที่ต้องการลบ' });
    }

    res.json({ message: 'ลบสัญญาสำเร็จ' });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสัญญา' });
  }
});

// ✅ Admin สร้างบิลรายเดือน
router.post('/monthly-payments/create', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  const { userId, roomId, month, roomPrice, waterFee, electricityFee } = req.body;
  const totalAmount = roomPrice + waterFee + electricityFee;

  try {
    const payment = new MonthlyPayment({ 
      user: userId, room: roomId, month, roomPrice, waterFee, electricityFee, totalAmount 
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin ดึงข้อมูลทั้งหมด
router.get('/monthly-payments', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  try {
    const payments = await MonthlyPayment.find()
      .populate('user', 'firstName lastName email tel')
      .populate('room', 'roomNumber size')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin ยืนยันการชำระเงิน
router.put('/monthly-payments/confirm/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  try {
    const payment = await MonthlyPayment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'confirmed', paidAt: new Date() },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin ส่งข้อความเตือนให้ User
router.put('/monthly-payments/message/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  try {
    const { adminMessage } = req.body;
    const payment = await MonthlyPayment.findByIdAndUpdate(
      req.params.id,
      { adminMessage},
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------

// ✅ User ดึงข้อมูลชำระเงินตัวเอง
router.get('/monthly-payments/me', authMiddleware, async (req, res) => {
  try {
    const payments = await MonthlyPayment.find({ user: req.user.userId })
      .populate('room', 'roomNumber size')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ User อัปโหลดใบเสร็จชำระเงิน
router.post('/monthly-payments/upload-receipt/:id', authMiddleware, upload.single('receipt'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'กรุณาอัปโหลดไฟล์ใบเสร็จ' });

  try {
    const payment = await MonthlyPayment.findByIdAndUpdate(
      req.params.id,
      {
        receiptImage: req.file.path,
        paymentStatus: 'pending',
        uploadedAt: new Date()
      },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/monthly-payments/generate', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  const { month, waterFee, electricityFee } = req.body;

  try {
    const activeContracts = await Contract.find({ status: 'active' });

    const payments = activeContracts.map(async (contract) => {
      const totalAmount = contract.monthlyRent + waterFee + electricityFee;

      const newPayment = new MonthlyPayment({
        user: contract.user,
        room: contract.room,
        month,
        roomPrice: contract.monthlyRent,
        waterFee,
        electricityFee,
        totalAmount
      });

      return await newPayment.save();
    });

    const results = await Promise.all(payments);
    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างบิลรายเดือน' });
  }
});

router.post('/monthly-payments/generate-single', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ error: 'Unauthorized' });

  const { userId, roomId, month, waterFee, electricityFee } = req.body;

  try {
    const contract = await Contract.findOne({ user: userId, room: roomId, status: 'active' });

    if (!contract) {
      return res.status(400).json({ error: 'ไม่พบสัญญา active ของห้องนี้' });
    }

    const totalAmount = contract.monthlyRent + waterFee + electricityFee;

    const payment = new MonthlyPayment({
      user: userId,
      room: roomId,
      month,
      roomPrice: contract.monthlyRent,
      waterFee,
      electricityFee,
      totalAmount
    });

    await payment.save();
    res.json(payment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

// DELETE ลบรายการบิลรายเดือน
router.delete('/monthly-payments/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    console.log('🗑️ ลบรายการ:', req.params.id);

    await MonthlyPayment.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบรายการสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบรายการ' });
  }
});



module.exports = router;
