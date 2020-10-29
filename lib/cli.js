const text = require('./text.js');
//https://yargs.js.org/docs/#api-reference
const yargs = require('yargs');
yargs
  .scriptName('goblins')
  .usage('usage: $0 <command> [<args>]')
  .command(
    'init <appId>',
    `provide all needed files for crafting a new goblin app
    in the current directory.

    note:
     - appId is mandatory and normalized to camelCase
     - a startcraft dev-bundle is also created`,
    {
      appId: {
        alias: 'appId',
      },
    },
    (argv) => {
      require('./init.js')(argv.appId);
    }
  )
  .command(
    'craft [type] <name>',
    `craft initial files for backend

    ex: 'craft service todoManager'
    
    will create needed file for 
      exposing a todoManager service`,
    yargs.positional('type', {
      describe: 'ressource type',
      default: 'service',
    }),
    (argv) => {
      console.dir(argv);
    }
  )
  .help()
  .demandCommand(1, '').argv;
