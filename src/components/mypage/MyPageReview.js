import React, { useEffect, useState } from 'react';
import "../../assets/css/mypage/MyPageReview.css";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyPageReview = () => {

  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장
  const [error, setError] = useState(null); // 에러 메시지 저장
  const { isLogged, userId } = useSelector((state) => state.member);  // Redux에서 로그인 정보 가져오기
  const [filteredReviews, setFilteredReviews] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isLogged) {
        setError("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
    
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/review/myList", {
          headers: {
            Authorization: token,
          },
        });
    
        const reviews = response.data;
    
        // createdAt 필드를 ISO 형식으로 변환
        const formattedReviews = reviews.map((review) => ({
          ...review,
          createdAt: review.createdAt ? review.createdAt.replace(" ", "T") : null,
        }));
    
        // 리뷰 데이터를 역순으로 정렬
        formattedReviews.sort((a, b) => b.reNo - a.reNo);
    
        setReviews(formattedReviews);
      } catch (error) {
        console.error("리뷰 데이터를 불러오는 중 오류 발생:", error);
        setError("리뷰 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    };

    fetchReviews();
  }, [isLogged, navigate]);


  useEffect(() => {
    setFilteredReviews(reviews);
    setPage(1); // 필터 변경 시 페이지를 초기화
  }, [reviews]);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginatedReviews = reviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const pageNumbers = () => {
    const maxVisiblePages = 5; // 화면에 표시할 최대 페이지 수
    let start = Math.max(page - Math.floor(maxVisiblePages / 2), 1);
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }


  return (
    <main className="review-container">
      <div className="review-box">
        <h5>내 리뷰</h5>
      </div>

      <table className='review-list'>
        <thead className='review-list-head'>
          <tr>
            <th className='col-1'>No</th>
            <th className='col-2'>게시글 제목</th>
            <th className='col-3'>작성일</th>
          </tr>
        </thead>

        <tbody className='review-list-body'>
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map((review, index) => (
              <tr key={review.reNo}>
                <td className="item-col-1">{(page - 1) * itemsPerPage + index + 1}</td>
                <td className="item-col-2">{review.content}</td>
                <td className="item-col-3">{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">작성한 리뷰가 없습니다.</td>
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
        {pageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={page === pageNumber ? "active" : ""}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
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

export default MyPageReview;
