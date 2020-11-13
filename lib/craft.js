const path = require('path');
const {tryGenerateFile} = require('./helpers.js');
const {libDir} = require('./treePaths.js');

module.exports = (type, name) => {
  const configStore = require('./configStore.js');
  const {currentModule} = configStore.get();
  const appDir = path.join(libDir, currentModule);

  const serviceFilePath = path.join(appDir, `${name}.js`);
  let serviceFile;
  const goblinFilePath = path.join(appDir, '/lib/', `${name}.js`);
  let goblinFile;
  switch (type) {
    case 'service':
      {
        console.log(`✨ Crafting service ${name} in ${appDir}`);
        serviceFile = `
exports.xcraftCommands = function () {
  return require('/lib/${name}.js');
};
`;

        goblinFile = `
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
      }
      break;
  }
  tryGenerateFile(serviceFilePath, serviceFile);
  tryGenerateFile(goblinFilePath, goblinFile);
};
