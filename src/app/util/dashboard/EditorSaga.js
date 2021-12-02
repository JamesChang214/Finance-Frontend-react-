import { put, takeLatest } from 'redux-saga/effects';
import * as editorActions from './EditorActions';
import * as api from '../../post/postApi';
import {
  createArticle,
  uploadFeaturedImage,
  updateArticleCall,
  deleteArticle,
  getMentionSuggestions
} from './EditorApi';

export const editorWatchers = [
  postArticleWatch,
  uploadFeaturedImageWatch,
  updateArticleWatch,
  getMentionSuggestionsWatcher,
  deleteArticleWatch
];

export function* postArticleWatch() {
  yield takeLatest(editorActions.createArticleRoutine.TRIGGER, newArticle);
}

export function* uploadFeaturedImageWatch() {
  yield takeLatest(
    editorActions.uploadFeaturedImageRoutine.TRIGGER,
    uploadImage
  );
}

export function* updateArticleWatch() {
  yield takeLatest(editorActions.updateArticleRoutine.TRIGGER, updateArticle);
}

export function* deleteArticleWatch() {
  yield takeLatest(editorActions.deleteArticleRoutine.TRIGGER, deleterticle);
}

function* uploadImage(data) {
  console.log('fired');
  const serverResponse = yield uploadFeaturedImage(data);
  if (serverResponse.data) {
    yield put(
      editorActions.uploadFeaturedImageRoutine.success(serverResponse.data)
    );
  } else {
    yield put(editorActions.uploadFeaturedImageRoutine.failure(serverResponse));
  }
}
function* newArticle(data) {
  const serverResponse = yield createArticle(data);
  if (serverResponse.status === 201) {
    yield put(editorActions.createArticleRoutine.success(serverResponse.data));
    serverResponse.data.status == "publish" && serverResponse.data.slug ? yield api.sendPrerender(`https://www.loop.markets/${serverResponse.data.slug}`) : null;
  } else {
    yield put(editorActions.createArticleRoutine.failure(serverResponse));
  }
}

function* updateArticle(data) {
  const serverResponse = yield updateArticleCall(data);
  if (serverResponse.status === 200) {
    yield put(editorActions.updateArticleRoutine.success(serverResponse.data));
  } else {
    yield put(editorActions.updateArticleRoutine.failure(serverResponse));
  }
}

function* deleterticle(data) {
  const serverResponse = yield deleteArticle(data);
  if (serverResponse.status === 200) {
    yield put(editorActions.deleteArticleRoutine.success(serverResponse.data));
  } else {
    yield put(editorActions.deleteArticleRoutine.failure(serverResponse));
  }
}

function* getMentionSuggestionsWatcher() {
  yield takeLatest(
    editorActions.getMentionSuggestions.TRIGGER,
    getMentionSuggestionsWorker
  );
}
function* getMentionSuggestionsWorker({ payload }) {
  const serverResponse = yield getMentionSuggestions(payload.userId);
  if (serverResponse.status === 200) {
    yield put(editorActions.getMentionSuggestions.success(serverResponse.data));
  } else {
    yield put(editorActions.getMentionSuggestions.failure(serverResponse));
  }
}
