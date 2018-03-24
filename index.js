var uniq = require('lodash.uniq');

var DOCS_LINK = 'https://github.com/cmswalker/req.set';

var getType = function(val) {
  return Object.prototype.toString.call(val);
}
var isString = function(val) {
  return getType(val) === '[object String]';
}
var isObjectLiteral = function(val) {
  return getType(val) === '[object Object]';
}

function extend(req) {
  req.set = function() {
    var obj;

    switch (arguments.length) {
      case 0:
        throw new Error('must provide either object or strings to req.set() see: ' + DOCS_LINK);
        break;

      case 1:
        obj = arguments[0];
        if (!isObjectLiteral(obj)) {
          throw new Error('Must provide object to req.set() with Arity of 1 see: ' + DOCS_LINK);
        }
        break;

      case 2:
        var key = arguments[0];
        var val = arguments[1];

        if (!isString(key)) {
          throw new Error('Must provide first argument as string (key, value) to req.set() with Arity of 2 see: ' + DOCS_LINK);
        }

        obj = {};
        obj[key] = val;
        break;

      default:
        throw new Error('Improper user of req.get() see: ', + DOCS_LINK);
    }

    var lowercasedObj = Object.keys(obj).reduce(function(result, key) {
      var lowered = key.toLowerCase();
      var value = obj[key];

      if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean') {
        value = JSON.stringify(value);
      }

      result[lowered] = value;
      return result;
    }, {});

    var headerKeys = Object.keys(lowercasedObj);

    // update raw headers
    Array.prototype.push.apply(req.rawHeaders, headerKeys);
    var uniqueHeaders = uniq(req.rawHeaders);
    req.rawHeaders = uniqueHeaders;

    // update headers
    Object.assign(req.headers, lowercasedObj);
  };

  // update the headers reference for req.get()
  var originalGet = req.get;
  req.get = function(headerName) {
    var attempt = originalGet.call(req, headerName);

    // x '==' null catches null and undefined
    if (attempt != null) {
      return attempt;
    }

    return req.headers[headerName.toLowerCase()];
  };
}

module.exports = {
  extend,
  middleware: function (req, res, next) {
    extend(req);
    next();
  }
}