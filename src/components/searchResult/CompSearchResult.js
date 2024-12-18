import React, { useEffect, useState, useContext } from "react";
import CompPrd from "../productCommon/CompPrd";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Context } from "../../index";

const CompSearchResult = () => {
  const [prdList, setPrdList] = useState([]);
  const authToken = useSelector((state) => state.member.authToken);
  const { host } = useContext(Context);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  let totalPages = 0;
  let currentProducts;

  // URL 파라미터 가져오기
  const { keyword } = useParams();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${host}/product/list`, {
          headers: {
            Authorization: authToken,
          },
        });
        if (keyword !== null) {
          let filteredPrdList = response.data.filter((prd) => {
            if (prd.pdName.includes(keyword)) {
              return true;
            }
          });
          setPrdList(filteredPrdList);
          setPage(1);
        }
      } catch (error) {
        console.error("상품 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    getProducts();
  }, [keyword]); // 키워드가 변경되면 useEffect 다시 실행

  totalPages = Math.ceil(prdList.length / itemsPerPage);
  currentProducts = prdList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <main className="prd-main">
      {currentProducts.map((prd) => (
        <CompPrd key={prd.pdNo} {...prd} />
      ))}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </button>
      </div>
    </main>
  );
};

export default CompSearchResult;
