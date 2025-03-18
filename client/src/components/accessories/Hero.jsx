import React from 'react'

const Hero = () => {
  return (
    <div className='bg-gray-900 text-white py-16'>
        <div className='container mx-auto text-center'>
            <h1 className='text-4xl font-extrabold mb-2'>ยินดีต้อนรับเข้าสู่เว็บไซส์</h1>
            <p className='text-lg mt-4'>ค้นหาสิ่งที่คุณต้องการ</p>
            <a href='#' className='bg-blue-500 text-white px-6 py-2 
            rounded-full mt-8 inline-block hover:bg-blue-600
            '>ค้นหา</a>
        </div>

    </div>
  )
}

export default Hero