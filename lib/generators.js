const {workingDirName} = require('./treePaths.js');
const genDesktopAppTemplate = (appId) => `
'use strict';
////////////////////////////////////////////////////////////////
// ${appId}
////////////////////////////////////////////////////////////////

const Goblin = require('xcraft-core-goblin');

const quests = {}; //Impl. your app base quest's here

module.exports = Goblin.buildApplication('${appId}', {icon: '🕮', quests});
`;

const genAPIAppTemplate = (appId) => `
'use strict';
////////////////////////////////////////////////////////////////
// ${appId} API
////////////////////////////////////////////////////////////////

const Goblin = require('xcraft-core-goblin');

const quests = {
  init: function* (quest) {
    const desktopId = 'system@${appId}';
    yield quest.create('${appId}-api', {
      id: '${appId}-api@mainInstance',
      desktopId,
    });
  },
};

module.exports = Goblin.buildApplication('${appId}', {
  icon: '🪐',
  quests,
  useWorkshop: false,
});
`;

const genDesktopPackage = (appId, depsVersions, userName) => `{
  "name": "goblin-${appId}",
  "version": "0.0.1",
  "description": "A goblin's desktop app",
  "author": "${userName}",
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

const genAPIPackage = (appId, depsVersions, userName) => `{
  "name": "goblin-${appId}",
  "version": "0.0.1",
  "description": "A goblin's API",
  "author": "${userName}",
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
    "goblin-warehouse": "${depsVersions['goblin-warehouse']}",
    "goblin-tradingpost": "${depsVersions['goblin-tradingpost']}",
    "xcraft-core-goblin": "${depsVersions['xcraft-core-goblin']}"
  },
  "devDependencies": {
    "xcraft-dev-prettier": "${depsVersions['xcraft-dev-prettier']}",
    "xcraft-dev-rules": "${depsVersions['xcraft-dev-rules']}"
  },
  "prettier": "xcraft-dev-prettier"
}`;

const genDesktopBundlePackage = (
  electronVersion,
  reactVersion,
  reactDomVersion,
  depsVersions,
  additionalDeps,
  userName
) => `{
  "name": "${workingDirName}",
  "version": "0.1.0",
  "description": "${workingDirName}",
  "main": "node_modules/xcraft-core-host/bin/host",
  "scripts": {
    "start": "cross-env XCRAFT_LOG=2 NODE_ENV=development electron .",
    "electron-rebuild": "cross-env npm_config_target=${electronVersion} npm_config_arch=x64 npm_config_target_arch=x64 npm_config_runtime=electron npm_config_disturl=https://electronjs.org/headers npm_config_build_from_source=true CFLAGS=-Wno-error CXXFLAGS=-Wno-error npm rebuild",
    "prod": "cross-env NODE_ENV=production electron .",
    "builder": "cross-env NODE_OPTIONS=--max-old-space-size=4096 NODE_ENV=production GOBLINS_APP=builder XCRAFT_LOG=2 node .",
    "zog": "cross-env NODE_ENV=development GOBLINS_APP=zog XCRAFT_LOG=2 node .",
    "build": "cross-env GOBLINS_APP=builder ./zog electronify.build $npm_config_goblin ./build/$npm_config_goblin"
  },
  "keywords": [
    "xcraft",
    "goblins"
  ],
  "author": "${userName}",
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

const genAPIBundlePackage = (depsVersions, userName) => `{
  "name": "${workingDirName}",
  "version": "0.1.0",
  "description": "${workingDirName}",
  "main": "node_modules/xcraft-core-host/bin/host",
  "scripts": {
    "start": "cross-env XCRAFT_LOG=2 NODE_ENV=development node .",
    "prod": "cross-env NODE_ENV=production node .",
    "builder": "cross-env NODE_OPTIONS=--max-old-space-size=4096 NODE_ENV=production GOBLINS_APP=builder XCRAFT_LOG=2 node .",
    "zog": "cross-env NODE_ENV=development GOBLINS_APP=zog XCRAFT_LOG=2 node .",
    "build": "cross-env GOBLINS_APP=builder ./zog debify.build $npm_config_goblin ./build/$npm_config_goblin"
  },
  "keywords": [
    "xcraft",
    "goblins"
  ],
  "author": "${userName}",
  "license": "MIT",
  "engines": {
    "node": ">=14"
  },
  "workspaces": ["lib/*"],
  "dependencies": {
    "cross-env": "^5.0.1"
  },
  "devDependencies": {
    "goblin-builder": "${depsVersions['goblin-builder']}",
    "node-pre-gyp": "^0.12.0",
    "xcraft-dev-rules": "${depsVersions['xcraft-dev-rules']}"
  }
}`;

const genDesktopConfig = (appId) => `'use strict';

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

const genAPIConfig = (appId) => `'use strict';

/**
 * for xcraft-core-etc
 */
module.exports = [
  {
    type: 'input',
    name: 'host',
    message: 'hostname',
    default: 'localhost',
  },
  {
    type: 'input',
    name: 'port',
    message: 'port',
    default: '3000',
  },
  {
    type: 'input',
    name: 'serverUrl',
    message: 'public server url',
    default: 'http://localhost:3000',
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

const genDesktopBundleApp = (appId) => `{
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

const genAPIBundleApp = (appId) => `{
  "name": "${appId}",
  "versionFrom": "goblin-${appId}",
  "description": "${appId} API",
  "appCompany": "${appId}",
  "appId": "${appId}",
  "xcraft": {
    "xcraft-core-host": {
      "mainQuest": "${appId}.boot",
      "secondaryQuest": "${appId}.init"
    },
    "xcraft-core-server": {
      "userModulesFilter": "^goblin-",
      "modules": ["goblin-${appId}"]
    }
  }
}`;

const genPortalApp = (appId) => `
{
  "name": "${appId}-portal",
  "versionFrom": "goblin-${appId}",
  "description": "${appId} portal",
  "appCompany": "${appId}",
  "appId": "${appId}-portal",
  "xcraft": {
    "xcraft-core-host": {
      "mainQuest": "client.boot",
      "secondaryQuest": "client.start",
      "powerSaveBlockers": ["prevent-app-suspension"]
    },
    "xcraft-core-server": {
      "userModulesFilter": "^goblin-",
      "userModulesBlacklist": "^goblin-(nabu|theme)$",
      "modules": ["goblin-client"]
    },
    "xcraft-core-horde": {
      "hordes": ["${appId}-thrall"],
      "topology": {
        "${appId}-thrall": {
          "host": "localhost",
          "commanderPort": 10000,
          "notifierPort": 20000,
          "timeout": 3600000,
          "nice": -4
        }
      }
    },
    "xcraft-core-transport": {
      "backends": ["ee", "axon"]
    },
    "xcraft-core-log": {
      "journalize": true
    },
    "goblin-client": {
      "mainGoblin": "${appId}",
      "mainGoblinModule": "goblin-${appId}",
      "themeContexts": ["theme"],
      "useConfigurator": true,
      "useLogin": false
    },
    "goblin-laboratory": {
      "defaultZoom": 0.7
    },
    "goblin-workshop": {
      "entityStorageProvider": "goblin-rethink"
    },
    "goblin-configurator": {
      "buildInfo": "Warning: developer release, press ctrl+k for advanced mode",
      "profiles": {
        "default": {
          "id": "default",
          "mainGoblin": "${appId}",
          "name": "${appId}",
          "defaultContextId": "${appId}"
        }
      }
    }
  }
}
`;

const genThrallApp = (appId) => `
{
  "name": "${appId}-thrall",
  "versionFrom": "goblin-${appId}",
  "description": "${appId} thrall",
  "appCompany": "${appId}",
  "appId": "${appId}-thrall",
  "debify": {
    "dependencies": "iproute2"
  },
  "xcraft": {
    "xcraft-core-host": {
      "mainQuest": "${appId}.boot"
    },
    "xcraft-core-server": {
      "userModulesFilter": "^goblin-",
      "userModulesBlacklist": "^goblin-client$",
      "modules": ["goblin-warehouse", "goblin-${appId}"]
    },
    "xcraft-core-bus": {
      "host": "0.0.0.0",
      "commanderPort": 10000,
      "notifierPort": 20000,
      "timeout": 3600000,
      "acceptIncoming": false
    },
    "xcraft-core-transport": {
      "backends": ["ee", "axon"]
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
      "presentation": {"group": "${appId}"},
      "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron.cmd"
      },
      "cwd": "\${workspaceRoot}",
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
    {
      "type": "node",
      "request": "launch",
      "name": "${appId}-portal (instance 1)",
      "presentation": {"group": "${appId}"},
      "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron.cmd"
      },
      "linux": {
        "runtimeArgs": ["--no-sandbox"]
      },
      "program": "\${workspaceRoot}/node_modules/xcraft-core-host/bin/host",
      "args": ["--log=2", "--app=${appId}-portal"],
      "protocol": "inspector",
      "outputCapture": "std",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "${appId}-portal (instance 2)",
      "presentation": {"group": "${appId}"},
      "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "\${workspaceRoot}/node_modules/.bin/electron.cmd"
      },
      "linux": {
        "runtimeArgs": ["--no-sandbox"]
      },
      "program": "\${workspaceRoot}/node_modules/xcraft-core-host/bin/host",
      "args": ["--log=2", "--app=${appId}-portal"],
      "protocol": "inspector",
      "outputCapture": "std",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "${appId}-thrall",
      "presentation": {"group": "${appId}"},
      "program": "\${workspaceRoot}/node_modules/xcraft-core-host/bin/host",
      "args": ["--debug-child", "--log=2", "--app=${appId}-thrall"],
      "protocol": "inspector",
      "outputCapture": "std",
      "autoAttachChildProcesses": true,
      "console": "internalConsole",
      "env": {
        "NODE_ENV": "development",
      }
    }
  ]
}`;

const genAPIService = (appId) => `
'use strict';

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  const apiBuilder = require('goblin-tradingpost');
  const xEtc = require('xcraft-core-etc')();
  const {host, port, serverUrl} = xEtc.load('goblin-${appId}');
  const quests = require('./lib/api/controllers.js');
  const schemaBuilder = require('./lib/api/schema.js');
  const ${appId}API = {
    name: '${appId}',
    host: host,
    port: port,
    exposeSwagger: true,
    swaggerServerUrl: serverUrl,
    schemaBuilder,
    quests,
    options: {},
    skills: [],
  };

  return apiBuilder(${appId}API);
};
`;

module.exports = {
  genBundleReadme,
  genAPIBundleApp,
  genDesktopBundleApp,
  genBundleConfig,
  genAPIAppTemplate,
  genAPIService,
  genDesktopAppTemplate,
  genHostConfig,
  genAPIPackage,
  genAPIBundlePackage,
  genDesktopPackage,
  genDesktopBundlePackage,
  genPortalApp,
  genThrallApp,
  genAPIConfig,
  genDesktopConfig,
  genServiceHandler,
  genConfigJs,
  genBundleBuilderApp,
  genCodeLauncher,
};
