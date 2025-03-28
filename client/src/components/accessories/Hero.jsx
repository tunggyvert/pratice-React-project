import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-screen flex items-center justify-center text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 z-10">
      {/* Hero Content */}
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Optional overlay */}
      
      <div className="relative z-10 px-4 sm:px-8">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight animate__animated animate__fadeIn">
          ยินดีต้อนรับ สู่ Grove Residences
        </h1>
        <p className="text-white mt-4 text-sm sm:text-base md:text-lg font-medium animate__animated animate__fadeIn animate__delay-1s">
          สถานที่พักที่พร้อมให้คุณสัมผัสความสะดวกสบาย และความเงียบสงบ
        </p>
      </div>
    </section>
  );
};

export default Hero;