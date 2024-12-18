import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/member/CompRegister.css";
import axios from "axios";
import { Context } from "../..";

const CompRegisterAdmin = () => {

  const navigate = useNavigate();
  const { host } = useContext(Context);
  const [admin, setAdmin] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "",
    phone: "",
    role: "ROLE_ADMIN",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };


  const idCheck = async () => {
    if (!admin.id) {
      alert("아이디를 입력해주세요.");
      return;
    }
  
    try {
      const response = await axios.post(`${host}/check-id`, { id: admin.id });
      if (response.data) {
        alert("사용 가능한 아이디입니다.");
      } else {
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 에러:", error);
      alert("중복 확인 중 문제가 발생했습니다.");
    }
  };

  const DomainChange = (e) => {
    const { value } = e.target;
  
    setAdmin((prev) => ({
      ...prev,
      emailDomain: value,
    }));
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password !== admin.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(`${host}/register`, admin);
      if (response.status === 201) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <main className="register-container">
    <div className="join-box">
      <h5>회원가입</h5>
    </div>
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-box">
        <label className="form-title" htmlFor="id">회원 아이디</label>
        <div className="id-input-group">
          <input
            type="text"
            id="id"
            className="reg-input-field"
            name="id"
            onChange={handleChange}
            required
          />
          <button type="button" className="check-btn" onClick={idCheck}>중복확인</button>
        </div>
      </div>


        <div className="form-box">
          <div className="form-title">회원 이름</div>
          <input
            type="text"
            className="reg-input-field"
            name="name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-box">
          <div className="form-title">비밀번호</div>
          <input
            type="password"
            className="reg-input-field"
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-box">
          <div className="form-title">비밀번호 확인</div>
          <input
            type="password"
            className="reg-input-field"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="email">이메일</label>
          <div className="email-input-group">
            <input
              type="text"
              id="email-id"
              className="email-field"
              placeholder="이메일 아이디"
              name="emailId"
              onChange={handleChange}
            />
            <span>@</span>
            <input
              type="text"
              id="email-domain"
              className="email-field"
              placeholder="도메인"
              name="emailDomain"
              value={admin.emailDomain || ""}
              onChange={DomainChange}
            />
            <select
              className="select-domain"
              onChange={DomainChange}
              name="emailSelect"
            >
              <option value="">선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="address">주소</label>
          <input
            type="text"
            id="address"
            className="reg-input-field"
            name="address"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="phone">휴대폰번호</label>
          <div className="phone-field-group">
            <input
              type="text"
              id="phone-part1"
              className="phone-field"
              maxLength="3"
              placeholder="010"
              name="phone1"
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              id="phone-part2"
              className="phone-field"
              maxLength="4"
              name="phone2"
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              id="phone-part3"
              className="phone-field"
              maxLength="4"
              name="phone3"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="apply-btn-box">
          <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
            취소
          </button>
          <button type="submit" className="register-btn">
            회원가입
          </button>
        </div>
      </form>
  </main>
  );
};

export default CompRegisterAdmin;
