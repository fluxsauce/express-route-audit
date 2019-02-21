let aggregator;
if (aggregator === undefined) {
  aggregator = new Map();
}

/**
 * Given a route and method, generate a key used for lookups.
 *
 * @param {string} route - Express route
 * @param {string} method - HTTP method
 * @return {string} normalized key
 */
function generateKey(route, method) {
  if (!route || typeof route !== 'string') {
    throw new TypeError('generateKey: invalid route!');
  }
  if (!method || typeof method !== 'string') {
    throw new TypeError('generateKey: invalid method!');
  }
  return `${route.toLowerCase()}|${method.toLowerCase()}`;
}

module.exports = {
  generateKey,
};
