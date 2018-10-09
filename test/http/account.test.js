const request = require('supertest');
const { app } = require('../../server');

/**
 * Since the account routes are actually set up in a separate module, we don't need to
 * test all the various expectations of all of the account routes. Those tests will be
 * done by the account module itself.
 *
 * Instead, checking the happy-path flow of the simplest route should be enough to know
 * that the routes have been attached and the account module has been initialized.
 */

describe('account routes', () => {
  it('should attach account routes', async () => {
    await request(app).post('/api/logout')
      .expect('Content-Type', /text/)
      .expect(200)
      .expect('OK');
  });
});
