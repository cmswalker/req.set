var request = require('supertest');

describe('loading express', function() {
  var server;

  beforeEach(function() {
    server = require('../test-server/bin/www');
  });

  afterEach(function() {
    server.close();
  });

  context('Extending Request', function() {
    // NOTE: Assertions are found in server/app.js

    it('Adds req.set() and ensures backwards compatibilty with req.get()', function testSlash(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });
});
