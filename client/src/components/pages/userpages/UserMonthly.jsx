import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import imgQr from '/qrpromptpay.jpg'; 

const UserMonthly = () => {
  const [payments, setPayments] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/monthly-payments/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handleUpload = async (id) => {
    if (!receipt) return toast.warn('กรุณาเลือกไฟล์ก่อน');
    const formData = new FormData();
    formData.append('receipt', receipt);

    try {
      await axios.post(`http://localhost:4000/monthly-payments/upload-receipt/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('✅ อัปโหลดใบเสร็จสำเร็จ');
      fetchPayments();
      setReceipt(null);
    } catch (err) {
      toast.error('❌ อัปโหลดไม่สำเร็จ');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📅 ชำระเงินรายเดือน</h2>

      {payments.map(payment => (
        <div key={payment._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="font-semibold">📌 เดือน: {payment.month}</h3>
          <p>ค่าห้อง: {payment.roomPrice} บาท</p>
          <p>ค่าน้ำ: {payment.waterFee} บาท</p>
          <p>ค่าไฟ: {payment.electricityFee} บาท</p>
          <h4 className="text-lg font-semibold text-blue-600">
            รวมทั้งหมด: {payment.totalAmount.toLocaleString()} บาท
          </h4>
          <img src={imgQr} alt="QR Code" className="w-48 mt-2 rounded" />
          <p className={`mt-2 font-medium ${
            payment.paymentStatus === 'confirmed' ? 'text-green-600' : 'text-red-500'
          }`}>
            สถานะ: {payment.paymentStatus}
          </p>

          {payment.adminMessage && (
            <div className="bg-yellow-100 p-2 rounded my-2">
              ✉️ ข้อความจากแอดมิน: {payment.adminMessage}
            </div>
          )}

          {payment.paymentStatus === 'unpaid' && (
            <div className="mt-3">
              <input type="file" onChange={(e) => setReceipt(e.target.files[0])} />
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleUpload(payment._id)}
              >
                อัปโหลดสลิป
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserMonthly;
