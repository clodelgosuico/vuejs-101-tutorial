import { shallowMount } from '@vue/test-utils';
import App from '../../src/app';

describe('app.vue', () => {
  it('wraps the entire app in a slideout component', () => {
    const wrapper = shallowMount(App, {
      stubs: ['router-view'],
    });

    expect(wrapper.html()).toBe('<slideout-stub id="app"><template></template> <template></template></slideout-stub>');
  });

  it('wraps the menu in a slideout, and wraps the header/content in the slideout content wrapper', () => {
    const Slideout = {
      template: '<div><div id="slideout"><slot name="slideout"/></div><div id="slideout-content"><slot name="slideout-content"/></div></div>',
    };

    const wrapper = shallowMount(App, {
      stubs: {
        Slideout,
        AppMenu: true,
        AppHeader: true,
        'router-view': true,
      },
    });

    expect(wrapper.html()).toBe('<div id="app"><div id="slideout"><appmenu-stub></appmenu-stub></div><div id="slideout-content"><appheader-stub></appheader-stub> <article id="content" class="grid-container"><router-view-stub name="fade" mode="out-in"></router-view-stub></article></div></div>');
  });
});
