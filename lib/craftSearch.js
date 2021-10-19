const {jsify, tryGenerateFile, getPathsForNewService} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const {appDir, serviceFilePath} = getPathsForNewService(`${name}-search`);

  const searchServiceFile = `
  'use strict';

  const T = require('goblin-nabu');
  const {buildWorkitem, editSelectedEntityQuest} = require('goblin-workshop');
  
  const config = {
    type: '${name}',
    kind: 'search',
    title: T('${name}'),
    hintText: T('par ${name}'),
    list: '${name}',
    hinters: {
      ${name}: {
        onValidate: editSelectedEntityQuest('${name}-workitem'),
      },
    },
  };
  
  exports.xcraftCommands = function() {
    return buildWorkitem(config);
  };
  `;

  tryGenerateFile(serviceFilePath, searchServiceFile);
  console.log(`✨ Crafted search ${name} 
  in ${appDir}`);
};
