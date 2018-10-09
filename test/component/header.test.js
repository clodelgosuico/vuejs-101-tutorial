import { TOGGLE } from '@component/slideout-vue';
import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import Header from '../../src/components/header';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('header.vue', () => {
  it('renders the correct html', () => {
    const wrapper = shallowMount(Header, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBe('<header class="top-bar top-bar-unstacked"><div data-cy="menu-icon" class="menu-icon"></div> <div class="top-bar-title"><a>Demo Application</a></div> <div class="top-bar-right"><loginoutlink-stub></loginoutlink-stub></div></header>');
  });

  it('attaches a router link to the topbar that navigates to the home page', () => {
    const wrapper = shallowMount(Header, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find(RouterLinkStub).html()).toBe('<a>Demo Application</a>');
    expect(wrapper.find(RouterLinkStub).props().to).toEqual({ name: 'home' });
  });

  it('toggles the slideout when the menu icon is clicked', () => {
    const store = {
      modules: {
        slideout: {
          namespaced: true,
          mutations: {
            [TOGGLE]: jest.fn(),
          },
        },
      },
    };

    const wrapper = shallowMount(Header, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
      store: new Vuex.Store(store),
      localVue,
    });

    expect(store.modules.slideout.mutations[TOGGLE]).not.toHaveBeenCalled();
    wrapper.find('.menu-icon').trigger('click');
    expect(store.modules.slideout.mutations[TOGGLE]).toHaveBeenCalled();
  });
});
