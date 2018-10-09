import Vue from 'vue';
import NProgress from '@component/nprogress';
import serviceApi from '@core/util/service-api';
import { FETCH_ITEMS, FETCH_ITEM, FETCH_ITEM_EXTRAS } from './types/actions';
import { GET_ITEMS, GET_ITEM } from './types/getters';
import { ADD_ITEM, ADD_ITEMS, ADD_TO_ITEM, SET_ITEMS } from './types/mutations';

// @TODO the HOST needs to be dynamic.
// Currently there is no way to have a non-standard port without specifying host.
// @see https://github.com/axios/axios/issues/1794
const api = serviceApi.create({ baseURL: `http://localhost:${process.env.PORT || 80}` });

const parse = (id) => {
  const parsed = Number.parseInt(id, 10);

  if (Number.isNaN(parsed)) {
    throw new Error('Item ID is not a valid number');
  }

  return parsed;
};

const getCached = (items, id) => items.find(item => item.id === parse(id));
const getCachedIndex = (items, id) => items.findIndex(item => item.id === parse(id));
const sortById = (a, b) => a.id - b.id;

export default ({ router }) => ({
  state: () => ({
    items: [],
  }),

  actions: {
    async [FETCH_ITEMS]({ commit }, { page, replace = true } = {}) {
      try {
        // attach a cancel token to the router that the router will cancel
        // if the route changes before for the request completes
        router.cancelTokenSource = serviceApi.CancelToken.source();

        const params = {};
        if (page) {
          params.page = page;
        }

        const request = api.get('/api/items', {
          params,

          // pass the cancel token to the api promise to kill the request if the route changes
          cancelToken: router.cancelTokenSource.token,

          // every time a stream buffer packet is received, update the progress bar
          onDownloadProgress: (progressEvent) => {
            NProgress.set(progressEvent.loaded / progressEvent.total);
          },
        });

        const { data: items } = await request;

        if (replace) {
          commit(SET_ITEMS, { items });
        } else {
          commit(ADD_ITEMS, { items });
        }
      } catch (err) {
        if (serviceApi.isCancel(err)) {
          // the promise was cancelled by the route changing before the request could finish - remove progress bar
          NProgress.remove();
        } else {
          throw err;
        }
      }
    },

    async [FETCH_ITEM]({ commit }, id) {
      const cached = getCached(this.state.example.items, id);

      if (!cached) {
        const { data: item } = await api.get(`/api/items/${id}`);
        commit(ADD_ITEM, item);
      }
    },

    async [FETCH_ITEM_EXTRAS]({ commit }, id) {
      const cached = getCached(this.state.example.items, id);

      if (!cached) {
        throw new Error('Cannot fetch extra item details for item that has not been fetched');
      } else if (!cached.lazy) {
        /**
         * For the main user flow, the lazy-loaded content will never be cached, FETCH_ITEM_EXTRAS will perform the below async
         * operation every time (cached.lazy won't be set). In the standard flow, the user would normally first visit the items list
         * page (which dispatches FETCH_ITEMS). When FETCH_ITEMS completes, it calls the SET_ITEMS mutation, which completely replaces
         * state.items with the result of the fetch, which doesn't include the lazy data. (See SET_ITEMS mutation in this file)
         *
         * However, there is one flow where we can take advantage of the cached lazy-loaded data. If the user is on an item details page,
         * the lazy-loaded data is fetched + cached. If they then click "login", and successfully login, the user will be redirected
         * straight back to the item details page they were previously on. This circumvents the items index page, and thus the lazy data
         * for the item will still be cached. In this particular user flow, the async operation is skipped since "cached.lazy" is checked.
         */
        await new Promise((resolve) => {
          setTimeout(() => {
            commit(ADD_TO_ITEM, { id, data: { lazy: 'Lazy-loaded content' } });
            resolve();
          }, 600);
        });
      }
    },
  },

  getters: {
    [GET_ITEMS]: (state) => {
      state.items.sort(sortById);
      return state.items;
    },
    [GET_ITEM]: state => id => getCached(state.items, id),
  },

  mutations: {
    [ADD_ITEM](state, item) {
      item.id = parse(item.id);

      if (getCachedIndex(state.items, item.id) !== -1) {
        throw new Error(`Item with ID ${item.id} already exists`);
      }

      state.items.push(item);
    },

    [ADD_ITEMS](state, { items }) {
      // note that this is not checking for collisions
      state.items = [...state.items, ...items];
    },

    [ADD_TO_ITEM](state, { id, data }) {
      const itemIndex = getCachedIndex(state.items, id);

      if (itemIndex === -1) {
        throw new Error(`Item with ID ${id} does not exist`);
      }

      if (!data) {
        throw new Error('Missing required "data" to add to the item');
      }

      // don't use spread syntax because it would replace item and break existing bindings
      Object.keys(data).forEach((key) => {
        Vue.set(state.items[itemIndex], key, data[key]);
      });
    },

    [SET_ITEMS](state, { items }) {
      /**
       * Note that by replacing state.items completely, anything bound to an individual item will break its binding.
       * However this is orders of magnitude faster than going through and updating each individual item.
       */
      state.items = items;
    },
  },
});
