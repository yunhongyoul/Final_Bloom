import React from 'react';
import MyPageForm from './MyPageForm';
import '../../assets/css/mypage/MyPageform.css';

const MyPageTemplate  = () => {
    return (
      <div className="my-page-template-block">
        <div className="white-box">
          <MyPageForm />
        </div>
      </div>
    );
  };
  

export default MyPageTemplate;
