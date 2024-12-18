import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Context } from "../../index";
import axios from "axios";

import "../../assets/css/product/CompPrdDetailReview.css";

const CompPrdDetailReview = () => {
  const { isLogged, role, userId } = useSelector((state) => state.member);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [reviewContent, setReviewContent] = useState(""); // 리뷰 등록록
  const [isReviewing, setIsReviewing] = useState(false); // 리뷰 작성 폼 상태 추가
  const { pdNo } = useParams();
  const { host } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 한 페이지당 항목 수

  // 리뷰 데이터 불러오기
  useEffect(() => {
    const fetchReviews = async () => {
      if (!pdNo) {
        console.error("pdNo가 정의되지 않았습니다.");
        return;
      }

      try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");

        // API 호출
        const response = await axios.get(
          `${host}/review/productList?pdNo=${pdNo}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("리뷰 데이터:", response.data);
        if (response.status === 200) {
          setReviews(response.data.reverse()); // 역정렬된 리뷰 데이터 저장
        } else {
          console.error("리뷰 데이터를 가져오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchReviews();
  }, [pdNo]);

  // 리뷰 등록
  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!reviewContent.trim()) {
        alert("리뷰 내용을 입력해주세요.");
        return;
      }

      const response = await axios.post(
        `${host}/review/register`,
        {
          pdNo: pdNo,
          content: reviewContent,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("리뷰가 등록되었습니다.");
        const newReview = {
          reNo: response.data, // API에서 반환된 reNo 사용
          id: userId, // 로그인한 사용자의 ID
          pdNo: pdNo, // 현재 상품 번호
          content: reviewContent, // 사용자가 입력한 리뷰 내용
          regDate: new Date().toISOString(), // 현재 시간을 등록일로 추가
          modDate: new Date().toISOString(), // 수정일을 현재 시간으로 초기화
        };
        // 최신 리뷰가 위에 오도록 새로 등록한 리뷰를 앞에 추가
        setReviews([newReview, ...reviews]);

        // 폼 초기화
        setReviewContent("");
        setIsReviewing(false);
      } else {
        alert("리뷰 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 등록 중 오류 발생:", error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reNo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await axios.delete(`${host}/review/remove/${reNo}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        alert("리뷰가 삭제되었습니다.");
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reNo !== reNo)
        );
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 수정 함수 (기본 폼 표시)
  const [editReviewId, setEditReviewId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleEditClick = (review) => {
    setEditReviewId(review.reNo); // 수정할 리뷰 ID 설정
    setEditContent(review.content); // 기존 내용 가져오기
  };

  const handleUpdateReview = async (reNo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${host}/review/modify`,
        { reNo, content: editContent },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert("리뷰가 수정되었습니다.");
        setReviews(
          reviews.map((review) =>
            review.reNo === reNo ? { ...review, content: editContent } : review
          )
        );
        setEditReviewId(null); // 수정 폼 닫기
      } else {
        alert("리뷰 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error);
    }
  };

  // 페이징 처리
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  // 로딩 중일 때 메시지 표시
  if (loading) {
    return <p>리뷰 데이터를 불러오는 중입니다...</p>;
  }

  // 리뷰가 없을 때 메시지 표시
  if (reviews.length === 0) {
    return <p>리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>;
  }

  // 리뷰 데이터를 렌더링
  return (
    <section className="review">
      <h2>상품 리뷰 ({reviews.length})</h2>

      {/* 리뷰 작성 버튼 */}
      <button
        onClick={() => setIsReviewing((prev) => !prev)}
        className="review-reg-btn"
      >
        {isReviewing ? "작성 취소" : "리뷰 작성"}
      </button>

      {/* 리뷰 작성 영역 */}
      {isReviewing && (
        <div className="review-form">
          <textarea
            placeholder="리뷰를 작성해주세요."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          ></textarea>
          <div className="review-buttons">
            <button onClick={handleAddReview} className="review-reg-btn2">
              등록
            </button>
          </div>
        </div>
      )}

      {/* 리뷰 리스트 */}
      <div className="review-list">
        {currentReviews.map((review) => (
          <div key={review.reNo} className="review-item">
            {/* 상단 영역: 리뷰 내용 + 아이디와 날짜 */}
            {editReviewId === review.reNo ? (
              <div className="edit-review-form">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-review-area"
                  rows="5"
                ></textarea>
                <div className="review-bottom">
                  <button
                    onClick={() => handleUpdateReview(review.reNo)}
                    className="review-save-btn"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditReviewId(null)}
                    className="review-cancel-btn"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="review-top">
                  <p className="review-content">{review.content}</p>
                  <div className="review-meta">
                    <span className="review-id">{review.id}</span>
                    <span className="review-date">
                      {new Date(review.regDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* 읽기 모드: 수정/삭제 버튼 */}
                {isLogged && review.id === userId && (
                  <div className="review-bottom">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="review-edit-btn"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.reNo)}
                      className="review-delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* 페이징 버튼 */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* 이전 버튼 */}
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className="page-after"
            disabled={currentPage === 1}
          >
            이전
          </button>

          {/* 페이지 숫자 버튼 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-btn ${
                currentPage === number ? "active" : ""
              }`}
            >
              {number}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            className="page-before"
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
};

export default CompPrdDetailReview;
