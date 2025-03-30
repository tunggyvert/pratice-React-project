import React from 'react'
import Home from '../components/pages/Home'
import Register from '../components/pages/Register'
import Login from '../components/pages/Login'
import ForgotPassword from '../components/pages/ForgotPassword'
import ResetPassword from '../components/pages/ResetPassword'
import About from '../components/pages/About'
import AdminDashboard from '../components/pages/AdminDashboard'
import UserDashboard from '../components/pages/UserDashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import EditProfile from '../components/pages/userpages/EditProfile'
import UserLayout from '../components/layout/UserLayout'
import AdminLayout from '../components/layout/AdminLayout'
import ManageUsers from '../components/pages/adminpages/ManageUsers'
import Booking from '../components/pages/Booking'
import StepProgress from '../components/pages/bookingpages/bookingcomponent/StepProgress'
import Room from '../components/pages/bookingpages/Room'
import Terms from '../components/pages/bookingpages/Terms'
import Quote from '../components/pages/bookingpages/Quote'
import Floor from '../components/pages/bookingpages/Floor'
import RoomManage from '../components/pages/adminpages/RoomManage'
import PayManagement from '../components/pages/adminpages/PayManagement'
import Payment from '../components/pages/userpages/Payment'
import UserRoom from '../components/pages/userpages/UserRoom'
import UserReport from '../components/pages/userpages/UserReport'
import AdminReportManage from '../components/pages/adminpages/AdminReportManage'
import RoomOwnBy from '../components/pages/adminpages/RoomOwnBy'
import AdminMonthlyManage from '../components/pages/adminpages/AdminMonthlyManage'
import UserMonthly from '../components/pages/userpages/UserMonthly'

const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />,
    },
    {
      path:"about",
      element: <About />
    },
    {
      path: 'booking',
      element: <Booking />,
    },
    {
      path:'book-process',
      element: <StepProgress/>,
      children: [
        {
          path: 'step1',
          element: <Floor/>,
        },
        {
          path: 'step2',
          element: <Room/>,
        },
        {
          path: 'step3',
          element: <Terms/>,
        },
        {
          path: 'step4',
          element: <Quote/>,
        },
        {
          path: 'step5',
          element: <Payment/>,
        },
      ]
    },
    {
      path:"admin-dashboard",
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: 'manage-users',
          element: <ManageUsers />,
        },
        {
          path: 'manage-room',
          element:<RoomManage />,
        },
        {
          path: 'pay-management',
          element: <PayManagement />,
        },
        {
          path:'manage-report',
          element:<AdminReportManage/>,
        },
        {
          path:'room-own',
          element:<RoomOwnBy/>
        },
        {
          path:'monthly-report',
          element:<AdminMonthlyManage/>
        }
      ],
    },
    {
      path:'user-dashboard',
      element: 
      <ProtectedRoute requiredRole="user">
      <UserLayout />
      </ProtectedRoute>
      ,
      children: [
        {
          index: true, // /user
          element: <UserDashboard />,
        },
        {
          path: 'edit-profile', // /user/edit-profile
          element: <EditProfile />,
        },
        {
          path:'user-room',
          element:<UserRoom/>,
        },
        {
          path:'user-report',
          element:<UserReport/>,
        },
        {
          path:'user-monthly',
          element:<UserMonthly/>,
        }
      ],
    }
  ]);
  
  const AppRoute = () => {
    return <RouterProvider router={router} />;
  };

export default AppRoute