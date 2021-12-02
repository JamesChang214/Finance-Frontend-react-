import * as actions from './postActions';

const defaultState = {
  postLoading: false,
  moreArticlesLoading: false,
  postComments: [],
  commentPages: 0,
  commentsLoading: false,
  ratingLoading: true,
  ratingSending: false,
  postRating: {},
  postInfo: {},
  moreArticles: {},
  preRendered: false,
  preRenderChecked: false
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    
    case actions.getPrerenderRoutine.TRIGGER: {
      return { ...state, preRendered: false, preRenderChecked: false };
    }
    case actions.getPrerenderRoutine.SUCCESS: {
      return { ...state, preRendered: true, preRenderChecked: true };
    }
    case actions.getPrerenderRoutine.FAILURE: {
      return { ...state, preRendered: false, preRenderChecked: true };
    }

    case actions.getPostInfo.TRIGGER: {
      return { ...state, postLoading: true };
    }
    case actions.getPostInfo.SUCCESS: {
      return { ...state, postInfo: payload, postLoading: false };
    }
    case actions.getPostInfo.FAILURE: {
      return { ...state, postInfo: false, postLoading: false };
    }

    case actions.getAuthorPost.TRIGGER: {
      return { ...state, moreArticlesLoading: true };
    }
    case actions.getAuthorPost.SUCCESS: {
      return { ...state, moreArticles: payload, moreArticlesLoading: false };
    }

    case actions.clearPostInfo.TRIGGER: {
      return { ...state, postInfo: {}, postComments: [], moreArticlesLoading: true };
    }

    case actions.getPostComments.TRIGGER: {
      return { ...state, commentsLoading: true };
    }
    case actions.getPostComments.SUCCESS: {
      return { ...state, commentPages: payload.totalPages, postComments: payload.comments, commentsLoading: false };
    }

    case actions.sendPostComment.TRIGGER: {
      return { ...state, commentsLoading: true, commentErrorMessage: false, commentSuccessMessage: false };
    }
    case actions.sendPostComment.SUCCESS: {
      return { ...state, commentsLoading: false, commentErrorMessage: false, commentSuccessMessage: true };
    }
    case actions.sendPostComment.FAILURE: {
      console.log(payload.data.message)
      return { ...state, commentsLoading: false, commentErrorCode: payload.data.code, commentErrorMessage: payload.data.message };
    }


    case actions.sendPostRating.TRIGGER: {
      return {
        ...state,
        ratingLoading: true,
        ratingSending: true
      };
    }
    case actions.sendPostRating.SUCCESS: {
      const { postRating } = state;
      const { rated } = payload[0].status;
      const newPostRating = {
        ...postRating,
        user_rated: rated
      };
      return {
        ...state,
        postRating: newPostRating,
        ratingSending: false
      };
    }
    case actions.sendPostRating.FAILURE: {
      return {
        ...state,
        ratingLoading: false,
        ratingSending: false
      };
    }


    case actions.getPostRating.TRIGGER: {
      return { ...state, ratingLoading: true };
    }
    case actions.getPostRating.SUCCESS: {
      return { ...state, postRating: payload[0], ratingLoading: false };
    }


    case actions.replyToPostComment.TRIGGER: {
      return { ...state, commentsLoading: true };
    }
    case actions.replyToPostComment.SUCCESS: {
      return { ...state, commentsLoading: false };
    }
    case actions.replyToPostComment.FAILURE: {
      return { ...state, commentsLoading: false };
    }
    default:
      return state;
  }
}
