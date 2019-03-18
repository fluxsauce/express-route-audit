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
const ERA = require('express-route-audit');
```

Choose a storage backend. For transient in-memory storage that will not persist across restarts / processes, use `ERAMemory`.

```js
const ERAMemory = require('express-route-audit/storage/ERAMemory');
```

Initialize ERA with in-memory storage.

```js
const era = new ERA(new ERAMemory()); 
```

Before any routing occurs, include a `middleware` that upon completed requests tallies the number of requests to a given route and method.

```js
// express-route-audit middleware; counts routed requests.
app.use((...args) => era.middleware(...args));
```

Then, given an Express app, a report can be generated on usage.

```js
// Report on route usage.
app.get('/report', (request, response) => response.json(era.report(app)));
```

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
[{"path":"/ping","method":"GET","count":0},{"path":"/hello/:target","method":"GET","count":0},{"path":"/hello","method":"POST","count":0},{"path":"/report","method":"GET","count":0},{"path":"/report","method":"DELETE","count":0}]% 
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
   },
   {  
      "path":"/report",
      "method":"DELETE",
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
[{"path":"/ping","method":"GET","count":3},{"path":"/hello/:target","method":"GET","count":1},{"path":"/hello","method":"POST","count":1},{"path":"/report","method":"GET","count":0},{"path":"/report","method":"DELETE","count":0}]%
# Delete the report.
» curl -X DELETE http://localhost:3000/report
» 
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
      "count":0
   },
   {  
      "path":"/report",
      "method":"DELETE",
      "count":0
   }
]
```

Example server output:

```
» node ./example.js 
listening on 3000
2019-03-18T16:50:17.342Z 'GET' '/report'
2019-03-18T16:50:21.567Z 'GET' '/ping'
2019-03-18T16:50:22.104Z 'GET' '/ping'
2019-03-18T16:50:22.626Z 'GET' '/ping'
2019-03-18T16:50:26.241Z 'GET' '/hello/world'
2019-03-18T16:50:31.809Z 'POST' '/hello'
2019-03-18T16:50:36.978Z 'GET' '/fail'
2019-03-18T16:50:42.197Z 'GET' '/report'
2019-03-18T16:50:47.603Z 'DELETE' '/report'
```
