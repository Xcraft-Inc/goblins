const {
  jsify,
  tryGenerateFile,
  preparePathsForNewService,
} = require('./helpers.js');

module.exports = (name) => {
  name = jsify(name);
  const workitemFolderPath = `widgets/${name}-workitem/`;
  const serviceFile = `
  'use strict';
  exports.xcraftCommands = function() {
    return require(\`./${workitemFolderPath}service.js\`);
  };`;

  const workitemServiceFile = `
  'use strict';
  const {buildWorkitem} = require('goblin-workshop');
  
  const config = {
    type: '${name}',
    kind: 'workitem',
    maxLevel: 2,
    actions: {},
    quests: {},
    plugins: {},
    hinters: {},
    onEntityPropertyChanged: {},
    onLoad: null,
    onUpdate: null,
    onPublish: null,
    onArchive: null,
    onTrash: null,
    onSubmit: null
  };
  
  module.exports = buildWorkitem(config);
`;

  const uiFile = `
  import React from 'react';
  
  import Container from 'goblin-gadgets/widgets/container/widget';
  import Field from 'goblin-gadgets/widgets/field/widget';
  
  /******************************************************************************/
  
  function renderPanel(props, readonly) {
    return (
      <Container kind="column" grow="1">
        <Container kind="pane">
          <Field model=".name" />
          <Field model=".status" />
        </Container>
      </Container>
    );
  }
  
  function renderPlugin(props, readonly) {
    return (
      <Container kind="column" grow="1">
        <Container kind="row">
          <Field model=".name" />
          <Field model=".status" />
        </Container>
     </Container>
    );
  }
  
  /******************************************************************************/
  
  export default {
    panel: {
      readonly: renderPanel,
      edit: renderPanel,
    },
    plugin: {
      readonly: {
        compact: renderPlugin,
        extend: renderPlugin,
      },
      edit: {
        compact: renderPlugin,
        extend: renderPlugin,
      },
    },
  };
  `;

  const {appDir, serviceFilePath} = preparePathsForNewService(
    `${name}-workitem`
  );
  tryGenerateFile(serviceFilePath, serviceFile);

  const {mkdir} = require('xcraft-core-fs');
  const path = require('path');
  mkdir(path.join(appDir, workitemFolderPath));
  const {goblinFilePath} = preparePathsForNewService(
    'service',
    workitemFolderPath
  );
  tryGenerateFile(goblinFilePath, workitemServiceFile);
  const uiPath = preparePathsForNewService('ui', workitemFolderPath);
  tryGenerateFile(uiPath.goblinFilePath, uiFile);
  console.log(`✨ Crafted workitem ${name} 
  in ${appDir}`);
};
