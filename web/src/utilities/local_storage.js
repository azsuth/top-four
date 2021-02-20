const saveState = state => {
  if (typeof localStorage === 'undefined') return;

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('game_state', serializedState);
  } catch (err) {
    console.log('Error saving serialized state');
  }
};

const loadState = () => {
  if (typeof localStorage === 'undefined') return;

  try {
    const serializedState = localStorage.getItem('game_state');

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    console.log('Error loading serialized state', err);
    return undefined;
  }
};

const withSaveableState = reducer => {
  return (oldState, action) => {
    const newState = reducer(oldState, action);

    const { coachmark: _, ...state } = newState;
    saveState(state);

    return newState;
  };
};

export { saveState, loadState, withSaveableState };
