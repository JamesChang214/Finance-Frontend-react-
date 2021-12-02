import * as editorActions from './EditorActions';

const defaultState = {
  articleIsCreated: false,
  sendingArticle: false,
  featuredImage: null,
  mentionSuggestions: [],
  articleDeleted: false
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;
  switch (action.type) {
    case editorActions.createArticleRoutine.TRIGGER: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', true);
      return { ...state, articleIsCreated: false, sendingArticle: true };
    }
    case editorActions.createArticleRoutine.SUCCESS: {
      // const newState = state
      //   .set('articleIsCreated', true)
      //   .set('sendingArticle', false);
      return { ...state, articleIsCreated: true, sendingArticle: false };
    }
    case editorActions.createArticleRoutine.FAILURE: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', false);
      return { ...state, articleIsCreated: false, sendingArticle: false };
    }

    case editorActions.updateArticleRoutine.TRIGGER: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', true);
      return { ...state, articleIsCreated: false, sendingArticle: true };
    }
    case editorActions.updateArticleRoutine.SUCCESS: {
      // const newState = state
      //   .set('articleIsCreated', true)
      //   .set('sendingArticle', false);
      return { ...state, articleIsCreated: true, sendingArticle: false };
    }
    case editorActions.updateArticleRoutine.FAILURE: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', false);
      return { ...state, articleIsCreated: false, sendingArticle: false };
    }

    case editorActions.deleteArticleRoutine.TRIGGER: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', true);
      return { ...state, articleDeleted: false };
    }
    case editorActions.deleteArticleRoutine.SUCCESS: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', true);
      return { ...state, articleDeleted: true };
    }
    case editorActions.deleteArticleRoutine.FAILURE: {
      // const newState = state
      //   .set('articleIsCreated', false)
      //   .set('sendingArticle', true);
      return { ...state, articleDeleted: false };
    }

    case editorActions.uploadFeaturedImageRoutine.TRIGGER: {
      // const newState = state.set('feauturedImageLoading', true);
      return { ...state, feauturedImageLoading: true };
    }
    case editorActions.uploadFeaturedImageRoutine.SUCCESS: {
      // const newState = state
      //   .set('feauturedImageLoading', false)
      //   .set('featuredImage', payload);
      return { ...state, feauturedImageLoading: false, featuredImage: payload };
    }
    case editorActions.uploadFeaturedImageRoutine.FAILURE: {
      // const newState = state.set('feauturedImageLoading', false);
      return { ...state, feauturedImageLoading: true };
    }
    case editorActions.articleIsCreatedRoutine.TRIGGER: {
      // const newState = state.set('articleIsCreated', false);
      return { ...state, articleIsCreated: false, articleDeleted: false };
    }

    case editorActions.getMentionSuggestions.SUCCESS: {
      // const newState = state.set('mentionSuggestions', payload);
      return { ...state, mentionSuggestions: payload };
    }

    default:
      return state;
  }
}
