const sanitize = (data) => {
  if (typeof data === 'string') {
    return encodeURIComponent(data).slice(0, 100);
  }
  return String(data).slice(0, 100);
};

const apiMiddleware = store => next => action => {
  const actionType = action.type;
  
  switch (true) {
    case actionType.endsWith('pending'):
      console.log('[API] Request started:', sanitize(actionType));
      break;
    case actionType.endsWith('fulfilled'):
      console.log('[API] Request successful:', sanitize(actionType));
      break;
    case actionType.endsWith('rejected'):
      console.warn('[API] Request failed:', sanitize(actionType));
      break;
  }

  return next(action);
};

export default apiMiddleware;
