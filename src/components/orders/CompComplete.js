import React from "react";
import { useParams } from "react-router-dom";
import flower from '../../assets/img/home/꽃1.png';
import '../../assets/css/mypage/MyPageform.css';

// 주문 완료
const CompComplete = () => {

  const { odNo } = useParams();

  return (    
    <main className="register-container">
      <div className="read-box">
        <h5>주문 완료</h5>
      </div>
      <form className="mypage-form">
      <div className="line-block">
          <div className="full-line">
            <img src={flower} alt="flower" className="flower" />
            <div className="mypage-text">
              {/* todo: 번호로 하니까 총 주문 번호가 나오기 때문에 로그인 정보를 가지고 member-아이디 혹은 odName-수취인 으로 변경하기 */}
            {odNo} 번 주문이 완료되었습니다
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CompComplete;
