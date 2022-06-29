const w = require('gigawatts');
const {spawn, execSync} = require('child_process');

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
  const {workingDir} = require('./treePaths.js');

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
    } else if (/^Xcraft:/.test(url)) {
      const remoteURL = getRemoteURL(workingDir);
      if (/^http/.test(remoteURL)) {
        url = `${url.replace(/Xcraft:/, 'https://github.com/Xcraft-Inc/')}.git`;
      } else {
        url = `git@github.com:Xcraft-Inc/${url.replace(/Xcraft:/, '')}.git`;
      }
    }

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
