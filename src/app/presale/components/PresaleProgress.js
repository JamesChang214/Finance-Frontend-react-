import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Statistic, Progress, Divider } from 'semantic-ui-react';
import * as presaleActions from '../presaleActions';

class PresaleProgress extends Component {
  componentDidMount() {
    const { getPresaleProgress } = this.props;
    getPresaleProgress();
  }

  render() {
    const {totalSold} = this.props;
    return (
      <Segment>
        <Statistic.Group size="small" widths="four">
          <Statistic size="small">
            <Statistic.Label>Max Supply</Statistic.Label>
            <Statistic.Value>100.00M</Statistic.Value>
          </Statistic>
          <Statistic size="small">
            <Statistic.Label>Sold</Statistic.Label>
            <Statistic.Value>
              {(totalSold/1000000).toFixed(2)}
              M
            </Statistic.Value>
          </Statistic>
          <Statistic size="small">
            <Statistic.Label>
              Remaining
            </Statistic.Label>
            <Statistic.Value>
              {((100000000-totalSold)/1000000).toFixed(2)}
              M
            </Statistic.Value>
          </Statistic>
          <Statistic size="small">
            <Statistic.Label>Completed</Statistic.Label>
            <Statistic.Value>
              {100000000-totalSold<=0?'Yes':'No'}
            </Statistic.Value>
          </Statistic>
        </Statistic.Group>
        <Divider />
        <Progress percent={(100-((100000000-totalSold)/1000000)).toFixed(2)} inverted color="purple" progress />
      </Segment>
    );
  }
}

export default withRouter(connect(
  (state) => {
    const presaleProgressData = state.presale.get('presaleProgress');
    const totalSold = presaleProgressData.totalSold ? parseInt(presaleProgressData.totalSold) : 0;
    return {
      presaleProgressData, totalSold,
    };
  },
  dispatch => ({
    getPresaleProgress: () => {
      dispatch(presaleActions.getPresaleProgressRoutine());
    },
  })
)(PresaleProgress));