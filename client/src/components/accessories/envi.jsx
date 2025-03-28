import React, { useState } from 'react';
import { FaStore } from 'react-icons/fa';
import { IoIosCafe } from "react-icons/io";
import { GrCafeteria } from "react-icons/gr";
import { IoMdFitness } from "react-icons/io";


const facilitiesData = [
  {
    icon: <IoIosCafe size={60} className="text-gray-600" />,
    name: 'cafe',
    description: <p className='text-light'>หอเรามี cafe ใกล้หอพักสำหรับนักศึกษาที่อยากผ่อนคลาย,ทำงาน,อ่านหนังสือ
    <li>COMMU Rooftop Cafe </li>
    </p>
  },
  {
    icon: <GrCafeteria size={60} className="text-gray-600" />,
    name: 'ร้านอาหาร',
    description: <p className='text-light'>หอเราตั้งอยู่ย่านหลังตัวมหาวิทยาลัยทำให้มีตัวเลือกมากมาย
    <li>ร้านก๋วยเตี๋ยวลูกชิ้นหมูบีเอ็ม</li>
    <li>ตำแซ่บ วงศ์สว่าง ซ.11</li>
    <li>Turtle Bakery</li>
    <li>ร้านข้าวแกง หม่อนเดย์ (Monday Foods and Drinks)</li>
    <li>Oh Yes Steak</li>
    <li>ป.ประทีป บ้านก๋วยเตี๋ยวเรือ วงศ์สว่าง 11</li>
    <li>266/3ซ.วงศ์สว่าง11ร้านเครปนมสดป้าสุหลังม.</li>
    <li>ร้านชาบู,หมาล่า,อาหารตามสั่ง,หมูกระทะ และอีกมากมาย</li>
    </p>,
  },
  {
    icon: <FaStore size={60} className="text-gray-600" />,
    name: 'ร้านสะดวกซื้อ',
    description: <p classname='text-light'>หอเรามีร้านสะดวกซื้อใกล้หอรวมถึง 7-eleven หลายที่
    กล้ๆ Grove residences วงศ์สว่าง 11 มี 7-11 อยู่ 3 สาขา:
    <li>7-Eleven สาขา วงศ์สว่าง 11 จุด 4 (08912)</li>
    <li>7-Eleven สาขา วงศ์สว่างศ์ 11 จุด 3 (07225)</li>
    <li>7-Eleven สาขา วงศ์สว่าง 11 (01589)</li>
    </p>,
  },
  {
    icon: <IoMdFitness  size={60} className="text-gray-600" />,
    name: 'สถานที่ออกกำลังกาย',
    description: <p className='text-light'>สถานที่ออกกำลังกาย สำหรับนักศึกษาที่ต้องการออกกำลังกาย
    <li>เมนเทอร์ยิม(Mentor Gym) วงศ์สว่าง 11</li>
    </p>,
  },
];

const envi = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-[34px] font-semibold text-center mb-10">สิ่งแวดล้อมรอบหอพัก</h2>

      {/* Icons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
        {facilitiesData.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="flex flex-col items-center cursor-pointer hover:scale-110 transition"
          >
            {item.icon}
            <p className="mt-2 font-medium text-center">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Info Box */}
      {selectedIndex !== null && (
        <div className="mt-10 bg-white border border-gray-300 shadow-md rounded-xl p-6 max-w-xl mx-auto animate-fade-in">
          <h3 className="text-xl font-semibold mb-2">
            {facilitiesData[selectedIndex].name}
          </h3>
          <p className="text-gray-700">{facilitiesData[selectedIndex].description}</p>
          <button
            onClick={() => setSelectedIndex(null)}
            className="mt-4 text-sm text-red-500 hover:underline"
          >
            ✖ ปิด
          </button>
        </div>
      )}
    </div>
  );
};

export default envi;
