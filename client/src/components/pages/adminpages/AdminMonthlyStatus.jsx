import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const AdminMonthlyStatus = () => {
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/monthly-payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบรายการนี้?')) return;
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📊 สถานะการชำระเงินรายเดือนของแต่ละห้อง</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {payments.map((p) => (
          <div key={p._id} className="bg-white border p-4 rounded shadow">
            <p className="font-semibold">🏠 ห้อง: {p.room?.roomNumber}</p>
            <p>👤 ผู้เช่า: {p.user?.firstName} {p.user?.lastName}</p>
            <p>📅 เดือน: {formatMonthThai(p.month)}</p>
            <p className={`font-medium ${
              p.paymentStatus === 'confirmed'
                ? 'text-green-600'
                : p.paymentStatus === 'pending'
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}>
              สถานะ: {
                p.paymentStatus === 'confirmed'
                  ? '✅ ชำระแล้ว'
                  : p.paymentStatus === 'pending'
                  ? '🕒 รอยืนยัน'
                  : '❌ ยังไม่ชำระ'
              }
            </p>

            <button
              onClick={() => deletePayment(p._id)}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              🗑️ ลบรายการนี้
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMonthlyStatus;
