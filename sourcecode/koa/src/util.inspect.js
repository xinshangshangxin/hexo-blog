const util = require('util');

let obj = {
  toJSON() {
    return {
      key: 'toJSON',
    };
  },
  inspect() {
    return this.toJSON();
  },
};

obj[util.inspect.custom] = function (depth, options) {
  return { bar: 'baz' };
};

console.info(util.inspect(obj));
