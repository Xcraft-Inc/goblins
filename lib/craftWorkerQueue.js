const {tryGenerateFile, getPathsForNewService} = require('./helpers.js');

const writeQueue = (name) => {
  const {appDir, serviceFilePath} = getPathsForNewService(name);
  const topic = `${name}-enqueue-requested`;
  const serviceFile = `
const Goblin = require('xcraft-core-goblin');
//usage:
//  quest.evt(${topic},{desktopId, data});
exports.xcraftCommands = function () {
  return Goblin.buildQueue('${name}', {
    sub: '*::*.${topic}', //TODO: CHANGE ME
    queueSize: 1,         //TODO: TWEAK ME
  });
};
`;
  tryGenerateFile(serviceFilePath, serviceFile);
  console.log(`✨ Crafted queue service ${name} 
  in ${appDir}`);
};

const writeWorker = (name) => {
  const workerName = `${name}-worker`;
  const {appDir, serviceFilePath} = getPathsForNewService(workerName);
  const serviceFile = `
const Goblin = require('xcraft-core-goblin');
exports.xcraftCommands = function () {
  return Goblin.buildQueueWorker('${name}', {
    workQuest: function* (quest, desktopId, data) {
      //TODO: CHANGE IMPL.
      yield setTimeout(() => console.dir(data),10);
    },
  });
};
`;
  tryGenerateFile(serviceFilePath, serviceFile);
  console.log(`✨ Crafted queue worker service ${workerName} 
  in ${appDir}`);
};

module.exports = (name) => {
  writeQueue(name);
  writeWorker(name);
};
