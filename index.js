const listEndpoints = require('express-list-endpoints')

let pathMethodCounts;
if (pathMethodCounts === undefined) {
  pathMethodCounts = new Map();
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

/**
 * Middleware that records the route paths upon a finished request.
 *
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 * @return {*} next
 */
function middleware(request, response, next) {
  response.on('finish', () => {
    if (request.route && request.route.path) {
      const key = generateKey(request.route.path, request.method);
      const count = pathMethodCounts.get(key) || 0;
      pathMethodCounts.set(key, count + 1);
    }
  });
  return next();
}

function report(app) {
  const routes = [];
  listEndpoints(app).forEach((endpoint) => {
    endpoint.methods.forEach((method) => {
      const { path } = endpoint;
      const key = generateKey(path, method);
      const count = pathMethodCounts.get(key) || 0;
      routes.push({
        path,
        method,
        count,
      });
    });
  });
  routes.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    return (a.count < b.count) ? 1 : 0;
  });
  return routes;
}

module.exports = {
  generateKey,
  middleware,
  report,
};
