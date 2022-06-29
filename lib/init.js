module.exports = (initializer, appId, noInstall) => {
  const path = require('path');
  const {peaceful, jsify, sanitize} = require('./helpers.js');
  appId = jsify(sanitize(appId));
  let initScript;
  try {
    if (!peaceful(initializer, path.join(__dirname, '/initializers/'))) {
      console.log(`👎 don't trick me like that`);
      return;
    }
    initScript = require(`./initializers/${initializer}.js`);
  } catch (ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      const fs = require('fs-extra');
      const initializers = fs
        .readdirSync(path.join(__dirname, '/initializers/'))
        .map(
          (f) =>
            ` - ${f.replace(path.extname(f), '')} ${
              f === 'desktop.js' ? '(default)' : ''
            }`
        )
        .join('\n');
      console.log(`👎 Invalid initializer provided (${initializer}), try:`);
      console.log(initializers);
      console.log(`ex: goblins init ${appId} api`);
      return;
    }
  }
  console.log(`✨ #I've got what you need!`);
  initScript(appId, noInstall);
};
