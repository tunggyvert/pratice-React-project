import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import gim2 from "../../../assets/Groveimage/gim2.jpg"; // รูปตัวอย่าง (เช็ค path)

const Floor = () => {
  const navigate = useNavigate();
  const [roomsAvailable, setRoomsAvailable] = useState({
    M: 0,
    L: 0,
    XL: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:4000/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const availableCounts = { M: 0, L: 0, XL: 0 };

      res.data.forEach(room => {
        if (room.status === 'vacant') {
          availableCounts[room.size]++;
        }
      });

      setRoomsAvailable(availableCounts);
    } catch (err) {
      console.error(err);
    }
  };

  const roomDetails = [
    { id: 1, size: 'M', name: "Size M | ขนาด 26 ตร.ม.", price: "7,000/เดือน", image: gim2 },
    { id: 2, size: 'L', name: "Size L | ขนาด 34 ตร.ม.", price: "7,500/เดือน", image: gim2 },
    { id: 3, size: 'XL', name: "Size XL | ขนาด 40 ตร.ม.", price: "8,000/เดือน", image: gim2 },
  ];

  const selectRoom = (room) => {
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    navigate("/book-process/step2");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center">เลือกขนาดห้อง</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {roomDetails.map((room) => (
          <div
            key={room.id}
            className="border p-4 rounded-lg shadow-md bg-white flex flex-col items-center"
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-60 h-60 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2 text-center">{room.name}</h3>
            <p className="text-gray-600 text-center">{room.price}</p>
            <button
              className={`mt-2 px-4 py-2 rounded-lg ${
                roomsAvailable[room.size] > 0 ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-100 cursor-not-allowed'
              }`}
              onClick={() => roomsAvailable[room.size] > 0 && selectRoom(room)}
              disabled={roomsAvailable[room.size] === 0}
            >
              ({roomsAvailable[room.size]}) ว่างอยู่
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Floor;
