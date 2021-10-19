const {jsify, tryGenerateFile, getPathsForNewService} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const {appDir, serviceFilePath} = getPathsForNewService(`${name}-hinter`);

  const hinterServiceFile = `
  'use strict';

  const T = require('goblin-nabu');
  const {buildHinter} = require('goblin-elasticsearch');
  exports.xcraftCommands = function() {
    return buildHinter({
      type: '${name}',
      fields: ['info'],
      newWorkitem: {
        name: '${name}-workitem',
        newEntityType: '${name}',
        description: T('Nouveau ${name}'),
        view: 'default',
        icon: 'solid/pencil',
        mapNewValueTo: 'name',
        kind: 'tab',
        isClosable: true,
        navigate: true,
      },
      title: T('${name}'),
      newButtonTitle: T('Nouveau ${name}'),
    });
  };
  `;

  tryGenerateFile(serviceFilePath, hinterServiceFile);
  console.log(`✨ Crafted hinter ${name} 
  in ${appDir}`);
};
