import NProgress from '@component/nprogress'; // mocked
import serviceApi from '@core/util/service-api'; // mocked
import Vue from 'vue';
import exampleModule from '../../../src/components/example/example.module';
import { FETCH_ITEMS, FETCH_ITEM, FETCH_ITEM_EXTRAS } from '../../../src/components/example/types/actions';
import { ADD_ITEM, ADD_ITEMS, ADD_TO_ITEM, SET_ITEMS } from '../../../src/components/example/types/mutations';

jest.mock(
  '@component/nprogress',
  () => ({
    set: jest.fn(),
    remove: jest.fn(),
  }),
);

jest.mock(
  '@core/util/service-api',
  () => {
    const sapi = {
      create: jest.fn(() => ({
        get: sapi.__spies__.get,
      })),
      CancelToken: {
        source: jest.fn(() => ({ token: `cancelTokenSource-${Date.now()}` })),
      },
      isCancel: jest.fn(err => err.cancel),
    };

    sapi.__spies__ = {
      get: jest.fn(() => Promise.resolve({
        data: [
          { id: 2 },
          { id: 1 },
          { id: 3 },
        ],
      })),
    };

    return sapi;
  },
);

describe('example.module actions', () => {
  let router;
  let commit;

  beforeEach(() => {
    router = {};
    commit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up the service api', () => {
    expect(serviceApi.create).toHaveBeenCalledWith({ baseURL: 'http://localhost:80' });
  });

  describe(`${FETCH_ITEMS}`, () => {
    it('should attach a cancel token to the router', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit });
      expect(serviceApi.CancelToken.source).toHaveBeenCalled();
      expect(router.cancelTokenSource.token).toContain('cancelTokenSource');
    });

    it('should fetch items using the service api', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit });
      expect(serviceApi.__spies__.get).toHaveBeenCalledWith('/api/items', expect.any(Object));
    });

    it('should pass page as query param to get items request', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit }, { page: 5 });
      expect(serviceApi.__spies__.get.mock.calls[0][1].params).toEqual({ page: 5 });
    });

    it('should pass down the same cancel token that is attached to the router', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit });
      expect(serviceApi.__spies__.get.mock.calls[0][1].cancelToken).toBe(router.cancelTokenSource.token);
    });

    it('it should attach a download progress event to the service api that sets ui progress', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit });
      const { onDownloadProgress } = serviceApi.__spies__.get.mock.calls[0][1];
      expect(onDownloadProgress).toEqual(expect.any(Function));
      expect(NProgress.set).not.toHaveBeenCalled();
      onDownloadProgress({ loaded: 25, total: 100 });
      expect(NProgress.set).toHaveBeenCalledWith(0.25);
    });

    it('should eet the items that are resolved by the service api into the store', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit });

      return Vue.nextTick(() => {
        expect(commit).toHaveBeenCalledWith(SET_ITEMS, {
          items: [
            { id: 2 },
            { id: 1 },
            { id: 3 },
          ],
        });
      });
    });

    it('should add the items that are resolved by the service api into the store if replace=false', () => {
      exampleModule({ router }).actions[FETCH_ITEMS]({ commit }, { replace: false });

      return Vue.nextTick(() => {
        expect(commit).toHaveBeenCalledWith(ADD_ITEMS, {
          items: [
            { id: 2 },
            { id: 1 },
            { id: 3 },
          ],
        });
      });
    });

    it('should throw an error if the service api fails', async () => {
      let hasError = false;
      serviceApi.__spies__.get.mockReturnValue(Promise.reject(new Error('service api failed')));

      try {
        await exampleModule({ router }).actions[FETCH_ITEMS]({});
      } catch (err) {
        hasError = true;
        expect(err.message).toBe('service api failed');
      }

      expect(hasError).toBe(true);
    });

    it('should remove the progress bar if the request is cancelled', async () => {
      const err = new Error('cancelled');
      err.cancel = true;
      serviceApi.__spies__.get.mockReturnValue(Promise.reject(err));

      expect(NProgress.remove).not.toHaveBeenCalled();
      await exampleModule({ router }).actions[FETCH_ITEMS]({});
      expect(NProgress.remove).toHaveBeenCalled();
    });
  });

  describe(`${FETCH_ITEM}`, () => {
    let item;

    beforeEach(() => {
      item = { id: 123 };
      serviceApi.__spies__.get.mockReturnValue({ data: item });
    });

    it('should fetch the item if its not in the store, and commit it', async () => {
      const ctx = {
        state: {
          example: {
            items: [],
          },
        },
      };

      expect(commit).not.toHaveBeenCalled();
      await exampleModule({}).actions[FETCH_ITEM].call(ctx, { commit }, 123);
      expect(serviceApi.__spies__.get).toHaveBeenCalledWith('/api/items/123');
      expect(commit).toHaveBeenCalledWith(ADD_ITEM, item);
    });

    it('should not fetch the item if its in the store, and not call commit', async () => {
      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      await exampleModule({}).actions[FETCH_ITEM].call(ctx, { commit }, 123);
      expect(serviceApi.__spies__.get).not.toHaveBeenCalled();
      expect(commit).not.toHaveBeenCalled();
    });

    it('should handle parsing strings for id', async () => {
      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      await exampleModule({}).actions[FETCH_ITEM].call(ctx, { commit }, '123');
      expect(serviceApi.__spies__.get).not.toHaveBeenCalled();
      expect(commit).not.toHaveBeenCalled();
    });

    it('should throw an error if the string cannot be parsed as an integer', async () => {
      let hasError = false;
      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      try {
        await exampleModule({}).actions[FETCH_ITEM].call(ctx, { commit }, 'asdfasf');
      } catch (err) {
        expect(err.message).toBe('Item ID is not a valid number');
        hasError = true;
      }

      expect(hasError).toBe(true);
    });
  });

  describe(`${FETCH_ITEM_EXTRAS}`, () => {
    let item;

    beforeEach(() => {
      item = { id: 123 };
      serviceApi.__spies__.get.mockReturnValue({ data: item });
    });

    it('should throw an error if the item is not in the store', async () => {
      let hasError = false;
      const ctx = {
        state: {
          example: {
            items: [],
          },
        },
      };

      try {
        await exampleModule({}).actions[FETCH_ITEM_EXTRAS].call(ctx, { commit }, 123);
      } catch (err) {
        expect(err.message).toBe('Cannot fetch extra item details for item that has not been fetched');
        hasError = true;
      }

      expect(hasError).toBe(true);
    });

    it('should commit extra item details after the timeout resolves', () => {
      jest.useFakeTimers();

      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      exampleModule({}).actions[FETCH_ITEM_EXTRAS].call(ctx, { commit }, 123);
      expect(commit).not.toHaveBeenCalled();
      jest.runAllTimers();

      expect(commit).toHaveBeenCalledWith(ADD_TO_ITEM, {
        id: 123,
        data: {
          lazy: 'Lazy-loaded content',
        },
      });
    });

    it('should handle parsing strings for id when doing cache lookup', () => {
      jest.useFakeTimers();
      let hasError = false;

      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      try {
        exampleModule({}).actions[FETCH_ITEM_EXTRAS].call(ctx, { commit }, '123');
        jest.runAllTimers();
      } catch (err) {
        hasError = true;
      }

      expect(hasError).toBe(false);
    });

    it('should throw an error if the string cannot be parsed as an integer', async () => {
      let hasError = false;
      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      try {
        await exampleModule({}).actions[FETCH_ITEM_EXTRAS].call(ctx, { commit }, 'asdfasf');
      } catch (err) {
        expect(err.message).toBe('Item ID is not a valid number');
        hasError = true;
      }

      expect(hasError).toBe(true);
    });

    it('should not need to commit any action if lazy content already exists', () => {
      jest.useFakeTimers();
      item.lazy = 'already loaded';

      const ctx = {
        state: {
          example: {
            items: [
              item,
            ],
          },
        },
      };

      exampleModule({}).actions[FETCH_ITEM_EXTRAS].call(ctx, { commit }, 123);
      jest.runAllTimers();
      expect(commit).not.toHaveBeenCalled();
    });
  });
});
