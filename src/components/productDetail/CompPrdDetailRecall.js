import React from "react";
import "../../assets/css/product/CompPrdDetailRecall.css";

const CompPrdDetailRecall = () => {
  return (
    <section className="recall">
      <div className="info-section">
        <h3>판매자 정보</h3>
        <table>
          <tr>
            <th>업체명</th>
            <td>제이치코퍼레이션</td>
          </tr>
          <tr>
            <th>대표자</th>
            <td>배장현</td>
          </tr>
          <tr>
            <th>사업자구분</th>
            <td>개인</td>
          </tr>
          <tr>
            <th>사업자등록번호</th>
            <td>866-29-00866</td>
          </tr>
          <tr>
            <th>통신판매업신고번호</th>
            <td>2021 서울강서 1554</td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>010-5864-0347</td>
          </tr>
          <tr>
            <th>e-mail</th>
            <td>qofftmak@naver.com</td>
          </tr>
        </table>
      </div>
      <div className="info-section">
        <h3>교환/반품 접수안내</h3>
        <p>1. 마이페이지: 주문/배송조회로 이동</p>
        <p>2. 주문조회: "교환/반품접수" 버튼 선택</p>
        <p>
          마이페이지에서 접수가 어려운 경우 고객센터(1899-7000)으로 문의하여
          주시기 바랍니다.
        </p>
      </div>
      <div className="info-section">
        <h3>교환/반품 안내</h3>
        <p>- 반품비용: 7,000원</p>
        <p>- 교환비용: 7,000원</p>
        <p>
          - 보낼 곳: (07806) 서울 강서구 마곡중앙로 35 425호 (마곡동,
          이너매스마곡Ⅱ)
        </p>
        <p>
          단, 고객의 단순 변심에 의한 경우 발생하는 부분 반품시 일부 배송비가
          부과될 수 있으며, 무료배송 상품을 반품하시는 경우 반품비에 초기
          배송비가 포함되어 청구될 수 있습니다.
        </p>
      </div>
      <div className="info-section">
        <h3>교환/반품 규정 안내</h3>
        <p>- 교환/반품은 구매확정 전까지 가능합니다.</p>
        <p>- 제품이 손상되거나 사용된 경우 교환/반품이 불가합니다.</p>
        <p>- 신선식품, 주문 제작 상품 등은 교환/반품이 제한될 수 있습니다.</p>
        <p>
          기타 자세한 내용은 고객센터 또는 판매자 정보를 통해 확인하시기
          바랍니다.
        </p>
      </div>
    </section>
  );
};

export default CompPrdDetailRecall;
