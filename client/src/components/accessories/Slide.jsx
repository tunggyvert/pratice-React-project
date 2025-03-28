import React, { useState } from 'react';


const Slide = ({images}) => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
      setCurrent((prev) => (prev + 1) % images.length);
    };
  
    const prevSlide = () => {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };
  
    return (
      <div className="relative w-128 max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
        {/* Carousel wrapper */}
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className="w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>
  
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10"
        >
          <span className="text-2xl">‹</span>
        </button>
  
        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10"
        >
          <span className="text-2xl">›</span>
        </button>
  
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                current === index ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
};

export default Slide;
