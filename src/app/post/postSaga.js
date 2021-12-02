import { put, takeLatest } from 'redux-saga/effects';
import * as actions from './postActions';
import * as api from './postApi';

export const postWatchers = [
  getPostInfoWatch,
  getPostCommentsWatch,
  sendPostCommentWatch,
  successfullCommentSendPostWatch,
  successfullReplySendPostWatch,
  sendReplyToPostCommentWatch,
  getPostRatingWatch,
  sendPostRatingWatch,
  getAuthorPostWatch,
  getPrerenderWatch,
  sendPrerenderWatch
];

export function* getPostInfoWatch() {
  yield takeLatest(actions.getPostInfo.TRIGGER, getPostInfo);
}
export function* getPrerenderWatch() {
  yield takeLatest(actions.getPrerenderRoutine.TRIGGER, getPrerender);
}
export function* sendPrerenderWatch() {
  yield takeLatest(actions.sendPrerenderRoutine.TRIGGER, sendPrerenderAction);
}
export function* getAuthorPostWatch() {
  yield takeLatest(actions.getAuthorPost.TRIGGER, getAuthorPost);
}
export function* getPostCommentsWatch() {
  yield takeLatest(actions.getPostComments.TRIGGER, getPostComments);
}
export function* sendPostCommentWatch() {
  yield takeLatest(actions.sendPostComment.TRIGGER, sendPostComment);
}
export function* successfullCommentSendPostWatch() {
  yield takeLatest(actions.sendPostComment.SUCCESS, getPostComments);
}
export function* getPostRatingWatch() {
  yield takeLatest(actions.getPostRating.TRIGGER, getPostRating);
}
export function* sendReplyToPostCommentWatch() {
  yield takeLatest(actions.replyToPostComment.TRIGGER, sendReplyToPostComment);
}
export function* successfullReplySendPostWatch() {
  yield takeLatest(actions.replyToPostComment.SUCCESS, getPostComments);
}
export function* sendPostRatingWatch() {
  yield takeLatest(actions.sendPostRating.TRIGGER, sendPostRating);
}

function* getPostInfo({ payload }) {
  const {id} = payload;
  let serverResponse;
  if (parseInt(id)) serverResponse = yield api.getPostInfo(payload);
  else serverResponse = yield api.getPostInfoBySlug(payload);

  if (serverResponse.data) {
    Array.isArray(serverResponse.data)
      ? yield put(actions.getPostInfo.success(serverResponse.data[0]))
      : yield put(actions.getPostInfo.success(serverResponse.data));
  } else {
    yield put(actions.getPostInfo.failure(serverResponse));
  }
}

function* getPrerender(data) {
  const url = `https://www.loop.markets/${data.payload}/`
  console.log(url)
  const draft = data.payload == '';
  if (!draft) {
    const serverResponse = yield api.getPrerender(url);
    if (serverResponse.data[0]) {
      yield put(actions.getPrerenderRoutine.success(serverResponse.data[0]));
    } else {
      yield put(actions.getPrerenderRoutine.failure(serverResponse));
    } 
  } else {
    yield put(actions.getPrerenderRoutine.failure(serverResponse));
  }
}

function* sendPrerenderAction(data) {
  const url = `https://www.loop.markets/${data.payload}/`
  console.log(url)
  const serverResponse = yield api.sendPrerender(url);
  if (serverResponse) {
    console.log(serverResponse)
    yield put(actions.sendPrerenderRoutine.success(serverResponse.data));
  } else {
    yield put(actions.sendPrerenderRoutine.failure(serverResponse));
  }
}

function* getAuthorPost({ payload }) {
  const serverResponse = yield api.getAuthorPost(payload);
  if (serverResponse.data) {
    yield put(actions.getAuthorPost.success(serverResponse.data));
  } else {
    yield put(actions.getAuthorPost.failure(serverResponse));
  }
}

function* getPostComments({ payload }) {
  const serverResponse = yield api.getPostComments(payload);
  if (serverResponse.data) {
    yield put(actions.getPostComments.success(serverResponse.data));
  } else {
    yield put(actions.getPostComments.failure(serverResponse));
  }
}

function* sendPostComment({ payload }) {
  console.log('comment info', payload);
  const serverResponse = yield api.sendComment(payload);
  if (serverResponse.data.status == "approved") {
    yield put(actions.sendPostComment.success({post: serverResponse.data.post, page: 1}));
  } else {
    yield put(actions.sendPostComment.failure(serverResponse));
  }
}

function* getPostRating({ payload }) {
  const serverResponse = yield api.getPostRating(payload);
  if (serverResponse.status === 200) {
    yield put(actions.getPostRating.success(serverResponse.data));
  } else {
    yield put(actions.getPostRating.failure(serverResponse));
  }
}

function* sendPostRating({ payload }) {
  const serverResponse = yield api.sendPostRating(payload);
  if (serverResponse.status === 200) {
    yield put(actions.sendPostRating.success(serverResponse.data));
  } else {
    yield put(actions.sendPostRating.failure(serverResponse));
  }
}

function* sendReplyToPostComment({ payload }) {
  console.log(payload)
  const serverResponse = yield api.sendReplyToPostComment(payload);
  if (serverResponse.data) {
    yield put(actions.replyToPostComment.success({post: serverResponse.data.post, page: 1}));
  } else {
    yield put(actions.replyToPostComment.failure(serverResponse));
  }
}
