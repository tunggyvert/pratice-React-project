import React from 'react'

const Footer = () => {
  return (
   <footer className='bg-gray-800 px-4 py-10 md:px-20 lg:px-28 mt-auto'>
     <div className='grid grid-cols-1 md:grid-cols-3'>
        <div>
            <h2 className='text-lg font-bold mb-4 text-white'>
                เกี่ยวกับเรา
            </h2>
            <p className='text-white-300 text-white'>
            ที่พักที่ดีที่สุดในวงศ์สว่าง
            </p>
        </div>
        <div>
            <h2 className='text-lg font-bold mb-4 text-white'>
                ติดต่อเรา
            </h2>
            <li className=' text-white'><a href='' className='text-white hover:underline text-white-300 '></a>facebook</li>
            <li className=' text-white'><a href='' className='text-white hover:underline text-white-300 '></a>line</li>
            <li className=' text-white'><a href='' className='text-white hover:underline text-white-300 '></a>tel</li>
        </div>
        <div>
            <h2 className='text-lg font-bold mb-4 text-white'>
                เวลาทำการ
            </h2>
            <ul className='flex space-x-4'>
                <li className='text-white-300 text-white'> 
                <a href='' className='text-white hover:underline text-white-300'></a>
                เบอร์โทร
                </li>
            </ul>
        </div>
     </div>
     <div className='border-t border-gray-600 p-4 pt-6 text-white-300 text-white text-center mt-6'>
        <p>code by se project team</p>
     </div>
   </footer>
  )
}

export default Footer