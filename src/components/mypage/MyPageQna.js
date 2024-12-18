import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../assets/css/mypage/MyPageQna.css";

const MyPageQna = () => {
  const [qnaList, setQnaList] = useState([]); // QnA 데이터를 저장
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null); // 에러 메시지 저장
  const [page, setPage] = useState(1); // 페이지 번호
  const itemsPerPage = 10; // 페이지당 항목 수
  const currentUserId = useSelector((state) => state.member.userId);

  const formatDateTime = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    try {
      // 🔥 로컬 스토리지에 저장된 Q&A 데이터 가져오기
      const storedQna = JSON.parse(localStorage.getItem("qnaList")) || [];
      const storedProductList =
        JSON.parse(localStorage.getItem("productList")) || []; // 🔥 상품 데이터 가져오기

      if (!currentUserId) {
        setError("로그인 정보가 없습니다.");
        return;
      }

      const filteredQnaList = storedQna.filter(
        (qna) => qna.userId === currentUserId
      );

      setQnaList(filteredQnaList); // 필터링된 Q&A 데이터로 설정
      setProductList(storedProductList); // 🔥 상품 데이터로 설정
    } catch (error) {
      console.error("로컬스토리지 데이터 오류:", error);
      setError("QnA 데이터를 불러오는 중 문제가 발생했습니다.");
    }
  }, [currentUserId]);

  const getProductName = (pdNo) => {
    const product = productList.find((product) => product.pdNo === pdNo);
    return product ? product.pdName : "알 수 없는 상품";
  };

  const totalPages = Math.ceil(qnaList.length / itemsPerPage);

  const paginatedQna = qnaList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <main className="qna-container">
      <div className="qna-box">
        <h5>내 문의 내역</h5>
      </div>

      <table className="qna-list">
        <thead className="qna-list-head">
          <tr>
            <th className="col-1">No</th>
            <th className="col-2">상품명</th>
            <th className="col-3">게시글 제목</th>
            <th className="col-4">작성일</th>
          </tr>
        </thead>

        <tbody className="qna-list-body">
          {paginatedQna.length > 0 ? (
            paginatedQna.map((qna, index) => (
              <tr key={qna.qnaNo}>
                <td className="col-1">
                  {(page - 1) * itemsPerPage + index + 1}
                </td>
                <td className="col-2">{getProductName(qna.pdNo)}</td>
                <td className="col-3">{qna.content}</td>
                <td className="col-4">
                  {qna.date ? formatDateTime(qna.date) : "날짜 없음"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">작성한 문의 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="page-before"
        >
          이전
        </button>

        {/* 페이지 번호 */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="page-after"
        >
          다음
        </button>
      </div>
    </main>
  );
};

export default MyPageQna;
