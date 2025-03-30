import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRoom = () => {
  const [contract, setContract] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [amount, setAmount] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axios.get('http://localhost:4000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if(res.data.length > 0){
          setContract(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContract();
  }, [token]);

  if (!contract) return <p className="text-center mt-10">กำลังโหลดข้อมูลสัญญา...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🏠 สถานะห้องพักของคุณ</h2>

      <div className="bg-white shadow rounded-lg p-4 space-y-2">
       <p><strong>เลขห้อง:</strong> {contract.room?.roomNumber || 'ไม่มีข้อมูลห้อง'}</p>
       <p><strong>ขนาดห้อง:</strong> {contract.room?.size || 'ไม่มีข้อมูลขนาด'}</p>
       <p><strong>วันที่เริ่มสัญญา:</strong> {new Date(contract.startDate).toLocaleDateString() || 'ไม่มีข้อมูล'}</p>
        <p><strong>ราคาต่อเดือน:</strong> {contract.monthlyRent.toLocaleString() || 'ไม่มีข้อมูล'} บาท</p>
      <p><strong>สถานะการชำระเงิน:</strong> {contract.paymentStatus || 'ไม่มีข้อมูล'}</p>
      </div>

    </div>
  );
};

export default UserRoom;
