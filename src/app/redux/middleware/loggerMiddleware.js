const logger = store => next => (action) => {
  const result = next(action);
  if (process.env.NODE_ENV === 'development' || window.location.hostname == "beta.loop.markets") {
    // console.group(action.type);
    // console.info('dispatching', action);
    // console.log('next state', store.getState());
    // console.groupEnd();
    return result;
  }
  return result;
};

export default logger;