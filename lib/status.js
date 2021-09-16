const getStoredInfo = (storeLib) => {
  const {get} = require(`./${storeLib}.js`);
  return get();
};
module.exports = () => {
  const goblins = getStoredInfo('configStore');
  const {currentModule, ...apps} = goblins;
  console.log(`
✨ goblins:

 - current module: ${currentModule}
 - bundle apps :
 ${Object.keys(apps).map((app) => `  * ${app}\n`)}
`);
};
