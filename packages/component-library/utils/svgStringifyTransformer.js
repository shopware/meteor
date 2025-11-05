// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

 
module.exports = {
  process(filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
