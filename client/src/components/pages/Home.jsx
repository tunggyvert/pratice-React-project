import React from 'react'
import Hero from '../Hero'
import Footer from '../Footer'
import Navbar from '../Navbar'
import imgEx1 from '../../assets/ex1.jpeg'


const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
     <header>
      <Navbar />
     </header>
     <main>
      <Hero />
      <div className='container mx-auto text-center font-bold text-2xl mt-10'>
        เกี่ยวกับเรา
        <div className='font-light text-lg mt-5'>
        Nadao Place Apartment.
        เดินทางสะดวก “ป้ายรถประจำทาง ติดหน้าหอพัก”
        “…ติดป้ายรถเมล์ห่างเทคโนพระจอมเกล้า 750 เมตร…”
        มีที่จอดรถยนต์และรถมอเตอร์ไซด์ สำหรับ ลูกค้า
        ห้องพัก วงศ์สว่างใกล้พระจอมเกล้าพระนครเหนือ
        ห้องพักสะอาด ปลอดภัย เดินทางสะดวก 
         <div className="flex justify-center items-center px-8 py-8">
          <img src={imgEx1} alt="โลโก้" className="w-128 h-auto" />
         </div>
        </div>
      </div>
     </main>
    <Footer/>
    </div>
  )
}

export default Home