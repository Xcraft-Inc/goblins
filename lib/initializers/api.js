const {tryGenerateFile} = require('../helpers.js');
const {mkdir, cp} = require('xcraft-core-fs');
const path = require('path');
const fs = require('fs');
const {
  bundleAppsDir,
  bundlePackageFile,
  libDir,
  launchFile,
} = require('../treePaths.js');

module.exports = (appId, noInstall) => {
  const depsVersions = require('../gatherDepsVersions.js')();
  console.log(`⚗️  initializing ${appId} API...`);
  const {
    genAPIAppTemplate,
    genAPIBundleApp,
    genAPIBundlePackage,
    genAPIPackage,
    genAPIConfig,
    genAPIService,
    genServiceHandler,
    genAPICodeLauncher,
  } = require('../generators.js');
  const initBundle = require('./bundle.js');
  const userName = initBundle(appId);

  const bundleAppDir = path.join(bundleAppsDir, appId);
  const bundleAppFile = path.join(bundleAppDir, 'app.json');
  if (!fs.existsSync(bundleAppFile)) {
    fs.writeFileSync(bundleAppFile, genAPIBundleApp(appId));
  }

  //app module creation
  const appDir = path.join(libDir, `goblin-${appId}`);
  const serviceHandlerFile = path.join(appDir, `${appId}.js`);
  const packageFile = path.join(appDir, 'package.json');
  const configFile = path.join(appDir, 'config.js');
  const appLibDir = path.join(appDir, 'lib');
  const apiServiceFile = path.join(appDir, `${appId}-api.js`);
  const appFile = path.join(appLibDir, 'app.js');
  const apiDir = path.join(appLibDir, 'api');

  mkdir(appLibDir);

  tryGenerateFile(launchFile, genAPICodeLauncher(appId));
  fs.writeFileSync(serviceHandlerFile, genServiceHandler());
  fs.writeFileSync(packageFile, genAPIPackage(appId, depsVersions, userName));
  fs.writeFileSync(configFile, genAPIConfig(appId));
  fs.writeFileSync(appFile, genAPIAppTemplate(appId));
  fs.writeFileSync(apiServiceFile, genAPIService(appId));
  cp(
    path.join(__dirname, '../stuff/gitignore'),
    path.join(appDir, '.gitignore')
  );
  mkdir(apiDir);
  cp(
    path.join(__dirname, '../stuff/api/controllers.js'),
    path.join(apiDir, 'controllers.js')
  );
  cp(
    path.join(__dirname, '../stuff/api/schema.js'),
    path.join(apiDir, 'schema.js')
  );
  tryGenerateFile(
    bundlePackageFile,
    genAPIBundlePackage(depsVersions, userName)
  );
  const install = require('../install.js');
  install(appId, noInstall, 'genApiBundlePackage', userName);
};
