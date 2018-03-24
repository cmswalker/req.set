# req.set()

Set request headers like response headers in Express

```js
var reqSet = require('req.set');

app.use((req, res, next) => {
  // extend req
  reqSet.extend(req);

  // object api
  req.set({
    'foo': 1,
    'Bar': 2
  });

  // string api
  req.set('baz', 100);

  // Compatible with req.get()
  req.get('foo'); // => 1
  req.get('bar'); // => 2
  req.get('baz'); // => 100
});
```

```js
// If an object is passed, it will be stringified

req.set('object', { complex: true });
req.get('object') // => '{"complex":true}'
```

There's also a middleware for one-time application use so each request is extended with .set()

```js
var reqSet = require('req.set');
app.use(reqSet.middleware);
```