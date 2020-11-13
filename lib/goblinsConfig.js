const {cliFile} = require('./treePaths.js');
const {getOrCreateConfigFile} = require('./helpers.js');
const fs = require('fs');
const initialState = {
  currentModule: null,
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
