import React, { useEffect, useState } from "react";

function AdminMember() {
  const [qnaList, setQnaList] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 항목 수

  // 📌 로컬 스토리지에서 Q&A 데이터 가져오기
  useEffect(() => {
    const savedQnaList = localStorage.getItem("qnaList");
    if (savedQnaList) {
      setQnaList(JSON.parse(savedQnaList)); // 로컬 스토리지의 데이터를 QNA 리스트로 설정
    }
  }, []);

  // 📌 페이지네이션에 사용할 변수 계산
  const totalPages = Math.ceil(qnaList.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQna = qnaList.slice(startIndex, endIndex);

  // 📌 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  return (
    <main className="qna-container">
      <div className="qna-box">
        <h5>문의 내역</h5>
      </div>

      <table className="qna-list">
        <thead className="qna-list-head">
          <tr>
            <th className="col-1">No</th>
            <th className="col-2">게시글 제목</th>
            <th className="col-3">작성일</th>
            <th className="col-4">작성자</th>
          </tr>
        </thead>

        <tbody className="qna-list-body">
          {paginatedQna.length > 0 ? (
            paginatedQna.map((qna, index) => (
              <tr key={qna.qnaNo}>
                <td className="col-1">
                  {(page - 1) * itemsPerPage + index + 1}
                </td>
                <td className="col-2">{qna.content}</td>
                <td className="col-3">
                  {qna.date
                    ? (() => {
                        const dateObj = new Date(qna.date);
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // 월은 0부터 시작하므로 +1
                        const day = String(dateObj.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`; // 하이픈(-)으로 구분
                      })()
                    : "날짜 없음"}
                </td>
                <td className="col-4">{qna.userId || "익명"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">작성한 문의 내역이 없습니다.</td>
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
}

export default AdminMember;
