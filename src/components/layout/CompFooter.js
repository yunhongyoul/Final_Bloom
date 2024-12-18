import React from 'react';
import "../../assets/css/layout/CompFooter.css";

const CompFooter = () => {
  return (
    <footer>
    <hr />
    <div class="w-1440">
                <div class="footer-menu">
                    <ul>
                        <li class="bold">고객센터</li>
                        <li>10:30~18:00 (점심시간 13:00~14:00)</li>
                        <li>주말, 공휴일 휴무</li>
                        <li class="btn"><a href>카카오톡 1:1문의 바로가기</a></li>
                    </ul>
                    <ul>
                        <li class="bold">지원</li>
                        <li><a href class="semibold">개인정보처리방침</a></li>
                        <li><a href>자주 묻는 질문</a></li>
                        <li><a href>공지사항</a></li>
                        <li><a href>이용약관</a></li>
                    </ul>
                </div>
                <ul class="footer-info">
                    <li>Bloom</li>
                    <li>서울시 구로구 디지털로 27 가길 17 702~709호</li>
                    <li>사업자등록번호 : 000-00-00000</li>
                    <li class="business"><a href>사업자 정보확인</a></li>
                </ul>
                <ul class="footer-notice">
                    <li>Bloom은 통신판매중계자이며, 통신판매의 당사자가 아닙니다. 상품, 상품정보,
                        거래에 관한 의무에 책임은 판매회원에게 있습니다.</li>
                    <li>상품/판매회원/중개 서비스/거래 정보, 콘텐츠, UI 등에 대한
                        무단복제, 전송, 배포, 스크래핑 등의 행위는 저작권법, 콘텐츠산업 진흥법 등
                        관련법령에 의하여 엄격히 금지됩니다. <a href>[안내 보기]</a></li>
                    <li>Copyright © 2023 bloom avenue co., ltd. All
                        rights reserved.</li>
                </ul>
            </div>
    </footer>
  );
};

export default CompFooter;