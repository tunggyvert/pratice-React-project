// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secretkey'); // ใช้ key เดียวกับตอน login
    req.user = decoded; // ใส่ user ลงใน req สำหรับใช้ใน route
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token ไม่ถูกต้อง' });
  }
};

module.exports = authMiddleware;
