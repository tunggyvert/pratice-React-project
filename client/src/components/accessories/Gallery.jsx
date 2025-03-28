import React , {useEffect} from 'react'
import imgGim1 from "../../assets/Groveimage/gim1.jpg"
import imgGim2 from "../../assets/Groveimage/gim2.jpg"
import imgGim3 from "../../assets/Groveimage/gim3.jpg"
import imgGim4 from "../../assets/Groveimage/gim4.jpg"
import imgGim5 from "../../assets/Groveimage/gim5.jpg"
import imgGim6 from "../../assets/Groveimage/gim6.jpg"
import imgGim7 from "../../assets/Groveimage/gim7.jpg"
import imgGim8 from "../../assets/Groveimage/gim8.jpg"

import Aos from 'aos'
import 'aos/dist/aos.css'

const images = [
    imgGim2,
    imgGim3,
    imgGim4,
    imgGim5,
    imgGim6,
    imgGim7,
    imgGim8,
  ];
  
const Gallery = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
    return (
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8" data-aos="fade-up">แกลเลอรีหอพัก</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-aos="flip-up">
          {images.map((img, index) => (
            <div key={index} className="overflow-hidden rounded shadow hover:scale-105 transition duration-300">
              <img src={img} 
              alt={`gallery-${index}`} 
              className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Gallery;