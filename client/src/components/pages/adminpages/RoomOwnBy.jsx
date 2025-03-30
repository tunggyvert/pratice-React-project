import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomOwnBy = () => {
  const [paidContracts, setPaidContracts] = useState([]);
  const token = localStorage.getItem('token');

  const fetchPaidContracts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paidData = res.data.filter(
        contract => 
          (contract.paymentStatus === 'paid' || contract.paymentStatus === 'confirmed') &&
          contract.user && contract.room // เช็คให้มีข้อมูล user และ room
      );

      setPaidContracts(paidData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaidContracts();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 รายชื่อผู้ครองห้อง (ชำระเงินแล้ว)</h2>

      {paidContracts.length > 0 ? (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-2 px-4">ชื่อผู้เช่า</th>
              <th className="py-2 px-4">อีเมล</th>
              <th className="py-2 px-4">เบอร์โทร</th>
              <th className="py-2 px-4">เลขห้อง</th>
              <th className="py-2 px-4">สถานะชำระเงิน</th>
              <th className="py-2 px-4">วันที่ชำระเงิน</th>
            </tr>
          </thead>
          <tbody>
            {paidContracts.map(contract => (
              <tr key={contract._id} className="text-center border-b hover:bg-gray-100">
                <td className="py-2 px-4">
                  {contract.user?.firstName} {contract.user?.lastName}
                </td>
                <td className="py-2 px-4">
                  {contract.user?.email || 'ไม่มีข้อมูล'}
                </td>
                <td className="py-2 px-4">
                  {contract.user?.tel || 'ไม่มีข้อมูล'}
                </td>
                <td className="py-2 px-4">
                  {contract.room?.roomNumber || 'ไม่มีข้อมูลห้อง'}
                </td>
                <td className="py-2 px-4">
                  <span className={
                    contract.paymentStatus === 'confirmed'
                      ? 'text-green-700 font-semibold'
                      : 'text-green-500 font-semibold'
                  }>
                    {contract.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {contract.paidAt
                    ? new Date(contract.paidAt).toLocaleDateString()
                    : 'ไม่มีข้อมูลวันที่'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">ไม่พบข้อมูลผู้ที่ชำระเงินแล้ว</p>
      )}
    </div>
  );
};

export default RoomOwnBy;
