import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import Item from '../../../src/components/example/item/index';
import { FETCH_ITEM } from '../../../src/components/example/types/actions';
import { GET_ITEM } from '../../../src/components/example/types/getters';

const localVue = createLocalVue();

localVue.use(Vuex);

const item = {
  id: 123,
  title: 'this is the title',
  description: 'this is the description',
};

describe('item.vue', () => {
  it('requires a number prop', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const wrapper = shallowMount(Item, {
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

  it('dispatches the item fetch before resolving the route', () => {
    const store = {
      dispatch: jest.fn(),
    };

    const route = {
      params: {
        id: 123,
      },
    };

    Item.beforeRouteResolve({ store, route });
    expect(store.dispatch).toHaveBeenCalledWith(FETCH_ITEM, 123);
  });

  it('renders the correct html', () => {
    const itemSpy = jest.fn(() => item);

    const store = new Vuex.Store({
      getters: {
        [GET_ITEM]: () => itemSpy,
      },
    });

    const wrapper = shallowMount(Item, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      propsData: {
        id: 123,
      },
      store,
      localVue,
    });

    expect(itemSpy).toHaveBeenCalledWith(123);
    expect(wrapper.html()).toBe('<div id="item"><h1 data-cy="title">This is this is the title</h1> <div class="item-container flex-container"><div class="details-container"><p></p> <div class="img-row flex-container"><div><svg class="placeholder"></svg></div> <div><svg class="placeholder"></svg></div></div> <div class="img-row flex-container"><div><svg class="placeholder"></svg></div> <div><svg class="placeholder"></svg></div></div></div> <div class="item-lazy-ssr-container"><lazyssrcontent-stub id="123"></lazyssrcontent-stub></div></div> <div class="item-lazy-no-ssr-container"><lazynossrcontent-stub></lazynossrcontent-stub></div> <a class="button">Back to Items</a></div>');
  });

  it('renders a link that routes to the items page', () => {
    const itemSpy = jest.fn(() => item);
    const getItem = () => itemSpy;
    const store = new Vuex.Store({
      getters: {
        [GET_ITEM]: getItem,
      },
    });

    const wrapper = shallowMount(Item, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      propsData: {
        id: 123,
      },
      store,
      localVue,
    });

    expect(wrapper.find(RouterLinkStub).html()).toBe('<a class="button">Back to Items</a>');
    expect(wrapper.find(RouterLinkStub).props().to).toEqual({ name: 'items' });
  });
});
