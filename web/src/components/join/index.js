import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import cx from 'utilities/cx';
import { isDesktop } from 'utilities/device';

import { withAction } from '@state';
import { joinGame } from '@actions';

import Button from 'components/shared/button';
import Coachmark from 'components/shared/coachmark';
import Loading from 'components/shared/loading';
import Logo from 'components/shared/logo';
import TextInput from 'components/shared/text_input';

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

  const joinContainerClasses = cx(
    'join__container container flex direction--column align-items--center flex-grow--1 margin--large padding-t--large padding-h--s padding-b--s',
    'md:width--70-pct md:max-width--36 md:flex-grow--0',
    'lg:width--40-pct lg:max-width--36 lg:flex-grow--0'
  );

  return (
    <div class="join flex direction--column height--100-pct bg-color--primary md:align-items--center lg:align-items--center">
      <div class="join__logo margin-t--xlarge md:flex-grow--1 lg:flex-grow--1">
        <Logo size={isDesktop() ? 'med' : 'small'} />
      </div>
      <div class={joinContainerClasses}>
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
              class="flex direction--column flex-grow--1 margin-t--xlarge width--75-pct md:max-width--15 lg:max-width--15"
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
              <div class="flex direction--column justify--end flex-grow--1 margin-t--base width--100-pct">
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
              <Coachmark name="join">
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
      <div class="md:flex-grow--1 lg:flex-grow--1" />
    </div>
  );
};

const withJoinGameAction = withAction(joinGame, 'joinGame');

export { Join };
export default withJoinGameAction(Join);
