import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../index';
import '../../assets/css/product/ProductModify.css';
import { useSelector } from 'react-redux';

function ProductModify() {

  const navigate = useNavigate();
  const { host } = useContext(Context);
  const { pdNo } = useParams(); // URL에서 pdNo 가져오기
  const [originalOptions, setOriginalOptions] = useState([]);
  const [form, setForm] = useState({
    pdName: '',
    depth1: '',
    depth2: '',
    comment: '',
    price: '',
    pdCount: '',
    thumnailFile: null,
    detailImgFiles: [],
    options: [] // 옵션 입력 (콤마로 구분된 옵션)
  });

  const depthOptions = {
    "스킨케어": ['에센스', '앰플', '세런', '크림', '로션'],
    "메이크업": ['리프', '베이스', '아이'],
    "마스크팩": ['시트팩', '패드', '코팩', '패치'],
    "바디": ['로션', '오일', '사워', '립케어', '핸드케어', '바디미스트'],
    "클렐징": ['폼', '제르', '오일', '스크럼', '티슈']
  };

  const authToken = useSelector((state) => state.member.authToken);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${host}/product/read?no=${pdNo}`);
        setForm({
          pdName: response.data.pdName || '',
          depth1: response.data.depth1 || '',
          depth2: response.data.depth2 || '',
          comment: response.data.comment || '',
          price: response.data.price || '',
          pdCount: response.data.pdCount || '',
          thumnailFile: response.data.thumnailFile || null,
          detailImgFiles: response.data.detailImgFiles || [],
          options: response.data.options || [],
          // options: response.data.options ? response.data.options.join(', ') : '' // 옵션을 콤마로 연결
        });
        // setOriginalOptions(response.data.options || []); // 기존 옵션 저장하는곳

      } catch (error) {
        console.error('상품 정보 불러오기 실패:', error);
      }
    };
    fetchProduct();
  }, [pdNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value 
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;
    setForm((prevForm) => ({
      ...prevForm,
      options: updatedOptions
    }));
  };

  const handleAddOption = () => {
    setForm((prevForm) => ({
      ...prevForm,
      options: [...prevForm.options, '']
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pdNo', pdNo);
    formData.append('pdName', form.pdName);
    formData.append('depth1', form.depth1);
    formData.append('depth2', form.depth2);
    formData.append('comment', form.comment);
    formData.append('price', form.price);
    formData.append('pdCount', form.pdCount);
    
    if (form.thumnailFile) {
      formData.append('thumnailFile', form.thumnailFile);
    }

    for (let i = 0; i < form.detailImgFiles.length; i++) {
      formData.append('detailImgFiles', form.detailImgFiles[i]);
    }

    // 옵션이 변경되었는지 확인하고 추가
  // if (JSON.stringify(form.options) !== JSON.stringify(originalOptions)) {
  //   form.options.forEach((option) => {
  //     formData.append('option', option);
  //   });
  // }

    form.options.forEach((option) => {
      formData.append('option', option);
    });

    try {
      await axios.put(`${host}/product/modify`, formData, {
        headers: {
          Authorization: authToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('상품이 수정되었습니다.');
      navigate(`/product/read/${pdNo}`);
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert('상품 수정에 실패했습니다.');
    }
  };


  return (
    <main className="pd-mod-container">
      <h2 className="pd-mod-title">상품 수정</h2>
      <form onSubmit={handleSubmit} className="pd-mod-form">
        <div className='pd-mod-content'>
          <div className="pd-mod-group">
            <label htmlFor="pdName">상품명</label>
            <input type="text" name="pdName" value={form.pdName} onChange={handleChange} placeholder="상품명" required />
          </div>

          <div className="pd-mod-group">
            <label htmlFor="depth1">대분류</label>
            <select name="depth1" value={form.depth1} onChange={handleChange}>
              <option value="">대분류 선택</option>
              {Object.keys(depthOptions).map((depth1) => (
                <option key={depth1} value={depth1}>{depth1}</option>
              ))}
            </select>
          </div>

          <div className="pd-mod-group">
            <label htmlFor="depth2">소분류</label>
            <select name="depth2" value={form.depth2} onChange={handleChange} disabled={!form.depth1}>
              <option value="">소분류 선택</option>
              {depthOptions[form.depth1]?.map((depth2) => (
                <option key={depth2} value={depth2}>{depth2}</option>
              ))}
            </select>

          </div>
          <div className="pd-mod-group">
            <label htmlFor="comment">상품 설명</label>
            <textarea name="comment" value={form.comment} onChange={handleChange} rows="5"></textarea>
          </div>

          <div className="pd-mod-group">
            <label htmlFor="price">상품 가격</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>

          <div className="pd-mod-group">
            <label htmlFor="thumnailFile">대표 이미지</label>
            <input type="file" name="thumnailFile" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="pd-mod-group">
            <label htmlFor="detailImgFiles">상세 이미지</label>
            <input type="file" name="detailImgFiles" multiple onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="pd-mod-group pd-mod-option">
            <label htmlFor="options">옵션</label>
            <div className="pd-mod-options">
              <button type="button" onClick={handleAddOption} className="pd-mod-add-btn">
                옵션 추가
              </button>
              {/* 옵션 입력 필드 렌더링 */}
              {form.options.map((option, index) => (
                <input
                  key={index}
                  className="pd-mod-option-field"
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`옵션 ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="pd-mod-group">
            <label htmlFor="pdCount">입고 수량</label>
            <input type="number" name="pdCount" value={form.pdCount} onChange={handleChange} placeholder="입고 수량" required />
          </div>
        </div>

        <button type="submit" className="pd-mod-btn">수정하기</button>
      </form>

    </main>
  );
}

export default ProductModify;
