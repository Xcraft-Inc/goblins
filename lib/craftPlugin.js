const {
  jsify,
  tryGenerateFile,
  preparePathsForNewService,
} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const {appDir, serviceFilePath} = preparePathsForNewService(`${name}-plugin`);

  const hinterServiceFile = `
  'use strict';

  const T = require('goblin-nabu/widgets/helpers/t.js');
  const {buildWorkitem} = require('goblin-workshop');
  
  const config = {
    type: '${name}',
    kind: 'plugin',
    title: T('${name}'),
  };
  
  exports.xcraftCommands = function() {
    return buildWorkitem(config);
  };
  `;

  tryGenerateFile(serviceFilePath, hinterServiceFile);
  console.log(`✨ Crafted plugin ${name} 
  in ${appDir}`);
};
