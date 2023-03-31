const deps = {
  'goblin-builder': '^3.0.0',
  'goblin-client': '^4.0.0',
  'goblin-desktop': '^3.0.0',
  'goblin-gadgets': '^3.0.0',
  'goblin-elasticsearch': '^2.0.0',
  'goblin-rethink': '^2.0.0',
  'goblin-tradingpost': '^2.0.0',
  'goblin-warehouse': '^4.0.0',
  'goblin-workshop': '^3.0.0',
  'xcraft-core-goblin': '^5.0.0',
  'xcraft-dev-fontawesome': '^0.1.0',
  'xcraft-dev-prettier': '^2.0.0',
  'xcraft-dev-rules': '^2.0.0', //v3 will follow core-goblin v6
};

module.exports = (pkg) => {
  if (pkg) {
    return deps[pkg];
  } else {
    return deps;
  }
};
