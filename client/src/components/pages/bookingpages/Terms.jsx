import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const room = location.state?.room;

  if (!room) return <p>ไม่พบข้อมูลห้อง</p>;

  const leaseTermsOptions = [6, 10, 12]; // จำนวนเดือน
  const monthlyRent = parseInt(room.price.replace(/[^\d]/g, '')); // ดึงเลขจาก "7,500/เดือน"
  const totalPrice = selectedTerm ? monthlyRent * selectedTerm : 0;

  const handleTermSelection = (term) => {
    setSelectedTerm(selectedTerm === term ? null : term);
  };

  const handleNext = () => {
    if (!accepted || !selectedTerm) return;
    navigate('/book-process/step4', {
      state: {
        room,
        contract: {
          months: selectedTerm,
          totalPrice,
          monthlyRent,
          startDate: new Date()
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">เลือกระยะเวลาสัญญาเช่า</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ul className="list-none space-y-2 text-gray-700">
          {leaseTermsOptions.map((term) => (
            <li key={term} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={term}
                checked={selectedTerm === term}
                onChange={() => handleTermSelection(term)}
                className="w-5 h-5"
              />
              <span>{term} เดือน</span>
            </li>
          ))}
        </ul>
        {selectedTerm && (
          <div className="mt-4 text-blue-600 font-medium">
            💰 รวมค่าเช่า {selectedTerm} เดือน: {totalPrice.toLocaleString()} บาท
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-center mt-6">สัญญาเช่าที่พัก</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ul className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>ผู้เช่าต้องชำระค่าเช่าภายในวันที่กำหนดของแต่ละเดือน</li>
          <li>ห้ามนำสัตว์เลี้ยงเข้ามาในที่พักโดยไม่ได้รับอนุญาต</li>
          <li>ค่าน้ำ 10 บาท/หน่วย ค่าไฟ 8 บาท/หน่วย</li>
          <li>ห้ามส่งเสียงดังรบกวนผู้อื่นในช่วงเวลา 22:00 - 07:00 น.</li>
          <li>ต้องแจ้งล่วงหน้าอย่างน้อย 30 วันก่อนย้ายออก</li>
        </ul>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="accept"
            className="w-5 h-5"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <label htmlFor="accept" className="ml-2 text-gray-700 cursor-pointer">
            ฉันยอมรับเงื่อนไขการเช่า
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="bg-gray-500 text-white px-6 py-2 rounded-lg" onClick={() => navigate(-1)}>
          กลับ
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${
            accepted && selectedTerm ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!accepted || !selectedTerm}
        >
          ไปต่อ
        </button>
      </div>
    </div>
  );
};

export default Terms;
