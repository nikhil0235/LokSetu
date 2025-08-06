const sanitize = (data) => {
  if (typeof data === 'string') {
    return encodeURIComponent(data).slice(0, 100);
  }
  if (typeof data === 'object' && data !== null) {
    return JSON.stringify(data).slice(0, 200);
  }
  return String(data).slice(0, 100);
};

const errorMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    console.error('[Error] Action failed:', sanitize(action.type), sanitize(error.message));
    throw error;
  }
};

export default errorMiddleware;
