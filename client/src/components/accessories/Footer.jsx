import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-8">
            {/* Container for the content */}
            <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center lg:items-start">
                {/* About Section */}
                <div className="mb-4 lg:mb-0 w-full lg:w-1/3 text-center lg:text-left">
                    <h3 className="text-lg font-semibold">เกี่ยวกับเรา</h3>
                    <p className="text-sm mt-2 py-2">
                        Grove Residences<br></br>
                        หอพักหลังมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
                    </p>
                </div>

                {/* Contact Section */}
                <div className="mb-4 lg:mb-0 w-full lg:w-1/3 text-center lg:text-left">
                    <h3 className="text-lg font-semibold">ข้อมูลติดต่อ</h3>
                    <p className="text-sm mt-2 py-2">
                        <strong>โทรศัพท์:</strong> 062-373-8955
                    </p>
                    <p className="text-sm py-2">
                        <strong>Email:</strong> grove_rescidence@gmail.com
                    </p>
                    <p className='text-sm py-2'>
                        <strong>Facebook:</strong> <a href='https://www.facebook.com/groverescidences/?locale=th_TH'>
                        Grove Residences หอพักหลังมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ </a>
                    </p>
                </div>

                {/* Working Hours Section */}
                <div className="w-full lg:w-1/3 text-center lg:text-left">
                    <h3 className="text-lg font-semibold">สถานที่และเวลาทำการ</h3>
                    <ul className="text-sm mt-2 py-2">
                        <li>318/8 ซอย วงศ์สว่าง 11 แขวงวงศ์สว่าง บางซื่อ กรุงเทพมหานคร 10800</li>
                        <li className='test-sm py-2'>เวลาทำการ : เปิดตลอดเวลา</li>
                    </ul>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="mt-6 text-center text-sm">
                <p>© Copyright Grove Residences by se-team. All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
