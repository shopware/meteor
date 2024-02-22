// eslint-disable-next-line no-undef
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  process(filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
