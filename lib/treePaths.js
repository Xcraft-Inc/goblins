const path = require('path');
const workingDir = process.env.PWD;
const cliFile = path.join(workingDir, '.goblins');
const gitFile = path.join(workingDir, '.git');
const readmeFile = path.join(workingDir, 'README.md');
const scrcFile = path.join(workingDir, '.scrc');
const nodeModulesDir = path.join(workingDir, 'node_modules');
const hostFile = path.join(workingDir, 'westeros.json'); //todo: rename file
const bundleConfigFile = path.join(workingDir, 'config.js');
const bundlePackageFile = path.join(workingDir, 'package.json');
const bundleGitIgnoreFile = path.join(workingDir, '.gitignore');

const bundleAppsDir = path.join(workingDir, 'app');
const libDir = path.join(workingDir, 'lib');

module.exports = {
  workingDir,
  cliFile,
  gitFile,
  readmeFile,
  scrcFile,
  nodeModulesDir,
  hostFile,
  bundleConfigFile,
  bundlePackageFile,
  bundleGitIgnoreFile,
  bundleAppsDir,
  libDir,
};
