import { Link } from "react-router-dom";
import "../../assets/css/member/CompFindId.css";


const CompFindId = () =>  {



  return (
    <main>

      <div className='login-container'>

        <div className="login-box">
          <h5>아이디 찾기</h5>
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="name">이름</label>
          <input
            type="text"
            className="find-input-field"
            name="name"
            required
          />
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="email">이메일</label>
          <div className="find-input-group">
            <input
              type="text"
              id="email"
              className="find-input-field"
              name="email"
            />
          </div>
        </div>

        <div className="form-box">
          <label className="form-title" htmlFor="phone">휴대폰번호</label>
          <div className="find-input-group">
            <input
              type="text"
              id="phone"
              className="find-input-field"
              maxLength="11"
              name="phone"
            />
          </div>
        </div>

        <Link to="/find-id-after">
          <button type="submit" className="find-btn">
            아이디 찾기
          </button>
        </Link>

      </div>

    </main>
  );
}

export default CompFindId;
