const text = require('./text.js');
//https://yargs.js.org/docs/#api-reference
require('yargs')
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
  .help()
  .demandCommand(1, '').argv;
