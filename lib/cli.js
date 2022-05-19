const pack = require('../package.json');
const {execSync} = require('child_process');
try {
  const npmVersion = execSync('npm --version').toString();
  const semver = npmVersion.split('.');
  const major = semver[0];
  if (major < 7) {
    console.error('goblins need at least npm 7');
    process.exit(1);
  }
} catch {
  console.error('Unable to find npm version ?!');
  process.exit(1);
}
console.log(`Xcraft Goblins CLI (v${pack.version})`);
//https://yargs.js.org/docs/#api-reference
const yargs = require('yargs');
yargs
  .scriptName('goblins')
  .usage(
    `
Usage:

goblins init raclette

* this cmd build a delicious raclette app

Credits:
- Chief Orc
- Master Goblin

Made with 🧀 at Epsitec SA
`
  )
  .option('no-install', {
    alias: 'n',
    type: 'boolean',
    description: 'Run without installing packages',
  })
  .command(
    'status',
    `display bundle status
     `,
    {},
    () => {
      require('./status.js')();
    }
  )
  .command(
    'work <url>',
    `install remote repository to workspace
     `,
    {},
    (argv) => {
      require('./installRepo.js')(argv.url);
    }
  )
  .command(
    'init <appId> [initializer]',
    `provide all needed files for crafting a new goblin app
    in the current directory.

    note:
     - appId is mandatory and normalized to camelCase
     - initializer can be set for a different scaffolding
     `,
    {
      appId: {
        alias: 'appId',
      },
      initializer: {
        default: 'desktop',
      },
    },
    (argv) => {
      require('./init.js')(argv.initializer, argv.appId, argv.noInstall);
    }
  )
  .command(
    'craft <action> <name>',
    `craft initial files

    action can be:
    - module    //craft a new goblin module
    - service   //craft a minimal goblin service
    - worker-q  //craft a worker queue service
    - workbench  //craft all workshop's base services

    individual actions for workshop base services: 
    - entity    //craft entity service
    - workitem  //craft workitem UI service for entity
    - hinter    //craft hinter service for entity
    - search    //craft search service for entity
    - plugin    //craft plugin service for CRUD
`,
    (y) => {
      y.positional('action', {
        describe: 'action type',
      });
      y.positional('name', {
        describe: 'ressource name',
      });
    },
    (argv) => {
      if (!argv.name) {
        console.log(
          `Unable to craft a new ${argv.action} file, invalid service name provided!`
        );
        return;
      }
      switch (argv.action) {
        case 'module':
          require('./craftModule.js')(argv.name);
          break;
        case 'service':
          require('./craftService.js')(argv.name);
          break;
        case 'worker-q':
          require('./craftWorkerQueue.js')(argv.name);
          break;
        case 'entity':
          require('./craftEntity.js')(argv.name);
          break;
        case 'search':
          require('./craftSearch.js')(argv.name);
          break;
        case 'hinter':
          require('./craftHinter.js')(argv.name);
          break;
        case 'plugin':
          require('./craftPlugin.js')(argv.name);
          break;
        case 'workitem':
          require('./craftWorkitem.js')(argv.name);
          break;
        case 'workbench':
          require('./craftEntity.js')(argv.name);
          require('./craftSearch.js')(argv.name);
          require('./craftHinter.js')(argv.name);
          require('./craftPlugin.js')(argv.name);
          require('./craftWorkitem.js')(argv.name);
          break;
        default:
          console.log(`Unable to craft this type of ressources...`);
          return;
      }
    }
  )
  .command(
    'select <goblinModule>',
    `select default craft destination module
     `,
    {
      goblinModule: {
        alias: 'goblinModule',
      },
    },
    (argv) => {
      require('./select.js')(argv.goblinModule);
    }
  )
  .command(
    'apply <codeName>',
    `trigger and apply dedicated goblins procedure
     `,
    {
      codeName: {
        alias: 'codeName',
      },
    },
    (argv) => {
      require('./apply.js')(argv.codeName);
    }
  )
  .help()
  .demandCommand(1, '').argv;
