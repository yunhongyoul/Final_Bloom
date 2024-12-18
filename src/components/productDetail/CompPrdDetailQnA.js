import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../assets/css/product/CompPrdDetailQnA.css";

const CompPrdDetailQnA = ({ pdNo }) => {
  const [activeTab, setActiveTab] = useState("qna");
  const [qnaList, setQnaList] = useState([]);
  const [newQna, setNewQna] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [showQnaInput, setShowQnaInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userId = useSelector((state) => state.member.userId);

  useEffect(() => {
    const savedQnaList = localStorage.getItem("qnaList");
    if (savedQnaList) {
      const parsedQnaList = JSON.parse(savedQnaList);
      const filteredQnaList = parsedQnaList.filter((qna) => qna.pdNo === pdNo);
      setQnaList(filteredQnaList);
    }
  }, [pdNo]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddQna = () => {
    if (newQna.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    const newEntry = {
      pdNo,
      content: newQna,
      userId,
      date: new Date().toISOString(),
    };

    const updatedQnaList = [...qnaList, newEntry];
    setQnaList(updatedQnaList);
    setNewQna("");
    setShowQnaInput(false);

    const storedQnaList = JSON.parse(localStorage.getItem("qnaList")) || [];
    const updatedStoredQnaList = [...storedQnaList, newEntry];
    localStorage.setItem("qnaList", JSON.stringify(updatedStoredQnaList));
  };

  const handleEditQnaStart = (index) => {
    setEditingIndex(index);
    setEditedContent(qnaList[index].content);
  };

  const handleEditQnaSubmit = (index) => {
    const updatedQnaList = qnaList.map((qna, i) =>
      i === index ? { ...qna, content: editedContent } : qna
    );
    setQnaList(updatedQnaList);
    setEditingIndex(null);
    setEditedContent("");

    const storedQnaList = JSON.parse(localStorage.getItem("qnaList")) || [];
    const updatedStoredQnaList = storedQnaList.map((qna) =>
      qna.pdNo === pdNo && qna.content === qnaList[index].content
        ? { ...qna, content: editedContent }
        : qna
    );
    localStorage.setItem("qnaList", JSON.stringify(updatedStoredQnaList));
  };

  const handleEditQnaCancel = () => {
    setEditingIndex(null);
    setEditedContent("");
  };

  const handleDeleteQna = (index) => {
    const updatedQnaList = qnaList.filter((_, i) => i !== index);
    setQnaList(updatedQnaList);

    const storedQnaList = JSON.parse(localStorage.getItem("qnaList")) || [];
    const updatedStoredQnaList = storedQnaList.filter(
      (qna) => !(qna.pdNo === pdNo && qna.content === qnaList[index].content)
    );
    localStorage.setItem("qnaList", JSON.stringify(updatedStoredQnaList));
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQnaList = qnaList.slice().reverse().slice(startIndex, endIndex);
  const totalPages = Math.ceil(qnaList.length / itemsPerPage);
  return (
    <section className="qna">
      <div className="tab-content">
        {activeTab === "qna" && (
          <div className="qna-section">
            <div className="qna-header">
              <h2>Q&A ({qnaList.length})</h2>
            </div>

            {/* Q&A 작성 버튼 */}
            <button
              onClick={() => setShowQnaInput(!showQnaInput)}
              className="qna-reg-btn"
            >
              {showQnaInput ? "작성 취소" : "Q&A 작성"}
            </button>

            {/* Q&A 작성 영역 */}
            {showQnaInput && (
              <div className="qna-input">
                <textarea
                  value={newQna}
                  onChange={(e) => setNewQna(e.target.value)}
                  placeholder="QnA를 작성해주세요."
                  rows={5}
                />
                <button onClick={handleAddQna}>등록</button>
              </div>
            )}

            {/* Q&A 리스트 */}
            <div className="qna-list">
              {qnaList.length === 0 ? (
                <div className="qna-item">
                  <p>아직 작성된 QnA가 없습니다.</p>
                </div>
              ) : (
                [...qnaList].reverse().map((qna, reversedIndex) => {
                  const originalIndex = qnaList.length - 1 - reversedIndex; // 원래 인덱스 계산
                  return (
                    <div className="qna-item" key={originalIndex}>
                      {editingIndex === originalIndex ? (
                        // 수정 모드
                        <div className="qna-mod-area-box">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={5}
                            className="qna-mod-area"
                          />
                          <div className="qna-actions">
                            <button
                              onClick={() => handleEditQnaSubmit(originalIndex)}
                              className="qna-mod-btn"
                            >
                              저장
                            </button>
                            <button
                              onClick={handleEditQnaCancel}
                              className="qna-mod-btn"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        // 읽기 모드
                        <div className="qna-item-content">
                          {/* 줄바꿈 처리를 위해 \n을 <br />로 변환 */}
                          <p>
                            {qna.content.split("\n").map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                          <div className="qna-meta-actions">
                            <div className="qna-meta">
                              <small>{qna.userId}</small>
                              <small>{qna.date}</small>
                            </div>
                            {qna.userId === userId && (
                              <div className="qna-actions">
                                <button
                                  onClick={() =>
                                    handleEditQnaStart(originalIndex)
                                  }
                                  className="qna-meta-btn"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteQna(originalIndex)}
                                  className="qna-meta-btn"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-after"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-before"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default CompPrdDetailQnA;
