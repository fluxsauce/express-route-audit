/**
 * express-route-audit - Audit declared Express routes with usage data.
 * Copyright (C) 2019  Jon Peck
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const listEndpoints = require('express-list-endpoints');

module.exports = class ERA {
  constructor(value) {
    // todo: validate;
    this.storage = value;
  }

  /**
   * Given a route and method, generate a key used for lookups.
   *
   * @param {string} route - Express route
   * @param {string} method - HTTP method
   * @return {string} normalized key
   */
  static generateKey(route, method) {
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
   * @param {Object} request - Express request object
   * @param {Object} response - Express response object
   * @param {Function} next - Express next middleware function
   * @return {*} next
   */
  middleware(request, response, next) {
    response.on('finish', () => {
      if (request.route && request.route.path) {
        const key = ERA.generateKey(request.route.path, request.method);
        this.storage.get(key)
          .then(value => this.storage.set(key, value + 1))
          .catch(error => next(error));
      }
    });
    return next();
  }

  /**
   * Parse an Express app and combine with path/method counts to produce a consumable report.
   *
   * @param {Object} app - express app
   * @return {Promise<Array>} objects containing count, method and path
   */
  report(app) {
    const routes = [];

    const promises = [];

    listEndpoints(app).forEach((endpoint) => {
      endpoint.methods.forEach((method) => {
        const { path } = endpoint;
        const key = ERA.generateKey(path, method);
        routes.push({
          path,
          method,
        });

        promises.push(this.storage.get(key));
      });
    });

    return Promise.all(promises)
      .then((counts) => {
        routes.forEach((value, index) => {
          routes[index].count = counts[index];
        });
        // Highest counts first.
        routes.sort((a, b) => {
          if (a.count > b.count) {
            return -1;
          }
          return (a.count < b.count) ? 1 : 0;
        });
        return routes;
      });
  }
};
