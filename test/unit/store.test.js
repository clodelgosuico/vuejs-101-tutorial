import Vue from 'vue';
import store from '../../src/store';

describe('store.js', () => {
  it('exports the appropriate modules', () => {
    expect(Object.keys(store({}).modules)).toEqual(['account', 'slideout', 'example']);
  });

  it('requires account and slideout to be namespaced and example not to', () => {
    const { modules } = store({});
    expect(modules.account.namespaced).toBe(true);
    expect(modules.slideout.namespaced).toBe(true);
    expect(modules.example.namespaced).not.toBe(true);
  });

  it('should pass the router to the example module generator function', () => {
    // mock example module to spy on the exported function
    jest.mock('../../src/components/example/example.module', () => jest.fn());

    // force require cache to get purged before loading store again, so example will be mocked
    jest.resetModules();

    // load store again to cause example module to load stub
    const s = require('../../src/store').default;
    const example = require('../../src/components/example/example.module');

    s({ router: 'foo', bar: 'baz' });
    expect(example).toHaveBeenCalledWith({ router: 'foo' });

    return Vue.nextTick(() => {
      jest.unmock('../../src/components/example/example.module');
    });
  });
});
