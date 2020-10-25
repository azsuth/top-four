import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';

firebase.initializeApp({
  apiKey: process.env.TOP_FOUR_FIREBASE_API_KEY,
  authDomain: 'top-four-cca25.firebaseapp.com',
  databaseURL: 'https://top-four-cca25.firebaseio.com',
  projectId: 'top-four-cca25',
  storageBucket: 'top-four-cca25.appspot.com',
  messagingSenderId: '120019969623',
  appId: '1:120019969623:web:6d6ba9a3d0834b0259e512'
});

const createGameService = async ({
  numberOfTeams,
  topicPackUid,
  numRounds,
  state
}) => {
  const createGame = firebase.functions().httpsCallable('startGame');

  const response = await createGame({
    numberOfTeams,
    topicPackUid,
    numRounds,
    state
  });

  // prune games for now
  pruneGamesService();

  return response.data;
};

const addPlayerService = async ({ gameUid, name }) => {
  const response = await firebase
    .database()
    .ref(`/games/${gameUid}/players`)
    .push({ name, score: 0, lockedIn: false, active: true });

  return response.key;
};

const getTopicPacksService = async () => {
  const topicPacks = await firebase.database().ref('/topicPacks').once('value');

  return topicPacks.val();
};

const pruneGamesService = () => {
  const pruneGames = firebase.functions().httpsCallable('pruneGames');
  pruneGames();
};

const getGameUidService = async gameId => {
  const response = await firebase.database().ref('/games').once('value');

  const games = response.val();

  return Object.keys(games)
    .map(gameUid => ({
      gameUid,
      ...games[gameUid]
    }))
    .find(game => game.gameId === gameId);
};

let subscribedGameUid = null;
const subscribeToGameUpdatesService = (gameUid, on) => {
  unsubscribeFromGameUpdatesService();

  subscribedGameUid = gameUid;

  firebase
    .database()
    .ref(`/games/${gameUid}`)
    .on('value', snapshot => on(snapshot.val()));
};

const unsubscribeFromGameUpdatesService = () => {
  if (subscribedGameUid) {
    firebase.database().ref(`/games/${subscribedGameUid}`).off('value');

    subscribedGameUid = null;
  }
};

const joinTeamService = ({ teamUid, playerUid, gameUid }) => {
  firebase
    .database()
    .ref(`/games/${gameUid}/players/${playerUid}`)
    .update({ teamUid });
};

const addTopicService = ({ topic, playerUid, gameUid }) => {
  firebase.database().ref(`/games/${gameUid}/topics`).push({
    topic,
    playerUid,
    status: 'available',
    rank: -1
  });
};

const deleteTopicService = (topicUid, gameUid) => {
  firebase.database().ref(`/games/${gameUid}/topics/${topicUid}`).remove();
};

const updateGameService = (game, gameUid) => {
  firebase.database().ref(`/games/${gameUid}`).update(game);
};

const lockInService = async ({ gameUid, playerUid, guesses }) => {
  await firebase
    .database()
    .ref(`/games/${gameUid}/players/${playerUid}`)
    .update({ lockedIn: true });

  firebase
    .database()
    .ref(`/games/${gameUid}/guesses/${playerUid}`)
    .update(guesses);
};

const setPlayerActiveService = (playerUid, active, gameUid) => {
  firebase
    .database()
    .ref(`/games/${gameUid}/players/${playerUid}`)
    .update({ active });
};

const logErrorMessage = (message, env) => {
  const date = new Date();

  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const mm = `${m > 9 ? '' : '0'}${m}`;
  const dd = `${d > 9 ? '' : '0'}${d}`;

  const errorDate = `${yyyy}-${mm}-${dd}`;

  firebase.database().ref(`/error/${env}/${errorDate}`).push(message);
};

export {
  createGameService,
  getTopicPacksService,
  addPlayerService,
  getGameUidService,
  subscribeToGameUpdatesService,
  unsubscribeFromGameUpdatesService,
  joinTeamService,
  addTopicService,
  deleteTopicService,
  updateGameService,
  lockInService,
  setPlayerActiveService,
  logErrorMessage
};
