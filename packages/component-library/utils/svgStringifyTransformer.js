// eslint-disable-next-line no-undef, @typescript-eslint/no-require-imports
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  process(filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
