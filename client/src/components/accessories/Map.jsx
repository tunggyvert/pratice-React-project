import React from 'react';
import { FaFacebookSquare } from "react-icons/fa";
import { FaLine } from "react-icons/fa6";


const Map = () => {
  return (
    <section className="py-12 px-4 md:px-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">ติดต่อเรา</h2>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: Details */}
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-bold">Grove residences</h3>

          <div className="flex items-start gap-3">
            <span><FaFacebookSquare /></span>
            <div>
              <p className="font-medium">Grove Residences หอพักหลังมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
              <p className="text-sm text-gray-600">Facebook</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span><FaLine /></span>
            <div>
              <p>0623738955</p>
              <p className="text-sm text-gray-600">Line-ID</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span>📞</span>
            <div>
              <p>062-373-8955</p>
              <p className="text-sm text-gray-600">Phone Number</p>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="flex-1 w-full h-96">
          <iframe
            title="Grove Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5811.525041175915!2d100.51438049141673!3d13.82403424765799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b009937b43b%3A0x64d28d13c6c546fa!2sGrove%20residences!5e0!3m2!1sth!2sth!4v1742991679560!5m2!1sth!2sth"
            width="100%"
            height="100%"
            className="rounded-lg shadow-md border"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Map;
