const sanitize = (data) => {
  if (typeof data === 'string') {
    return encodeURIComponent(data).slice(0, 100);
  }
  return String(data).slice(0, 100);
};

const persistMiddleware = store => next => action => {
  const result = next(action);

  if (action.type.includes('voters/select') || action.type.includes('auth/login')) {
    const state = store.getState();
    try {
      localStorage.setItem('selectedVoters', JSON.stringify(state.voters?.selectedVoters || []));
    } catch (err) {
      console.warn('[Persist] Error saving to localStorage:', sanitize(err.message));
    }
  }

  return result;
};

export default persistMiddleware;
