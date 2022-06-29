const path = require('path');
const {mkdir} = require('xcraft-core-fs');
const {libDir} = require('./treePaths.js');
const {jsify} = require('./helpers.js');
const fs = require('fs-extra');

module.exports = (name) => {
  //normalize name
  name = jsify(name);
  if (!name.startsWith('goblin-')) {
    name = `goblin-${name}`;
  }

  const moduleDir = path.join(libDir, name);
  if (fs.existsSync(moduleDir)) {
    console.log(`
Canceled: folder already exist:
${moduleDir}`);
    return;
  }

  const moduleLibDir = path.join(moduleDir, 'lib');
  const entitiesDir = path.join(moduleDir, 'entities');
  const packageFile = path.join(moduleDir, 'package.json');
  mkdir(moduleLibDir);
  mkdir(entitiesDir);
  const deps = require('./gatherDepsVersions.js')();

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
    "xcraft-core-goblin": "${deps['xcraft-core-goblin']}"
  },
  "devDependencies": {
    "xcraft-dev-prettier": "${deps['xcraft-dev-prettier']}",
    "xcraft-dev-rules": "${deps['xcraft-dev-rules']}"
  },
  "prettier": "xcraft-dev-prettier"
}`;
  fs.writeFileSync(packageFile, packageContent);

  console.log(`
✨ Crafted  module ${name} 
in ${libDir}

hint:
run npm install in your bundle when ready
`);
  require('./select.js')(name);
};
