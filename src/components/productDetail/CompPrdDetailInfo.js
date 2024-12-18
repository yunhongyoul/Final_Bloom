import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/css/product/CompPrdDetailInfo.css';

const CompPrdDetailInfo = () => {

  const { pdNo } = useParams();

  const [detailImgs, setDetailImgs] = useState([]); // 상태 초기화

  // ProductDetail 정보 불러오기
  useEffect(() => {
    const fetchDetailImages = async () => {
      if (!pdNo) {
        console.error('pdNo가 정의되지 않았습니다.');
        return;
      }

      try {
        // API 요청으로 detailImgs 데이터 가져오기
        const response = await axios.get(`http://localhost:8080/product/read?no=${pdNo}`);
        const images = response.data?.detailImgs || []; // 배열 확인 및 초기화
        setDetailImgs(images);
      } catch (error) {
        console.error('상품 상세 이미지 불러오기 실패:', error);
      }
    };

    fetchDetailImages();
  }, [pdNo]);

  return (
    <section className='detail-info'>
      {/* <h2>상품 상세 이미지</h2> */}
      <div className="detail-images">
        {detailImgs.length > 0 ? (
          detailImgs.map((image, index) => (
            <img key={index} src={image} alt={`상세 이미지 ${index + 1}`} className='prd-detail-img'/>
          ))
          ) : (
            <p>상세 이미지를 준비중입니다...</p>
          )}
      </div>
    </section>
  );
};

export default CompPrdDetailInfo;