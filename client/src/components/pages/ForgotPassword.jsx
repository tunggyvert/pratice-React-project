import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'animate.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/forgot-password', { email });
      toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว');
    } catch (err) {
      toast.error(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate__animated animate__fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Reset your password</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-900 transition-all duration-200 hover:scale-[1.02] active:scale-100"
          >
            Reset your password
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="font-semibold text-black hover:underline">
            Get access →
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
