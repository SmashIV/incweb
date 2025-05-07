import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { clothesData } from '../../constants/testClothes';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function ProductCarruselCard({ item }) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow bg-white border border-gray-100 h-full">
      <div className="w-full h-[200px] md:h-[700px] bg-gray-200 flex items-center justify-center">
        <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 flex flex-col justify-between bg-gray-100 p-4">
        <div>
          <span className="text-xs text-gray-500 font-medium uppercase">{item.category}</span>
          <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 line-clamp-2 min-h-[2.5em]">{item.title}</h3>
        </div>
        <div className="flex items-end justify-between mt-2">
          <span className="text-lg font-bold text-emerald-700">S/.{item.price}</span>
        </div>
      </div>
    </div>
  );
}

function ProductCarrusel() {
  return (
    <div className="w-full max-w-[80vw] mx-auto pt-2 mb-20 relative flex items-center justify-center">
      <button
        className="product-carrusel-prev hidden md:block absolute left-[-70px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Anterior"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="product-carrusel-next hidden md:block absolute right-[-70px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Siguiente"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
      <button
        className="product-carrusel-prev md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Anterior"
        style={{marginLeft: '-8px'}}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="product-carrusel-next md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Siguiente"
        style={{marginRight: '-8px'}}
      >
        <ArrowRight className="w-6 h-6" />
      </button>
      <div className="relative w-full">
        <Swiper
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          navigation={{
            nextEl: '.product-carrusel-next',
            prevEl: '.product-carrusel-prev',
          }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          modules={[Navigation, Autoplay]}
          className="w-full"
        >
          {clothesData.map((item) => (
            <SwiperSlide key={item.title}>
              <ProductCarruselCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductCarrusel; 