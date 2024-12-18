import React, { useState, useContext } from "react";
import "../../assets/css/member/CompRegister.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Context } from "../..";

const CompRegister = () => {
  const authToken = useSelector((state) => state.member.authToken);
  const navigate = useNavigate();
  const { host } = useContext(Context);
  const [member, setMember] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "",
    phone: "",
    role: "ROLE_USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));

    if (name === "id" && value === "관리자등록") {
      alert("관리자 회원가입 페이지로 이동합니다.");
      navigate("/admin-register");
    }
  };

  const idCheck = async () => {
    if (!member.id) {
      console.log("요청 데이터:", { id: member.id });

      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `${host}/check-id`,
        { id: member.id },
        {
          headers: {
            Authorization: `${authToken}`, // Redux에서 가져온 토큰 사용
          },
        }
      );

      console.log("서버 응답:", response.data);
      if (response.data === true) {
        console.log("서버 응답 데이터:", response.data);

        alert("사용 가능한 아이디입니다.");
      } else {
        alert("사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 에러:", error);
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const DomainChange = (e) => {
    const { value } = e.target;

    setMember((prev) => ({
      ...prev,
      emailDomain: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (member.password !== member.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 이메일 아이디와 도메인을 합쳐서 email 필드로 설정
      const fullEmail = `${member.email}@${member.emailDomain}`;
      const fullPhone = `${member.phone}-${member.phone2}-${member.phone3}`;
  
      const response = await axios.post(
        `${host}/register`,
        {
          ...member,
          email: fullEmail, // 합쳐진 이메일을 전송
          phone: fullPhone, // 합쳐진 전화번호를 전송
          // phone: `${member.phone}`, 폰넘버 합칠때 이쪽에 코드 추가
        },
        {
          headers: {
            Authorization: `${authToken}`, // Redux에서 가져온 토큰 사용
          },
        }
      );

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
          <label className="form-title" htmlFor="id">
            회원 아이디
          </label>
          <div className="id-input-group">
            <input
              type="text"
              id="id"
              className="reg-input-field"
              name="id"
              onChange={handleChange}
              required
            />
            <button type="button" className="check-btn" onClick={idCheck}>
              중복확인
            </button>
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
          <label className="form-title" htmlFor="email">
            이메일
          </label>
          <div className="email-input-group">
            <input
              type="text"
              id="email-id"
              className="email-field"
              placeholder="이메일 아이디"
              name="email"
              onChange={handleChange}
            />
            <span>@</span>
            <input
              type="text"
              id="email-domain"
              className="email-field"
              placeholder="도메인"
              name="emailDomain"
              value={member.emailDomain || ""}
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
          <label className="form-title" htmlFor="address">
            주소
          </label>
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
          <label className="form-title" htmlFor="phone">
            휴대폰번호
          </label>
          <div className="phone-field-group">
            <input
              type="text"
              id="phone"
              className="phone-field"
              placeholder="010"
              name="phone"
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              id="phone2"
              className="phone-field"
              name="phone2"
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              id="phone3"
              className="phone-field"
              name="phone3"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="apply-btn-box">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
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

export default CompRegister;
