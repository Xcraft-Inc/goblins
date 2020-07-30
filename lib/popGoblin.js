const { mkdir, cp } = require("xcraft-core-fs");
const jsify = (str) => {
  return str.replace(/-([a-z])/g, (m, g1) => g1.toUpperCase());
};

const {
  genAppTemplate,
  genPackage,
  genConfig,
  genServiceHandler,
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
const appDir = path.join(workingDir, appId);
console.log(`Creating app in ${appDir}...`);
const serviceHandlerFile = path.join(appDir, `${appId}.js`);
const packageFile = path.join(appDir, "package.json");
const configFile = path.join(appDir, "config.js");
const libDir = path.join(appDir, "lib");
const appFile = path.join(libDir, "app.js");
const entitiesDir = path.join(appDir, "entities");
const widgetDir = path.join(appDir, "widgets");
const contextDir = path.join(widgetDir, appId);

mkdir(libDir);
mkdir(entitiesDir);
mkdir(widgetDir);
mkdir(contextDir);
fs.writeFileSync(serviceHandlerFile, genServiceHandler(appId));
fs.writeFileSync(packageFile, genPackage(appId));
fs.writeFileSync(configFile, genConfig(appId));
fs.writeFileSync(appFile, genAppTemplate(appId));
cp(path.join(__dirname, "stuff/gitignore"), path.join(appDir, ".gitignore"));
cp(path.join(__dirname, "/stuff/eslintrc"), path.join(appDir, ".eslintrc.js"));
cp(
  path.join(__dirname, "/stuff/editorconfig"),
  path.join(appDir, ".editorconfig")
);
cp(
  path.join(__dirname, "/stuff/widgets/default/tasks.js"),
  path.join(contextDir, "task.js")
);
console.log(`Creating app in ${appDir}...[DONE]`);
