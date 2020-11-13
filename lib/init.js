const {mkdir, cp} = require('xcraft-core-fs');
const spawnSync = require('child_process').spawnSync;
const text = require('./text.js');
const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};
const {tryGenerateFile} = require('./helpers.js');

module.exports = (appId) => {
  appId = jsify(appId).toLowerCase();
  console.log(`✨ initializing ${appId} ✨
  
  `);
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
  const {execSync} = require('child_process');

  const {
    workingDir,
    workingDirName,
    cliFile,
    gitFile,
    readmeFile,
    scrcFile,
    nodeModulesDir,
    hostFile,
    bundleConfigFile,
    bundlePackageFile,
    bundleGitIgnoreFile,
    bundleAppsDir,
    libDir,
  } = require('./treePaths.js');

  if (!fs.existsSync(gitFile)) {
    let gitInitialized;
    try {
      gitInitialized = !!execSync('git init');
    } catch (ex) {
      console.warn('git not in PATH');
    }
    if (gitInitialized) {
      console.log(`git repository for ${appId} initalized`);
    }
  }

  if (fs.existsSync(cliFile)) {
    const content = fs.readFileSync(cliFile);
    let cliInfos;
    let cancel = false;
    try {
      cliInfos = JSON.parse(content);
      if (cliInfos[appId]) {
        cancel = true;
        const cliVersion = cliInfos.cliVersion;
        console.log(
          `${appId} already initialized with goblins CLI v${cliVersion}`
        );
      }
    } catch (ex) {
      cancel = true;
      console.log(
        `bundle seems to be already initialized, with bad ${cliFile}`
      );
    }
    if (cancel) {
      return;
    }
  }

  mkdir(nodeModulesDir);
  //look for bundle files creation
  tryGenerateFile(readmeFile, () => genBundleReadme(appId));

  //FIXME: merge SCRC entries
  tryGenerateFile(scrcFile, () => genScrc(appId));

  tryGenerateFile(bundleConfigFile, () => genBundleConfig(appId));
  tryGenerateFile(hostFile, () => genHostConfig(appId));
  tryGenerateFile(bundlePackageFile, () => genBundlePackage());

  if (!fs.existsSync(bundleGitIgnoreFile)) {
    cp(path.join(__dirname, '/stuff/gitignore'), bundleGitIgnoreFile);
  }

  const bundleAppDir = path.join(bundleAppsDir, appId);
  mkdir(bundleAppDir);
  const bundleAppFile = path.join(bundleAppDir, 'app.json');
  if (!fs.existsSync(bundleAppFile)) {
    fs.writeFileSync(bundleAppFile, genBundleApp(appId));
  }

  //app module creation
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
  const depsVersions = require('./gatherDepsVersions.js')();
  console.dir(depsVersions);
  fs.writeFileSync(packageFile, genPackage(appId, depsVersions));
  fs.writeFileSync(configFile, genConfig(appId));
  fs.writeFileSync(appFile, genAppTemplate(appId));
  cp(path.join(__dirname, 'stuff/gitignore'), path.join(appDir, '.gitignore'));
  cp(
    path.join(__dirname, '/stuff/widgets/default/tasks.js'),
    path.join(contextDir, 'task.js')
  );

  console.log(`
${workingDirName}/
  ├── app                         // bundle app's config dir
  |   └── ${appId}
  |       └── app.json            // your app config file
  ├── config.js                   // bundle xcraft config file
  ├── full-package-lock.json      // startcraft package cache for your bundle
  ├── lib
  |   └── goblin-${appId} (your app main goblin package)
  |       ├── config.js           // app config file
  |       ├── entities            // put here your entity services
  |       ├── ${appId}.js (service file)        
  |       ├── lib                 // contains your goblin's service codebase
  |       |   └── app.js          // service impl. of your main goblin
  |       ├── package.json        // put your goblin dependencies here
  |       └── widgets             // ux/ui dir
  |           └── ${appId} (default app context)
  |               └── task.js     // goblin-desktop task launcher file
  ├── node_modules                // you must recognise this dir
  ├── package.json                // bundle package.json
  ├── README.md                   // waiting your attention
  └── westeros.json               // framework config file
  `);

  console.log(`installing...`);
  spawnSync('npm', ['install', '--prefix', workingDir], {silent: true});
  const configStore = require('./configStore.js');
  configStore.merge({currentModule: appId, [appId]: {}});
  text(`${appId} ready!`);
};
