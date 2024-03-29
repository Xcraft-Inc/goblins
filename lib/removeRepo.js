const w = require('gigawatts');
const {spawn} = require('child_process');
const fs = require('fs-extra');
const path = require('path');

module.exports = w(function* (mod, next) {
  const ora = require('ora');
  const spinners = require('cli-spinners');
  const {workingDir, libDir, bundlePackageLockFile} = require('./treePaths.js');

  let spinner;
  try {
    spinner = ora({
      spinner: spinners.aesthetic,
      text: `📦 removing, please wait...`,
    }).start();

    const modDir = path.join(libDir, mod);
    const st = fs.statSync(path.join(modDir, '.git'));
    if (!st.isDirectory()) {
      console.error(
        `\nthe module ${mod} seems not installed by the 'work' command`
      );
      throw null;
    }

    fs.removeSync(modDir);
    fs.removeSync(bundlePackageLockFile);
    fs.removeSync(`${bundlePackageLockFile}.${mod}`);
    fs.copySync(`${bundlePackageLockFile}.goblins`, bundlePackageLockFile);

    const dirlist = fs
      .readdirSync(workingDir)
      .filter((f) =>
        new RegExp(
          `^${path
            .basename(bundlePackageLockFile)
            .replace(/[.]/g, '[.]')}[.][^.]+`
        ).test(f)
      );
    if (dirlist.length === 1) {
      fs.removeSync(`${bundlePackageLockFile}.goblins`);
    }

    const p = spawn('npm', ['install'], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
    p.on('close', (code) => next(code ? `rc=${code}` : null));
    yield;

    const up = spawn('npm', ['upgrade', mod], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
    up.on('close', (code) => next(code ? `rc=${code}` : null));
    yield;

    spinner.succeed();
    console.log(`🧙 #I got a long day, kid.`);
  } catch (ex) {
    console.error(ex);
    spinner.fail();
    return;
  }
});
