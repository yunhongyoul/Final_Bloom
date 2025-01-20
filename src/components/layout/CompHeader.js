import React, { useEffect, useContext } from 'react';
import CompLoginBefore from './CompLoginBefore';
import CompLoginAfter from './CompLoginAfter';
import { AppContext } from '../../App';
import CompMenu from './CompMenu';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import "../../assets/css/layout/CompHeader.css";
import logo from "../../assets/img/home/블룸 로고 1.png";

const CompHeader = () => {
  const { isLogged } = useContext(AppContext);
  const navigate = useNavigate();

  const fnSubmitHandler = (e) => {
    e.preventDefault();
    const keyword = document.querySelector(".searchInput").value.trim();
    if (keyword) {
      navigate(`/product/list?search=${encodeURIComponent(keyword)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header-container');
      if (window.scrollY > 0) {
        header.style.backdropFilter = 'blur(5px)';
      } else {
        header.style.backdropFilter = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header-container">
      <div className="header-center">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <form className="search" onSubmit={fnSubmitHandler}>
          <input type="text" className="searchInput" required />
          <button className="searchButton"></button>
        </form>

        <nav className="nav">
          <CompMenu />
          {isLogged ? <CompLoginAfter /> : <CompLoginBefore />}
        </nav>
      </div>
    </header>
  );
};

export default CompHeader;