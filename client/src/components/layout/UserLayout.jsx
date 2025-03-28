// components/layouts/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Table, FileText,
  Menu, X
} from 'lucide-react';
import logo from '../../assets/Groveimage/grove-logo.png';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // ✅ ปรับสถานะ sidebar ตามขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // เรียกใช้ตอนโหลดครั้งแรก
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      section: "HOME",
      items: [
        { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
      ],
    },
    {
      section: "UTILITIES",
      items: [
        { to: "/user-dashboard/edit-profile", icon: <Table size={18} />, label: "จัดการบัญชี" },
        { to: "/", icon: <Table size={18} />, label: "Table" },
        { to: "/", icon: <FileText size={18} />, label: "คำร้องเรียน" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Mobile Topbar - แสดงเฉพาะตอน sidebar ปิด */}
      {!sidebarOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-white shadow px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-32 h-auto object-contain" />
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
        </div>
      )}

      {/* ✅ Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen overflow-y-auto z-40
        bg-white w-64 shadow-md transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 rounded-r-2xl`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-32 h-auto md:w-32" />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X />
          </button>
        </div>

        {/* ✅ Menu list */}
        <div className="px-4 py-6 space-y-6 text-sm text-gray-700">
          {navItems.map((section, index) => (
            <div key={index}>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">{section.section}</h4>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg ${
                        isActive
                          ? "bg-violet-500 text-white font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)} // ปิด sidebar เมื่อเลือกเมนู
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Content */}
      <main className="flex-1 p-6 mt-16 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
