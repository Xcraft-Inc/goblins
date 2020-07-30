const genAppTemplate = (appId) => `
'use strict';
////////////////////////////////////////////////////////////////
// ${appId}
////////////////////////////////////////////////////////////////

const Goblin = require('xcraft-core-goblin');
const pdf = require('pdf-parse');
const {appId} = require('xcraft-core-host');

const quests = {}; //Impl. your app base quest's here

module.exports = Goblin.buildApplication('${appId}', {icon: '🕮', quests});`;

const genPackage = (appId) => `
{
  "name": "goblin-${appId}",
  "version": "0.0.1",
  "description": "A goblin's app",
  "author": "",
  "license": "MIT",
  "config": {
    "xcraft": {
      "commands": true
    }
  },
  "dependencies": {
    "goblin-rethink": "^0.0.1",
    "goblin-elasticsearch": "^0.0.1",
    "xcraft-core-goblin": "^3.0.0",
    "goblin-warehouse": "^0.0.1",
    "goblin-desktop": "^0.0.1",
    "goblin-workshop": "^0.0.1"
  },
  "devDependencies": {
    "prettier": "2.0.4",
    "xcraft-dev-prettier": "^2.0.0",
    "xcraft-dev-rules": "^2.0.0"
  },
  "prettier": "xcraft-dev-prettier"
}`;

const genConfig = (appId) => `
'use strict';

/**
 * for xcraft-core-etc
 */
module.exports = [
  {
    type: "input",
    name: "mandate",
    message: "Main mandate for this app",
    default: "${appId}",
  },
  {
    type: "input",
    name: "rethinkdbHost",
    message: "rethinkdb hostname",
    default: "localhost",
  },
  {
    type: "input",
    name: "elasticsearchUrl",
    message: "elasticsearch node url",
    default: "http://localhost:9200",
  },
];`;

const genServiceHandler = (appId) => `
'use strict';

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  return require('./lib/app.js');
};`;

module.exports = { genAppTemplate, genPackage, genConfig, genServiceHandler };
