import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PayManagement = () => {
  const [contracts, setContracts] = useState([]);
  const token = localStorage.getItem('token');

  const fetchContracts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ✅ ยกเลิกสัญญาและคืนห้อง
  const handleCancel = async (contractId, roomId) => {
    if (!window.confirm('❌ ยืนยันการลบสัญญานี้และคืนห้องเป็นว่าง?')) return;

    try {
      await axios.put(`http://localhost:4000/cancel/${contractId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(`http://localhost:4000/rooms/status/${roomId}`, { status: 'vacant' }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ ยกเลิกสัญญาและคืนห้องสำเร็จ');
      fetchContracts();
    } catch (err) {
      alert('❌ ไม่สามารถยกเลิกสัญญาได้');
    }
  };

  // ✅ ยืนยันหรือปฏิเสธใบเสร็จ
  const verifyReceipt = async (contractId, status) => {
    try {
      await axios.put(`http://localhost:4000/contracts/verify-receipt/${contractId}`, {
        status,
        adminNote: status === 'rejected' ? 'ตรวจสอบแล้วไม่ถูกต้อง' : 'ยืนยันการชำระเงินแล้ว'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`✅ อัปเดตสถานะเป็น ${status} แล้ว`);
      fetchContracts();
    } catch (err) {
      alert('❌ ไม่สามารถอัปเดตสถานะได้');
    }
  };

  // ✅ ลบสัญญาถาวร
  const deleteContract = async (contractId) => {
    if (!window.confirm('⚠️ ยืนยันการลบประวัติสัญญานี้ถาวร?')) return;

    try {
      await axios.delete(`http://localhost:4000/contracts/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ ลบประวัติสัญญาสำเร็จ');
      fetchContracts();
    } catch (err) {
      alert('❌ ลบสัญญาไม่สำเร็จ');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 รายการสัญญาทั้งหมด (Admin)</h2>

      {contracts.map((contract) => (
        <div key={contract._id} className="bg-white shadow rounded p-4 mb-4">
          <p><strong>ผู้เช่า:</strong> {contract.user?.firstName} {contract.user?.lastName}</p>
          <p><strong>ห้อง:</strong> #{contract.room?.roomNumber}</p>
          <p><strong>สถานะสัญญา:</strong> {contract.status}</p>
          <p>
            <strong>สถานะชำระเงิน:</strong> 
            <span className={
              contract.paymentStatus === 'paid' ? 'text-green-600' :
              contract.paymentStatus === 'pending' ? 'text-yellow-500' :
              contract.paymentStatus === 'confirmed' ? 'text-green-700 font-bold' :
              'text-red-500'
            }>
              {contract.paymentStatus}
            </span>
          </p>

          {/* ✅ แสดงใบเสร็จ */}
          {contract.receiptImage && (
            <div className="my-2">
              <img
                src={`http://localhost:4000/${contract.receiptImage}`}
                alt="ใบเสร็จ"
                className="max-w-xs rounded shadow border"
              />
            </div>
          )}

          {/* ✅ ยืนยันหรือปฏิเสธการชำระเงิน */}
          {contract.paymentStatus === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => verifyReceipt(contract._id, 'paid')}
              >
                ✔️ ยืนยันชำระเงิน
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => verifyReceipt(contract._id, 'rejected')}
              >
                ❌ ปฏิเสธ
              </button>
            </div>
          )}

          {/* ✅ ยกเลิกสัญญา */}
          {contract.status !== 'canceled' && (
            <button
              className="mt-3 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
              onClick={() => handleCancel(contract._id, contract.room._id)}
            >
              ❌ ยกเลิกสัญญา & คืนห้อง
            </button>
          )}

          {/* ✅ ปุ่มลบประวัติสัญญาแบบถาวร */}
          {contract.status === 'canceled' && (
            <button
              className="mt-3 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => deleteContract(contract._id)}
            >
              🗑 ลบประวัติสัญญา
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PayManagement;
