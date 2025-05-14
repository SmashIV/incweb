import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'

import { FreeMode, Pagination } from 'swiper/modules';

import { ArrowUpRight } from 'lucide-react';
import { slidesData } from '../constants/infoSlide';

function HomeInfoSlide() {
    return ( 
        <div className='flex items-center justify-center flex-col min-h-screen bg-white'>
            <h1 className='text-center text-black font-extrabold text-6xl mb-20'>Explora nuestras novedades.</h1>
            <Swiper
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    480: {
                        slidesPerView: 1.2,
                        spaceBetween: 18,
                    },
                    700: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 32,
                    },
                    1400: {
                        slidesPerView: 4,
                        spaceBetween: 36,
                    },
                }}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className='max-w-[95vw] lg:max-w-[80vw]'
            >
                {slidesData.map((item) => (
                    <SwiperSlide key={item.title} className="flex items-stretch">
                        <div className="flex flex-col gap-6 group relative shadow-lg text-white rounded-2xl px-6 py-8 h-[250px] sm:h-[300px] lg:h-[900px] xl:h-[900px] w-full max-w-xs sm:max-w-sm lg:max-w-md overflow-hidden">
                            <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: `url(${item.bgImage})`}}/>
                            <div className='absolute inset-0 bg-black opacity-10 group-hover:opacity-50'/>
                            <div className='relative flex flex-col gap-3'>
                                <item.icon className='text-gray-100 group-hover:text-white w-[32px] h-[32px]'/>
                                <h1 className='text-xl lg:text-2xl'>{item.title}</h1>
                                <p className='lg:text-[18px]'>{item.content}</p>
                            </div>
                            <ArrowUpRight className='absolute bottom-5 left-5 w-[35px] h-[35px] text-gray-100 group-hover:text-white group-hover:rotate-45 duration-100'/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
                
        </div>
     );
}

export default HomeInfoSlide;