import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (!acceptTerms) {
      toast.error('กรุณายอมรับเงื่อนไขก่อน');
      return;
    }

    try {
      await axios.post(`http://localhost:4000/reset-password/${token}`, {
        newPassword,
      });
      toast.success('รีเซ็ตรหัสผ่านสำเร็จ 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'ลิงก์ไม่ถูกต้องหรือหมดอายุ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#1E1E2F] p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

        <div className="mb-4">
          <label className="block text-sm text-white mb-1">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-white mb-1">Confirm password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center mb-6 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mr-2 accent-blue-500"
          />
          I accept the{' '}
          <a href="#" className="text-blue-400 hover:underline ml-1">
            Terms and Conditions
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Reset password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
