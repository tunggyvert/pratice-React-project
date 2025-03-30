import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sizePriceMap = {
  M: "7,000/เดือน",
  L: "7,500/เดือน",
  XL: "8,000/เดือน"
};

const RoomManage= () => {
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [size, setSize] = useState('M');
  const [moveInDate, setMoveInDate] = useState('');
  const [amenities, setAmenities] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'vacant' ? 'occupied' : 'vacant';
    try {
      await axios.put(`http://localhost:4000/rooms/status/${id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRooms();
    } catch (err) {
      alert('เปลี่ยนสถานะห้องไม่สำเร็จ');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:4000/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error('โหลดห้องไม่สำเร็จ:', err);
    }
  };

  const addRoom = async () => {
    if (!roomNumber || !moveInDate) return alert('กรอกข้อมูลให้ครบ');

    try {
      await axios.post(
        'http://localhost:4000/rooms/add',
        {
          roomNumber,
          size,
          moveInDate,
          amenities: amenities.split(',').map(a => a.trim())
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoomNumber('');
      setMoveInDate('');
      setAmenities('');
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    }
  };

  const deleteRoom = async (roomNumber) => {
    if (!window.confirm(`ลบห้อง ${roomNumber}?`)) return;
    try {
      await axios.delete(`http://localhost:4000/rooms/${roomNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch (err) {
      alert('ลบไม่สำเร็จ');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 จัดการห้องพัก (Admin)</h2>

      {/* เพิ่มห้อง */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">➕ เพิ่มห้องใหม่</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
          <input
            className="border p-2 rounded"
            placeholder="เลขห้อง (เช่น 0405)"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="M">M (7,000฿)</option>
            <option value="L">L (7,500฿)</option>
            <option value="XL">XL (8,000฿)</option>
          </select>
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="วันที่เข้าอยู่ เช่น 1 พฤษภาคม, 2025"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
          />
        </div>
        <textarea
          className="border p-2 rounded w-full mb-3"
          placeholder="สิ่งอำนวยความสะดวก (คั่นด้วย ,)"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
        <button
          onClick={addRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เพิ่มห้อง
        </button>
      </div>

      {/* รายการห้อง */}
      <div className="grid gap-4">
        {rooms.map((room) => (
       <div key={room._id} className="border p-4 rounded-lg bg-white shadow flex justify-between items-center">
       <div>
         <h4 className="font-semibold text-lg">ห้อง #{room.roomNumber}</h4>
         <p>ขนาด: {room.size} | ราคา: {room.price}</p>
         <p>สถานะ: <span className={
           room.status === 'vacant' ? 'text-green-500' : 'text-red-500'
         }>
           {room.status === 'vacant' ? 'ว่าง' : 'ไม่ว่าง'}
         </span></p>
         <p>เข้าอยู่ได้: {room.moveInDate}</p>
         <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
           {room.amenities?.map((a, i) => <li key={i}>{a}</li>)}
         </ul>
   
         {/* 🔁 ปุ่มเปลี่ยนสถานะ */}
         <button
           className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
           onClick={() => toggleStatus(room._id, room.status)}
         >
           เปลี่ยนเป็น: {room.status === 'vacant' ? 'ไม่ว่าง' : 'ว่าง'}
         </button>
       </div>
   
       <button
         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
         onClick={() => deleteRoom(room.roomNumber)}
       >
         ลบ
       </button>
     </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManage;
