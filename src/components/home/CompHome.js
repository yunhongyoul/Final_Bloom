import React from 'react';
// 이미지가 깨져서 해당 컴포넌트에 임포트 함
import Frame1 from '../../assets/img/home/Frame1.png';
import Frame2 from '../../assets/img/home/Frame2.png';
import '../../assets/css/home/CompHome.css';
import SwiperComponent from './SwiperComponent';

const CompHome = () => {
  return (
    <main>

        <section>
          <div class="section-1">
            <SwiperComponent />
            <div class="swiper-div">
              <p>Say Goodbye<br/> to Skin Problems</p>
              <p>맞춤형 스킨케어를 시작하세요.</p>
            </div>
          </div>
        </section>

      <section>
        <div class="section-2">
            <img src={Frame1} alt="bgimg"/>
            <img src={Frame2} alt="bgimg"/>
            <h1>Bloom's Story</h1>
            <p>스킨케어를 넘어선 라이프스타일 뷰티</p>
        </div>
      </section>

    </main>
  );
};

export default CompHome;