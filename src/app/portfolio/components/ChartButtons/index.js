import React, {Component} from 'react';
import { noop } from 'lodash';

export default class ChartButtons extends Component {
  onRemove = label => (e) => {
    e.stopPropagation();
    const { removeElement } = this.props;
    removeElement(label);
  }

  render() {
    const {
      labels,
      walletData,
      activeElement,
      setActiveElement,
      elementForAdding,
      addElementBack
    } = this.props;
    return (
      <div className="token-list-container">
        <ul className="token-list">
          {labels.map((item, index) => {
            return (
              <li
                className={`li ${item === activeElement.label && 'selected'}`}
                onClick={() => setActiveElement(item, walletData[index])}
                onKeyDown={noop}
              >
                <span className="li-item-text">{item}</span>
                <span
                  className="li-remove-button"
                  onClick={this.onRemove(item)}
                  onKeyDown={noop}
                >remove
                </span>
                <span className="li-item-amount">{walletData[index]} %</span>
              </li>
            );
          })}
          {elementForAdding && (
            <li
              className="li add-element"
              onClick={() => addElementBack(elementForAdding)}
              onKeyDown={noop}
            >
              <span className="restore" />
              <span className="li-item-text">{elementForAdding}</span>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
