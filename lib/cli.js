const pack = require('../package.json');
//https://yargs.js.org/docs/#api-reference
const yargs = require('yargs');
yargs
  .scriptName('goblins')
  .usage(
    `✨ Goblins CLI (v${pack.version}) ✨

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
    'init <appId>',
    `provide all needed files for crafting a new goblin app
    in the current directory.

    note:
     - appId is mandatory and normalized to camelCase
     
     `,
    {
      appId: {
        alias: 'appId',
      },
    },
    (argv) => {
      require('./init.js')(argv.appId, argv.noInstall);
    }
  )
  .command(
    'craft <action> <name>',
    `craft initial files based on ressource type

    action can be:
      
    - module    //craft a new goblin module
    - service   //craft a minimal goblin service
    - worker-q  //craft a worker queue service
    - entity    //craft a workshop entity service
    - hinter    //craft a hinter service for entity
    - search    //craft a search service for entity
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
  .help()
  .demandCommand(1, '').argv;
