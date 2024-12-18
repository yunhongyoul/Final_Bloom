useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const depth1Param = urlParams.get('depth1');
  if (depth1Param) {
    setSelectedDepth1(depth1Param);
    setPage(1); // 페이지를 1로 초기화
  }
}, [location.search]);

const handleDepth1Change = (depth1) => {
  setSelectedDepth1(depth1);
  navigate(`/product/list?depth1=${encodeURIComponent(depth1)}`);
  setPage(1); // 페이지를 1로 초기화
};

// 상품 필터링 (depth1과 depth2 조건 적용)
useEffect(() => {
  let filtered = prdList;
  
  if (selectedDepth1) {
    filtered = filtered.filter((prd) => prd.depth1 === selectedDepth1);
  }
  
  if (selectedDepth2.length > 0) {
    filtered = filtered.filter((prd) => selectedDepth2.includes(prd.depth2));
  }

  setFilteredPrdList(filtered);
  setPage(1); // 페이지를 1로 초기화 (필터가 변경되었으므로)
}, [selectedDepth1, selectedDepth2, prdList]);

// Depth1 변경 로직 수정
return (
  <div className="prd-container">
    <aside className="prd-filter">
      <h3>검색 필터</h3>
      <div className="depth1-list">
        {depth1List.map((depth1) => (
          <div key={depth1}>
            <h3
              onClick={() => handleDepth1Change(depth1)} // 수정된 부분
              style={{ cursor: 'pointer' }}
            >
              {depth1}
            </h3>

            <ul>
              {depth2Map[depth1] && depth2Map[depth1].map((depth2, index) => (
                <li key={`${depth1}-${depth2}-${index}`}>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(depth2, e.target.checked)
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

    {isLogged && role === 'ROLE_ADMIN' && (
      <Link to="/product/register" className="register-btn">
        상품 등록
      </Link>
    )}

    <main className="prd-main">
      {currentProducts.length > 0 ? (
        <>
          <ul className="prd-list">
            {currentProducts.map((prd) => (
              <CompPrd key={prd.pdNo} {...prd} />
            ))}
          </ul>

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
                className={page === i + 1 ? 'active' : ''}
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
        </>
      ) : (
        <p>조건에 맞는 상품이 없습니다.</p>
      )}
    </main>
  </div>
);
