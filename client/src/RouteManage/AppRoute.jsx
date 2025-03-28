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
      ],
    }
  ]);
  
  const AppRoute = () => {
    return <RouterProvider router={router} />;
  };

export default AppRoute