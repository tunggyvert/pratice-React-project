import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      const selectedSize = JSON.parse(localStorage.getItem("selectedRoom"))?.size;

      if (!selectedSize) {
        alert("⚠️ กรุณาเลือกขนาดห้องก่อน!");
        navigate("/book-process/step1");
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vacantRooms = res.data.filter(
          (room) => room.status === "vacant" && room.size === selectedSize
        );
        setRooms(vacantRooms);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลห้องได้:", err);
      }
    };

    fetchRooms();
  }, [navigate]);

  const handleCancel = () => {
    setShowPopup(true);
  };

  const confirmCancel = () => {
    setSelectedRoom(null);
    setShowPopup(false);
    localStorage.removeItem("selectedRoom");
    navigate("/book-process/step1");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">ห้องที่ว่าง ({JSON.parse(localStorage.getItem("selectedRoom"))?.size})</h2>

      <div className="mt-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room._id}
              className={`border p-4 rounded-lg shadow-md bg-white mb-4 cursor-pointer ${
                selectedRoom?._id === room._id ? "border-blue-500" : ""
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <h3 className="text-lg font-semibold">ห้อง #{room.roomNumber}</h3>
              <p className="text-gray-600">ขนาด: {room.size}</p>
              <p className="text-gray-600">ราคา: {room.price}</p>
              <p className="text-gray-500">เข้าอยู่ได้: {room.moveInDate}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีห้องว่างในขนาดที่เลือก</p>
        )}
      </div>

      {selectedRoom && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
          <h3 className="text-lg font-semibold">เลือกห้อง: #{selectedRoom.roomNumber}</h3>
          <p className="text-gray-600">ขนาด: {selectedRoom.size}</p>
          <p className="text-gray-600">ราคา: {selectedRoom.price}</p>
          <p className="text-gray-500">เข้าอยู่ได้: {selectedRoom.moveInDate}</p>
          <h4 className="mt-2 font-semibold">สิ่งอำนวยความสะดวก:</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {selectedRoom.amenities?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          กลับ
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            selectedRoom
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() =>
            selectedRoom &&
            navigate("/book-process/step3", { state: { room: selectedRoom } })
          }
          disabled={!selectedRoom}
        >
          ไปต่อ
        </button>

        {selectedRoom && (
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
            onClick={handleCancel}
          >
            ยกเลิกการจอง
          </button>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-xl font-bold">ยืนยันการยกเลิก</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจอง?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                ยืนยันยกเลิก
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                กลับ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
