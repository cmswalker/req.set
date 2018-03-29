# req.set() :pushpin:

## Set request headers like response headers in [Express](https://expressjs.com/)

### Compatible with any node version running Express

## Why does this matter?
Updating request headers directly in express isn't supported in the same manner as [res.set()](https://expressjs.com/en/api.html#res.set)

For example, you lose the ability to fetch those headers in a case-insensitive manner such as with [req.get()](https://expressjs.com/en/api.html#req.get)

```js
req.headers['Content-Type'] = 'application/json';
req.get('content-type') // => undefined
```

## Usage
It uses the same API as `res.set()`

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

  // Compatible with req.get(), case-insensitive
  req.get('foo'); // => 1
  req.get('bar'); // => 2
  req.get('baz'); // => 100

  // Calls the origina req.get() under the API, so built-in express helpers work
  req.get('referer')  // => github.com
  req.get('Referer')  // => github.com
  req.get('referrer') // => github.com
  req.get('Referrer') // => github.com
});
```

```js
// If an object is passed, it will be stringified

req.set('object', { complex: true });
req.get('object') // => '{"complex":true}'
```

## There's also a middleware for one-time application use so each request is extended with .set()

```js
var reqSet = require('req.set');
app.use(reqSet.middleware);
```