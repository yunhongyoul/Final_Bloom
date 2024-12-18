import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Context } from '../..';
import '../../assets/css/orders/orders.css'
import PortOne from '@portone/browser-sdk/v2';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CompCheckOut2 = () => {
  const { host } = useContext(Context);
  const [item, setItem] = useState([]);
  const [memberData, setMemberData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [deliveryType, setDeliveryType] = useState('member'); // 기본값: 'member'
  const [totalPrice, setTotalPrice] = useState(0); // 상품 합계 금액
  const [shippingFee, setShippingFee] = useState(0); // 배송비
  const [finalPrice, setFinalPrice] = useState(0); // 최종 결제 금액

  // 토큰
  const authToken = useSelector((state) => state.member.authToken);

  // 결제 상태
  const [paymentStatus, setPaymentStatus] = useState({
    status: "IDLE",
  })

  const navigate = useNavigate();

  const extractMemberIdFromToken = (token) => {
    if (!token) {
      console.error("토큰이 없습니다.");
      return null;
    }
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1])); // JWT payload 디코딩
      return payload.sub; // 사용자 ID (sub 필드)
    } catch (error) {
      console.error("토큰 디코딩 중 오류 발생:", error);
      return null;
    }
  };

  const { pdNo, ctCount, option } = useParams();

  useEffect(() => {

    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const memberId = extractMemberIdFromToken(token); // 사용자 ID 추출

        // 1. 상품 데이터 가져오기
        const response = await axios.get(`http://localhost:8080/product/read?no=${pdNo}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });
        const product = response.data;
        setItem(product);

        // 상품 합계 금액 계산
        setTotalPrice(product.price);

        // 배송비 계산 (3만원 이상 무료, 미만 2500원)
        const shipping = totalPrice >= 30000 ? 0 : 2500;
        setShippingFee(shipping);

        // 최종 결제 금액 계산
        setFinalPrice(totalPrice + shipping);

        // 2. 회원 데이터 가져오기
        const memberResponse = await axios.get(`http://localhost:8080/member/${memberId}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });
        setMemberData(memberResponse.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCartData();
  }, [host]);

  const handleDeliveryTypeChange = async (type) => {
    setDeliveryType(type);

    if (type === 'member') {
      const token = localStorage.getItem('token');
      if (token) {
        const memberId = extractMemberIdFromToken(token);
        try {
          const response = await axios.get(`http://localhost:8080/member/${memberId}`, {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          });
          setMemberData(response.data);
        } catch (error) {
          console.error('회원 정보를 가져오는 중 오류 발생:', error);
        }
      }
    } else if (type === 'custom') {
      setMemberData({
        name: '',
        address: '',
        phone: '',
      });
    }
  };

  // 주문
  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("")
  }

  const handleClick = async (e) => {

    e.preventDefault()
    setPaymentStatus({ status: "PENDING" })
    const paymentId = randomId()

    // 결제창 호출
    const payment = await PortOne.requestPayment({
      storeId: "store-a9181f3b-2e70-4b78-a931-4f42941035f3", // 스토어아이디 설정
      channelKey: "channel-key-14e6d9b0-deb8-4245-a558-29d0fe468d3f", // 채널키 설정
      paymentId,
      orderName: memberData.name,
      totalAmount: 10,
      currency: 'CURRENCY_KRW',
      payMethod: "EASY_PAY", // 카카오페이는 'EASY_PAY'
      // customData: {
      //   item: item.id,
      // },
      customer: { // customer은 KG이니시스 일반 결제시 필요한 정보
        fullName: memberData.name,
        email: memberData.email,
        phoneNumber: memberData.phone
      },

    })

    if (payment.code !== undefined) {
      setPaymentStatus({
        status: "FAILED",
        message: payment.message,
      })
      return
    }

    // 가맹점 결제 요청 (서버)
    const completeResponse = await fetch("http://localhost:8080/orders/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      body: JSON.stringify({
        orders: {
          totalPrice: totalPrice,
          odAddress: memberData.address,
          odName: memberData.name,
          odPhone: memberData.phone,
          payMethod: '카카오페이'
        }, //주문정보
        paymentId: payment.paymentId, // 결제번호
      }),
    })
    // 결제 결과
    if (completeResponse.status === 201) {
      const odNo = await completeResponse.json()
      setPaymentStatus({
        status: 'Completed',
      })
      navigate(`/orders/complete/${odNo}`);
    } else {
      setPaymentStatus({
        status: "FAILED",
        message: await completeResponse.text(),
      })
      alert('결제에 실패했습니다..');
    }
  }

  return (
    <main className="register-container">
      <div className="read-box">
        <h5>단건 상품 주문하기</h5>
      </div>

      <form className="form-section">
        <div className="section">
          <h2 className="section-title"></h2>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>수량</th>
                <th>옵션</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{item.pdName}</td>
                  <td>{ctCount}</td>
                  <td>{option === null ? '-' : option}</td>
                  <td>{(item.price * ctCount).toLocaleString()}원</td>
                </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2 className="section-title">배송지 입력</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="delivery-type"
                value="member"
                checked={deliveryType === 'member'}
                onChange={() => handleDeliveryTypeChange('member')}
              />{' '}
              회원 정보와 동일
            </label>
            <label>
              <input
                type="radio"
                name="delivery-type"
                value="custom"
                checked={deliveryType === 'custom'}
                onChange={() => handleDeliveryTypeChange('custom')}
              />{' '}
              직접 입력
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="recipient-name">받으시는 분</label>
            <input
              type="text"
              id="recipient-name"
              placeholder="이름을 입력하세요"
              value={memberData.name}
              onChange={(e) =>
                setMemberData({ ...memberData, name: e.target.value })
              }
              readOnly={deliveryType === 'member'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipient-address">주소</label>
            <input
              type="text"
              id="recipient-address"
              placeholder="주소를 입력하세요"
              value={memberData.address}
              onChange={(e) =>
                setMemberData({ ...memberData, address: e.target.value })
              }
              readOnly={deliveryType === 'member'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipient-phone">전화번호</label>
            <input
              type="text"
              id="recipient-phone"
              placeholder="전화번호를 입력하세요"
              value={memberData.phone}
              onChange={(e) =>
                setMemberData({ ...memberData, phone: e.target.value })
              }
              readOnly={deliveryType === 'member'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="delivery-note">남기실 말씀</label>
            <input type="text" id="delivery-note" placeholder="요청사항을 입력하세요" />
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">결제 정보</h2>
          <table>
            <tbody>
              <tr>
                <td>상품 합계 금액</td>
                <td>{totalPrice.toLocaleString()}원</td>
              </tr>
              <tr>
                <td>배송비</td>
                <td>{shippingFee.toLocaleString()}원</td>
              </tr>
              <tr>
                <td>최종 결제 금액</td>
                <td>
                  <b>{finalPrice.toLocaleString()}원</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button-box">
          <button onClick={handleClick}>결제하기</button>
        </div>
      </form>
    </main>
  );
};

export default CompCheckOut2;
