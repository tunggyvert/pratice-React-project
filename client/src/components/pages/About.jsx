import React, { useEffect } from 'react'
import Navbar from '../accessories/Navbar'
import HeroA from '../accessories/HeroA'
import Footer from '../accessories/Footer'
import Gallery from '../accessories/Gallery'
import Slide from '../accessories/slide'
import imgSize from '../../assets/Groveimage/sizedetail.jpg'
import Aos from 'aos'
import 'aos/dist/aos.css'
import imgSizem1 from '../../assets/Groveimage/sizem1.jpg'
import imgSizem2 from '../../assets/Groveimage/sizem2.jpg'
import imgSizeL1 from '../../assets/Groveimage/sizeL1.jpg'
import imgShower from '../../assets/Groveimage/shower.jpg'
import Envi from '../accessories/envi'
import { IoIosBed } from "react-icons/io";
import { TbAirConditioning } from "react-icons/tb";
import { FaShower } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa6";
import { PiSecurityCameraFill } from "react-icons/pi";
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import { MdLocalLaundryService } from "react-icons/md";

const About = () => {

  const images = [
    imgSizem1,
    imgSizem2,
    imgSizeL1,
    imgShower
  ];

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main>
        <HeroA />
        <Gallery />
        <div className='container mx-auto px-4 py-12'>
          <div className='' data-aos="fade-up">
            <p className='text-center font-light text-[34px]'
            >
              "หอพัก Grove Residences สไตล์ห้องของเรามีความทันสมัย เฟอร์นิเจอร์ครบพร้อมเข้าอยู่ สภาพแวดล้อมดีปลอดภัย มีสิ่งอำนวยความสะดวกที่ครบคัน"
            </p>
          </div>
        </div>
        <div className='container mx-auto px-4 py-20'>
          <div className='' data-aos="fade-up">
            <h1 className='text-left font bold text-[34px]'>
              "แล้วห้องพักเรามีขนาดยังไงบ้าง?"
            </h1>
          </div>
          <div className='py-10 text-left font-light text-[26px]'
            data-aos="fade-up">
            <p className=''>ห้องพักของเรามีทั้งหมด 3 ขนาดได้แก่ ห้อง size-m,size-x,size-xl<br></br>
              ห้อง size-M ขนาด 26 ตารางเมตร<br></br>
              ห้อง size-L ขนาด 34 ตารางเมตร<br></br>
              ห้อง size-XL ขนาด 40 ตารางเมตร<br></br>
            </p>
          </div>
          <div className='flex px-10 justify-center items-center'
            data-aos="fade up">
            <img
              src={imgSize}
              alt='room-size'
              className='w-128 h-auto object-cover' />
          </div>
        </div>
        <div className='container mx-auto px-4 py-5'> 
          <p className='py-10 text-center font-light text-[26px]' 
          data-aos='fade-up'>ตัวอย่างของห้อง</p>
          <div className='flex my-1' data-aos="fade-up">
            <Slide images={images} />
          </div>
        </div>
        {/*ส่วนที่เป็น บอกสิ่งอำนวยความสะดวก */}
        <div className='container mx-auto max-w-4xl px-30'>
          <p className='py-10 text-center font-bold text-[34px]'
          data-aos='fade-up'>สิ่งอำนวยความสะดวก</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-6'
          data-aos='fade-up'>
            <div className='flex items-center gap-4 py-2'>
            <IoIosBed size={50}/>
            <span>มีเตียงนอน,เฟอร์นิเจอร์และของตกแต่ง</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <TbAirConditioning size={50}/>
            <span>มีเครื่องปรับอากาศในทุกห้อง</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <FaShower size={50}/>
            <span>มีห้องน้ำและมีเครื่องทำน้ำอุ่น</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <FaWifi size={50}/>
            <span>มี Wifi บริการ</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <FaCarSide size={50}/>
            <span>มีที่จอดรถ</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <PiSecurityCameraFill size={50}/>
            <span>มีระบบรักษาความปลอดภัย 24 ชั่วโมง</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <PiBuildingApartmentDuotone size={50}/>
            <span>มีลิฟท์,ตู้กดน้ำในหอ</span>
            </div>

            <div className='flex items-center gap-4 py-2'>
            <MdLocalLaundryService size={50}/>
            <span>มีบริการซักผ้าแบบหยอดเหรียญ</span>
            </div>
          </div>

        </div>
        {/*ส่วนที่เป็น บอกสภาพแวดล้อม */}
        <div className='container mx-auto px-4 py-5 ' data-aos='fade-up'>
          <Envi />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About