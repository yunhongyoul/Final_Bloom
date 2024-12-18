import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../assets/css/mypage/MyOrder.css";

const MyOrder = () => {

  const [orders, setOrders] = useState([]);
  const authToken = useSelector((state) => state.member.authToken);
  
  const getRandomDeliveryStatus = () => {
    const statuses = ["상품준비중", "배송중", "배송완료"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!authToken) {
          console.error("로그인이 필요합니다.");
          return;
        }

        const response = await axios.get("http://localhost:8080/orders/myList", {
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
          },
        });

        const updatedOrders = response.data.map(order => ({
          ...order,
          deliveryStatus: getRandomDeliveryStatus()
        }));
        setOrders(updatedOrders);
      } catch (error) {
        console.error("주문 내역을 불러오는 중 오류 발생:", error);
      }
    };
    
    fetchOrders();
  }, [authToken]);
  
  const formatRegDate = (regDate) => {
    if (!regDate) return "N/A";
    const date = new Date(regDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <main className="myorder-container">
      <div className="title-box">구매 내역</div>
      <div className="container">
        <div className="content">
          <h1>Order List</h1>
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>아이디</th>
                <th>총금액</th>
                <th>배송지</th>
                <th>수취인</th>
                <th>연락처</th>
                <th>결제일시</th>
                <th>결제방법</th>
                <th>배송상태</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.odNo}</td>
                  <td>{order.id}</td>
                  <td>{order.totalPrice.toLocaleString()}원</td>
                  <td>{order.odAddress}</td>
                  <td>{order.odName}</td>
                  <td>{order.odPhone}</td>
                  <td>{formatRegDate(order.regDate)}</td>
                  <td>{order.payMethod}</td>
                  <td>{order.deliveryStatus}
                  <div className="button-container">
                      {order.deliveryStatus === "상품준비중" && (
                        <button className="cancel-btn">주문취소</button>
                      )}
                      {order.deliveryStatus === "배송중" && (
                        <button className="return-btn">반품/교환</button>
                      )}
                      {order.deliveryStatus === "배송완료" && (
                        <button className="review-btn">REVIEWS</button>
                      )}
                      <button className="track-btn">배송조회</button>
                    </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default MyOrder;
