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
 * Middleware
 *
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function middleware(request, response, next) {
  response.on('finish', () => {
    if (request.route && request.route.path) {
      const key = generateKey(request.route.path, request.method);
      let count = pathMethodCounts.get(key);
      if (!count) {
        count = 0;
      }
      pathMethodCounts.set(key, count + 1);
    }
  });
  next();
}

function report(app) {
  const routes = [];
  Object.keys(app._router.stack).forEach((key) => {
    if (!app._router.stack[key].route) { // eslint-disable-line no-underscore-dangle
      return;
    }
    const routerMiddleware = app._router.stack[key]; // eslint-disable-line no-underscore-dangle
    console.log(routerMiddleware);
    const { route: { path } } = routerMiddleware;
    const { route: { stack: [{ method }] } } = routerMiddleware;
    let count = pathMethodCounts.get(generateKey(path, method));
    if (!count) {
      count = 0;
    }

    routes.push({
      path,
      method,
      count,
    });
  });
  return routes;
}

module.exports = {
  generateKey,
  middleware,
  report,
};
