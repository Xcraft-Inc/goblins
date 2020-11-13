const getStoredInfo = (storeLib) => {
  const {get} = require(`./${storeLib}.js`);
  return get();
};
module.exports = () => {
  const goblins = getStoredInfo('configStore');
  const {currentModule, ...apps} = goblins;
  const scrc = getStoredInfo('scrcManager');
  console.log(`
✨ goblins:

 - current module: ${currentModule}
 - bundle apps :
 ${Object.keys(apps).map((app) => `  * ${app}\n`)}
`);

  console.log(`
✨ startcraft:

${scrc.modules.map((m) => ` * ${m}`).join('\n')}

`);
};
