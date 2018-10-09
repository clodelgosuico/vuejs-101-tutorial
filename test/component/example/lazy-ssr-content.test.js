import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import LazySSRContent from '../../../src/components/example/item/lazy-ssr-content';
import { FETCH_ITEM_EXTRAS } from '../../../src/components/example/types/actions';
import { GET_ITEM } from '../../../src/components/example/types/getters';

const localVue = createLocalVue();

localVue.use(Vuex);

const item = {
  id: 123,
  title: 'this is the title',
  description: 'this is the description',
};

describe('lazy-ssr-content.vue', () => {
  it('requires a number prop', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const wrapper = shallowMount(LazySSRContent, {
      store: new Vuex.Store({
        getters: {
          [GET_ITEM]: () => jest.fn(() => item),
        },
      }),
      localVue,
    });
    expect(wrapper.vm.$options.props.id.required).toBe(true);
    expect(wrapper.vm.$options.props.id.type).toBe(Number);
  });

  it('dispatches the extra item details fetch before resolving the route server-side', () => {
    const store = {
      dispatch: jest.fn(),
    };

    const route = {
      params: {
        id: 123,
      },
    };

    LazySSRContent.beforeRouteResolveServer({ store, route });
    expect(store.dispatch).toHaveBeenCalledWith(FETCH_ITEM_EXTRAS, 123);
  });

  it('dispatches the extra item details fetch before the component is mounted client-side', () => {
    const actions = {
      [FETCH_ITEM_EXTRAS]: jest.fn(),
    };

    shallowMount(LazySSRContent, {
      propsData: {
        id: 123,
      },
      store: new Vuex.Store({
        actions,
        getters: {
          [GET_ITEM]: () => jest.fn(() => item),
        },
      }),
      localVue,
    });

    expect(actions[FETCH_ITEM_EXTRAS].mock.calls[0][1]).toBe(123);
  });

  it('renders the correct initial html while the ssr content is loading', () => {
    const actions = {
      [FETCH_ITEM_EXTRAS]: jest.fn(),
    };

    const itemSpy = jest.fn(() => item);

    const wrapper = shallowMount(LazySSRContent, {
      propsData: {
        id: 123,
      },
      store: new Vuex.Store({
        actions,
        getters: {
          [GET_ITEM]: () => itemSpy,
        },
      }),
      localVue,
    });

    expect(wrapper.html()).toBe('<div class="lazy-container"><!----> <div class="lazy-ssr-content flex-container align-spaced align-middle flex-dir-column"><loading-stub></loading-stub></div></div>');
  });

  it('renders lazy-loaded content when its ready', () => {
    const actions = {
      [FETCH_ITEM_EXTRAS]: jest.fn(),
    };

    const itemSpy = jest.fn(() => ({ ...item, lazy: 'the lazy content' }));

    const wrapper = shallowMount(LazySSRContent, {
      propsData: {
        id: 123,
      },
      store: new Vuex.Store({
        actions,
        getters: {
          [GET_ITEM]: () => itemSpy,
        },
      }),
      localVue,
    });

    expect(wrapper.html()).toContain('<h3>the lazy content <b>with</b> SEO relevance</h3>');
  });
});
