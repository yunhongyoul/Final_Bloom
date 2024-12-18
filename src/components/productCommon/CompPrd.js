import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../index";

import "font-awesome/css/font-awesome.min.css";

const CompPrd = ({ pdNo, pdName, price, thumnail, comment }) => {
  const { host } = useContext(Context);
  const navigate = useNavigate();

  // 🛒장바구니 등록🛒
  const handleWishlist = async (event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(`${host}/cart/register`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdNo, // 상품 번호
          ctCount: 1, // 기본 수량 1
        }),
      });

      if (response.ok) {
        alert(`${pdName}을(를) 장바구니에 추가했습니다.`);
        navigate("/product/list");
      } else {
        const errorData = await response.json();
        alert(
          `장바구니 추가 실패: ${errorData.message || "오류가 발생했습니다."}`
        );
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/product/read/${pdNo}`);
  };

  return (
    <div className="prd-iist-box">
      <div className="prd-card" onClick={handleCardClick}>
        <img src={`${thumnail}`} alt={pdName} className="prd-img" />
        <h4>{pdName}</h4>
        <p>{price.toLocaleString()} 원</p>
        <p>{comment}</p>
      </div>
      {/* 장바구니 등록 버튼 */}
      <button className="wishlist-btn" onClick={handleWishlist}>
        <i className={`fa fa-shopping-cart`}></i>
      </button>
    </div>
  );
};

export default CompPrd;
