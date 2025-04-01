import React, { useState } from 'react';
import axios from 'axios';
import imgGroove from '../../assets/Groove.png';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|icloud\.com|yahoo\.com)$/;


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // ✅ ตรวจสอบ email format
    if (!emailRegex.test(email)) {
      return setError('📧 กรุณากรอกอีเมลให้ถูกต้อง');
    }

    // ✅ ตรวจสอบเบอร์โทร (ตัวเลข 10 หลัก)
    if (!/^\d{10}$/.test(tel)) {
      return setError('📱 เบอร์โทรต้องเป็นตัวเลข 10 หลัก');
    }

    try {
      const response = await axios.post('http://localhost:4000/register', {
        firstName,
        lastName,
        email,
        tel,
        password,
      });
      setSuccess(true);
      toast.success('🎉 สมัครบัญชีสำเร็จ!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/login');
    } catch (err) {
      console.log('❌ Register error:', err.response?.data || err.message);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('เกิดข้อผิดพลาด');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            src={imgGroove}
            alt="register-visual"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10">
            <h2 className="text-2xl font-bold mb-2">Welcome to Grove Residence,</h2>
            <p className="text-lg">สมัครบัญชีเพื่อมาเป็นส่วนนึงกับเรา</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 bg-zinc-800 p-10">
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Already have an account? <Link to="/login" className="text-violet-500 cursor-pointer hover:underline">Log in</Link>
          </p>
          {error && <p className="text-red-400 text-sm mb-2">❌ {error}</p>}
          {success && <p className="text-green-400 text-sm mb-2">✅ สมัครบัญชีสำเร็จ!</p>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-2 bg-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-2 bg-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
            <input
              type="tel"
              placeholder="เบอร์โทร (10 หลัก)"
              value={tel}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 10) {
                  setTel(val);
                }
              }}
              className="w-full px-4 py-2 bg-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-violet-500" required />
              <label>ฉันยอมรับ <span className="text-violet-500 underline cursor-pointer">ข้อตกลงการใช้งาน</span></label>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-semibold"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
