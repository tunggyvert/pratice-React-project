import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email] = useState(userData?.email || '');
  const [tel, setTel] = useState(userData?.tel || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:4000/update-profile',
        {
          firstName,
          lastName,
          tel,
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('✅ อัปเดตโปรไฟล์เรียบร้อย!');
      localStorage.setItem('user', JSON.stringify(res.data.updatedUser));
    } catch (err) {
      alert('❌ เปลี่ยนรหัสผ่านหรือข้อมูลไม่สำเร็จ');
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6">แก้ไขโปรไฟล์</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="ชื่อจริง"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="นามสกุล"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          value={email}
          disabled
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
        <input
          type="tel"
          placeholder="เบอร์โทร"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <h3 className="mt-8 font-semibold">🔒 เปลี่ยนรหัสผ่าน (ไม่บังคับ)</h3>
      <div className="grid gap-4 sm:grid-cols-2 mt-2">
        <input
          type="password"
          placeholder="รหัสผ่านปัจจุบัน"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
      >
        💾 บันทึกข้อมูล
      </button>
    </div>
  );
};

export default EditProfile;
