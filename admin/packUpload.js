const admin = require('firebase-admin');
const serviceAccount = require('./top-four-serviceAccountKey.json');

const fs = require('fs');
const readline = require('readline');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://top-four-cca25.firebaseio.com'
});

const db = admin.database();

const fileName = process.env.FILE_NAME;
const packName = process.env.PACK_NAME;

if (!fileName || !packName) {
  console.log('fileName and packName must be defined');
  process.exit(1);
}

const fileStream = fs.createReadStream(`./packs/${fileName}.txt`);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

const run = async () => {
  const topics = db.ref('/topicPacks').push({
    name: packName,
  }).child('/topics');

  rl.on('line', topic => {
    console.log(topic);

    topics.push({ topic });
  });
}

run();
