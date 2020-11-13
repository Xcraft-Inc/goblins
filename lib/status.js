const displayStoreInfo = (storeLib) => {
  const {get} = require(`./${storeLib}.js`);
  console.dir(get());
};
module.exports = () => {
  console.log(`
✨ goblins config:`);
  displayStoreInfo('configStore');
  console.log(`
✨ startcraft config: `);
  displayStoreInfo('scrcManager');
};
