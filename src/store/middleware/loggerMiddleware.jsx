const sanitize = (data) => {
  if (typeof data === 'string') {
    return encodeURIComponent(data).slice(0, 100);
  }
  if (typeof data === 'object' && data !== null) {
    return JSON.stringify(data).slice(0, 200);
  }
  return String(data).slice(0, 100);
};

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Logger] Dispatching:', sanitize(action.type));
    const result = next(action);
    return result;
  }
  return next(action);
};

export default loggerMiddleware;
