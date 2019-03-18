const API = require('./API');

module.exports = class ERAMemory extends API {
  get(key) {
    let count = this.pathMethodCounts[key];
    if (count === undefined) {
      count = 0;
    }
    return count;
  }

  set(key, value) {
    this.pathMethodCounts[key] = value;
  }

  clear() {
    this.pathMethodCounts = {};
  }
};
