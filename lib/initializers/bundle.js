const {tryGenerateFile} = require('../helpers.js');
const {mkdir, cp} = require('xcraft-core-fs');
const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');
const {
  genBundleConfig,
  genBundleReadme,
  genCodeLauncher,
  genHostConfig,
} = require('../generators.js');

const {
  cliFile,
  gitFile,
  readmeFile,
  launchFile,
  ideDir,
  libDir,
  nodeModulesDir,
  hostFile,
  bundleConfigFile,
  bundleGitIgnoreFile,
  bundleAppsDir,
} = require('../treePaths.js');

module.exports = (appId) => {
  console.log(`⚙️  initializing ${appId} bundle...`);
  let userName = '';
  if (!fs.existsSync(gitFile)) {
    try {
      execSync('git init');
    } catch (ex) {
      console.log('😲 git not in PATH');
    }
  }

  try {
    userName = execSync('git config --global user.name');
    userName = userName.toString().trim();
    console.log(`☎️  Wake up, ${userName}...`);
  } catch (ex) {
    console.log('😲 failed to retreive git user name');
  }

  if (fs.existsSync(cliFile)) {
    const content = fs.readFileSync(cliFile);
    let cliInfos;
    let cancel = false;
    try {
      cliInfos = JSON.parse(content);
      if (cliInfos[appId]) {
        cancel = true;
        const cliVersion = cliInfos[appId].cliVersion;
        console.log(
          `😲 ${appId} already initialized with goblins CLI v${cliVersion}`
        );
      }
    } catch (ex) {
      cancel = true;
      console.log(
        `👎 bundle seems to be already initialized, with bad ${cliFile}`
      );
    }
    if (cancel) {
      return userName;
    }
  }

  mkdir(nodeModulesDir);
  mkdir(ideDir);
  //look for bundle files creation
  tryGenerateFile(readmeFile, genBundleReadme(appId));
  tryGenerateFile(bundleConfigFile, genBundleConfig(appId));
  tryGenerateFile(hostFile, genHostConfig(appId));

  if (!fs.existsSync(bundleGitIgnoreFile)) {
    cp(path.join(__dirname, '../stuff/gitignore'), bundleGitIgnoreFile);
  }

  const bundleAppDir = path.join(bundleAppsDir, appId);
  mkdir(bundleAppDir);
  mkdir(libDir);
  return userName;
};
