import * as exported from '../..';
import App from '../../src/app';
import routes from '../../src/routes';
import store from '../../src/store';

describe('module exports', () => {
  it('should export the app', () => {
    expect(exported.App).toBe(App);
  });

  it('should export the routes', () => {
    expect(exported.routes).toBe(routes);
  });

  it('should export the store', () => {
    expect(exported.store).toBe(store);
  });
});
