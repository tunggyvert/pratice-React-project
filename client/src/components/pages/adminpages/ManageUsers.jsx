import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('❌ โหลดรายชื่อผู้ใช้ล้มเหลว:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePassword = async () => {
    try {
      await axios.put(
        `http://localhost:4000/admin/update-password/${selectedUser._id}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ เปลี่ยนรหัสสำเร็จ');
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      alert('❌ ไม่สามารถเปลี่ยนรหัสได้');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบผู้ใช้นี้?')) return;

    try {
      await axios.delete(`http://localhost:4000/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('🗑️ ลบผู้ใช้สำเร็จ');
      fetchUsers();
    } catch (err) {
      console.error('❌ ลบผู้ใช้ล้มเหลว:', err);
      alert('❌ ลบไม่สำเร็จ');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">👥 จัดการผู้ใช้</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div className="space-y-1 text-sm sm:text-base">
              <p><strong>👤 ชื่อ:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>📱 เบอร์:</strong> {user.tel}</p>
              <p><strong>🎯 สิทธิ์:</strong> {user.role}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedUser(user)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                🔑 เปลี่ยนรหัส
              </button>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                🗑️ ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">🔐 เปลี่ยนรหัสของ {selectedUser.email}</h2>
            <input
              type="password"
              placeholder="รหัสใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
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
