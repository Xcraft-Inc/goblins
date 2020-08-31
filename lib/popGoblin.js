const { mkdir, cp } = require("xcraft-core-fs");
const spawnSync = require("child_process").spawnSync;
const clc = require("cli-color");
const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};

const {
  genScrc,
  genAppTemplate,
  genPackage,
  genHostConfig,
  genBundleApp,
  genBundlePackage,
  genBundleReadme,
  genConfig,
  genServiceHandler,
  genConfigJs,
} = require("./generators.js");
const path = require("path");
const fs = require("fs");

let appId = process.argv[2];
if (!appId) {
  console.error("Please provide an appId: npx pop-goblin <appId>");
  process.exit(1);
}
appId = jsify(appId);

const workingDir = process.env.PWD;
mkdir(path.join(workingDir, "node_modules"));
//look for bundle files creation
const readmeFile = path.join(workingDir, "README.md");
if (!fs.existsSync(readmeFile)) {
  fs.writeFileSync(readmeFile, genBundleReadme(appId));
}

const scrcFile = path.join(workingDir, ".scrc");
if (!fs.existsSync(scrcFile)) {
  fs.writeFileSync(scrcFile, genScrc(appId));
}

//todo: rename file
const hostFile = path.join(workingDir, "westeros.json");
if (!fs.existsSync(hostFile)) {
  fs.writeFileSync(hostFile, genHostConfig(appId));
}

const bundleConfigFile = path.join(workingDir, "config.js");
if (!fs.existsSync(bundleConfigFile)) {
  fs.writeFileSync(bundleConfigFile, genConfigJs(appId));
}

const bundlePackageFile = path.join(workingDir, "package.json");
if (!fs.existsSync(bundlePackageFile)) {
  fs.writeFileSync(bundlePackageFile, genBundlePackage(appId));
}

const bundleGitIgnoreFile = path.join(workingDir, ".gitignore");
if (!fs.existsSync(bundleGitIgnoreFile)) {
  cp(path.join(__dirname, "/stuff/gitignore"), bundleGitIgnoreFile);
}

const bundleAppsDir = path.join(workingDir, "app");
const bundleAppDir = path.join(bundleAppsDir, appId);
mkdir(bundleAppDir);
const bundleAppFile = path.join(bundleAppDir, "app.json");
if (!fs.existsSync(bundleAppFile)) {
  fs.writeFileSync(bundleAppFile, genBundleApp(appId));
}

//app module creation
const libDir = path.join(workingDir, "lib");
mkdir(libDir);

const appDir = path.join(libDir, `goblin-${appId}`);
console.log(`Creating app in ${appDir}...`);
const serviceHandlerFile = path.join(appDir, `${appId}.js`);
const packageFile = path.join(appDir, "package.json");
const configFile = path.join(appDir, "config.js");
const appLibDir = path.join(appDir, "lib");
const appFile = path.join(appLibDir, "app.js");
const entitiesDir = path.join(appDir, "entities");
const widgetDir = path.join(appDir, "widgets");
const contextDir = path.join(widgetDir, appId);
mkdir(appLibDir);
mkdir(entitiesDir);
mkdir(widgetDir);
mkdir(contextDir);
fs.writeFileSync(serviceHandlerFile, genServiceHandler(appId));
fs.writeFileSync(packageFile, genPackage(appId));
fs.writeFileSync(configFile, genConfig(appId));
fs.writeFileSync(appFile, genAppTemplate(appId));
cp(path.join(__dirname, "stuff/gitignore"), path.join(appDir, ".gitignore"));
cp(
  path.join(__dirname, "/stuff/widgets/default/tasks.js"),
  path.join(contextDir, "task.js")
);
console.log(`Creating app in ${appDir}...[DONE]`);
console.log(`Installing app in ${workingDir}...`);
spawnSync("npm", ["install", "--prefix", workingDir], { stdio: "inherit" });
