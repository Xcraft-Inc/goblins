const {cliFile} = require('./treePaths.js');
const fs = require('fs');

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
    throw new Error(`CLI config file missing: ${cliFile}`);
  }
};

module.exports = {
  get,
  merge: (data) => {
    const existing = get();
    fs.writeFileSync(cliFile, JSON.stringify(Object.assign(existing, data)));
  },
};
