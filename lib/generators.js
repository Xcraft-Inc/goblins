const {workingDirName} = require('./treePaths.js');
const genAppTemplate = (appId) => `
'use strict';
////////////////////////////////////////////////////////////////
// ${appId}
////////////////////////////////////////////////////////////////

const Goblin = require('xcraft-core-goblin');

const quests = {}; //Impl. your app base quest's here

module.exports = Goblin.buildApplication('${appId}', {icon: '🕮', quests});
`;

const genPackage = (appId, depsVersions) => `{
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
    "goblin-client": "${depsVersions['goblin-client']}",
    "goblin-desktop": "${depsVersions['goblin-desktop']}",
    "goblin-gadgets": "${depsVersions['goblin-gadgets']}",
    "goblin-elasticsearch": "${depsVersions['goblin-elasticsearch']}",
    "goblin-rethink": "${depsVersions['goblin-rethink']}",
    "goblin-warehouse": "${depsVersions['goblin-warehouse']}",
    "goblin-workshop": "${depsVersions['goblin-workshop']}",
    "xcraft-core-goblin": "${depsVersions['xcraft-core-goblin']}"
  },
  "devDependencies": {
    "xcraft-dev-prettier": "${depsVersions['xcraft-dev-prettier']}",
    "xcraft-dev-rules": "${depsVersions['xcraft-dev-rules']}"
  },
  "prettier": "xcraft-dev-prettier"
}`;

const genBundlePackage = (
  electronVersion,
  reactVersion,
  reactDomVersion,
  depsVersions,
  additionalDeps
) => `{
  "name": "${workingDirName}",
  "version": "0.1.0",
  "description": "${workingDirName}",
  "main": "node_modules/xcraft-core-host/bin/host",
  "scripts": {
    "start": "cross-env XCRAFT_LOG=2 NODE_ENV=development electron .",
    "electron-rebuild": "cross-env npm_config_target=${electronVersion} npm_config_arch=x64 npm_config_target_arch=x64 npm_config_runtime=electron npm_config_disturl=https://electronjs.org/headers npm_config_build_from_source=true CFLAGS=-Wno-error CXXFLAGS=-Wno-error npm rebuild",
    "prod": "cross-env NODE_ENV=production electron .",
    "builder": "cross-env NODE_OPTIONS=--max-old-space-size=4096 NODE_ENV=production WESTEROS_APP=builder XCRAFT_LOG=2 node .",
    "zog": "cross-env NODE_ENV=development WESTEROS_APP=zog XCRAFT_LOG=2 node .",
    "test": "node -e \\"require('child_process').spawnSync('mocha', ['--inspect', '-c', 'lib/' + JSON.parse(process.env.npm_config_argv).remain[0] + '/test'], {shell: true, stdio: 'inherit'})\\" #",
    "build": "cross-env WESTEROS_APP=builder ./zog electronify.build $npm_config_goblin ./build/$npm_config_goblin"
  },
  "keywords": [
    "xcraft",
    "goblins"
  ],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=14"
  },
  "workspaces": ["lib/*"],
  "dependencies": {
    "cross-env": "^5.0.1"
  },
  "devDependencies": {
    ${additionalDeps ?? ''}
    "electron": "${electronVersion}",
    "goblins": "^${require('../package.json').version}",
    "goblin-builder": "${depsVersions['goblin-builder']}",
    "node-pre-gyp": "^0.12.0",
    "react": "${reactVersion}",
    "react-dom": "${reactDomVersion}",
    "xcraft-dev-fontawesome": "${depsVersions['xcraft-dev-fontawesome']}",
    "xcraft-dev-prettier": "${depsVersions['xcraft-dev-prettier']}",
    "xcraft-dev-rules": "${depsVersions['xcraft-dev-rules']}"
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
    name: "profile.mandate",
    message: "Main mandate for this app",
    default: "${appId}",
  },
  {
    type: "input",
    name: "profile.rethinkdbHost",
    message: "rethinkdb hostname",
    default: "localhost",
  },
  {
    type: "input",
    name: "profile.elasticsearchUrl",
    message: "elasticsearch node url",
    default: "http://localhost:9200",
  },
  {
    type: "confirm",
    name: "profile.useNabu",
    message: "enable the nabu toolbar",
    default: false,
  },
];`;

const genServiceHandler = () => `'use strict';

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  return require('./lib/app.js');
};`;

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
  "versionFrom": "goblin-${appId}",
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
    "goblin-theme": {
      "compositions": {
        "matrix": {
          "displayName": "Matrix",
          "themeContexts": ["theme"],
          "builder": "default",
          "look": "default",
          "timing": "default",
          "spacing": "default",
          "colors": "matrix",
          "meta": {
            "glyph": "solid/tv",
            "glyphColor": "#00c200",
            "egg": false
          }
        }
      }
    },
    "goblin-workshop": {
      "entityStorageProvider": "goblin-rethink"
    }
  }
}
`;

const genBundleBuilderApp = (appId) => `{
  "name": "builder",
  "versionFrom": "goblin-builder",
  "description": "Builder",
  "appCompany": "epsitec",
  "appId": "builder",
  "xcraft": {
    "xcraft-core-host": {
      "mainQuest": "${appId}.debify"
    },
    "xcraft-core-server": {
      "userModulesFilter": "^goblin-",
      "modules": ["goblin-builder", "goblin-${appId}", "goblin-warehouse"]
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

const genCodeLauncher = (appId) => `
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "${appId}",
      "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron.cmd"
      },
      "program": "\${workspaceRoot}/node_modules/xcraft-core-host/bin/host",
      "args": [
        "--log=2",
        "--app=${appId}"
      ],
      "protocol": "inspector",
      "outputCapture": "std",
      "env": {
        "NODE_ENV": "development"
      }
    },
  ]
}`;

module.exports = {
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
  genBundleBuilderApp,
  genCodeLauncher,
};
