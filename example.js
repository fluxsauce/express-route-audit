const http = require('http');
const bodyParser = require('body-parser'); // eslint-disable-line import/no-extraneous-dependencies
const express = require('express'); // eslint-disable-line import/no-extraneous-dependencies
const era = require('./index');

// Initialize Express.
const app = express();

// Logger.
app.use((request, response, next) => {
  console.log(new Date(), request.method, request.path); // eslint-disable-line no-console
  next();
});

// express-route-audit middleware; counts routed requests.
app.use(era.middleware);

// Router.
const router = new express.Router({});
router.route('/ping').get((request, response) => response.send('PONG'));
router.route('/hello/:target').get((request, response) => response.send(request.params.target));
app.use(router);

// No router; POST method.
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/hello', (request, response) => response.send(request.body));

// Report on route usage.
app.get('/report', (request, response) => response.json(era.report(app)));

// 404
app.use((request, response) => response.sendStatus(404));

// Start server.
const server = http.createServer(app);
const port = 3000;

server.listen(port);

server.on('listening', () => {
  console.log(`listening on ${port}`); // eslint-disable-line no-console
});
