import React from 'react'

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับ {user?.firstName}</h1>
        <p>นี่คือหน้าหลักของ Dashboard</p>
      </div>
    );
}

export default UserDashboard