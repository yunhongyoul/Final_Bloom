import { Link } from "react-router-dom";
import "../../assets/css/member/CompFindIdAfter.css";


const CompFindId = () =>  {



  return (
    <main>

      <div className='login-container'>

        <div className="login-box">
          <h5>아이디 찾기</h5>
        </div>

        <div className="find-id-box">
          <div className="form-box">
            <label className="form-title" htmlFor="name">아이디</label>
            <input
              type="text"
              className="find-id-field"
              name="name"
              disabled
            />
          </div>

          <Link to="/login">
            <button type="submit" className="find-btn">
              로그인하기
            </button>
          </Link>
        </div>

      </div>

    </main>
  );
}

export default CompFindId;
