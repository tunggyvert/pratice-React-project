import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Quote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const { room, contract } = location.state || {};

  const [depositPaid, setDepositPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!room || !contract) return <p className="text-center mt-10">ไม่พบข้อมูลห้องหรือสัญญา</p>;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:4000/create',
        {
          roomId: room._id,
          startDate: contract.startDate,
          monthlyRent: contract.monthlyRent,
          deposit: 1500
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      const newContract = res.data.contract; // ✅ ใช้สัญญาจริงที่ได้จาก backend
  
      toast.success("✅ สร้างสัญญาเช่าสำเร็จ!");
      navigate('/book-process/step5', { state: { contract: newContract } });
    } catch (err) {
      toast.dismiss(loadingToast);
      if (err.response) {
        toast.error(`❌ ${err.response.data.error}`);
        console.error("❌ Backend Error:", err.response.data.error);
      } else {
        toast.error(`❌ Network Error: ${err.message}`);
        console.error("❌ Network Error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const totalPrice = contract.monthlyRent * contract.months + 10000 + 1500;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">สรุปใบเสนอราคา</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ul className="text-gray-700 space-y-2">
          <li className="flex justify-between">
            <span>ค่าห้อง ({contract.months} เดือน):</span>
            <span>{(contract.monthlyRent * contract.months).toLocaleString()} บาท</span>
          </li>
          <li className="flex justify-between">
            <span>ค่าสัญญา:</span>
            <span>{(10000).toLocaleString()} บาท</span>
          </li>
          <li className="flex justify-between">
            <span>ค่ามัดจำ:</span>
            <span>{(1500).toLocaleString()} บาท</span>
          </li>
          <li className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>ยอดรวมค่าใช้จ่ายระหว่างในสัญญา:</span>
            <span>{totalPrice.toLocaleString()} บาท</span>
          </li>
        </ul>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-700">ยอมรับในสัญญา</h3>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="payDeposit"
            className="w-5 h-5"
            checked={depositPaid}
            onChange={() => setDepositPaid(!depositPaid)}
          />
          <label htmlFor="payDeposit" className="ml-2 text-gray-700 cursor-pointer">
            ยินยอม
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="bg-gray-500 text-white px-6 py-2 rounded-lg" onClick={() => navigate(-1)}>
          กลับ
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${
            depositPaid ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleConfirm}
          disabled={!depositPaid || loading}
        >
          {loading ? "กำลังดำเนินการ..." : "✅ ยืนยันการเช่า"}
        </button>
      </div>
    </div>
  );
};

export default Quote;
