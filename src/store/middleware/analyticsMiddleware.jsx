const sanitize = (data) => {
  if (typeof data === 'string') {
    return encodeURIComponent(data).slice(0, 100);
  }
  return String(data).slice(0, 100);
};

const analyticsMiddleware = store => next => action => {
  const result = next(action);

  if (action.type.startsWith('voters/') || action.type.startsWith('auth/')) {
    console.log('[Analytics] Action Tracked:', sanitize(action.type));
  }

  return result;
};

export default analyticsMiddleware;
