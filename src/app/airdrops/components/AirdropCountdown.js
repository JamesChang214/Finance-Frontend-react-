import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import moment from 'moment';

class AirdropCountdown extends Component {
  render() {
    const countdownRenderer = ({days, hours, minutes, seconds}) => (
      <div className="tr-airdrop-countdown">
        <div className="tr-airdrop-countdown__item">
          <div className="tr-airdrop-countdown__item-value">{days}</div>
          <div className="tr-airdrop-countdown__item-label">Days</div>
        </div>
        <div className="tr-airdrop-countdown__item">
          <div className="tr-airdrop-countdown__item-value">{hours}</div>
          <div className="tr-airdrop-countdown__item-label">Hours</div>
        </div>
        <div className="tr-airdrop-countdown__item">
          <div className="tr-airdrop-countdown__item-value">{minutes}</div>
          <div className="tr-airdrop-countdown__item-label">Minutes</div>
        </div>
        <div className="tr-airdrop-countdown__item">
          <div className="tr-airdrop-countdown__item-value">{seconds}</div>
          <div className="tr-airdrop-countdown__item-label">Seconds</div>
        </div>
      </div>
    );

    const now = moment.utc();
    const airdropDate = moment.utc([2019, now.date() < 11 ? now.month() : (now.month() + 1), 11]);

    return (
      <Countdown
        date={airdropDate.toDate()}
        renderer={countdownRenderer}
      />
    );
  }
}

export default AirdropCountdown;