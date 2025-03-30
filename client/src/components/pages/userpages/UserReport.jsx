import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserReport = () => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [reports, setReports] = useState([]);
  const [roomNumber, setRoomNumber] = useState(null);
  const token = localStorage.getItem('token');

  // ✅ ดึงเลขห้องจากสัญญาผู้ใช้งาน
  const fetchRoomNumber = async () => {
    try {
      const res = await axios.get('http://localhost:4000/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeContract = res.data.find(c => c.status === 'active');
      if (activeContract) {
        setRoomNumber(activeContract.room.roomNumber);
      } else {
        toast.warn('ไม่พบข้อมูลห้องพักที่คุณเช่าอยู่', { theme: 'colored' });
      }
    } catch (err) {
      toast.error('❌ ไม่สามารถดึงข้อมูลสัญญาได้', { theme: 'colored' });
      console.error(err);
    }
  };

  // ✅ ดึงข้อมูลคำร้องตามเลขห้อง
  const fetchReports = async (roomNum) => {
    try {
      const res = await axios.get(`http://localhost:4000/reports/${roomNum}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoomNumber();
  }, []);

  useEffect(() => {
    if (roomNumber) {
      fetchReports(roomNumber);
    }
  }, [roomNumber]);

  const handleSubmit = async () => {
    if (!title || !detail) return alert('กรุณากรอกข้อมูลให้ครบ');

    try {
      await axios.post('http://localhost:4000/reports/create', {
        roomNumber,
        title,
        detail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ ส่งคำร้องสำเร็จ', { theme: 'colored' });
      setTitle('');
      setDetail('');
      fetchReports(roomNumber); // อัปเดตรายการทันทีหลังส่งคำร้อง
    } catch (err) {
      toast.error('❌ ส่งคำร้องไม่สำเร็จ', { theme: 'colored' });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 แจ้งปัญหาห้องพัก</h2>

      <input
        type="text"
        placeholder="หัวข้อปัญหา"
        className="border p-2 rounded w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="รายละเอียดของปัญหา"
        className="border p-2 rounded w-full mb-3"
        rows="4"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={!roomNumber}
      >
        ส่งคำร้อง
      </button>

      {/* ✅ ส่วนแสดงสถานะของคำร้อง */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">📋 สถานะคำร้องของคุณ</h3>

        {reports.length > 0 ? (
          reports.map(report => (
            <div key={report._id} className="mb-4 p-3 border rounded-lg shadow-sm">
              <p><strong>หัวข้อ:</strong> {report.title}</p>
              <p><strong>รายละเอียด:</strong> {report.detail}</p>
              <p>
                <strong>สถานะ:</strong> 
                <span className={
                  report.status === 'resolved' ? 'text-green-600 font-bold' :
                  report.status === 'pending' ? 'text-yellow-600 font-bold' :
                  report.status === 'rejected' ? 'text-red-600 font-bold' :
                  'text-gray-600'
                }>
                  {report.status === 'resolved' && '✅ แก้ไขแล้ว'}
                  {report.status === 'pending' && '⏳ รอดำเนินการ'}
                  {report.status === 'rejected' && '❌ ปฏิเสธ'}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">ยังไม่มีคำร้องในขณะนี้</p>
        )}
      </div>
    </div>
  );
};

export default UserReport;
