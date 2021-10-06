const path = require('path');
if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}
const workingDir = process.env.PWD;
const workingDirName = path.basename(workingDir);
const cliFile = path.join(workingDir, '.goblins');
const gitFile = path.join(workingDir, '.git');

const readmeFile = path.join(workingDir, 'README.md');
const nodeModulesDir = path.join(workingDir, 'node_modules');
const hostFile = path.join(workingDir, 'goblins.json');
const bundleConfigFile = path.join(workingDir, 'config.js');
const bundlePackageFile = path.join(workingDir, 'package.json');
const bundleGitIgnoreFile = path.join(workingDir, '.gitignore');

const bundleAppsDir = path.join(workingDir, 'app');
const libDir = path.join(workingDir, 'lib');
const ideDir = path.join(workingDir, '.vscode');
const launchFile = path.join(ideDir, 'launch.json');

module.exports = {
  workingDir,
  workingDirName,
  cliFile,
  gitFile,
  readmeFile,
  nodeModulesDir,
  hostFile,
  bundleConfigFile,
  bundlePackageFile,
  bundleGitIgnoreFile,
  bundleAppsDir,
  libDir,
  ideDir,
  launchFile,
};
