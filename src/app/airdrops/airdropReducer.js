import {fromJS} from 'immutable';
import * as airdropActions from './airdropActions';

const defaultState = fromJS({
  leaderboard: {
  },
  claiming: false,
  claimError: null,
  claimStatus: null,
});

export default function reducer(state = defaultState, action) {
  const {payload} = action;

  switch (action.type) {
    case airdropActions.getAirdropLeaderBoardRoutine.TRIGGER: {
      return state;
    }

    case airdropActions.getAirdropLeaderBoardRoutine.SUCCESS: {
      const newState = state.set('leaderBoard', payload);
      return newState;
    }
    case airdropActions.getAirdropLeaderBoardRoutine.FAILURE:
      return state;

    case airdropActions.claimAirdropRoutine.TRIGGER: {
      return state.set('claimStatus', 'Waiting for Wallet, please be patient.');
    }

    case airdropActions.claimAirdropRoutine.SUCCESS: {
      return state.set('claimStatus', 'Claim has been successfully processed.');
    }

    case airdropActions.claimAirdropRoutine.FAILURE: {
      return state.set('claimStatus', 'Error Claiming: ' + payload);
    }

    default:
      return state;
  }
}