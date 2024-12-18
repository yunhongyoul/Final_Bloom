import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { counterSlice } from '../store/countSlice';

export const Counterr = ({ onChange }) => {

  const num = useSelector((state) => state.counter.num);
    const dispatch = useDispatch();

    const handleIncrement = () => {
      const newCount = num + 1; // 수량 증가
      dispatch(counterSlice.actions.up(1));
      onChange(newCount); // 부모에 변경된 수량 전달
  };

  const handleDecrement = () => {
    if (num > 1) { // 최소값이 1 이하로 내려가지 않도록 조건 설정
      const newCount = num - 1; 
      dispatch(counterSlice.actions.down(1));
      onChange(newCount); // 부모에 변경된 수량 전달
    }
  };
  

  return (
    <div className='counter-gap'>
      <button onClick={handleDecrement} className='counter-btn'>-</button>
      {num}
      <button onClick={handleIncrement} className='counter-btn'>+</button>
    </div>
  );
};
