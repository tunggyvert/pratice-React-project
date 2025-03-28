// components/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error('❌ โหลดรายชื่อผู้ใช้ล้มเหลว:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/admin/update-password/${selectedUser._id}`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ เปลี่ยนรหัสสำเร็จ');
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      alert('❌ ไม่สามารถเปลี่ยนรหัสได้');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">👥 จัดการผู้ใช้</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ชื่อ</th>
              <th className="border px-4 py-2">นามสกุล</th>
              <th className="border px-4 py-2">อีเมล</th>
              <th className="border px-4 py-2">เบอร์โทร</th>
              <th className="border px-4 py-2">สิทธิ์</th>
              <th className="border px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{u.firstName}</td>
                <td className="border px-4 py-2">{u.lastName}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.tel}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedUser(u)}
                  >
                    แก้รหัส
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">🔐 เปลี่ยนรหัสของ {selectedUser.email}</h2>
            <input
              type="password"
              placeholder="รหัสใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-gray-300 rounded">
                ยกเลิก
              </button>
              <button onClick={handleChangePassword} className="px-4 py-2 bg-green-600 text-white rounded">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
