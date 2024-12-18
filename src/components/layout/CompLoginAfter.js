import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../store/memberSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppContext } from '../../App';
import "../../assets/css/layout/CompHeader.css";


// 이미지경로가 잘안잡혀서 임포트함
import logoutIcon from '../../assets/img/home/logout.png';
import cartIcon from '../../assets/img/home/cart.png';

const CompLoginAfter = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLogged } = useContext(AppContext);

  const handleLogout = () => {

    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLogged(false);

    navigate("/");
  };

  return (
    <ul className='nav-icons'>
      <li>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src={logoutIcon} alt="logout"  className="logout-icon"/>
        </button>
      </li>
      <li>
        <Link to="/cart/list">
          <img src={cartIcon} alt="cart" />
        </Link>
      </li>
  </ul>
  );
};

export default CompLoginAfter;