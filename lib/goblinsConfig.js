const {cliFile} = require('./treePaths.js');
const {getOrCreateConfigFile} = require('./helpers.js');
const fs = require('fs-extra');
const initialState = {
  currentModule: null,
  electronVersion: '13.5.1',
  reactVersion: '^17.0.2',
  reactDomVersion: '^17.0.2',
};

const get = (prop) => {
  const data = getOrCreateConfigFile(cliFile, initialState);
  if (prop) {
    return data[prop];
  } else {
    return data;
  }
};

module.exports = {
  get,
  merge: (data) => {
    const existing = get();
    //todo: merge deep
    fs.writeFileSync(cliFile, JSON.stringify(Object.assign(existing, data)));
  },
};
