module.exports = {
  hello: function (quest, name) {
    const pack = require('../../package.json');
    return {say: `Hello ${name}!`, version: pack.version, author: pack.author};
  },
};
