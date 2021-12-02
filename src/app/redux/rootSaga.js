import formActionSaga from 'redux-form-saga';
import { fork, all } from 'redux-saga/effects';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';
import { feedWatchers } from '../util/feed/feedSaga.js';
import { userWatchers } from '../user/userSaga.js';
import { articlesWatchers } from '../yourtrybe/articles/articlesSaga.js';
import { postWatchers } from '../post/postSaga';
import { editorWatchers } from '../util/dashboard/EditorSaga';
import { uploadImageWatchers } from '../util/articleEditor/imageAdd/ImageAddSaga';
import { socialFeedWatchers } from '../yourtrybe/social/SocialFeedSaga';
import { followingWatchers } from '../yourtrybe/following/FollowingSaga';
import { userReviewWatchers } from '../user-review/userReviewSaga';
import { notificationsWatchers } from '../sidebar/notifications/NotificationsSaga';
import { friendsWatchers } from '../yourtrybe/friends/FriendsSaga';
import { chatWatchers } from '../chat/ChatSaga';
import { signUpWatchers } from '../sign-up/signUpSaga';
import { presaleWatches } from '../presale/presaleSaga';
import { scatterWatches } from '../scatter/scatterSaga.js';
import { airdropWatches } from '../airdrops/airdropSaga.js';
import { trybeAccountWatches } from '../trybeaccount/trybeAccountSaga';
import {settingsWatchers} from '../yourtrybe/settings/settingsSaga';
import { portfolioWatchers } from '../portfolio/portfolioSaga';
import { powerUpWatches } from '../powerup/powerUpSaga';
import { payoutStatsWatches } from '../pages/payout/weeklyPayoutSaga';
import { pageWatches } from '../pages/pageSaga';
import { terraWatches } from '../terra/wallet/terraSaga';
import { getPayoutDataWatch } from '../yourtrybe/engagement/engagementSaga';

export default function* root() {
  const allWatchers = [
    ...settingsWatchers,
    ...feedWatchers,
    ...userWatchers,
    ...postWatchers,
    ...editorWatchers,
    ...uploadImageWatchers,
    ...articlesWatchers,
    ...socialFeedWatchers,
    ...userReviewWatchers,
    ...followingWatchers,
    ...friendsWatchers,
    ...notificationsWatchers,
    ...chatWatchers,
    ...signUpWatchers,
    ...trybeAccountWatches,
    ...presaleWatches,
    ...scatterWatches,
    ...airdropWatches,
    ...portfolioWatchers,
    ...powerUpWatches,
    ...payoutStatsWatches,
    ...pageWatches,
    ...terraWatches,
    ...payoutStatsWatches,
    routinePromiseWatcherSaga,
    formActionSaga
  ];

  yield all(allWatchers.map(saga => fork(saga)));
}
