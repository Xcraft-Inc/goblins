const fs = require('fs');
const path = require('path');
const {libDir} = require('./treePaths.js');

const tryGenerateFile = (path, content) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
  }
};

const getOrCreateConfigFile = (filePath, initialState) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    let object;
    try {
      object = JSON.parse(content);
    } catch (ex) {
      console.log(`error during ${filePath} JSON parsing`);
      return null;
    }
    return object;
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialState));
    return initialState;
  }
};

const getPathsForNewService = (name) => {
  const configStore = require('./configStore.js');
  const {currentModule} = configStore.get();
  const appDir = path.join(libDir, currentModule);

  const serviceFilePath = path.join(appDir, `${name}.js`);
  const goblinFilePath = path.join(appDir, '/lib/', `${name}.js`);
  return {appDir, serviceFilePath, goblinFilePath};
};

module.exports = {
  tryGenerateFile,
  getOrCreateConfigFile,
  getPathsForNewService,
};
