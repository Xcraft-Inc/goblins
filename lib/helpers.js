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

const getPathsForNewService = (name, customFolder) => {
  const configStore = require('./goblinsConfig.js');
  const {currentModule} = configStore.get();
  const appDir = path.join(libDir, currentModule);

  const serviceFilePath = path.join(appDir, `${name}.js`);
  const goblinFilePath = path.join(
    appDir,
    customFolder || '/lib/',
    `${name}.js`
  );
  return {appDir, serviceFilePath, goblinFilePath};
};

const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};

module.exports = {
  jsify,
  tryGenerateFile,
  getOrCreateConfigFile,
  getPathsForNewService,
};
