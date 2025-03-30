import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReportManage = () => {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:4000/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/reports/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (err) {
      alert('❌ อัปเดตสถานะไม่สำเร็จ');
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm('⚠️ ยืนยันการลบคำร้องนี้?')) return;

    try {
      await axios.delete(`http://localhost:4000/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ ลบคำร้องสำเร็จ');
      fetchReports();
    } catch (err) {
      alert('❌ ลบคำร้องไม่สำเร็จ');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 จัดการคำร้องเรียน (Admin)</h2>

      {reports.map(report => (
        <div key={report._id} className="bg-white shadow rounded p-4 mb-3">
          <p><strong>ห้อง:</strong> {report.roomNumber}</p>
          <p><strong>หัวข้อ:</strong> {report.title}</p>
          <p><strong>รายละเอียด:</strong> {report.detail}</p>
          <p><strong>สถานะ:</strong> {report.status}</p>

          <div className="mt-3 flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => updateStatus(report._id, 'resolved')}
            >
              ✅ แก้ไขแล้ว
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              onClick={() => updateStatus(report._id, 'pending')}
            >
              ⏳ รอดำเนินการ
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => updateStatus(report._id, 'rejected')}
            >
              ❌ ปฏิเสธ
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => deleteReport(report._id)}
            >
              🗑️ ลบคำร้อง
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReportManage;
