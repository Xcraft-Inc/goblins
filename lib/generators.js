const genAppTemplate = (appId) => `
'use strict';
////////////////////////////////////////////////////////////////
// ${appId}
////////////////////////////////////////////////////////////////

const Goblin = require('xcraft-core-goblin');

const quests = {}; //Impl. your app base quest's here

module.exports = Goblin.buildApplication('${appId}', {icon: '🕮', quests});
`;

const genPackage = (appId) => `{
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
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {
    "goblin-client": "^1.0.0",
    "goblin-desktop": "^1.0.0",
    "goblin-gadgets": "^1.0.0",
    "goblin-elasticsearch": "^1.0.0",
    "goblin-rethink": "^1.0.0",
    "goblin-warehouse": "^1.0.0",
    "goblin-workshop": "^1.0.0",
    "xcraft-core-goblin": "^4.0.0"
  },
  "devDependencies": {
    "prettier": "2.0.4",
    "xcraft-dev-prettier": "^2.0.0",
    "xcraft-dev-rules": "^2.0.0"
  },
  "prettier": "xcraft-dev-prettier"
}`;

const genBundlePackage = (appId) => `{
  "name": "${appId}",
  "version": "0.1.0",
  "description": "${appId} bundle",
  "main": "node_modules/xcraft-core-host/bin/host",
  "scripts": {
    "start": "cross-env NODE_ENV=development electron .",
    "electron-rebuild": "cross-env npm_config_target=8.4.1 npm_config_arch=x64 npm_config_target_arch=x64 npm_config_runtime=electron npm_config_disturl=https://electronjs.org/headers npm_config_build_from_source=true CFLAGS=-Wno-error CXXFLAGS=-Wno-error npm rebuild",
    "prod": "cross-env NODE_ENV=production electron .",
    "builder": "cross-env NODE_OPTIONS=--max-old-space-size=4096 NODE_ENV=production WESTEROS_APP=builder XCRAFT_LOG=2 node .",
    "zog": "cross-env NODE_ENV=development WESTEROS_APP=zog XCRAFT_LOG=2 node .",
    "test": "node -e \\"require('child_process').spawnSync('mocha', ['--inspect', '-c', 'lib/' + JSON.parse(process.env.npm_config_argv).remain[0] + '/test'], {shell: true, stdio: 'inherit'})\\" #",
    "build": "cross-env WESTEROS_APP=builder ./zog electronify.build $npm_config_goblin ./build/$npm_config_goblin",
    "postinstall": "startcraft",
    "postshrinkwrap": "startcraft"
  },
  "keywords": [
    "xcraft",
    "goblins"
  ],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=10.0.0"
  },
  "dependencies": {
    "electron": "8.4.1",
    "electron-devtools-installer": "^3.1.1",
    "cross-env": "^5.0.1",
    "startcraft": "^2.1.0"
  },
  "devDependencies": {
    "electron": "8.4.1",
    "goblin-webpack": "^1.0.0",
    "node-pre-gyp": "^0.12.0",
    "prettier": "2.0.4",
    "xcraft-dev-frontend-deps": "^1.0.0",
    "xcraft-dev-prettier": "^2.0.0",
    "xcraft-dev-rules": "^2.0.0"
  },
  "prettier": "xcraft-dev-prettier"
}`;

const genConfig = (appId) => `'use strict';

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

const genServiceHandler = (appId) => `'use strict';

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  return require('./lib/app.js');
};`;

const genScrc = (appId) => `{
  "npmInstallArgs": [],
  "modules": [
    "./lib/goblin-${appId}"
  ],
  "exclude": ["babel-env", "generic-js-env", "mai-chai"],
  "scripts": {
    "presc": {},
    "postsc": {}
  }
}`;

const genHostConfig = (appId) => `{
  "appCompany": "${appId}",
  "appId": "${appId}",
  "appEnv": "test",
  "appCommit": "devel"
}`;

const genBundleConfig = (appId) => `'use strict';

const path = require('path');
const {modules} = require('xcraft-core-utils');

const [appId, variantId] = (
  process.env.GOBLINS_APP || '${appId}'
).split('@');

module.exports = {
  default: modules.extractForEtc(path.join(__dirname, 'app'), appId, variantId),
};
`;

const genBundleApp = (appId) => `{
  "name": "${appId}",
  "versionFrom": "${appId}",
  "description": "${appId} application",
  "appCompany": "${appId}",
  "appId": "${appId}",
  "xcraft": {
    "xcraft-core-host": {
      "mainQuest": "${appId}.boot",
      "secondaryQuest": "client.start"
    },
    "xcraft-core-server": {
      "userModulesFilter": "^goblin-",
      "modules": ["goblin-${appId}", "goblin-client"]
    },
    "goblin-client": {
      "mainGoblin": "${appId}",
      "mainGoblinModule": "goblin-${appId}",
      "contextId": "${appId}",
      "themeContexts": ["theme"],
      "useConfigurator": false,
      "useLogin": false
    },
    "goblin-workshop": {
      "entityStorageProvider": "goblin-rethink"
    }
  }
}
`;

const genConfigJs = (appId) => `'use strict';

const path = require('path');
const {modules} = require('xcraft-core-utils');

const [appId, variantId] = (
  process.env.WESTEROS_APP || '${appId}'
).split('@');

module.exports = {
  default: modules.extractForEtc(path.join(__dirname, 'app'), appId, variantId),
};
`;

const genBundleReadme = (appId) => `
# Welcome on board!

Your ${appId} application is now bundled and you are ready to start your crafting !

For help about the bundle, for ex. adding submodules,
see [startcraft documentation on github](https://github.com/Xcraft-Inc/startcraft)

Goblin craftbook is available [here](https://www.xcraft.ch/)

## Warning about goblins:

They employ vast teams of engineers who expand on current technology and
produce gadgets to suit a wide array of applications.

They constantly build and repair machines and work on new ideas.
Unfortunately, goblins alternate passionate genius with wandering focus.

Their lack of discipline means that many creations
end up half finished as something else catches their attention.

Goblin workmanship has a partially deserved reputation for unreliability,
and a goblin device may explode simply because
its creator forgot(or couldn't be bothered) to add a vital release valve.
`;

module.exports = {
  genScrc,
  genBundleReadme,
  genBundleApp,
  genBundleConfig,
  genAppTemplate,
  genHostConfig,
  genPackage,
  genBundlePackage,
  genConfig,
  genServiceHandler,
  genConfigJs,
};
