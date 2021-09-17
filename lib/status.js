const getStoredInfo = (storeLib) => {
  const {get} = require(`./${storeLib}.js`);
  return get();
};
module.exports = () => {
  const goblins = getStoredInfo('goblinsConfig');
  const {
    currentModule,
    electronVersion,
    reactVersion,
    reactDomVersion,
    ...apps
  } = goblins;
  console.log(`
✨ goblins:

 - bundle apps:
 ${Object.keys(apps).map((app) => `  * ${app}\n`)}
 - current module: ${currentModule}

 - electron: ${electronVersion}
 - react: ${reactVersion}
 - react-dom: ${reactDomVersion}
 
`);
};
