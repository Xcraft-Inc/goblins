const fs = require('fs-extra');
const path = require('path');
const {libDir} = require('./treePaths.js');
const {mkdir} = require('xcraft-core-fs');

const tryGenerateFile = (path, content) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
  }
};

const generateFile = (path, content) => {
  fs.writeFileSync(path, content);
};

const updateGitIgnoreList = () => {
  const {bundleGitIgnoreFile, libDir} = require('./treePaths.js');
  const {execSync} = require('child_process');
  if (fs.existsSync(bundleGitIgnoreFile)) {
    const underGitMgmt = execSync(`git ls-files ${libDir}`);
    const directories = [
      'node_modules/',
      'build/',
      'lib/*/',
      ...underGitMgmt
        .toString()
        .split('\n')
        .map((l) => l)
        .filter((l) => l !== 'lib/.gitignore' && l.startsWith('lib/'))
        .map((l) => `!${l}/`),
    ];
    fs.writeFileSync(bundleGitIgnoreFile, directories.join('\n'));
  }
};

const cloneIntoLib = (url) => {
  const {libDir} = require('./treePaths.js');
  const {execSync} = require('child_process');
  execSync(
    `git clone ${url} ${path.join(
      libDir,
      path.basename(url, '.git')
    )} --recursive`
  );
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

const preparePathsForNewService = (name, customFolder) => {
  const configStore = require('./goblinsConfig.js');
  const {currentModule} = configStore.get();
  const appDir = path.join(libDir, currentModule);

  const serviceFilePath = path.join(appDir, `${name}.js`);
  const destFolderPath = path.join(appDir, customFolder || '/lib/');
  mkdir(destFolderPath);
  const goblinFilePath = path.join(destFolderPath, `${name}.js`);
  return {appDir, destFolderPath, serviceFilePath, goblinFilePath};
};

const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};

const sanitize = (str) => {
  const str2 = str
    .replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    .toLowerCase();
  return str2.replace(/ /g, '-');
};

const peaceful = (str, rootDirectory) => {
  if (str.indexOf('\0') !== -1) {
    return false;
  }
  if (!/^[a-z0-9]+$/.test(str)) {
    return false;
  }

  const path = require('path');
  const filename = path.join(rootDirectory, str);
  if (filename.indexOf(rootDirectory) !== 0) {
    return false;
  }
  return true;
};

module.exports = {
  jsify,
  sanitize,
  peaceful,
  generateFile,
  tryGenerateFile,
  getOrCreateConfigFile,
  preparePathsForNewService,
  updateGitIgnoreList,
  cloneIntoLib,
};
