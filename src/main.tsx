import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './context/AuthProvider.tsx'

import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer/>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
