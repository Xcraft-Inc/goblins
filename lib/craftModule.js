const path = require('path');
const {mkdir} = require('xcraft-core-fs');
const {libDir} = require('./treePaths.js');
const fs = require('fs');

module.exports = (name) => {
  const moduleDir = path.join(libDir, name);
  if (fs.existsSync(moduleDir)) {
    console.log(`
Canceled: folder already exist:
${moduleDir}`);
    return;
  }

  const moduleLibDir = path.join(moduleDir, 'lib');
  const packageFile = path.join(moduleDir, 'package.json');
  mkdir(moduleLibDir);

  const packageContent = `{
  "name": "${name}",
  "version": "0.0.1",
  "description": "${name}",
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
    "xcraft-core-goblin": "^${require('./gatherDepsVersions.js')(
      'xcraft-core-goblin'
    )}"
  },
  "devDependencies": {
    "prettier": "2.0.4",
    "xcraft-dev-prettier": "^2.0.0",
    "xcraft-dev-rules": "^2.0.0"
  },
  "prettier": "xcraft-dev-prettier"
}`;
  fs.writeFileSync(packageFile, packageContent);

  console.log(`
✨ Crafted  module ${name} in ${libDir}`);
  const {addModule} = require('./scrcManager');
  addModule(name);
  require('./select.js')(name);
};
