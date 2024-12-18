import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Context } from "../../index";
import "../../assets/css/mypage/AdminMember.css";

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("ROLE_USER");
  const { host } = useContext(Context);
  const authToken = useSelector((state) => state.member.authToken);

  useEffect(() => {
    // 회원 정보 API 호출
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(`${host}/member/list`, {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });
        setMemberList(response.data); // 전체 회원 데이터 설정
        setLoading(false);
      } catch (error) {
        console.error("회원 정보 가져오기 오류:", error);
        setLoading(false);
      }
    };

    if (authToken) {
      fetchMemberData(); // 로그인된 사용자의 토큰이 있을 때만 호출
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // 등급별로 회원 분류
  const groupMembersByRole = (members) => {
    return members.reduce((acc, member) => {
      const { role } = member; // 회원의 등급을 기준으로 분류 (role 속성)
      if (!acc[role]) acc[role] = []; // 해당 등급이 없으면 초기화
      acc[role].push(member); // 등급에 해당하는 회원 추가
      return acc;
    }, {});
  };

  const membersByRole = groupMembersByRole(memberList);

  const toggleRoleTable = (role) => {
    setActiveRole((prevRole) => (prevRole === role ? null : role)); // 현재 클릭한 역할만 표시, 다시 클릭하면 숨김
  };

  return (
    <main>
      <div className="title-box">전체 회원 관리</div>
      <div className="container">
        <div className="content">
          <h1>회원조회</h1>
          {loading && <p>로딩 중...</p>}

          {Object.keys(membersByRole).length > 0 ? (
            <div>
              {/* 등급 버튼 */}
              <div className="role-buttons">
                {Object.keys(membersByRole).map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRoleTable(role)}
                    className={activeRole === role ? "active" : ""}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* 테이블 표시 */}
              {Object.keys(membersByRole).map((role) => (
                <div
                  key={role}
                  className="member-role-section"
                  style={{ display: activeRole === role ? "block" : "none" }}
                >
                  <table className="member-table">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>phone</th>
                        <th>address</th>
                        <th>email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersByRole[role].map((member) => (
                        <tr key={member.id}>
                          <td>{member.id}</td>
                          <td>{member.name}</td>
                          <td>{member.phone}</td>
                          <td>{member.address}</td>
                          <td>{member.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p>회원 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminMember;
