import React ,{useState} from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";

const steps = [
  { id: 1, name: "เลือกขนาดห้อง", path: "/book-process/step1" },
  { id: 2, name: "รายละเอียดของห้อง/ห้องว่าง", path: "/book-process/step2" },
  { id: 3, name: "สัญญาการเช่าอยู่", path: "/book-process/step3" },
  { id: 4, name: "แจ้งราคา", path: "/book-process/step4" },
  { id: 5, name: "ชำระเงิน", path: "/book-process/step5" },
];

const StepProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(true); // เพิ่ม state สำหรับควบคุมการแสดงผลปุ่ม

  const toggleBackButton = () => {
    setShowBackButton(!showBackButton); // ฟังก์ชันสำหรับสลับสถานะการแสดงผลปุ่ม
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Step bar */}
      <div className="flex justify-between items-center bg-white shadow p-3 rounded-md mb-6">
        {steps.map((step) => (
          <button
            key={step.id}
          
            className={`flex-1 text-center py-2 px-4 text-sm md:text-base font-medium transition-all duration-200 ${
              location.pathname === step.path
                ? "bg-red-500 text-white rounded-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {step.id}. {step.name}
          </button>
        ))}
      </div>

      {/* Content for each step */}
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>

      {showBackButton && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-center">
          <button onClick={toggleBackButton} className="mr-2">
            ซ่อน
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      )}
      {!showBackButton && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-center">
          <button onClick={toggleBackButton}>แสดง</button>
        </div>
      )}
    </div>
  );
};

export default StepProgress;
