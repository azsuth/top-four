import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import { withAction } from '@state';
import { joinGame } from '@actions';

import Button from 'components/shared/button';
import Coachmark from 'components/shared/coachmark';
import Loading from 'components/shared/loading';
import Logo from 'components/shared/logo';
import TextInput from 'components/shared/text_input';

function JoinContainer({ children, title }) {
  return (
    <div class="join__container container flex direction--column align-items--center flex-grow--1 margin--large padding-t--large padding-h--s padding-b--s">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        {title}
      </h1>
      {children}
    </div>
  );
}

const Join = ({ joinGame }) => {
  const [name, setName] = useState(null);
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const disabled = loading || !name || gameId.length !== 2;

  const handleJoinGame = () => {
    setLoading(true);

    joinGame({ name, gameId }).catch(error => {
      if (error && error.field) {
        if (error.field === 'game_id') {
          setGameId('');
        }

        if (error.field === 'name') {
          setName(null);
        }
      }

      setLoading(false);
      setError(error);
    });
  };

  const handleGameIdChanged = value => {
    setGameId(value.toUpperCase());
  };

  return (
    <div class="join flex direction--column height--100-pct bg-color--primary">
      <div class="join__logo margin-t--xlarge">
        <Logo size="small" />
      </div>
      <div class="join__container container flex direction--column align-items--center flex-grow--1 margin--large padding-t--large padding-h--s padding-b--s">
        <h1 class="modal-header color--primary-darkest">
          {error && 'Oops!'}
          {!error && loading && 'Joining...'}
          {!error && !loading && 'Join an Existing Game'}
        </h1>
        {error && error.subheader && (
          <h2 class="font-weight--bold font-size--base margin-t--xs">
            {error.subheader}
          </h2>
        )}
        {!loading && (
          <>
            <form
              autoComplete="off"
              class="flex direction--column flex-grow--1 margin-t--xlarge width--75-pct"
            >
              <div class="margin-b--xlarge">
                <TextInput
                  label="What's your name?"
                  name="name"
                  onChange={setName}
                  placeholder=""
                  value={name}
                />
              </div>
              <div class="margin-b--xlarge">
                <TextInput
                  label="What's the Game ID?"
                  name="game-id"
                  onChange={handleGameIdChanged}
                  placeholder="A6"
                  value={gameId}
                />
              </div>
              {error && error.msg && (
                <p class="text-align--center">{error.msg}</p>
              )}
              <div class="flex direction--column justify--end flex-grow--1 width--100-pct">
                <Button
                  disabled={disabled}
                  fullWidth
                  name="join"
                  onClick={handleJoinGame}
                  variant="primary"
                >
                  Join
                </Button>
              </div>
            </form>
            <div class="align-self--end">
              <Coachmark>
                Don't have a game code? Make sure one player in the group
                chooses START A NEW GAME on the previous screen. They'll get a
                code to share with everyone.
              </Coachmark>
            </div>
          </>
        )}
        {loading && (
          <div class="margin-t--xlarge">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

const withJoinGameAction = withAction(joinGame, 'joinGame');

export { Join };
export default withJoinGameAction(Join);
