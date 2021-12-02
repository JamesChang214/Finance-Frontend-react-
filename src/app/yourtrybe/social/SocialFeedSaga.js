import { put, takeLatest } from 'redux-saga/effects';
import * as actions from './SocialFeedActions';
import * as api from './SocialFeedApi';

export const socialFeedWatchers = [
  getSocialFeedWatch,
  createSocialPostWatch,
  likeWatch,
  commentWatch,
  deleteReactionWatch,
  expandPostWatch,
  getUserHelperDataWatch
];

export function* getSocialFeedWatch() {
  yield takeLatest(actions.getSocialFeed.TRIGGER, getSocialFeed);
}
export function* createSocialPostWatch() {
  yield takeLatest(actions.createSocialPost.TRIGGER, createSocialPost);
}
export function* likeWatch() {
  yield takeLatest(actions.like.TRIGGER, like);
}
export function* commentWatch() {
  yield takeLatest(actions.createSocialComment.TRIGGER, comment);
}
export function* deleteReactionWatch() {
  yield takeLatest(actions.deleteReaction.TRIGGER, deleteReaction);
}
export function* expandPostWatch() {
  yield takeLatest(actions.expandPost.TRIGGER, expandPost);
}
export function* getUserHelperDataWatch() {
  yield takeLatest(actions.getUserHelperData.TRIGGER, getUserHelperData);
}

function* getSocialFeed({ payload }) {
  const serverResponse = yield api.getSocialFeed(payload);
  if (serverResponse.results) {
    yield put(
      actions.getSocialFeed.success({
        posts: serverResponse.results,
        more: payload.more
      })
    );
  } else {
    console.log('cannot load posts ', serverResponse);
  }
}

function* createSocialPost({ payload }) {
  const serverResponse = yield api.createSocialPost(payload);
  if (serverResponse.status == 200) {
    yield put(actions.createSocialPost.success(serverResponse.data));
  } else {
    yield put(actions.createSocialPost.failure(serverResponse));
  }
}

function* like({ payload }) {
  const serverResponse = yield api.like(payload);
  if (serverResponse.status == 200) {
    yield put(actions.like.success(serverResponse.data));
  } else {
    yield put(actions.like.failure(serverResponse));
  }
}

function* comment({ payload }) {
  const serverResponse = yield api.comment(payload);
  if (serverResponse.status == 200) {
    yield put(actions.createSocialComment.success(serverResponse.data));
  } else {
    yield put(actions.createSocialComment.failure(serverResponse));
  }
}

function* deleteReaction({ payload }) {
  const serverResponse = yield api.deleteReaction(payload);
  if (serverResponse.status == 200) {
    yield put(actions.deleteReaction.success(serverResponse.data));
  } else {
    yield put(actions.deleteReaction.failure(serverResponse));
  }
}

function* expandPost({ payload }) {
  const serverResponse = yield api.getComments(payload);
  if (serverResponse.results) {
    yield put(actions.expandPost.success(serverResponse.results));
  } else {
    yield put(actions.expandPost.failure(serverResponse));
  }
}

function* getUserHelperData({ payload }) {
  const serverResponse = yield api.getUserHelper(payload);
  if (serverResponse.data) {
    yield put(actions.getUserHelperData.success(serverResponse.data));
  } else {
    yield put(actions.getUserHelperData.failure(serverResponse));
  }
}
