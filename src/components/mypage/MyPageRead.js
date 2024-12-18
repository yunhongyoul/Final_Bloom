import React, {useState, useContext} from 'react';
import "../../assets/css/mypage/MyPageRead.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import "../member/CompRegister";
import { useSelector } from 'react-redux'; 

const MyPageRead = () => {

  const navigate = useNavigate();
  const { host } = useContext(Context);
  const { isLogged, userId } = useSelector((state) => state.member); 
  const [member, setMember] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });


  useEffect(() => {
    const fetchMemberData = async () => {

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login'); 
            return;
          }

          if (!isLogged) {
            alert('로그인이 필요합니다.');
            navigate('/login'); 
            return;
          }

          
          const response = await fetch(`${host}/member/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: token, 
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("사용자 정보:", data);
    
          // React 상태 업데이트
          setMember({
            id: data.id,
            name: data.name,
            email: data.email,
            address: data.address,
            phone: data.phone,
          });
        } catch (error) {
          console.error("Error fetching member data:", error.message);
        }
      };
    
      fetchMemberData();
    }, [host, isLogged]);

      // 수정 코드작성


  return (
    <main className="register-container">
    <div className="read-box">
      <h5>회원정보</h5>
    </div>
    
    <form className="form-section">
        <div className="form-box">
          <label className="form-title" htmlFor="id">회원 아이디</label>
          <input
            type="text"
            className="my-input-field"
            id="id"
            name="id"
            value={member.id || ''}
            disabled 
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="name">회원 이름</label>
          <input
            type="text"
            className="my-input-field"
            id="name"
            name="name"
            value={member.name || ''}
            disabled 
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="email">이메일</label>
          <div className="email-input-group">
            <input
              type="text"
              id="email-id"
              className="my-input-field"
              name="email"
              value={member.email || ''}
              disabled 
            />
          </div>
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="address">주소</label>
          <input
            type="text"
            id="address"
            className="my-input-field"
            name="address"
            value={member.address || ''}
            disabled 
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="phone">휴대폰번호</label>
          <div className="phone-field-group">
            <input
              type="text"
              id="phone-part"
              className="my-input-field"
              name="phone"
              value={member.phone || ''}
              disabled 
            />
          </div>
        </div>


        {/* 회원 수정은 여기만 건들이기 */}
        <div className="apply-btn-box">
          <Link to="/mypage/modify">
            <button type="submit" className="register-btn">
              회원정보 수정
            </button>
          </Link>
        </div>
      </form>
  </main>
  );
};

export default MyPageRead;
