import React from 'react'
import Home from '../components/pages/Home'
import Register from '../components/pages/Register'
import Login from '../components/pages/Login'
import ForgotPassword from '../components/pages/ForgotPassword'
import ResetPassword from '../components/pages/ResetPassword'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  ]);
  
  const AppRoute = () => {
    return <RouterProvider router={router} />;
  };

export default AppRoute