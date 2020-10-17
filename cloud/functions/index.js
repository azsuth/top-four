const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const moment = require('moment');
const superlatives = require('./superlatives');

admin.initializeApp();

exports.putOne = functions.https.onRequest((req, res) => {
  const game = {
    gameId: gameId(),
    startDate: Date.now()
  };

  return admin
    .database()
    .ref('/games')
    .push(game)
    .then(snapshot => {
      return res.status(200).send(snapshot);
    });
});

exports.superlatives = functions.https.onCall(async (data, context) => {
  const db = admin.database();

  const gameData = await db.ref(`/mockGames/test_id`).once('value');

  return superlatives.generate(gameData.val());
});

exports.startGame = functions.https.onCall(async (data, context) => {
  const db = admin.database();

  const { numberOfTeams, topicPackUid, numRounds } = data;
  const games = await db.ref('/games').once('value');

  let gameIds = [];
  games.forEach(game => {
    gameIds.push(game.val().gameId);
  });

  let newGameId = gameId();

  while (gameIds.includes(newGameId)) {
    newGameId = gameId();
  }

  const newGame = db.ref('/games').push({
    gameId: newGameId,
    startDate: moment().format(),
    teams: {},
    noTeams: numberOfTeams === 0,
    topicPack: !!topicPackUid,
    numRounds: numRounds || -1
  });

  let firstTeamUid;
  let i;
  for (i = 0; i < numberOfTeams; i++) {
    const team = {
      name: `Team ${i + 1}`
    };

    const teamUid = newGame.child('/teams').push(team).key;

    if (i === 0) {
      firstTeamUid = teamUid;
    }
  }

  if (firstTeamUid) {
    newGame.update({ rankingTeamUid: firstTeamUid });
  }

  if (topicPackUid) {
    const topics = await db
      .ref(`/topicPacks/${topicPackUid}/topics`)
      .once('value');

    topics.forEach(topic => {
      newGame.child('/topics').push({
        rank: -1,
        status: 'available',
        topic: topic.val().topic
      });
    });
  }

  return {
    gameUid: newGame.key,
    gameId: newGameId
  };
});

exports.pruneGames = functions.https.onCall(async () => {
  const db = admin.database();

  const games = await db.ref('/games').once('value');

  let oldGameIds = [];
  games.forEach(game => {
    const startDate = moment(game.val().startDate);

    if (startDate < moment().subtract(12, 'hours')) {
      oldGameIds.push(game.key);
    }
  });

  oldGameIds.forEach(gameId => {
    db.ref(`/games/${gameId}`).remove();
  });

  return null;
});

const gameId = () => {
  return randomLetter() + randomNumber();
};

const randomLetter = () => {
  return randomFromPossible('ACDEFGHJKLMNPQRTUVWXY');
};

const randomNumber = () => {
  return randomFromPossible('1234567890');
};

const randomFromPossible = possible => {
  return possible.charAt(Math.floor(Math.random() * possible.length));
};
