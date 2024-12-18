import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../index";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/cart/CompOrderCart.css";

const CompOrderCart = () => {
  const [cartItems, setCartItems] = useState([]); // 장바구니 데이터 상태
  const { host } = useContext(Context);
  const navigate = useNavigate();

  // 장바구니 목록 가져오기
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(`${host}/cart/list`, {
        // Full URL 사용
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        
        const data = await response.json();
        console.log("장바구니 데이터:", data);

        const cartWithOptions = data.map((item) => {
          console.log("item:", item); 
          console.log("item.pdNo:", item.pdNo); 
          
          return {
          ...item,
          options: [], 
          selectedOption: item.option || "옵션을 선택해 주세요.",
          pdNo: item.pdNo,
          isEditing: false,
        };
        });

        setCartItems(cartWithOptions);
        } else {
        console.error("장바구니 데이터를 불러오지 못했습니다.", response.status);
        }
       } catch (error) {
        console.error("장바구니 데이터를 가져오는 중 오류 발생:", error);
        }
      };

       // 상품 옵션 데이터 가져오기
  const fetchProductOptions = async (pdNo) => {
    try {
      const response = await fetch(`${host}/product/read?no=${pdNo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const productData = await response.json();
        console.log("옵션 데이터:", productData.option);
        return productData.option || [];
      } else {
        console.error("상품 옵션 데이터를 불러오지 못했습니다.", response.status);
        return [];
      }
    } catch (error) {
      console.error("상품 옵션 데이터를 가져오는 중 오류 발생:", error);
      return [];
    }
  };

  // 수정 버튼 클릭 시 활성화 및 옵션 데이터 가져오기
  const handleEditToggle = async (ctNo, pdNo) => {
    try {
      const options = await fetchProductOptions(pdNo);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.ctNo === ctNo
            ? { ...item, options: options, isEditing: !item.isEditing }
            : item
        )
      );
    } catch (error) {
      console.error("옵션 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 옵션 변경
  const handleOptionChange = (ctNo, newOption) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.ctNo === ctNo ? { ...item, selectedOption: newOption } : item
      )
    );
  };

  // 수량 변경
  const handleQuantityChange = (ctNo, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.ctNo === ctNo ? { ...item, ctCount: newQuantity } : item
      )
    );
  };

  // 장바구니 항목 수정 (수량 및 옵션)
  const handleModify = async (ctNo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const item = cartItems.find((item) => item.ctNo === ctNo);

      // 요청 데이터 구성
      const requestData = {
        ctNo: item.ctNo,
        pdNo: item.pdNo,
        ctCount: item.ctCount,
        option: item.selectedOption, // 선택된 옵션 전달
      };

      const response = await fetch(`${host}/cart/modify`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.ctNo === ctNo ? { ...item, isEditing: false } : item
          )
        );
        alert("장바구니가 수정되었습니다.");
      } else {
        alert("장바구니 수정 실패");
        console.error("장바구니 수정 실패:", response.status);
      }
    } catch (error) {
      console.error("장바구니 수정 중 오류 발생:", error);
    }
  };

  // 장바구니 항목 삭제 (pdNo 기준)
  const handleDelete = async (ctNo) => {
    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
      const response = await fetch(`${host}/cart/remove?no=${ctNo}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // 삭제된 항목을 상태에서 제거
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.ctNo !== ctNo)
        );
        alert("장바구니에서 상품이 삭제되었습니다.");
      } else {
        alert("상품 삭제 실패");
        console.error("상품 삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 마운트될 때 장바구니 목록 가져오기
  useEffect(() => {
    fetchCartItems();
  }, []);

  // 주문하기 버튼 클릭 시 호출
  const handleCheckout = () => {
    const invalidItem = cartItems.find((item) => !item.selectedOption || item.selectedOption === "옵션을 선택해 주세요.");
    if (invalidItem) {
      alert("모든 상품의 옵션을 선택해야 주문할 수 있습니다.");
      return;
    }
    navigate('/orders/checkout'); // 조건이 만족되면 주문 페이지로 이동
  };

  return (
    <main className="main-cart">
      <div className="cart-title-box">
        <h3 className="cart-title">장바구니</h3>
      </div>
      <div className="cart-container">
        <div class="cart-header">
          <p>장바구니 상품은 최대 30일간 저장됩니다.</p>
          <p>
            오늘출발 상품은 판매자 설정 시점에 따라 오늘출발 여부가 변경될 수
            있으니 주문 시 꼭 다시 확인해 주시기 바랍니다.
          </p>
        </div>
        {cartItems.length > 0 ? (
          <div className="cart-table">
            {cartItems.map((item) => (
              <div className="cart-row" key={item.ctNo}>
                <div className="cart-thumbnail">
                  <img
                    src={item.thumbnail || "https://via.placeholder.com/150"}
                    alt={item.pdName}
                    width="100"
                  />
                </div>
                <div className="cart-info">
                  <h4>{item.pdName}</h4>
                  <div className="cart-options">
                    <p>수량:
                      <input
                        type="number"
                        value={item.ctCount}
                        min="1"
                        disabled={!item.isEditing} // 수정 모드에서만 활성화
                        onChange={(e) =>
                          handleQuantityChange(item.ctNo, e.target.value)
                        }
                      />
                    </p>
                    <p>
                      옵션:
                      {item.isEditing ? (
                        <select
                          value={item.selectedOption}
                          onChange={(e) =>
                            handleOptionChange(item.ctNo, e.target.value)
                          }
                        >
                          {item.options.length > 0 ? (
                            item.options.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))
                          ) : (
                            <option>옵션 없음</option>
                          )}
                        </select>
                      ) : (
                        item.selectedOption
                      )}
                      </p>
                  </div>
                </div>
                <div className="cart-actions">
                  <button
                    className="cart-modify-btn"
                    onClick={() =>
                      item.isEditing
                        ? handleModify(item.ctNo)
                        : handleEditToggle(item.ctNo, item.pdNo)
                    }
                  >
                    {item.isEditing ? "수정 완료" : "수정"}
                  </button>
                  <button
                    className="cart-delete-btn"
                    onClick={() => handleDelete(item.ctNo)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>장바구니에 상품이 없습니다.</p>
        )}
      </div>

      <div class="checkout-actions">
        <Link to="/product/list" className="checkout-btn continue-btn">
          쇼핑 계속하기
        </Link>
        <button className="checkout-btn order-btn" onClick={handleCheckout}>
          주문하기
        </button>
      </div>
    </main>
  );
};

export default CompOrderCart;
