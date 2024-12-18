import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "../store/store";
import { Counterr } from "../calculator/Counterr";
import { Context } from "../../index";
import axios from "axios";
import CompPrdDetailInfo from "./CompPrdDetailInfo";
import CompPrdDetailReview from "./CompPrdDetailReview";
import CompPrdDetailQnA from "./CompPrdDetailQnA";
import CompPrdDetailRecall from "./CompPrdDetailRecall";
import "../../assets/css/product/CompPrdDetail.css";

const CompPrdDetail = () => {
  const { pdNo } = useParams(); // URL에서 pdNo 가져오기
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [detailImages, setDetailImages] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const { host } = useContext(Context);
  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);

  const role = useSelector((state) => state.member.role);
  const isLogged = useSelector((state) => state.member.isLogged);

  // Product 정보 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      if (!pdNo) {
        console.error("pdNo가 정의되지 않았습니다.");
        return;
      }

      try {
        const productResponse = await axios.get(
          `${host}/product/read?no=${pdNo}`
        );
        setProduct(productResponse.data);
      } catch (error) {
        console.error("상품 정보 불러오기 실패:", error);
      }
    };

    fetchProduct();
  }, [pdNo]);

  // 옵션 선택 핸들러
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity); // 수량 상태 업데이트
  };

  // 장바구니에 추가하는 함수
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!selectedOption) {
        alert("옵션을 선택해주세요.");
        return;
      }

      const response = await axios.post(
        `${host}/cart/register`,
        {
          pdNo,
          ctCount: quantity,
          option: selectedOption,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("장바구니에 상품이 추가되었습니다.");
      } else {
        alert("장바구니 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 상품 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // DELETE 요청 (Query Parameter 사용)
      await axios.delete(`${host}/product/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          no: pdNo, // Query Parameter에 상품 번호 전달
        },
      });

      alert("상품이 삭제되었습니다.");
      navigate("/product/list"); // 상품 목록 페이지로 이동
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  // 상품 수정 핸들러
  const handleEdit = () => {
    navigate(`/product/modify/${pdNo}`); // 상품 수정 페이지로 이동
  };

  const printSection = () => {
    switch (activeTab) {
      case "info":
        return (
          <CompPrdDetailInfo product={product} detailImages={detailImages} />
        );
      case "review":
        return <CompPrdDetailReview />;
      case "qna":
        return <CompPrdDetailQnA />;
      case "exchange":
        return <CompPrdDetailRecall />;
      default:
        return (
          <CompPrdDetailInfo product={product} detailImages={detailImages} />
        );
    }
  };

  return (
    <div className="product-container">
      <section className="detail-top">
        <div className="product-image">
          {product.thumnail ? (
            <img
              src={product.thumnail}
              alt="썸네일"
              className="prd-thumnail-img"
            />
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.pdName}</h1>
          <p className="product-comment">{product.comment}</p>
          <p className="product-price">{product.price?.toLocaleString()}원</p>

          <div className="options">
            <select value={selectedOption} onChange={handleOptionChange}>
              <option>옵션 선택</option>
              {Array.isArray(product.option) ? (
                product.option.map((opt, index) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))
              ) : (
                <option>옵션이 없습니다.</option>
              )}
            </select>
          </div>

          <div className="quantity-section">
            <label htmlFor="quantity">수량:</label>
            <Provider store={store}>
              <Counterr onChange={handleQuantityChange} />
            </Provider>
          </div>

          <div className="buy-buttons">
            <button
              className="buy-button add-to-cart"
              onClick={handleAddToCart}
            >
              장바구니
            </button>
            <button
              className="buy-button add-to-cart"
              onClick={() => {
                navigate(`/orders/singleitem/${product.pdNo}/${quantity}/${selectedOption}`);
              }}
            >
              단건구매
            </button>
            {/* <button className="buy-button buy-now" onclick={productOneOrder}>
                구매하기
              </button> */}

            {isLogged && role === "ROLE_ADMIN" && (
              <div className="admin-buttons">
                <button onClick={handleEdit} className="edit-button">
                  수정
                </button>
                <button onClick={handleDelete} className="delete-button">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="detail-menu">
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          상세정보
        </button>
        <button
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          리뷰
        </button>
        <button
          className={activeTab === "qna" ? "active" : ""}
          onClick={() => setActiveTab("qna")}
        >
          Q&A
        </button>
        <button
          className={activeTab === "exchange" ? "active" : ""}
          onClick={() => setActiveTab("exchange")}
        >
          교환반품
        </button>
      </nav>

      {printSection()}
    </div>
  );
};

export default CompPrdDetail;
