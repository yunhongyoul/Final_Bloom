import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Context } from '../../index';
import axios from "axios";
import CompPrd from "../productCommon/CompPrd";
import "../../assets/css/product/CompPrdList.css";

const CompPrdList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { host } = useContext(Context);
  const { isLogged, role } = useSelector((state) => state.member);
  const [prdList, setPrdList] = useState([]);
  const [depth1List, setDepth1List] = useState([]);
  const [depth2Map, setDepth2Map] = useState({});
  const [filteredPrdList, setFilteredPrdList] = useState([]);
  const [selectedDepth2, setSelectedDepth2] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedDepth1, setSelectedDepth1] = useState("");

  // 전체 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${host}/product/list`);
        const products = response.data;
        setPrdList(products);

        const uniqueDepth1 = [...new Set(products.map((prd) => prd.depth1))];
        setDepth1List(uniqueDepth1);

        const depth2Mapping = {};
        uniqueDepth1.forEach((depth1) => {
          const depth2ForThisDepth1 = products
            .filter((prd) => prd.depth1 === depth1)
            .map((prd) => prd.depth2);
          depth2Mapping[depth1] = [...new Set(depth2ForThisDepth1)];
        });
        setDepth2Map(depth2Mapping);
      } catch (error) {
        console.error("상품 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const depth1Param = urlParams.get("depth1");

    if (!depth1Param) {
      setSelectedDepth1(""); // 선택된 depth1 초기화
      setSelectedDepth2([]); // 선택된 depth2 초기화
      setPage(1); // 페이지 초기화
    } else {
      setSelectedDepth1(depth1Param);
      setSelectedDepth2((prev) =>
        prev.filter((item) => item.depth1 === depth1Param)
      );
      setPage(1); // 페이지 초기화
    }
  }, [location.search]);

  useEffect(() => {
    let filtered = prdList;

    if (selectedDepth1) {
      filtered = filtered.filter((prd) => prd.depth1 === selectedDepth1);
    }

    if (selectedDepth2.length > 0) {
      filtered = filtered.filter((prd) =>
        selectedDepth2.some(
          (cond) => cond.depth1 === prd.depth1 && cond.depth2 === prd.depth2
        )
      );
    }

    setFilteredPrdList(filtered);
    setPage(1);
  }, [selectedDepth1, selectedDepth2, prdList]);

  const handleCheckboxChange = (depth1, depth2, checked) => {
    const condition = { depth1, depth2 };

    if (depth1 !== selectedDepth1) {
      // 새로운 depth1으로 변경될 때
      // 현재 선택된 depth2를 초기화하지 않고 유지
      setSelectedDepth2([condition]);

      // 이전 depth1의 모든 체크박스 해제
      const checkboxes = document.querySelectorAll(
        `.depth1-group-${selectedDepth1} input[type="checkbox"]`
      );
      checkboxes.forEach((checkbox) => (checkbox.checked = false));

      // 새로운 depth1으로 변경
      setSelectedDepth1(depth1);

      // 선택한 depth1로 이동
      navigate(`/product/list?depth1=${encodeURIComponent(depth1)}`);
    } else {
      // 같은 depth1 안에서 depth2 조건 추가/삭제
      if (checked) {
        setSelectedDepth2((prev) => [...prev, condition]);
      } else {
        setSelectedDepth2((prev) =>
          prev.filter(
            (item) => item.depth1 !== depth1 || item.depth2 !== depth2
          )
        );
      }
    }
  };

  const handleResetFilters = () => {
    navigate("/product/list"); // URL을 초기화
    setSelectedDepth1(""); // depth1 초기화
    setSelectedDepth2([]); // depth2 초기화
    setPage(1); // 페이지 초기화
  };

  const totalPages = Math.ceil(filteredPrdList.length / itemsPerPage);
  const currentProducts = filteredPrdList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedDepth1, selectedDepth2]);

  
  return (

    <div className="prd-container">
      <div className="prd-wrap">
        {/* 검색 필터 */}
        <aside className="prd-filter">
          <button className="filter-btn" onClick={handleResetFilters}>초기화</button>
          <div className="depth1-list">
            {depth1List.map((depth1) => (
              <div key={depth1} className={`depth1-group-${depth1}`}>
                <h3
                  onClick={() =>
                    navigate(`/product/list?depth1=${encodeURIComponent(depth1)}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {depth1}
                </h3>
                <ul>
                  {depth2Map[depth1] &&
                    depth2Map[depth1].map((depth2, index) => (
                      <li key={`${depth1}-${depth2}-${index}`} className="filter-li">
                        <input
                          type="checkbox"
                          checked={selectedDepth2.some(
                            (item) =>
                              item.depth1 === depth1 && item.depth2 === depth2
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(depth1, depth2, e.target.checked)
                          }
                        />
                        {depth2}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        
        <main className="prd-main">
          {isLogged && role === "ROLE_ADMIN" && (
          <button
            className="register-btn"
            onClick={() => navigate("/product/register")}
          >
            상품 등록
          </button>
          )}
          {/* 상품 리스트 */}
          <div className="prd-list-wrap">
            {currentProducts.map((prd) => (
              <CompPrd key={prd.pdNo} {...prd} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="page-before"
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
              className="page-after"
            >
              다음
            </button>
          </div>
        </main>

      </div>
    </div>
  );
};

export default CompPrdList;
