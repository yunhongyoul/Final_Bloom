import { createContext, useEffect, useState } from "react";
import CompHeader from "./components/layout/CompHeader";
import CompFooter from "./components/layout/CompFooter";
import { Route, Routes } from "react-router-dom";
import CompHome from "./components/home/CompHome";
import CompPrdList from "./components/prodcutList/CompPrdList";
import CompPrdDetail from "./components/productDetail/CompPrdDetail";
import CompSearchResult from "./components/searchResult/CompSearchResult";
import CompRegister from "./components/member/CompRegister";
import CompLogin from "./components/member/CompLogin";
import CompFindId from "./components/member/CompFindId";
import CompFindIdAfter from "./components/member/CompFindIdAfter";
import CompRegisterAdmin from "./components/member/CompRegisterAdmin";
import ProductRegister from "./components/prodcutList/ProductRegister";
import MyPage from "./pages/MyPage";
import MyPageRead from "./components/mypage/MyPageRead";
import MyPageMod from "./components/mypage/MyPageMod";
import MyPageQna from "./components/mypage/MyPageQna";
import MyPageReview from "./components/mypage/MyPageReview";
import CompCheckOut from "./components/orders/CompCheckOut";
import CompOrderCart from "./components/cart/CompOrderCart";
import CompComplete from "./components/orders/CompComplete";
import MyOrder from "./components/mypage/MyOrder";
import ProductModify from "./components/prodcutList/ProductModify";
import AdminOrder from "./components/mypage/AdminOrder";
import AdminPageQna from "./components/mypage/AdminPageQna";
import CompCheckOut2 from "./components/orders/CompCheckOut2";
import AdminMember from "./components/mypage/AdminMember";

export const AppContext = createContext();

function App() {
  const [prdList, setPrdList] = useState([]); //최신상품이나 인기상품등을 메인페이지에 출력시 필요함
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true); // 로그인 상태 설정
    } else {
      setIsLogged(false); // 비로그인 상태 설정
    }
  }, []);

  return (
    <AppContext.Provider value={{ isLogged, setIsLogged }}>
      <CompHeader />
      <Routes>
        <Route path="/" element={<CompHome />} />
        {/* Header */}
        <Route path="/search-result/:keyword" element={<CompSearchResult />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* 상품 */}
        <Route path="/product/list" element={<CompPrdList />} />
        <Route path="/product/register" element={<ProductRegister />} />
        <Route path="/product/modify/:pdNo" element={<ProductModify />} />
        <Route path="/product/read/:pdNo" element={<CompPrdDetail />} />
        {/* 로그인 */}
        <Route path="/register" element={<CompRegister />} />
        <Route path="/admin-register" element={<CompRegisterAdmin />} />
        <Route path="/login" element={<CompLogin />} />
        <Route path="/find-id" element={<CompFindId />} />
        <Route path="/find-id-after" element={<CompFindIdAfter />} />
        {/* MyPage */}
        <Route path="/mypage/read" element={<MyPageRead />} />
        <Route path="/mypage/modify" element={<MyPageMod />} />
        <Route path="/mypage/qna" element={<MyPageQna />} />
        <Route path="/mypage/review" element={<MyPageReview />} />
        <Route path="/orders/myList" element={<MyOrder />} />
        <Route path="/orders/list" element={<AdminOrder />} />
        <Route path="/mypage/adminQna" element={<AdminPageQna />} />
        <Route path="/member/list" element={<AdminMember />} />

        {/* 주문 */}
        <Route path="/orders/checkout" element={<CompCheckOut />} />
        <Route path="/orders/singleitem/:pdNo/:ctCount/:option" element={<CompCheckOut2 />} />

        {/* 결재완료 */}
        <Route path="/orders/complete/:odNo" element={<CompComplete />} />

        {/* 장바구니 */}
        <Route path="/cart/list" element={<CompOrderCart />} />
      </Routes>
      <CompFooter />
    </AppContext.Provider>
  );
}
export default App;
