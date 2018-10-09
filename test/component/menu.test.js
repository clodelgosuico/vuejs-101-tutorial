import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import Menu from '../../src/components/menu';

describe('menu.vue', () => {
  it('renders the correct html', () => {
    const wrapper = shallowMount(Menu, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    const li = '<li><a data-cy="menu-item">Items</a></li>';
    expect(wrapper.html()).toBe(`<nav><ul class="menu vertical align-center">${li.repeat(20)}</ul></nav>`);
  });

  it('routes each item link to the items route', () => {
    const wrapper = shallowMount(Menu, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find(RouterLinkStub).props().to).toEqual({ name: 'items' });
  });
});
