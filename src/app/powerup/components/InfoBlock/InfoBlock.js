import React from 'react';

const InfoBlock = ({icon, amount, name, amountClassName}) => (
  <div className="info-block-item tr-rounded-box">
    <div className="info-block-icon">{icon}</div>
    <div className="info-block-wrapper">
      <div className={`icon-block-amount-text ${amountClassName ? amountClassName : ''}`}>{amount}</div>
      <div className="icon-block-amount-name">{name}</div>
    </div>
  </div>
);

export default InfoBlock;
