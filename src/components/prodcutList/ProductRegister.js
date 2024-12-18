import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../../index';
import '../../assets/css/product/ProductRegister.css';

function ProductRegister() {

  const { host } = useContext(Context);
  const navigate = useNavigate();
  
  // 폼에 입력되는 데이터를 관리하는 상태
  const [form, setForm] = useState({
    pdName: '',
    depth1: '',
    depth2: '',
    comment: '',
    price: '',
    pdCount: '',
    thumnailFile: null,
    detailImgFiles: [],
    options: '' // 옵션 입력 (콤마로 구분된 옵션)
  });

  const depthOptions = {
    스킨케어: ['에센스', '앰플', '세럼', '크림', '로션'],
    메이크업: ['립', '베이스', '아이'],
    마스크팩: ['시트팩', '패드', '코팩', '패치'],
    바디: ['로션', '오일', '샤워', '립케어', '핸드케어', '바디미스트'],
    클렌징: ['폼', '젤', '오일', '스크럽', '티슈'],
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === 'depth1' && { depth2: '' }) // depth1이 변경되면 depth2 초기화
    }));
  };

  // 파일 입력 핸들러
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'thumnailFile') {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: files[0],
      }));
    } else if (name === 'detailImgFiles') {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: files,
      }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pdName', form.pdName);
    formData.append('depth1', form.depth1);
    formData.append('depth2', form.depth2);
    formData.append('comment', form.comment);
    formData.append('price', form.price);
    formData.append('pdCount', form.pdCount);
    formData.append('thumnailFile', form.thumnailFile);

    // 상세 이미지 추가
    for (let i = 0; i < form.detailImgFiles.length; i++) {
      formData.append('detailImgFiles', form.detailImgFiles[i]);
    }

    // 옵션 추가 (콤마로 구분된 옵션을 배열로 변환)
    const optionArray = form.options.split(',').map(option => option.trim());
    optionArray.forEach((option) => {
      formData.append('option', option);
    });

    try {
      const response = await axios.post(
        `${host}/product/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert(`상품이 등록되었습니다. 상품 번호: ${response.data}`);
      navigate('/product/list');
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록에 실패했습니다.');
    }
  };


  return (
    <main className="product-register-container">
      <div className='pd-reg-box'>
        <h2>상품 등록</h2>
        <form onSubmit={handleSubmit} className='pd-reg-form'>
          <div className='pd-reg-content'>
            <div className="pd-reg-group">
              <label htmlFor="pdName">상품명</label>
              <input type="text" name="pdName" value={form.pdName} onChange={handleChange} required />
            </div>

            <div className="pd-reg-group">
              <label htmlFor="depth1">대분류</label>
              <select name="depth1" value={form.depth1} onChange={handleChange}>
                <option value="">선택하세요</option>
                {Object.keys(depthOptions).map((depth1) => (
                  <option key={depth1} value={depth1}>{depth1}</option>
                ))}
              </select>
            </div>

            <div className="pd-reg-group">
              <label htmlFor="depth2">소분류</label>
              <select name="depth2" value={form.depth2} onChange={handleChange} disabled={!form.depth1}>
                <option value="">선택하세요</option>
                {depthOptions[form.depth1]?.map((depth2) => (
                  <option key={depth2} value={depth2}>{depth2}</option>
                ))}
              </select>
            </div>

            <div className="pd-reg-group comment-group">
              <label htmlFor="comment" className='comment-area'>상품 설명</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} rows="5"></textarea>
            </div>

            <div className="pd-reg-group">
              <label htmlFor="price">상품 가격</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required />
            </div>

            <div className="pd-reg-group">
              <label htmlFor="thumnailFile">대표 이미지</label>
              <input type="file" name="thumnailFile" onChange={handleFileChange} accept="image/*" />
            </div>

            <div className="pd-reg-group">
              <label htmlFor="detailImgFiles">상세 이미지</label>
              <input type="file" name="detailImgFiles" multiple onChange={handleFileChange} accept="image/*" />
            </div>

            <div className="pd-reg-group">
              <label htmlFor="options">옵션</label>
              <input type="text" name="options" value={form.options} onChange={handleChange} placeholder="옵션1, 옵션2, 옵션3" />
            </div>

            <div className="pd-reg-group">
              <label htmlFor="pdCount">입고 수량</label>
              <input type="number" name="pdCount" value={form.pdCount} onChange={handleChange} required />
            </div>
          </div>


        </form>
        <button type="submit" className="pd-reg-btn">상품 등록</button>
      </div>

    </main>
  );
}

export default ProductRegister;
