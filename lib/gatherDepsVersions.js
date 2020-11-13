const spawnSync = require('child_process').spawnSync;

//TODO: watt async parallel
const gatherVersion = (pkg) => {
  const r = spawnSync('npm', ['show', pkg, 'version'], {silent: true});
  const version = r.stdout.toString().split('\n')[0];
  return version;
};

const deps = [
  'goblin-client',
  'goblin-desktop',
  'goblin-gadgets',
  'goblin-elasticsearch',
  'goblin-rethink',
  'goblin-warehouse',
  'goblin-workshop',
  'xcraft-core-goblin',
];

module.exports = (pkg) => {
  if (pkg) {
    return gatherVersion(pkg);
  } else {
    console.log(`✨ slowly gather versions...
  
  `);
    return deps.reduce((state, dep) => {
      state[dep] = gatherVersion(dep);
      return state;
    }, {});
  }
};
