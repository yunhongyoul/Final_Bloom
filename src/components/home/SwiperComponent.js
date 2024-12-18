import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// Import required modules
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';

export default function SwiperComponent() {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={true}
      mousewheel={true}
      keyboard={true}
      loop={true}
      autoplay={{
        delay: 3000, 
        disableOnInteraction: false, 
      }}
      modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
      className="mySwiper"
    >
      <SwiperSlide>
        <img src="https://shop-phinf.pstatic.net/20241202_192/1733108472789wBJbp_JPEG/PC.jpg?type=m10000_10000"/>
      </SwiperSlide>

      <SwiperSlide>
        <img src="https://shop-phinf.pstatic.net/20241206_52/17334736579390XQCF_JPEG/12%BF%F9-%B8%DE%C0%CE%B9%E8%B3%CA_P_01.jpg?type=m10000_10000"/>
      </SwiperSlide>

      <SwiperSlide>
        <img src="https://shop-phinf.pstatic.net/20241101_282/1730446429077ks6uV_JPEG/PC_01.jpg?type=m10000_10000" />
      </SwiperSlide>
    </Swiper>
  );
}