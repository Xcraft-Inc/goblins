const {jsify, tryGenerateFile, getPathsForNewService} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name).toLowerCase();
  const {appDir, serviceFilePath, goblinFilePath} = getPathsForNewService(
    name,
    'entities'
  );

  const serviceFile = `
exports.xcraftCommands = function () {
  return require('/entities/${name}.js').service;
};
`;

  const goblinFile = `
'use strict';
const {buildEntity} = require('goblin-workshop');

const entity = {
  type: '${name}',
  cacheSize: 0,
  newEntityStatus: 'published',

  references: {},
  values: {},

  properties: {
    name: {type: 'string', defaultValue: ''},
  },

  summaries: {
    info: {type: 'string', defaultValue: ''},
    description: {type: 'markdown', defaultValue: ''},
  },

  buildSummaries: function (quest, ${name}) {
    const info = ${name}.name;
    return {info};
  },

  indexer: function (quest, ${name}) {
    const info = ${name}.get('meta.summaries.info', '');
    return {info};
  },

  onNew: function (quest, id, name) {
    return {
      id,
      name,
    };
  },
};

module.exports = {
  entity,
  service: buildEntity(entity),
};
`;

  tryGenerateFile(serviceFilePath, serviceFile);
  tryGenerateFile(goblinFilePath, goblinFile);
  console.log(`✨ Crafted entity ${name} 
  in ${appDir}`);
};
