const {scrcFile} = require('./treePaths.js');
const fs = require('fs');
const {getOrCreateConfigFile} = require('./helpers.js');

const initialState = {
  npmInstallArgs: [],
  modules: [],
  exclude: ['babel-env', 'generic-js-env', 'mai-chai'],
  scripts: {
    presc: {},
    postsc: {},
  },
};

const get = () => {
  return getOrCreateConfigFile(scrcFile, initialState);
};

module.exports = {
  addModule: (module) => {
    const scrc = get();
    const relativeModulePath = `./lib/${module}`;
    scrc.modules.push(relativeModulePath);
    fs.writeFileSync(scrcFile, JSON.stringify(scrc));
    console.log(`
✨ Added module ${module} in ${scrcFile}`);
  },
  get,
};
