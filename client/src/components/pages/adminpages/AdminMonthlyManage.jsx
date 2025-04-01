import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format } from 'date-fns';
import th from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('th', th);

// ✅ ช่องป้อนวันที่ custom
const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    type="text"
    onClick={onClick}
    ref={ref}
    value={value}
    readOnly
    placeholder="เลือกเดือน–ปี"
    className="w-full border border-black p-2 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
));

const AdminMonthlyManage = () => {
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [month, setMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [waterFee, setWaterFee] = useState('');
  const [electricityFee, setElectricityFee] = useState('');

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
    }
  };

  const formatMonthThai = (monthStr) => {
    const monthsThai = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    if (!monthStr || !monthStr.includes('-')) return 'ไม่ระบุเดือน';
    const [year, month] = monthStr.split('-');
    const m = parseInt(month, 10);
    if (isNaN(m) || m < 1 || m > 12) return 'เดือนไม่ถูกต้อง';
    return `${monthsThai[m - 1]} ${year}`;
  };

  const handleGenerateSingle = async () => {
    if (!selectedRoom || !month || waterFee < 0 || electricityFee < 0) {
      return toast.warn('โปรดกรอกข้อมูลให้ครบถ้วน');
    }

    const [userId, roomId] = selectedRoom.split(',');

    const isDuplicate = payments.some(
      (p) => p.user?._id === userId && p.room?._id === roomId && p.month === month
    );
    if (isDuplicate) {
      return toast.error(`❌ มีบิลของห้องนี้ในเดือน ${formatMonthThai(month)} แล้ว`);
    }

    try {
      await axios.post(
        'http://localhost:4000/monthly-payments/generate-single',
        { userId, roomId, month, waterFee, electricityFee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`✅ สร้างบิลเดือน ${formatMonthThai(month)} สำเร็จ!`);
      setMonth('');
      setSelectedDate(null);
      setWaterFee(0);
      setElectricityFee(0);
      setSelectedRoom('');
      fetchPayments();
    } catch (err) {
      toast.error('❌ เกิดข้อผิดพลาดในการสร้างบิล');
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
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบรายการนี้?")) return;
    try {
      await axios.delete(`http://localhost:4000/monthly-payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('🗑️ ลบรายการสำเร็จ');
      fetchPayments();
    } catch (err) {
      toast.error('❌ ลบไม่สำเร็จ');
    }
  };

  const sendMessage = async (id) => {
    const message = messages[id];
    if (!message) return toast.warn('กรุณาใส่ข้อความก่อน');

    try {
      await axios.put(`http://localhost:4000/monthly-payments/message/${id}`, {
        adminMessage: message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('📤 ส่งข้อความเตือนแล้ว');
      setMessages(prev => ({ ...prev, [id]: '' }));
      fetchPayments();
    } catch (err) {
      toast.error('ส่งข้อความไม่สำเร็จ');
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
            className="w-full border border-black p-2 rounded text-sm bg-white"
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

          {/* ✅ DatePicker UI ตรงตำแหน่งไม่เพี้ยน */}
          <div className="w-full relative z-10">
            <DatePicker
              locale="th"
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setMonth(format(date, 'yyyy-MM'));
              }}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              popperPlacement="bottom-start"
              popperModifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
              customInput={<CustomInput />}
            />
          </div>

          <input
            type="number"
            placeholder="ค่าน้ำ (บาท)"
            value={waterFee}
            onChange={(e) => setWaterFee(Number(e.target.value))}
            className="w-full border border-black p-2 rounded text-sm bg-white"
          />

          <input
            type="number"
            placeholder="ค่าไฟ (บาท)"
            value={electricityFee}
            onChange={(e) => setElectricityFee(Number(e.target.value))}
            className="w-full border border-black p-2 rounded text-sm bg-white"
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
          <p>📅 เดือน: {formatMonthThai(payment.month)}</p>
          <p>ยอดรวม: {payment.totalAmount.toLocaleString()} บาท</p>
          <p className={`font-semibold ${payment.paymentStatus === 'confirmed' ? 'text-green-600' : 'text-red-500'}`}>
            สถานะ: {payment.paymentStatus}
          </p>

          {payment.receiptImage && (
            <img src={`http://localhost:4000/${payment.receiptImage}`} className="w-48 mt-2 rounded" alt="receipt" />
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {payment.paymentStatus === 'pending' && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => confirmPayment(payment._id)}
              >
                ✅ ยืนยันการชำระเงิน
              </button>
            )}

            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => deletePayment(payment._id)}
            >
              🗑️ ลบรายการนี้
            </button>
          </div>

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
