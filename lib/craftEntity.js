const {
  jsify,
  tryGenerateFile,
  preparePathsForNewService,
} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const {appDir, serviceFilePath, goblinFilePath} = preparePathsForNewService(
    name,
    'entities'
  );

  const serviceFile = `
exports.xcraftCommands = function () {
  return require('./entities/${name}.js').service;
};
`;

  const goblinFile = `
'use strict';
const {buildEntity} = require('goblin-workshop');
const T = require('goblin-nabu');

const entity = {
  type: '${name}',
  cacheSize: 0,
  newEntityStatus: 'draft',

  references: {},
  values: {},
  links: {},

  properties: {
    name: {type: 'string', defaultValue: '', text: T('Nom')},
    status: {
      type: 'enum',
      values: ['A', 'B',],
      defaultValue: 'A',
      text: T('Status'),
      // prettier-ignore
      valuesInfo: {
        'A': {text: T("Status A"), glyph: 'solid/clock'},
        'B': {text: T("Status B"), glyph: 'solid/check'},
      }
    },

  },

  summaries: {
    info: {type: 'string', defaultValue: ''},
    description: {type: 'markdown', defaultValue: ''},
  },

  buildSummaries: function (quest, entity, peers, MD) {
    const {name, status} = entity.pick('name','status');
    const info = \`\${name} (\${status})\`;

    MD.addTitle(MD.bold(info));

    return {info, description: MD.toString()};
  },

  indexer: function (quest, entity) {
    const info = entity.get('meta.summaries.description', '');
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
