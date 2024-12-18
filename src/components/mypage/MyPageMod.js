import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Context } from "../..";

const MyPageMod = () => {
  const navigate = useNavigate();
  const { host } = useContext(Context);
  const { isLogged } = useSelector((state) => state.member);
  const { userId, authToken } = useSelector((state) => state.member);

  const [member, setMember] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    emailId: "",
    emailDomain: "",
    address: "",
    phone: "",
    phone2: "",
    phone3: "",
    role: "ROLE_USER",
  });

  const [isLoading, setIsLoading] = useState(true); // 데이터 로드 상태

  // 🔥 입력 필드 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 이메일 도메인 변경 처리
  const DomainChange = (e) => {
    const { value } = e.target;
    setMember((prev) => ({
      ...prev,
      emailDomain: value,
    }));
  };

  // 🔥 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    try {
      // const token = localStorage.getItem("token");
      // const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기

      if (!userId || !authToken) {
        alert("사용자 정보가 유효하지 않습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      if (member.password || member.confirmPassword) {
        if (member.password !== member.confirmPassword) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
      }

      // 📌 이메일과 전화번호 조합
      const fullEmail = `${member.emailId}@${member.emailDomain}`;
      const fullPhone = `${member.phone}-${member.phone2}-${member.phone3}`;

      // 📌 새로 저장할 회원 정보 구성
      const updatedMember = {
        id: member.id,
        password: member.password,
        email: fullEmail,
        address: member.address,
        phone: fullPhone
      };

      // 📌 서버에 PUT 요청 보내기
      const response = await axios.put(
        `${host}/member/modify`,
        updatedMember,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.status === 204) {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        navigate("/mypage/read");
      } else {
        console.error("Unexpected response:", response);
        alert("예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error occurred while updating member info:", error);

      if (error.response) {
        console.error("Server Error Response:", error.response.data);
      }

      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 🔥 사용자 데이터 로드
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        if (!isLogged || !userId) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${host}/member/${userId}`, {
          method: "GET",
          headers: {
            Authorization: authToken,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Member Data:", data); // 응답 데이터 확인

        const emailParts = data.email ? data.email.split("@") : ["", ""];
        const phoneParts = data.phone ? data.phone.split("-") : ["", "", ""];

        setMember({
          id: data.id,
          name: data.name,
          emailId: emailParts[0],
          emailDomain: emailParts[1],
          address: data.address,
          phone: phoneParts[0],
          phone2: phoneParts[1],
          phone3: phoneParts[2],
        });

        setIsLoading(false); // 로딩 상태 해제
      } catch (error) {
        console.error("Error fetching member data:", error);
        alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    fetchMemberData();
  }, [host, isLogged, userId]);

  return (
    <main className="register-container">
      <div className="join-box">
        <h5>회원정보 수정</h5>
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
              value={member.id || ""}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
        </div>

        <div className="form-box">
          <div className="form-title">회원 이름</div>
          <input
            type="text"
            className="reg-input-field"
            name="name"
            value={member.name || ""}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-box">
          <div className="form-title">비밀번호</div>
          <input
            type="password"
            className="reg-input-field"
            name="password"
            value={member.password || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-box">
          <div className="form-title">비밀번호 확인</div>
          <input
            type="password"
            className="reg-input-field"
            name="confirmPassword"
            value={member.confirmPassword || ""}
            onChange={handleChange}
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
              name="emailId"
              value={member.emailId || ""}
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
              value={member.emailDomain || ""}
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
            value={member.address || ""}
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
              className="phone-field"
              name="phone"
              placeholder="010"
              value={member.phone || ""}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              className="phone-field"
              name="phone2"
              placeholder="0000"
              value={member.phone2 || ""}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              className="phone-field"
              name="phone3"
              placeholder="0000"
              value={member.phone3 || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="apply-btn-box">
          <button type="submit" className="register-btn">
            수정 완료
          </button>
        </div>
      </form>
    </main>
  );
};

export default MyPageMod;
