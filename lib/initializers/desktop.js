const {mkdir, cp} = require('xcraft-core-fs');
const path = require('path');
const fs = require('fs-extra');
const {tryGenerateFile} = require('../helpers.js');
const configStore = require('../goblinsConfig.js');

module.exports = (appId, noInstall) => {
  const depsVersions = require('../gatherDepsVersions.js')();
  console.log(`⚗️  initializing ${appId} desktop app...`);
  const {
    genDesktopAppTemplate,
    genDesktopBundleApp,
    genDesktopBundlePackage,
    genDesktopPackage,
    genPortalApp,
    genThrallApp,
    genDesktopConfig,
    genServiceHandler,
    genDesktopCodeLauncher,
  } = require('../generators.js');

  const {
    workingDirName,
    bundleAppsDir,
    bundlePackageFile,
    libDir,
    launchFile,
  } = require('../treePaths.js');

  const initBundle = require('./bundle.js');
  const userName = initBundle(appId);

  const bundleAppDir = path.join(bundleAppsDir, appId);
  const bundleAppFile = path.join(bundleAppDir, 'app.json');
  if (!fs.existsSync(bundleAppFile)) {
    fs.writeFileSync(bundleAppFile, genDesktopBundleApp(appId));
  }

  const portalAppDir = path.join(bundleAppsDir, `${appId}-portal`);
  mkdir(portalAppDir);
  const portalAppFile = path.join(portalAppDir, 'app.json');
  if (!fs.existsSync(portalAppFile)) {
    fs.writeFileSync(portalAppFile, genPortalApp(appId));
  }

  const thrallAppDir = path.join(bundleAppsDir, `${appId}-thrall`);
  mkdir(thrallAppDir);
  const thrallAppFile = path.join(thrallAppDir, 'app.json');
  if (!fs.existsSync(thrallAppFile)) {
    fs.writeFileSync(thrallAppFile, genThrallApp(appId));
  }

  //app module creation
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

  tryGenerateFile(launchFile, genDesktopCodeLauncher(appId));
  fs.writeFileSync(serviceHandlerFile, genServiceHandler());
  fs.writeFileSync(
    packageFile,
    genDesktopPackage(appId, depsVersions, userName)
  );
  fs.writeFileSync(configFile, genDesktopConfig(appId));
  fs.writeFileSync(appFile, genDesktopAppTemplate(appId));
  cp(
    path.join(__dirname, '../stuff/gitignore'),
    path.join(appDir, '.gitignore')
  );
  cp(
    path.join(__dirname, '../stuff/widgets/default/tasks.js'),
    path.join(contextDir, 'tasks.js')
  );

  console.log(`
✨ ${workingDirName}
  ├── app                         // bundle app's config dir
  │    └── ${appId}
  │        └── app.json            // your app config file
  ├── config.js                   // bundle xcraft config file
  ├── package-lock.json
  ├── lib
  │    └── goblin-${appId} (your app main goblin package)
  │        ├── config.js           // app config file
  │        ├── entities            // put here your entity services
  │        ├── ${appId}.js (service file)        
  │        ├── lib                 // contains your goblin's service codebase
  │        │   └── app.js          // service impl. of your main goblin
  │        ├── package.json        // put your goblin dependencies here
  │        └── widgets             // ux/ui dir
  │            └── ${appId} (default app context)
  │                └── task.js     // goblin-desktop task launcher file
  ├── node_modules                // you must recognise this dir
  ├── package.json                // bundle package.json
  ├── README.md                   // waiting your attention
  └── goblins.json               // framework config file
  `);

  tryGenerateFile(
    bundlePackageFile,
    genDesktopBundlePackage(
      configStore.get('electronVersion'),
      configStore.get('reactVersion'),
      configStore.get('reactDomVersion'),
      depsVersions,
      null,
      userName
    )
  );
  const install = require('../install.js');
  install(appId, noInstall, 'genDesktopBundlePackage', userName);
};
