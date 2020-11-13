const fs = require('fs');

const tryGenerateFile = (path, content) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
  }
};

module.exports = {tryGenerateFile};
