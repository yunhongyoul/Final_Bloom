import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/layout/CompHeader.css";

const CompMenu = () => {
    const navigate = useNavigate();

    // depth1 클릭 시 URL로 이동하는 함수
    const handleDepth1Click = (depth1) => {
        navigate(`/product/list?depth1=${depth1}`);
        localStorage.setItem('currentPage', 1); // 페이지 초기화
    };

    // Product 클릭 시 필터 초기화 및 전체 상품 보기
    const handleProductClick = () => {
        navigate('/product/list'); // depth1 파라미터 없이 /product/list로 이동
        localStorage.setItem('currentPage', 1); // 페이지 초기화
    };

    return (
        <ul className="nav-menu">
            <li className="menu-item">
                <Link to={'/product/list'} onClick={handleProductClick} className="product-link">Product</Link>
                <ul className="dropdown">
                    <li onClick={() => handleDepth1Click('스킨케어')}>스킨/ 케어</li>
                    <li onClick={() => handleDepth1Click('메이크업')}>메이크업</li>
                    <li onClick={() => handleDepth1Click('마스크팩')}>마스크팩</li>
                    <li onClick={() => handleDepth1Click('바디')}>바디</li>
                    <li onClick={() => handleDepth1Click('클렌징')}>클렌징</li>
                </ul>
            </li>
            <li className="menu-item">
                <Link  to={'/mypage'}>Mypage</Link>
            </li>
        </ul>
    );
};

export default CompMenu;
