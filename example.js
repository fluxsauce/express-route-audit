const http = require('http');
const bodyParser = require('body-parser'); // eslint-disable-line import/no-extraneous-dependencies
const express = require('express'); // eslint-disable-line import/no-extraneous-dependencies
const ERA = require('./index');
const ERAMemory = require('./storage/ERAMemory');

// Initialize ERA with in-memory storage.
const era = new ERA(new ERAMemory());

// Initialize Express.
const app = express();

// Logger.
app.use((request, response, next) => {
  console.log(new Date(), request.method, request.path); // eslint-disable-line no-console
  next();
});

// express-route-audit middleware; counts routed requests.
app.use((...args) => era.middleware(...args));

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

// Clear report.
app.delete('/report', (request, response) => {
  era.storage.clear();
  return response.sendStatus(204);
});

// 404
app.use((request, response) => response.sendStatus(404));

// Start server.
const server = http.createServer(app);
const port = 3000;

server.listen(port);

server.on('listening', () => {
  console.log(`listening on ${port}`); // eslint-disable-line no-console
});
