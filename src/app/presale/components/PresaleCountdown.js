import React, { Component } from 'react';
import { Segment, Statistic } from 'semantic-ui-react';
import Countdown from 'react-countdown-now';

class PresaleCountdown extends Component {
  render() {
    const countdownRenderer = ({days, hours, minutes, seconds}) => (
      <Statistic.Group>
        <Statistic>
          <Statistic.Value>{days}</Statistic.Value>
          <Statistic.Label>Days</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{hours}</Statistic.Value>
          <Statistic.Label>Hours</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{minutes}</Statistic.Value>
          <Statistic.Label>Minutes</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{seconds}</Statistic.Value>
          <Statistic.Label>Seconds</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );

    return (
      <Segment>
        Presale Time Remaining
        <Countdown
          date={new Date(1548979200000)}
          renderer={countdownRenderer}
        />
      </Segment>
    );
  }
}

export default PresaleCountdown;