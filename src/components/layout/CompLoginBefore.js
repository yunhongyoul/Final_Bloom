import React from 'react';
import { Link } from 'react-router-dom';
import "../../assets/css/layout/CompHeader.css";


// 이미지경로가 잘안잡혀서 임포트함
import loginIcon from '../../assets/img/home/login.png';
import cartIcon from '../../assets/img/home/cart.png';

const CompLoginBefore = () => {
  return (
    <ul className='nav-icons'> 
      <li>
        <Link to="/login">
          <img src={loginIcon} alt="login" />
        </Link>
      </li>
      <li>
        <Link to="/login">
          <img src={cartIcon} alt="cart" />
        </Link>
      </li>
  </ul>
  );
};

export default CompLoginBefore;