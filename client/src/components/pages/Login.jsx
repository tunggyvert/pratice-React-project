import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import imgGrove from '../../assets/Groove.png';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });
      console.log("📦 login response:", response.data); // ✅ debug ดูว่าได้อะไรกลับมาบ้าง
      if (response.data.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("storage"));
        const role = response.data.user.role;
          if (role === 'admin') {
          navigate('/admin-dashboard');
          } else {
          navigate('/user-dashboard'); // หรือ /user-home
          }
      } else {
        localStorage.setItem('user', 'undefined'); // ป้องกัน navbar crash
      }
      
      toast.success('🎉 เข้าสู่ระบบสำเร็จ!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:block">
          <img
            src={imgGrove}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mb-6">
            ยังไม่มีบัญชีใช่มั้ย? <Link to="/register" className="text-blue-600 cursor-pointer hover:underline">สมัครบัญชี</Link>
          </p>

          {error && <div className="text-red-500 text-sm mb-4">❌ {error}</div>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>
              <Link to='/forgot-password' className="text-blue-600 cursor-pointer hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
            >
              Sign in
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
