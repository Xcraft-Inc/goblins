const w = require('gigawatts');
module.exports = w(function* (url, next) {
  const ora = require('ora');
  const spinners = require('cli-spinners');
  const {updateGitIgnoreList, cloneIntoLib} = require('./helpers.js');
  const {workingDir} = require('./treePaths.js');
  const spawn = require('child_process').spawn;
  let spinner;
  try {
    updateGitIgnoreList();
    spinner = ora({
      spinner: spinners.aesthetic,
      text: `📦 installing, please wait...`,
    }).start();
    cloneIntoLib(url);

    const done = next.parallel().arg(0);
    const p = spawn('npm', ['install'], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
    p.on('close', () => {
      spinner.succeed();
      done();
    });
    yield next.sync();
    console.log(`🧙 #I got a long day, kid.`);
  } catch {
    spinner.fail();
    return;
  }
});
