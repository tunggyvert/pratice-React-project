import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import imgUser from "../../assets/user.png";
import { useNavigate, Link } from "react-router-dom";
import imgGlo from "../../assets/Groveimage/grove-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthen, setIsAuthen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const navigate = useNavigate();

  // ดัก scroll
  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > 670){
        setIsScroll(true)
      }
      else{
        setIsScroll(false)
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ดึง user + token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    try {
      if (token && storedUser && storedUser !== "undefined") {
        setIsAuthen(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthen(false);
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Failed to parse user:", err);
      setIsAuthen(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthen(false);
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleGoToDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    navigate(user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 text-white transition-all duration-300 ${
        isScroll ? "bg-emerald-400 shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 lg:px-12 h-16">
        <Link to="/" className="text-2xl font-bold px-2 py-1">
          <img src={imgGlo} alt="logo" className="w-32 h-auto" />
        </Link>

        {/* desktop nav */}
        <div className="hidden lg:flex items-center justify-between gap-8 w-full px-6">
          <ul className="flex gap-6 font-medium">
            <Link to="/" className="hover:scale-110 hover:-translate-y-1 duration-200">หน้าหลัก</Link>
            <Link to="/about" className="hover:scale-110 hover:-translate-y-1 duration-200">รายละเอียด</Link>
            <Link to="/booking" className="hover:text-yellow-500 hover:scale-110 hover:-translate-y-1 duration-200">จองที่พัก</Link>
          </ul>

          <div className="flex items-center gap-4">
            {isAuthen && user ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center gap-2">
                  <img src={imgUser} className="w-8 h-8 rounded-full" alt="user" />
                  {user.firstName}
                  <IoIosArrowDown />
                </button>
                {showDropdown && (
                  <ul className="absolute right-0 mt-2 bg-black rounded shadow-lg w-40 z-10">
                    <li className="hover:text-yellow-500 hover:scale-110 hover:-translate-y-1 duration-200" onClick={handleGoToDashboard}>จัดการบัญชี</li>
                    <li className="hover:text-yellow-500 hover:scale-110 hover:-translate-y-1 duration-200" onClick={handleLogout}>ออกจากระบบ</li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/register" className="hover:text-yellow-500 hover:scale-110 hover:-translate-y-1 duration-200">สมัครบัญชี</Link>
                <Link to="/login" className="border px-3 py-1 rounded hover:text-yellow-500 hover:scale-110 hover:-translate-y-1 duration-200">ลงชื่อเข้าใช้</Link>
              </>
            )}
          </div>
        </div>

        {/* mobile menu toggle */}
        <div className="lg:hidden">
          <FaBars onClick={toggleMenu} className="text-xl cursor-pointer" />
        </div>
      </nav>

      {/* mobile dropdown menu */}
      {isOpen && (
        <div className="lg:hidden bg-black px-6 py-4 animate-in slide-in-from-top flex flex-col gap-4 font-medium ">
          <Link to="/" onClick={() => setIsOpen(false)}>หน้าหลัก</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>รายละเอียด</Link>
          <Link to="/booking" onClick={() => setIsOpen(false)}>จองที่พัก</Link>

          <div className="border-t border-white/20 pt-4 flex flex-col gap-3">
            {isAuthen && user ? (
              <>
                <span className="flex justify-center items-center gap-2"><img src={imgUser} className="w-6 h-6 rounded-full" /> {user.firstName}</span>
                <button onClick={() => navigate("/profile")}>จัดการบัญชี</button>
                <button onClick={handleLogout}>ออกจากระบบ</button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setIsOpen(false)}>สมัครบัญชี</Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>ลงชื่อเข้าใช้</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
