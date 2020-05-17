const fs = require('fs');

const gamesFile = `${process.env.GAMES_FILE}.json`;

const games = require(`./games/${gamesFile}`);

const data = Object.keys(games).reduce(
  (gamesData, gameUid) => {
    const game = games[gameUid];

    if (game.players) {
      gamesData.players.push(
        ...Object.keys(game.players)
          .filter((playerUid) => game.players[playerUid].active)
          .map((playerUid) => game.players[playerUid].name)
          .filter((name) => !!name)
      );
    }

    if (!game.topicPack && game.topics) {
      gamesData.topics.push(
        ...Object.keys(game.topics)
          .map((topicUid) => game.topics[topicUid].topic)
          .filter((topic) => !!topic)
      );
    }

    return gamesData;
  },
  { topics: [], players: [] }
);

const file = fs.createWriteStream(
  `./games/${process.env.GAMES_FILE}_data.txt`,
  { flags: 'a' }
);

file.write('Topics\n\n');

data.topics.forEach((topic) => file.write(`${topic}\n`));

file.write('\nPlayers\n\n');

data.players.forEach((player) => file.write(`${player}\n`));

file.end();
