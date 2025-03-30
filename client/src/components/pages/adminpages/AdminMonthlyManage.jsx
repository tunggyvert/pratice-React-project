import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AdminMonthlyManage = () => {
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [month, setMonth] = useState('');
  const [waterFee, setWaterFee] = useState(0);
  const [electricityFee, setElectricityFee] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPayments();
    fetchRooms();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/monthly-payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:4000/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const paidContracts = res.data.filter(
        c => (c.paymentStatus === 'paid' || c.paymentStatus === 'confirmed') && c.room && c.user
      );
      setRooms(paidContracts);
    } catch (err) {
      toast.error('โหลดข้อมูลห้องไม่สำเร็จ');
      console.error(err);
    }
  };


  const handleGenerateSingle = async () => {
    if (!selectedRoom || !month || waterFee < 0 || electricityFee < 0) {
      return toast.warn('โปรดกรอกข้อมูลให้ครบถ้วน');
    }

    const [userId, roomId] = selectedRoom.split(',');

    try {
      await axios.post('http://localhost:4000/monthly-payments/generate-single', {
        userId,
        roomId,
        month,
        waterFee,
        electricityFee
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`✅ สร้างบิลเดือน ${month} สำเร็จ!`);
      setMonth('');
      setWaterFee(0);
      setElectricityFee(0);
      setSelectedRoom('');
      fetchPayments();
    } catch (err) {
      toast.error('❌ เกิดข้อผิดพลาดในการสร้างบิล');
      console.error(err);
    }
  };

  const confirmPayment = async (id) => {
    try {
      await axios.put(`http://localhost:4000/monthly-payments/confirm/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ ยืนยันการชำระเงินสำเร็จ');
      fetchPayments();
    } catch (err) {
      toast.error('ยืนยันไม่สำเร็จ');
      console.error(err);
    }
  };

  const sendMessage = async (id) => {
    const message = messages[id];
    if (!message) return toast.warn('กรุณาใส่ข้อความก่อน');

    try {
      const qrImageUrl = `${window.location.origin}/qrpromptpay.jpg`;
      await axios.put(`http://localhost:4000/monthly-payments/message/${id}`, {
        adminMessage: message,
        qrImageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('📤 ส่งข้อความเตือนแล้ว');
      setMessages(prev => ({ ...prev, [id]: '' }));
      fetchPayments();
    } catch (err) {
      toast.error('ส่งข้อความไม่สำเร็จ');
      console.error(err);
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ จัดการการชำระเงินรายเดือน</h2>

      <div className="bg-indigo-100 p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">📅 สร้างบิลรายเดือน (รายห้อง)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">เลือกห้องพัก</option>
            {rooms.map(r => (
              r.room && r.user && (
                <option key={r._id} value={`${r.user._id},${r.room._id}`}>
                  ห้อง {r.room.roomNumber} - {r.user.firstName} {r.user.lastName}
                </option>
              )
            ))}
          </select>

          <input
            type="text"
            placeholder="เดือน (เช่น เมษายน 2025)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="ค่าน้ำ (บาท)"
            value={waterFee}
            onChange={(e) => setWaterFee(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="ค่าไฟ (บาท)"
            value={electricityFee}
            onChange={(e) => setElectricityFee(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleGenerateSingle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          🚀 สร้างบิลรายห้อง
        </button>
      </div>

      {payments.map(payment => (
        <div key={payment._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <p>👤 {payment.user?.firstName} {payment.user?.lastName}</p>
          <p>🏠 ห้อง {payment.room?.roomNumber}</p>
          <p>📅 เดือน: {payment.month}</p>
          <p>ยอดรวม: {payment.totalAmount.toLocaleString()} บาท</p>
          <p className={`font-semibold ${payment.paymentStatus === 'confirmed' ? 'text-green-600' : 'text-red-500'
            }`}>
            สถานะ: {payment.paymentStatus}
          </p>

          {payment.receiptImage && (
            <img src={`http://localhost:4000/${payment.receiptImage}`} className="w-48 mt-2 rounded" alt="receipt" />
          )}

          {payment.qrImageUrl && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700">📱 QR Code ที่ส่งไป:</h4>
              <img src={payment.qrImageUrl} className="w-48 mt-2 rounded" alt="PromptPay QR" />
            </div>
          )}

          {payment.paymentStatus === 'pending' && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
              onClick={() => confirmPayment(payment._id)}
            >
              ✅ ยืนยันการชำระเงิน
            </button>
          )}

          {/* ✅ ส่วนที่หายไป (ช่องข้อความเตือน) */}
          <div className="mt-3">
            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="พิมพ์ข้อความเตือนผู้เช่า..."
              value={messages[payment._id] || ''}
              onChange={(e) => setMessages(prev => ({ ...prev, [payment._id]: e.target.value }))}
            />
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-2"
              onClick={() => sendMessage(payment._id)}
            >
              📤 ส่งข้อความเตือน
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMonthlyManage;
