const nock = require('nock');
const request = require('supertest');
const { app } = require('../../server');

const itemsMock = require('../../server/mock/items.mock.json');

describe('items page', () => {
  it('should respond with the server-side rendered items page', async () => {
    // this page request makes an external api request for JSON data that needs to be mocked
    nock('http://localhost:3000')
      .get('/api/items?page=1')
      .reply(200, itemsMock);

    const response = await request(app).get('/items')
      .expect('Content-Type', /html/)
      .expect(200);

    expect(response.text).toContain('Items');
    expect(response.text).toContain('<a href="/items/1"');
    expect(response.text).toContain('<a href="/items/24"');
  });
});

describe('items api', () => {
  describe('items index requests', () => {
    // this test is skipped because it loads 50k items
    xit('should respond with all the items if there is no page query', async () => {
      const response = await request(app).get('/api/items')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(itemsMock);
    });

    it('should respond with paged items (96 per page)', async () => {
      const page1 = await request(app).get('/api/items?page=1')
        .expect('Content-Type', /json/)
        .expect(200);

      const page2 = await request(app).get('/api/items?page=2')
        .expect('Content-Type', /json/)
        .expect(200);

      const page3 = await request(app).get('/api/items?page=3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(page1.body).toEqual(itemsMock.slice(0, 96));
      expect(page2.body).toEqual(itemsMock.slice(96, 192));
      expect(page3.body).toEqual(itemsMock.slice(192, 288));
    });

    it('should respond with page out of bounds error', async () => {
      await request(app).get('/api/items?page=0')
        .expect('Content-Type', /text/)
        .expect(404)
        .expect('Page out of bounds');

      await request(app).get('/api/items?page=7')
        .expect('Content-Type', /text/)
        .expect(404)
        .expect('Page out of bounds');
    });

    it('should respond with an invalid page number error for non-integers', async () => {
      await request(app).get('/api/items?page=asdf')
        .expect('Content-Type', /text/)
        .expect(500)
        .expect('asdf is not a valid page number');
    });
  });

  describe('item details requests', () => {
    it('should respond with the details for the specific item requested', async () => {
      const response = await request(app).get('/api/items/123')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(itemsMock.find(item => item.id === 123));
    });

    it('should respond with a 404 if the item does not exist', async () => {
      await request(app).get('/api/items/100000')
        .expect('Content-Type', /text/)
        .expect(404)
        .expect('Item does not exist');
    });
  });
});
