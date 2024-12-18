import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../../assets/css/mypage/MyPageform.css';
import flower from '../../assets/img/home/꽃1.png';
import memberinfo from '../../assets/img/home/member-info.png';
import memberpost from '../../assets/img/home/member-post.png';
import membercart from '../../assets/img/home/member-cart.png';
import memberorder from '../../assets/img/home/member-order.png';

const MyPageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    navigate('/');
  };

  const isLogged = useSelector((state) => state.member.isLogged);
  const userId = useSelector((state) => state.member.userId);
  const name = useSelector((state) => state.member.name);
  const role = useSelector((state) => state.member.role);

  console.log("MyPageForm 로컬 사용자 데이터:", location.state?.user);

  const renderUserLinks = () => (
    <>
      <div className="line-block">
        <div className="left-column">
          <Link to="/mypage/read">
            <img src={memberinfo} alt="memberinfo" className="memberinfo" />
            <div className="mypage-text-box">회원 정보</div>
          </Link>
        </div>

        <div className="right-column">
          <Link to="/orders/myList">
            <img src={memberorder} alt="memberorder" className="memberorder" />
            <div className="mypage-text-box">구매 내역</div>
          </Link>
        </div>
      </div>

      <div className="line-block">
        <div className="right-column">
          <Link to="/mypage/qna">
            <img src={memberpost} alt="memberpost" className="memberpost" />
            <div className="mypage-text-box">문의 내역</div>
          </Link>
        </div>

        <div className="left-column">
          <Link to="/mypage/review">
            <img src={membercart} alt="membercart" className="membercart" />
            <div className="mypage-text-box">내 리뷰</div>
          </Link>
        </div>
      </div>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="line-block">
        <div className="left-column">
          <Link to="/member/list">
            <img src={memberinfo} alt="memberinfo" className="memberinfo" />
            <div className="mypage-text-box">회원 조회</div>
          </Link>
        </div>

        <div className="right-column">
          <Link to="/orders/list">
            <img src={memberorder} alt="memberorder" className="memberorder" />
            <div className="mypage-text-box">전체 주문 내역</div>
          </Link>
        </div>
      </div>

      <div className="line-block">
        <div className="right-column">
          <Link to="/mypage/adminQna">
            <img src={memberpost} alt="memberpost" className="memberpost" />
            <div className="mypage-text-box">Q&A 조회</div>
          </Link>
        </div>

        <div className="left-column">
          <Link to="/product/list">
            <img src={membercart} alt="membercart" className="membercart" />
            <div className="mypage-text-box">전체 상품 조회</div>
          </Link>
        </div>
      </div>
    </>
  );
  
  return (
    <div className="mypage-container">
      <div className="mypage-box">
        <h5>마이페이지</h5>
      </div>

      <form className="mypage-form">
        <div className="line-block">
          <div className="full-line">
            <img src={flower} alt="flower" className="flower" />
            <div className="mypage-text">
              {isLogged && name ? (
                <>안녕하세요, <b>{name}</b> 님!</>
              ) : (
                <>로그인이 필요합니다.</>
              )}
            </div>
          </div>
        </div>
        {role === 'ROLE_USER' ? renderUserLinks() : renderAdminLinks()}
      </form>

      <div className="button-container">
        <button className="home-button" onClick={handleHomeClick}>홈으로</button>
      </div>
    </div>
  );
};

export default MyPageForm;
