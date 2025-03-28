import React, { useEffect } from 'react'
import Hero from '../accessories/Hero'
import Footer from '../accessories/Footer'
import Navbar from '../accessories/Navbar'
import Video from '../accessories/Video'
import Map from '../accessories/Map'
import Aos from 'aos'
import 'aos/dist/aos.css'



const Home = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-10">เกี่ยวกับหอพักเรา</h2>

          <div className="flex flex-col lg:flex-row items-center gap-8" >
            {/* วิดีโอ */}
            <div className="w-full lg:w-1/2 " data-aos="fade up">
              <div className="h-full aspect-video">
                <Video />
              </div>
            </div>

            {/* ข้อความ: จัดให้อยู่กลางแนวตั้ง */}
            <div className="w-full lg:w-1/2 flex items-center" data-aos="fade up">
              <div className="text-start space-y-4 ">
                <p className="text-xl font-semibold">
                  Grove Residences หอพักหลังมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
                </p>
                <p className="text-gray-700 leading-relaxed">
                  อพาร์ตเม้นต์ พร้อมเข้าอยู่ ติดมจพ.(เดินเพียง 5 นาทีถึง)
                  ห้องว่างพร้อมเข้าอยู่ เฟอร์นิเจอร์พร้อมอยู่
                  ระบบรักษาความปลอดภัย และ สิ่งอำนวยความสะดวก ระบบคีย์การ์ด ปลดล็อคลิฟต์ ปลดล็อคประตู เข้า-ออก ด้วยระบบลายนิ้วมือ
                  มีที่จอดรถ ใกล้สิ่งอำนวยความสะดวก
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ส่วน ติดต่อ */}
      <div className='container mx-auto px-4 '
      data-aos="fade up"> 
        <Map />
      </div>
      <Footer />
    </div>
  )
}

export default Home