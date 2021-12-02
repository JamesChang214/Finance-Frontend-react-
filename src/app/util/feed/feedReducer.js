import * as feedActions from './feedActions';

const defaultState = {
  loading: false,
  posts: [],
  isEnd: false,
  mappedPosts: [],
  noAuthor: false
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case feedActions.getPostsRoutine.TRIGGER: {
      // const newState = state.set('loading', true);
      return { ...state, loading: true };
    }

    case feedActions.getPostsRoutine.SUCCESS: {
      // const postsState = state.update('posts', posts => posts.push(payload));
      // const newState = postsState.set('loading', false);
      if (payload.length === 0) {
        return { ...state, posts: [...state.posts, ...payload], isEnd: true, loading: false, noAuthor: false};
      }
      return { ...state, posts: [...state.posts, ...payload], loading: false, noAuthor: false };
    }
    case feedActions.getPostsRoutine.FAILURE: {
      // const newState = state.set('loading', false);
      const newState = { ...state, loading: false };
      console.log(payload);
      if (payload.data.code === 'rest_post_invalid_page_number') {
        return { ...newState, isEnd: true, noAuthor: false };
      }
      if (payload.data.code === 'rest_invalid_param') {
        return { ...newState, isEnd: true, noAuthor: true };
      }
      return newState;
    }
    case feedActions.clearPostsRoutine.TRIGGER: {
      // return state.set('posts', defaultState.get('posts')).set('isEnd', false);
      return { ...state, posts: [], isEnd: false };
    }
    default:
      return state;
  }
}
