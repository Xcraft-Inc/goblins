const {mkdir, cp} = require('xcraft-core-fs');
const spawnSync = require('child_process').spawnSync;
const text = require('./text.js');
const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};

module.exports = (appId) => {
  appId = jsify(appId).toLowerCase();

  const {
    genScrc,
    genAppTemplate,
    genPackage,
    genHostConfig,
    genBundleApp,
    genBundleConfig,
    genBundlePackage,
    genBundleReadme,
    genConfig,
    genServiceHandler,
  } = require('./generators.js');
  const path = require('path');
  const fs = require('fs');

  const workingDir = process.env.PWD;
  mkdir(path.join(workingDir, 'node_modules'));
  //look for bundle files creation
  const readmeFile = path.join(workingDir, 'README.md');
  if (!fs.existsSync(readmeFile)) {
    fs.writeFileSync(readmeFile, genBundleReadme(appId));
    console.log();
  }

  const scrcFile = path.join(workingDir, '.scrc');
  if (!fs.existsSync(scrcFile)) {
    fs.writeFileSync(scrcFile, genScrc(appId));
  }

  const bundleConfigFile = path.join(workingDir, 'config.js');
  if (!fs.existsSync(bundleConfigFile)) {
    fs.writeFileSync(bundleConfigFile, genBundleConfig(appId));
  }

  //todo: rename file
  const hostFile = path.join(workingDir, 'westeros.json');
  if (!fs.existsSync(hostFile)) {
    fs.writeFileSync(hostFile, genHostConfig(appId));
  }

  const bundlePackageFile = path.join(workingDir, 'package.json');
  if (!fs.existsSync(bundlePackageFile)) {
    fs.writeFileSync(bundlePackageFile, genBundlePackage(appId));
  }

  const bundleGitIgnoreFile = path.join(workingDir, '.gitignore');
  if (!fs.existsSync(bundleGitIgnoreFile)) {
    cp(path.join(__dirname, '/stuff/gitignore'), bundleGitIgnoreFile);
  }

  const bundleAppsDir = path.join(workingDir, 'app');
  const bundleAppDir = path.join(bundleAppsDir, appId);
  mkdir(bundleAppDir);
  const bundleAppFile = path.join(bundleAppDir, 'app.json');
  if (!fs.existsSync(bundleAppFile)) {
    fs.writeFileSync(bundleAppFile, genBundleApp(appId));
  }

  //app module creation
  const libDir = path.join(workingDir, 'lib');
  mkdir(libDir);

  const appDir = path.join(libDir, `goblin-${appId}`);
  const serviceHandlerFile = path.join(appDir, `${appId}.js`);
  const packageFile = path.join(appDir, 'package.json');
  const configFile = path.join(appDir, 'config.js');
  const appLibDir = path.join(appDir, 'lib');
  const appFile = path.join(appLibDir, 'app.js');
  const entitiesDir = path.join(appDir, 'entities');
  const widgetDir = path.join(appDir, 'widgets');
  const contextDir = path.join(widgetDir, appId);
  mkdir(appLibDir);
  mkdir(entitiesDir);
  mkdir(widgetDir);
  mkdir(contextDir);
  fs.writeFileSync(serviceHandlerFile, genServiceHandler());
  fs.writeFileSync(packageFile, genPackage(appId));
  fs.writeFileSync(configFile, genConfig(appId));
  fs.writeFileSync(appFile, genAppTemplate(appId));
  cp(path.join(__dirname, 'stuff/gitignore'), path.join(appDir, '.gitignore'));
  cp(
    path.join(__dirname, '/stuff/widgets/default/tasks.js'),
    path.join(contextDir, 'task.js')
  );
  spawnSync('npm', ['install', '--prefix', workingDir], {stdio: 'inherit'});
  text(appId);
};