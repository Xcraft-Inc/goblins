const fs = require('fs');

const tryGenerateFile = (path, generateContentFunction) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, generateContentFunction());
  }
};

module.exports = {tryGenerateFile};
