import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import loggerMiddleware from './middleware/loggerMiddleware';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [loggerMiddleware, sagaMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

  const store = createStore(
    rootReducer,
    preloadedState,
    composedEnhancers
  );

  sagaMiddleware.run(rootSaga);

  return store;
}