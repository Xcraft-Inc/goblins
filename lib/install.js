const {lsdir} = require('xcraft-core-fs');
const ora = require('ora');
const spinners = require('cli-spinners');
const path = require('path');
const fs = require('fs-extra');
const {generateFile, jsify} = require('./helpers.js');
const configStore = require('./goblinsConfig.js');

const {
  nodeModulesDir,
  bundlePackageFile,
  workingDir,
} = require('./treePaths.js');
const spawn = require('child_process').spawn;
const w = require('gigawatts');

module.exports = w(function* (appId, noInstall, generator, userName, next) {
  appId = jsify(appId);
  console.log(`✨ #Keep it real`);
  if (!noInstall && generator) {
    let twoPassInstall = false;
    const generatorFunc = require('./generators.js')[generator];
    if (generator === 'genDesktopBundlePackage') {
      twoPassInstall = true;
    }

    let spinner;
    try {
      spinner = ora({
        spinner: spinners.aesthetic,
        text: `📦 installing, please wait...`,
      }).start();
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
    } catch {
      spinner.fail();
      return;
    }

    if (twoPassInstall) {
      const depsVersions = require('./gatherDepsVersions.js')();
      const additionnalDeps = JSON.stringify(
        lsdir(nodeModulesDir, /^goblin-/).reduce((deps, mod) => {
          const packPath = path.join(nodeModulesDir, mod, 'package.json');
          const packageFile = fs.readFileSync(packPath);
          const packages = JSON.parse(packageFile.toString());
          deps = {...deps, ...packages.devDependencies};
          return deps;
        }, {})
      );
      generateFile(
        bundlePackageFile,
        generatorFunc(
          configStore.get('electronVersion'),
          configStore.get('reactVersion'),
          configStore.get('reactDomVersion'),
          depsVersions,
          additionnalDeps.slice(1, -1) + ',',
          userName
        )
      );
      spinner.text = `📦 installing (second pass), please wait...`;
      spinner.start();
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
    }

    configStore.merge({
      currentModule: `goblin-${appId}`,
      [appId]: {cliVersion: require('../package.json').version},
    });
    if (userName.length > 0) {
      console.log(`☎️  Knock, Knock, ${userName}.`);
    }
    console.log(`🧙 #I got a long day, kid.`);
  }
});
