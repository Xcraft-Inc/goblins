const {cliFile} = require('./treePaths.js');
const pack = require('../package.json');
const fs = require('fs');
const initialState = {
  cliVersion: pack.version,
  currentModule: null,
};

const get = (prop) => {
  if (fs.existsSync(cliFile)) {
    const content = fs.readFileSync(cliFile);
    let cliInfos;
    try {
      cliInfos = JSON.parse(content);
    } catch (ex) {
      console.log(`error during ${cliFile} JSON parsing`);
    }
    if (!prop) {
      return cliInfos;
    }
    return cliInfos[prop];
  } else {
    fs.writeFileSync(cliFile, JSON.stringify(initialState));
    return initialState;
  }
};

module.exports = {
  get,
  merge: (data) => {
    const existing = get();
    fs.writeFileSync(cliFile, JSON.stringify(Object.assign(existing, data)));
  },
};
