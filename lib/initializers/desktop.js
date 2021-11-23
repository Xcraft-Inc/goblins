const {mkdir, cp, lsdir} = require('xcraft-core-fs');
const configStore = require('../goblinsConfig.js');
const spawnSync = require('child_process').spawnSync;

const {generateFile, tryGenerateFile, jsify} = require('../helpers.js');

module.exports = (appId, noInstall) => {
  const depsVersions = require('../gatherDepsVersions.js')();
  appId = jsify(appId);
  console.log(`✨ initializing ${appId} #I've got what you need!

  `);
  const {
    genAppTemplate,
    genPackage,
    genHostConfig,
    genBundleApp,
    genPortalApp,
    genThrallApp,
    genBundleConfig,
    genBundlePackage,
    genBundleReadme,
    genConfig,
    genServiceHandler,
    genCodeLauncher,
  } = require('../generators.js');
  const path = require('path');
  const fs = require('fs');
  const {execSync} = require('child_process');

  const {
    workingDir,
    workingDirName,
    cliFile,
    gitFile,
    readmeFile,
    launchFile,
    ideDir,
    nodeModulesDir,
    hostFile,
    bundleConfigFile,
    bundlePackageFile,
    bundleGitIgnoreFile,
    bundleAppsDir,
    libDir,
  } = require('../treePaths.js');

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
        const cliVersion = cliInfos[appId].cliVersion;
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
  mkdir(ideDir);
  tryGenerateFile(launchFile, genCodeLauncher(appId));
  //look for bundle files creation
  tryGenerateFile(readmeFile, genBundleReadme(appId));

  tryGenerateFile(bundleConfigFile, genBundleConfig(appId));
  tryGenerateFile(hostFile, genHostConfig(appId));
  tryGenerateFile(
    bundlePackageFile,
    genBundlePackage(
      configStore.get('electronVersion'),
      configStore.get('reactVersion'),
      configStore.get('reactDomVersion'),
      depsVersions
    )
  );

  if (!fs.existsSync(bundleGitIgnoreFile)) {
    cp(path.join(__dirname, '../stuff/gitignore'), bundleGitIgnoreFile);
  }

  const bundleAppDir = path.join(bundleAppsDir, appId);
  mkdir(bundleAppDir);
  const bundleAppFile = path.join(bundleAppDir, 'app.json');
  if (!fs.existsSync(bundleAppFile)) {
    fs.writeFileSync(bundleAppFile, genBundleApp(appId));
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
  fs.writeFileSync(packageFile, genPackage(appId, depsVersions));
  fs.writeFileSync(configFile, genConfig(appId));
  fs.writeFileSync(appFile, genAppTemplate(appId));
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

  if (!noInstall) {
    console.log(`✨ installing, please wait... #Keep it real`);
    spawnSync('npm', ['install'], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
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
      genBundlePackage(
        configStore.get('electronVersion'),
        configStore.get('reactVersion'),
        configStore.get('reactDomVersion'),
        depsVersions,
        additionnalDeps.slice(1, -1) + ','
      )
    );
    console.log(`✨ installing dev dependencies, please wait...`);
    spawnSync('npm', ['install'], {
      cwd: workingDir,
      shell: true,
      silent: false,
    });
  } else {
    console.log(`✨ skipped npm install #I HAVE NO TIME FOR THIS!`);
  }

  configStore.merge({
    currentModule: `goblin-${appId}`,
    [appId]: {cliVersion: require('../../package.json').version},
  });
  console.log(`✨ #I got a long day, kid.`);
};
