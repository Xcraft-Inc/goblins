const {jsify, tryGenerateFile, getPathsForNewService} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const {appDir, serviceFilePath, goblinFilePath} = getPathsForNewService(name);

  const serviceFile = `
exports.xcraftCommands = function () {
  return require('/lib/${name}.js');
};
`;

  const goblinFile = `
'use strict';
const goblinName = '${name}';
const Goblin = require('xcraft-core-goblin');


const logicState = {
  id: goblinName,
};

const logicHandlers = {};

Goblin.registerQuest(goblinName, 'init', function (quest) {
  //TODO: initial stuff (don't forget to call me!)
});

// Singleton
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
Goblin.createSingle(goblinName);
`;

  tryGenerateFile(serviceFilePath, serviceFile);
  tryGenerateFile(goblinFilePath, goblinFile);
  console.log(`✨ Crafted service ${name} in ${appDir}`);
};
