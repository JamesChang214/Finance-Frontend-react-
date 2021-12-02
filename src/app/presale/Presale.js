import React, { Component } from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import LeaderBoard from './components/LeaderBoard';
import PresaleCountdown from './components/PresaleCountdown';
import PresaleProgress from './components/PresaleProgress';
import EosBalances from './components/EosBalances';
import MyPresale from './components/MyPresale';
import BuyTrybe from './components/BuyTrybe';

class Presale extends Component {
  render() {
    return (
      <div>
        <Grid stackable>
          <Grid.Column>
            <Segment className="top-presale-message">
              Pre-sale Bonuses: Each month the top 10 contributors for the month in EOS will share in a 1 million TRYBE bonus! And at the end of the pre-sale the top 20 contributors will share in a 5 million TRYBE bonus! These will be distributed based on the proportionate contributions of each person. Scroll down to see the current winners!
            </Segment>
            <Grid stackable>
              <Grid.Column width="5">
                <BuyTrybe />
              </Grid.Column>
              <Grid.Column width="11">
                <PresaleCountdown />
                <PresaleProgress />
                <Grid stackable>
                  <Grid.Column width="8">
                    <Segment>
                      <MyPresale />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column width="8">
                    <EosBalances />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid>
            <LeaderBoard />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Presale;