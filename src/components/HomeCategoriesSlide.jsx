import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css'
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation'
import { accesoriesData } from '../constants/accesoriesSlide';

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

function HomeCategoriesSlider() {
    return ( 
        <div className='relative m-5'>
            <div className="top-[50%] absolute z-10 button-next-slide right-4 text-white w-[40px] h-[40px] bg-[#000] grid place-items-center cursor-pointer hover:opacity-90">
                    <ArrowRightFromLine />
            </div>
            <div className="top-[50%] absolute z-10 button-prev-slide left-4 text-white w-[40px] h-[40px] bg-[#000] grid place-items-center cursor-pointer hover:opacity-90">
                    <ArrowLeftFromLine />
            </div>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                navigation={{
                    nextEl: ".button-next-slide",
                    prevEl: ".button-prev-slide",
                }}
                modules={[Navigation]}
                className='relative group'
            >
                {
                    accesoriesData.map((item) => (
                        <SwiperSlide key={item.title}>
                            {
                            <div className='rounded-2xl overflow-hidden relative'>
                                <img src={item.bgImage} alt={item.title} className='w-full h-[600px] object-cover'/>
                                <div className='space-y-4 absolute top-1/2 left-1/2 text-center -translate-x-1/2 -translate-y-1/2 text-white max-w-[80%] p-6'>
                                    <h3 className='text-[16px] font-medium'>{item.subtitle}</h3>
                                    <h3 className='text-[50px] font-bold'>{item.title}</h3>
                                    <p className='text-[14px] leading-relaxed'>
                                        {item.description}
                                    </p>
                                    <button className='px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200'>
                                        Compra ahora!
                                    </button>
                                </div>
                            </div>
                            }
        
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
     );
}

export default HomeCategoriesSlider;