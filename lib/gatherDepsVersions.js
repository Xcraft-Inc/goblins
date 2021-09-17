const deps = {
  'goblin-builder': '^2.0.0',
  'goblin-client': '^2.0.0',
  'goblin-desktop': '^2.0.0',
  'goblin-gadgets': '^2.0.0',
  'goblin-elasticsearch': '^2.0.0',
  'goblin-rethink': '^2.0.0',
  'goblin-warehouse': '^2.0.0',
  'goblin-workshop': '^2.0.0',
  'xcraft-core-goblin': '^5.0.0',
  'xcraft-dev-fontawesome': '^0.1.0',
  'xcraft-dev-prettier': '^2.0.0',
  'xcraft-dev-rules': '^3.0.0',
};

module.exports = (pkg) => {
  if (pkg) {
    return deps[pkg];
  } else {
    console.log(`✨ gather versions...
  
  `);
    return deps;
  }
};
