import * as actions from './userActions';
import * as articlesActions from '../yourtrybe/articles/articlesActions';
import { Mixpanel } from '../Mixpanel';

const defaultState = {
  userIsLogged: false,
  token: null,
  loginning: false,
  authError: false,
  userInfo: {},
  gettingUserData: false,
  forgotPasswordMode: false,
  forgotPasswordResponse: null,
  resetPasswordLoading: false,
  resetPasswordResponse: null,
  email: ''
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.postLogin.TRIGGER: {
      return { ...state, userIsLogged: false, loginning: true };
    }
    case actions.postLogin.SUCCESS: {
      Mixpanel.track('Successful login');
      const newState = { ...state, authError: false, token: payload.token };
      return newState;
    }
    case actions.postLogin.FAILURE: {
      return {
        ...state,
        userIsLogged: false,
        loginning: false,
        authError: payload
      };
    }

    case actions.getUserData.TRIGGER: {
      return {
        ...state,
        loginning: true,
        gettingUserData: true
      };
    }
    case actions.getUserData.SUCCESS: {
      localStorage.setItem('trybe_user', JSON.stringify(payload));
      Mixpanel.identify(payload.id);
      Mixpanel.people.set({
        $name: payload.name
      });
      return {
        ...state,
        userInfo: payload,
        loginning: false,
        userIsLogged: true,
        gettingUserData: false
      };
    }
    case actions.getUserData.FAILURE: {
      return {
        ...state,
        userIsLogged: false,
        loginning: false,
        gettingUserData: false
      };
    }

    case actions.forceUserLogin.TRIGGER: {
      return { ...state, userIsLogged: true, userInfo: payload };
    }

    case actions.setScroll.TRIGGER: {
      return { ...state, scrollPosition: true };
    }

    case actions.userSignOut.TRIGGER: {
      return { ...state, userIsLogged: false, userInfo: {}, token: null };
    }
    case articlesActions.addFavoriteCategory.SUCCESS: {
      const { category } = payload;
      const categories = state.userInfo.favoriteCategories
        ? [...state.userInfo.favoriteCategories]
        : [];
      categories.push(category);
      const user = { ...state.userInfo };
      user.details.favoriteCategories = categories;
      return {
        ...state,
        userInfo: user
      };
    }


    case actions.forgotPasswordClick.TRIGGER: {
      return {
        ...state,
        forgotPasswordMode: true,
        email: ''
      };
    }
    case actions.returnToLoginMode.TRIGGER: {
      return {
        ...state,
        forgotPasswordMode: false,
        forgotPasswordResponse: false,
        email: ''
      };
    }


    case actions.forgotPasswordRequest.TRIGGER: {
      return {
        ...state,
        resetPasswordLoading: true,
        email: payload.email
      };
    }
    case actions.forgotPasswordRequest.SUCCESS: {
      return {
        ...state,
        resetPasswordLoading: false,
        forgotPasswordResponse: payload,
        authError: false
      };
    }
    case actions.forgotPasswordRequest.FAILURE: {
      return {
        ...state,
        resetPasswordLoading: false,
        forgotPasswordResponse: payload,
        authError: payload
      };
    }


    case actions.sendNewPassword.TRIGGER: {
      return {
        ...state,
        resetPasswordLoading: true,
      };
    }
    case actions.sendNewPassword.SUCCESS: {
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordResponse: payload,
        forgotPasswordResponse: null,
        authError: false,
        email: ''
      };
    }
    case actions.sendNewPassword.FAILURE: {
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordResponse: payload,
        authError: payload,
        email: ''
      };
    }

    default:
      return state;
  }
}
