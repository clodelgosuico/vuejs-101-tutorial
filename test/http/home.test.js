const request = require('supertest');
const { app } = require('../../server');

describe('home page', () => {
  it('should respond with the server-side rendered home page', async () => {
    const response = await request(app).get('/')
      .expect('Content-Type', /html/)
      .expect(200);

    expect(response.text).toContain('<title>Hello world</title>');
    expect(response.text).toContain('Welcome');
    expect(response.text).toContain('Demo Application');
    expect(response.text).toContain('Fully-universal (isomorphic) app');
  });
});
