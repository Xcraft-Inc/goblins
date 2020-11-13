module.exports = (goblinModule) => {
  const path = require('path');
  const fs = require('fs');
  const {workingDir, cliFile} = require('./treePaths.js');

  if (!fs.existsSync(cliFile)) {
    console.warn(
      `Cannot select a crafting package/module in an uninitialized bundle`
    );
  }

  const moduleDir = path.join(workingDir, 'lib', goblinModule);
  if (!fs.existsSync(moduleDir)) {
    console.error(`Module not found: /${goblinModule} in ${workingDir}
    
    use:
    goblins craft module ${goblinModule}`);
    return;
  }
  const configStore = require('./configStore.js');
  configStore.merge({currentModule: goblinModule});
  console.log(
    `✨ Successfully selected ${goblinModule} as default crafting package/module`
  );
};
