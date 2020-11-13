const fs = require('fs');

const tryGenerateFile = (path, content) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
  }
};

const getOrCreateConfigFile = (filePath, initialState) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    let object;
    try {
      object = JSON.parse(content);
    } catch (ex) {
      console.log(`error during ${filePath} JSON parsing`);
      return null;
    }
    return object;
  } else {
    fs.writeFileSync(filePath, JSON.stringify(initialState));
    return initialState;
  }
};

module.exports = {tryGenerateFile, getOrCreateConfigFile};
