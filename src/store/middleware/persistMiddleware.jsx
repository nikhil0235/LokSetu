import AsyncStorage from '@react-native-async-storage/async-storage';

const persistMiddleware = store => next => action => {
  const result = next(action);

  if (action.type.includes('voters/select') || action.type.includes('auth/login')) {
    const state = store.getState();
    AsyncStorage.setItem('selectedVoters', JSON.stringify(state.voters?.selectedVoters || []))
      .catch(err => console.warn('[Persist] Error saving to AsyncStorage:', err.message));
  }

  return result;
};

export default persistMiddleware;
