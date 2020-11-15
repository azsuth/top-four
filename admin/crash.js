const fs = require('fs');
const sourceMap = require('source-map');

const BUILD_PATH = '../web/build/';
const HOST = 'https://topfour.io/';
const error = process.argv.slice(2)[0];

const firstPipe = error.indexOf('|');
const secondPipe = error.indexOf('|', firstPipe + 1);

const route = error.substring(0, firstPipe);
const errorMsg = error.substring(firstPipe + 2, secondPipe);
const pack = error.substring(
  error.indexOf(HOST) + HOST.length,
  error.indexOf('.js:') + 3
);
const column = error
  .substring(error.indexOf(pack), error.indexOf(HOST, error.indexOf(pack)))
  .match(/1:(\d+)/)[1];

new sourceMap.SourceMapConsumer(
  fs.readFileSync(`${BUILD_PATH}${pack}.map`, 'utf-8')
).then((consumer) => {
  console.log(`Route: ${route}`);
  console.log(`Error: ${errorMsg}`);
  console.log('Location:');
  console.log(consumer.originalPositionFor({ line: 1, column }));
});
