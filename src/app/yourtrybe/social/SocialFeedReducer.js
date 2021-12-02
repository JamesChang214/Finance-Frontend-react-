import * as actions from './SocialFeedActions';

const defaultState = {
  loading: false,
  postSending: false,
  postSuccessfullSended: false,
  likeSending: false,
  commentSending: false,
  expandedPost: null,
  posts: [],
  latestId: null,
  comments: [],
  loadingComments: false,
  userHelper: []
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getSocialFeed.TRIGGER: {
      payload.latestId = state.latestId;
      return {
        ...state,
        loading: true
      };
    }
    case actions.getSocialFeed.SUCCESS: {
      let { posts } = state;
      const newPosts = payload.posts;

      if (!state.latestId || !payload.more) posts = newPosts;
      if (payload.more) posts = [...posts, ...newPosts];
      const latestId = newPosts.length !== 0
        ? newPosts[newPosts.length - 1].id
        : state.latestId;

      return {
        ...state,
        posts,
        loading: false,
        latestId
      };
    }
    case actions.getSocialFeed.FAILURE: {
      return {
        ...state,
        loading: false,
        latestId: null
      };
    }

    case actions.createSocialPost.TRIGGER: {
      return {
        ...state,
        postSending: true,
        postSuccessfullSended: false
      };
    }
    case actions.createSocialPost.SUCCESS: {
      return {
        ...state,
        postSending: false,
        postSuccessfullSended: true,
        latestId: null
      };
    }
    case actions.createSocialPost.FAILURE: {
      return {
        ...state,
        postSending: false,
        postSuccessfullSended: false
      };
    }

    case actions.cleanSocialFeed.TRIGGER:
    case actions.cleanSocialFeed.SUCCESS: {
      return defaultState;
    }

    case actions.like.TRIGGER: {
      return {
        ...state,
        likeSending: true
      };
    }
    case actions.like.SUCCESS: {
      return {
        ...state,
        likeSending: false
      };
    }
    case actions.like.FAILURE: {
      return {
        ...state,
        likeSending: false
      };
    }

    case actions.createSocialComment.TRIGGER: {
      return {
        ...state,
        commentSending: true
      };
    }
    case actions.createSocialComment.SUCCESS: {
      return {
        ...state,
        commentSending: false
      };
    }
    case actions.createSocialComment.FAILURE: {
      return {
        ...state,
        commentSending: false
      };
    }

    case actions.deleteReaction.TRIGGER: {
      return {
        ...state,
        likeSending: true
      };
    }
    case actions.deleteReaction.SUCCESS: {
      return {
        ...state,
        likeSending: false
      };
    }
    case actions.deleteReaction.FAILURE: {
      return {
        ...state,
        likeSending: false
      };
    }

    case actions.expandPost.TRIGGER: {
      return {
        ...state,
        loadingComments: true,
        expandedPost: payload.activityId
      };
    }
    case actions.expandPost.SUCCESS: {
      return {
        ...state,
        loadingComments: false,
        comments: payload
      };
    }
    case actions.expandPost.FAILURE: {
      return {
        ...state,
        loadingComments: false
      };
    }

    case actions.rollPostBack.TRIGGER: {
      return {
        ...state,
        comments: [],
        expandedPost: null
      };
    }

    case actions.getUserHelperData.TRIGGER: {
      return {...state, isLoadingDisplayData: true};
    }
    case actions.getUserHelperData.SUCCESS: {
      return {...state, isLoadingDisplayData: false, userHelper: payload};
    }

    default:
      return state;
  }
}
