import { createRoutine} from 'redux-saga-routines';

// creating routine
export const getPostsRoutine = createRoutine('feed/GET_POSTS');
// export const mapPostsInfoRoutine = createRoutine("feed/MAP_POSTS_INFO");
export const clearPostsRoutine = createRoutine('feed/CLEAR_POSTS');
