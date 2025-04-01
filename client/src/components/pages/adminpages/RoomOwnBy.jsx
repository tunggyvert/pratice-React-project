import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomOwnBy = () => {
  const [paidContracts, setPaidContracts] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const token = localStorage.getItem('token');

  const fetchPaidContracts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paidData = res.data.filter(
        contract =>
          (contract.paymentStatus === 'paid' || contract.paymentStatus === 'confirmed') &&
          contract.user && contract.room
      );

      setPaidContracts(paidData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaidContracts();
  }, []);

  const filteredContracts = paidContracts.filter(contract => {
    if (selectedFloor === 'all') return true;
    const roomNumber = contract.room?.roomNumber || '';
    return roomNumber.startsWith(selectedFloor);
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 รายชื่อผู้ครองห้อง (ชำระเงินแล้ว)</h2>

      {/* 🔽 Filter ชั้น */}
      <div className="mb-6">
        <label className="mr-2 font-medium">เลือกชั้น:</label>
        <select
          className="border px-3 py-1 rounded"
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          {Array.from({ length: 10 }, (_, i) => {
            const fl = String(i + 1).padStart(2, '0');
            return <option key={fl} value={fl}>ชั้น {fl}</option>;
          })}
        </select>
      </div>

      {filteredContracts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContracts.map(contract => (
            <div key={contract._id} className="bg-white shadow rounded p-4">
              <p className="font-semibold text-lg mb-1">
                🧍‍♂️ {contract.user?.firstName} {contract.user?.lastName}
              </p>
              <p className="text-sm text-gray-700">📧 {contract.user?.email || 'ไม่มีอีเมล'}</p>
              <p className="text-sm text-gray-700">📱 {contract.user?.tel || 'ไม่มีเบอร์โทร'}</p>
              <p className="text-sm mt-2">
                🏠 ห้อง: <strong>{contract.room?.roomNumber || 'ไม่มีข้อมูล'}</strong>
              </p>
              <p className="text-sm">
                💰 สถานะ: <span className={
                  contract.paymentStatus === 'confirmed'
                    ? 'text-green-700 font-semibold'
                    : 'text-green-500 font-semibold'
                }>
                  {contract.paymentStatus}
                </span>
              </p>
              <p className="text-sm">📅 วันที่ชำระ: {contract.paidAt
                ? new Date(contract.paidAt).toLocaleDateString()
                : 'ไม่มีข้อมูล'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">ไม่พบข้อมูลผู้ที่ชำระเงินแล้ว</p>
      )}
    </div>
  );
};

export default RoomOwnBy;
