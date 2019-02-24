# express-route-audit

Audit declared [Express](https://expressjs.com/) routes with usage data.

## Why

When maintaining an application, it can be useful to know what routes and methods are being used. Let the application gather usage statistics, then generate a report that lists each unique route, method and count for that combination.

## How

Install the module.

```bash
npm install express-route-audit
```

Add to your Express application.

```js
const era = require('express-route-audit');
```

Before any routing occurs, include a `middleware` that upon completed requests tallies the number of requests to a given route and method.

```js
// express-route-audit middleware; counts routed requests.
app.use(era.middleware);
```

Then, given an Express app, a report can be generated on usage.

```js
// Report on route usage.
app.get('/report', (request, response) => response.json(era.report(app)));
```

The counts are stored in memory, so a server restart will reset all counts.

The output is compatible with [json2csv](https://www.npmjs.com/package/json2csv) if JSON isn't convenient.

## Example

```bash
git clone https://github.com/fluxsauce/express-route-audit.git
cd express-route-audit
npm install
node ./example.js
```

Then, in a new terminal:

```bash
# Get the report; the count for the report route will be 0 as it only increments after the request is complete.
» curl http://localhost:3000/report
[{"path":"/ping","method":"GET","count":0},{"path":"/hello/:target","method":"GET","count":0},{"path":"/hello","method":"POST","count":0},{"path":"/report","method":"GET","count":0}]% 
```

Formatted:

```json
[  
   {  
      "path":"/ping",
      "method":"GET",
      "count":0
   },
   {  
      "path":"/hello/:target",
      "method":"GET",
      "count":0
   },
   {  
      "path":"/hello",
      "method":"POST",
      "count":0
   },
   {  
      "path":"/report",
      "method":"GET",
      "count":0
   }
]

```

```bash
# Make some requests to populate the stats.
» curl http://localhost:3000/ping
PONG%                                                                                                     
» curl http://localhost:3000/ping
PONG%
» curl http://localhost:3000/ping
PONG%
» curl http://localhost:3000/hello/world
world%
» curl -d "foo=bar&fizz=buzz" -X POST http://localhost:3000/hello
{"foo":"bar","fizz":"buzz"}%
» curl http://localhost:3000/fail
Not Found%
» curl http://localhost:3000/report
[{"path":"/ping","method":"GET","count":3},{"path":"/hello/:target","method":"GET","count":1},{"path":"/hello","method":"POST","count":1},{"path":"/report","method":"GET","count":1}]% 
```

Formatted:

```json
[  
   {  
      "path":"/ping",
      "method":"GET",
      "count":3
   },
   {  
      "path":"/hello/:target",
      "method":"GET",
      "count":1
   },
   {  
      "path":"/hello",
      "method":"POST",
      "count":1
   },
   {  
      "path":"/report",
      "method":"GET",
      "count":1
   }
]
```

Example server output:

```
» node ./example.js 
listening on 3000
2019-02-22T23:52:26.777Z 'GET' '/report'
2019-02-22T23:52:35.267Z 'GET' '/ping'
2019-02-22T23:52:37.098Z 'GET' '/ping'
2019-02-22T23:52:37.698Z 'GET' '/ping'
2019-02-22T23:52:41.728Z 'GET' '/hello/world'
2019-02-22T23:52:46.730Z 'POST' '/hello'
2019-02-22T23:52:51.304Z 'GET' '/fail'
2019-02-22T23:52:55.242Z 'GET' '/report'
```
