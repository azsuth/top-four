import { GameStateProvider } from '@state';
import { loadState } from 'utilities/local_storage';

import App from 'components/app';

import 'style';
import 'typeface-roboto';

const Root = () => {
  const state = loadState();

  return (
    <GameStateProvider initialState={state}>
      <App />
    </GameStateProvider>
  );
};

export default Root;
