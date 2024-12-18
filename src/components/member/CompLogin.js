import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Context } from '../..';
import { login } from '../store/memberSlice';
import "../../assets/css/member/CompLogin.css";
import { AppContext } from '../../App';

import loginIcon from "../../assets/img/home/id.png";
import passwordIcon from "../../assets/img/home/password.png";

function CompLogin() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { host } = useContext(Context);
  const { setIsLogged } = useContext(AppContext);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCredentials((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // 가짜 데이터로 테스트
  //   const user = { id: "user1", name: "홍길동" }; 
  //   const token = "authTokenExample";
  
  //   console.log("사용자 데이터:", user); // 확인용 로그
  
  //   // Redux에 저장하지 않고, 바로 로컬 상태에서 관리
  //   localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
  //   setIsLogged(true); // Context 상태 업데이트
  //   navigate("/", { state: { user } }); // 사용자 정보를 전달하며 이동
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${host}/login`, credentials);

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        dispatch(login(response.data)); // Redux에 로그인 정보 저장
        setIsLogged(true);
        navigate("/"); // 메인 페이지로 이동
      } else {
        alert("로그인 실패. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <main>
      <div className='login-container'>
        <div className="login-box">
          <h5>로그인</h5>
        </div>
        
        <form className='login-form' onSubmit={handleSubmit}>
          <div className="text-box">
            <img src={loginIcon} alt="아이디 아이콘" />
            <input
              type="text"
              name="id"
              placeholder="아이디"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-box">
            <img src={passwordIcon} alt="비밀번호 아이콘" />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        <ul className="link-list">
          <li>
            <Link to="/find-id">아이디 찾기</Link>
          </li>
          |
          <li>
            <Link to="/mypage/modify">비밀번호 재설정</Link>
          </li>
          |
          <li>
            <Link to="/register">회원가입</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default CompLogin;
