module.exports = (codeName) => {
  const [department, code, os] = codeName.toLowerCase().split('-');

  const path = require('path');
  let registry;
  try {
    registry = require(path.join(
      __dirname,
      'procedures',
      department,
      'registry.js'
    ));
  } catch {
    console.error(`Cannot apply procedure ${codeName}: not found`);
    return;
  }

  const proc = registry[code];
  if (!proc) {
    console.error(`Procedure: ${code} not found in registry`);
    return;
  }
  console.log(`✨ ${codeName}:`);
  proc(codeName, os);
};
