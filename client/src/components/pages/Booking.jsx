import React from 'react'
import Navbar from '../accessories/Navbar'
import Footer from '../accessories/Footer'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
const Booking = () => {
    const navigate = useNavigate()

    const handleBookingClick = async () => {
      const token = localStorage.getItem('token')
  
      if (!token) {
        toast.error("กรุณาเข้าสู่ระบบก่อนทำการจองห้องพัก", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "colored"
        })
        return
      }
  
      try {
        // เช็คสัญญาที่ Active อยู่ของ user
        const res = await axios.get('http://localhost:4000/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
  
        const activeContract = res.data.find(
          (contract) => contract.status === 'active'
        )
  
        if (activeContract) {
          toast.warn(`คุณมีห้องพัก (#${activeContract.room.roomNumber}) อยู่แล้ว ไม่สามารถจองเพิ่มได้`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            theme: "colored"
          })
        } else {
          navigate('/book-process/step1')
        }
      } catch (err) {
        console.error(err.response?.data || err.message)
        toast.error(`เกิดข้อผิดพลาด: ${err.response?.data?.error || err.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "colored"
        })
      }
    }
  return (
    <div className='flex flex-col min-h-screen'>
      <header>
        <Navbar />
      </header>
      <main className='flex-grow'>
      <section className="relative bg-cover bg-center h-screen flex items-center justify-center text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 z-10">
      {/* Hero Content */}
      <div className="absolute inset-0 bg-black opacity-50"></div> 
      
      <div className="relative z-10 px-4 sm:px-8">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight animate__animated animate__fadeIn">
          การจองห้องพัก
        </h1>
        <p className="text-white mt-4 text-sm sm:text-base md:text-lg font-medium animate__animated animate__fadeIn animate__delay-1s">
          สนใจมาจองห้องพักกับเราได้ที่นี่
        </p>
      </div>
    </section>
    <div className='container mx-auto px-4 py-8'>
      <div className="border-2 border-blue-400 rounded-lg p-6 lg:flex-row items-center gap-8 w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">จองห้องพัก</h2>
      <p className='text-black font-extralight text-center leading-relaxed mb-6'>
        "เราจะพาคุณไปหน้าในการจองห้องพักของเรา"
      </p>
      <p className="text-red-400 leading-relaxed text-center mb-6">
        "โปรดสมัครบัญชีก่อนทำการจอง"</p>
      <div class="flex items-center justify-center">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 
      rounded transition-colors duration-300 transform hover:scale-105"
      onClick={handleBookingClick}>
        จองห้องพัก
      </button>
      </div>
      </div>
    </div>    
      </main>
      <Footer />

    </div>
  )
}

export default Booking