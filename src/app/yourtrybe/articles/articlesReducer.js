import * as actions from './articlesActions';

const defaultState = {
  categoriesAreLoading: false,
  promosAreLoading: false,
  currentCategory: {},
  categories: [],
  promos: []
};

export default function reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case actions.getAllCategories.TRIGGER: {
      return { ...state, categoriesAreLoading: true };
    }
    case actions.getAllCategories.SUCCESS: {
      localStorage.setItem('trybe_categories', JSON.stringify(payload));
      return { ...state, categories: payload, categoriesAreLoading: false };
    }
    case actions.getAllCategories.FAILURE: {
      return { ...state, categoriesAreLoading: false };
    }

    case actions.changeCategory.TRIGGER: {
      return { ...state, currentCategory: payload };
    }

    case actions.getAllPromos.TRIGGER: {
      return { ...state, promosAreLoading: true };
    }

    case actions.getAllPromos.SUCCESS: {
      localStorage.setItem('trybe_promos', JSON.stringify(payload?.acf.featured_articles));
      return { ...state, promos: payload?.acf.featured_articles, promosAreLoading: false };
    }

    case actions.getAllPromos.FAILURE: {
      return {...state, promosAreLoading: false };
    }

    default:
      return state;
  }
}
