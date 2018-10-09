import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import Items from '../../../src/components/example/items';
import { FETCH_ITEMS } from '../../../src/components/example/types/actions';
import { GET_ITEMS } from '../../../src/components/example/types/getters';

const localVue = createLocalVue();

localVue.use(Vuex);

const getItems = (count = 100, format = 'js') => {
  const items = [];

  for (let i = 0; i < count; i += 1) {
    items.push({ id: i, title: 'title' });
  }

  if (format === 'js') {
    return items;
  }

  let itemsHtml = '';
  items.forEach(() => {
    itemsHtml += '<div class="item-container cell medium-4 large-2"><div data-cy="item" class="item"><a><div class="item-title">title</div> <div class="item-image"><img src="https://placehold.it/400x500"></div></a></div></div>';
    return itemsHtml;
  });
  return itemsHtml;
};

describe('items.vue', () => {
  it('dispatches the items fetch (first page) before resolving the route', () => {
    const store = {
      dispatch: jest.fn(),
    };

    Items.beforeRouteResolve({ store });
    expect(store.dispatch).toHaveBeenCalledWith(FETCH_ITEMS, { page: 1 });
  });

  it('renders the correct html', () => {
    const store = new Vuex.Store({
      getters: {
        [GET_ITEMS]: jest.fn(() => getItems()),
      },
    });

    const wrapper = shallowMount(Items, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      store,
      localVue,
    });

    expect(wrapper.html()).toBe(`<div id="items"><h1 data-cy="title">Items</h1> <div class="grid-x grid-margin-x">${getItems(24, 'html')} <observer-stub options="[object Object]"></observer-stub> <!----></div></div>`);
  });

  it('renders 12 more items when scrolling', () => {
    const store = {
      getters: {
        [GET_ITEMS]: jest.fn(() => getItems()),
      },
    };

    const wrapper = shallowMount(Items, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      store: new Vuex.Store(store),
      localVue,
    });

    expect(wrapper.vm.page).toBe(2);
    wrapper.vm.intersected(); // simulate observer intersection event emitted
    expect(wrapper.vm.page).toBe(3);
    wrapper.vm.intersected(); // simulate observer intersection event emitted
    expect(wrapper.vm.page).toBe(4);
    expect(wrapper.html()).toBe(`<div id="items"><h1 data-cy="title">Items</h1> <div class="grid-x grid-margin-x">${getItems(48, 'html')} <observer-stub options="[object Object]"></observer-stub> <!----></div></div>`);
  });

  it('dispatches the items fetch (the next set) each 96 items that are rendered', () => {
    const actions = {
      [FETCH_ITEMS]: jest.fn(),
    };

    const store = new Vuex.Store({
      actions,
      getters: {
        [GET_ITEMS]: jest.fn(() => getItems()),
      },
    });

    const wrapper = shallowMount(Items, {
      store,
      localVue,
    });

    // 2 pages (24 items) already rendered
    wrapper.vm.intersected(); // 36
    wrapper.vm.intersected(); // 48
    wrapper.vm.intersected(); // 60
    wrapper.vm.intersected(); // 72
    wrapper.vm.intersected(); // 84
    expect(actions[FETCH_ITEMS]).not.toHaveBeenCalled();
    wrapper.vm.intersected(); // 96
    expect(actions[FETCH_ITEMS]).toHaveBeenCalled();
    expect(actions[FETCH_ITEMS].mock.calls[0][1]).toEqual({ page: 2, replace: false });
    wrapper.vm.intersected(); // 108
    wrapper.vm.intersected(); // 120
    wrapper.vm.intersected(); // 132
    wrapper.vm.intersected(); // 144
    wrapper.vm.intersected(); // 156
    wrapper.vm.intersected(); // 168
    wrapper.vm.intersected(); // 180
    wrapper.vm.intersected(); // 192
    expect(actions[FETCH_ITEMS].mock.calls.length).toBe(2);
    expect(actions[FETCH_ITEMS].mock.calls[1][1]).toEqual({ page: 3, replace: false });
  });

  it('stops fetching events on scroll after there are no more', () => {
    const actions = {
      [FETCH_ITEMS]: jest.fn().mockImplementation(() => {
        const err = new Error('Out of pages');
        err.response = { status: 404 };
        throw err;
      }),
    };

    const store = new Vuex.Store({
      actions,
      getters: {
        [GET_ITEMS]: jest.fn(() => getItems()),
      },
    });

    const wrapper = shallowMount(Items, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      store,
      localVue,
    });

    // 2 pages (24 items) already rendered
    wrapper.vm.intersected(); // 36
    wrapper.vm.intersected(); // 48
    wrapper.vm.intersected(); // 60
    wrapper.vm.intersected(); // 72
    wrapper.vm.intersected(); // 84
    expect(actions[FETCH_ITEMS]).not.toHaveBeenCalled();
    wrapper.vm.intersected(); // 96 --- no more items because dispatch will 404
    expect(actions[FETCH_ITEMS]).toHaveBeenCalled();
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    wrapper.vm.intersected(); // 96
    expect(actions[FETCH_ITEMS].mock.calls.length).toBe(1);
  });

  it('throws an error if the dispatch fails for any reason other than being out of items', () => {
    const actions = {
      [FETCH_ITEMS]: jest.fn().mockImplementation(() => {
        const err = new Error('Internal Server Error');
        err.response = { status: 500 };
        throw err;
      }),
    };

    const store = new Vuex.Store({
      actions,
      getters: {
        [GET_ITEMS]: jest.fn(() => getItems()),
      },
    });

    const wrapper = shallowMount(Items, {
      store,
      localVue,
    });

    // 2 pages (24 items) already rendered
    wrapper.vm.intersected(); // 36
    wrapper.vm.intersected(); // 48
    wrapper.vm.intersected(); // 60
    wrapper.vm.intersected(); // 72
    wrapper.vm.intersected(); // 84
    wrapper.vm.intersected(); // 96
    expect(wrapper.html()).toContain('Could not fetch items');
  });
});
