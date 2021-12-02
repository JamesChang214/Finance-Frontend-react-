import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import feedReducer from '../util/feed/feedReducer';
import userReducer from '../user/userReducer';
import postReducer from '../post/postReducer';
import editorReducer from '../util/dashboard/EditorReducer';
import imageReducer from '../util/articleEditor/imageAdd/ImageAddReducer';
import sidebarReducer from '../sidebar/SidebarReducer';
import articlesReducer from '../yourtrybe/articles/articlesReducer';
import SocialFeedReducer from '../yourtrybe/social/SocialFeedReducer';
import FollowingReducer from '../yourtrybe/following/FollowingReducer';
import userReviewReducer from '../user-review/userReviewReducer';
import NotificationsReducer from '../sidebar/notifications/NotificationsReducer';
import FriendsReducer from '../yourtrybe/friends/FriendsReducer';
import ChatReducer from '../chat/ChatReducer';
import SignUpReducer from '../sign-up/signUpReducer';
import presaleReducer from '../presale/presaleReducer';
import scatterReducer from '../scatter/scatterReducer';
import airdropReducer from '../airdrops/airdropReducer';
import trybeAccountReducer from '../trybeaccount/trybeAccountReducer';
import settingsReducer from '../yourtrybe/settings/settingsReducer';
import portfolioReducer from '../portfolio/portfolioReducer';
import powerUpReducer from '../powerup/powerUpReducer';
import payoutReducer from '../pages/payout/weeklyPayoutReducer';
import pageReducer from '../pages/pageReducer';

export default combineReducers({
  form: formReducer,
  feed: feedReducer,
  user: userReducer,
  post: postReducer,
  editor: editorReducer,
  image: imageReducer,
  articles: articlesReducer,
  sidebar: sidebarReducer,
  socialFeed: SocialFeedReducer,
  userReview: userReviewReducer,
  following: FollowingReducer,
  friends: FriendsReducer,
  notifications: NotificationsReducer,
  chat: ChatReducer,
  signUp: SignUpReducer,
  trybeAccount: trybeAccountReducer,
  presale: presaleReducer,
  scatter: scatterReducer,
  airdrop: airdropReducer,
  settings: settingsReducer,
  portfolio: portfolioReducer,
  powerUp: powerUpReducer,
  payout: payoutReducer,
  pages: pageReducer
});
