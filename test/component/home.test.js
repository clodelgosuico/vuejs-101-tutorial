import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Home from '../../src/components/home';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('header.vue', () => {
  it('dispatches the user fetch before resolving the route', () => {
    const store = {
      dispatch: jest.fn(),
    };

    Home.beforeRouteResolve({ store });
    expect(store.dispatch).toHaveBeenCalledWith('account/fetchUser');
  });

  it('prints page title with the name from whatever the account state is', () => {
    const store = new Vuex.Store({
      modules: {
        account: {
          namespaced: true,
          state: {
            name: '',
          },
        },
      },
    });

    const wrapper = shallowMount(Home, { store, localVue });
    expect(wrapper.html()).toContain('<h1 data-cy="title">Welcome </h1>');

    store.state.account.name = 'foo';
    expect(wrapper.html()).toContain('<h1 data-cy="title">Welcome foo</h1>');
  });
});
