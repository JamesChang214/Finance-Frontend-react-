import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import moment from 'moment';

class payoutCountdown extends Component {
  render() {
    const countdownRenderer = ({days, hours, minutes, seconds}) => (
      <div className="tr-airdrop-countdown">
        <p>{days}<span>Days</span></p>
        <p>{hours}<span>Hours</span></p>
        <p>{minutes}<span>Minutes</span></p>
        <p>{seconds}<span>Seconds</span></p>
      </div>
    );

    //const now = moment.utc();
    const friday = 6;
    const today = moment().isoWeekday();
    const payoutDate = moment.utc([moment().year(), today >= friday ? moment().add(1, 'week').isoWeekday(friday).toArray()[1] : moment().isoWeekday(friday).toArray()[1], today >= friday ? moment().add(1, 'week').isoWeekday(friday).toArray()[2] : moment().isoWeekday(friday).toArray()[2], 6]);

    return (
      <Countdown
        date={payoutDate.toDate()}
        renderer={countdownRenderer}
      />
    );
  }
}

export default payoutCountdown;