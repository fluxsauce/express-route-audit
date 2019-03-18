const API = require('./API');

module.exports = class ERARedis extends API {
  constructor(value, prefix) {
    super();
    this.client = value;
    this.prefix = prefix;
  }

  get(key) {
    return this.client.get(key)
      .then((value) => {
        if (!value) {
          return 0;
        }
        return parseInt(value, 10);
      });
  }

  set(key, value) {
    return this.client.set(key, value);
  }

  clear() {
    return this.client.keys(`${this.prefix}:*`).then((keys) => {
      const pipeline = this.client.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      return pipeline.exec();
    });
  }
};
