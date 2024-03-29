const w = require('gigawatts');
const {spawn, execSync} = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const getRemoteURL = (workingDir) =>
  execSync(
    `git -C "${workingDir.replace(/"/, '\\"')}" remote get-url --all origin`
  )
    .toString()
    .split('\n')
    .map((row) => row.trim())[0];

module.exports = w(function* (url, next) {
  const ora = require('ora');
  const spinners = require('cli-spinners');
  const {cloneIntoLib} = require('./helpers.js');
  const {workingDir, bundlePackageLockFile} = require('./treePaths.js');

  let spinner;
  try {
    spinner = ora({
      spinner: spinners.aesthetic,
      text: `📦 installing, please wait...`,
    }).start();

    /* Support for github shortlinks like github:Xcraft-Inc/goblin-wm
     * and Xcraft shortlinks like Xcraft:goblin-wm
     */
    if (/^github:/.test(url)) {
      const remoteURL = getRemoteURL(workingDir);
      if (/^http/.test(remoteURL)) {
        url = `${url.replace(/github:/, 'https://github.com/')}.git`;
      } else {
        url = `git@${url.replace(/github:/, 'github.com:')}.git`;
      }
    } else if (/^[Xx]craft:/.test(url)) {
      const remoteURL = getRemoteURL(workingDir);
      if (/^http/.test(remoteURL)) {
        url = `${url.replace(
          /[Xx]craft:/,
          'https://github.com/Xcraft-Inc/'
        )}.git`;
      } else {
        url = `git@github.com:Xcraft-Inc/${url.replace(/[Xx]craft:/, '')}.git`;
      }
    }

    cloneIntoLib(url);
    if (!fs.existsSync(`${bundlePackageLockFile}.goblins`)) {
      fs.copySync(bundlePackageLockFile, `${bundlePackageLockFile}.goblins`);
    }
    const mod = path.basename(url, '.git');
    fs.copySync(bundlePackageLockFile, `${bundlePackageLockFile}.${mod}`);

    const p = spawn('npm', ['install'], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
    p.on('close', (code) => next(code ? `rc=${code}` : null));
    yield;

    spinner.succeed();
    console.log(`🧙 #I got a long day, kid.`);
  } catch (ex) {
    console.error(ex);
    spinner.fail();
    return;
  }
});
