const Dotenv = require('dotenv-webpack');
const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

export default function (config, env, helpers, options) {
  // environment variables
  config.plugins.push(new Dotenv({ systemvars: true }));
  config.node.process = true;

  // absolute imports
  getDirectories('src/').map(dir => {
    config.resolve.alias[dir.replace('src/', '')] = path.resolve(
      __dirname,
      dir
    );

    config.resolve.alias[`@${dir.replace('src/', '')}`] = path.resolve(
      __dirname,
      dir
    );
  });

  // disable hot reloading
  if (config.devServer) {
    config.devServer.hot = false;
  }
}
