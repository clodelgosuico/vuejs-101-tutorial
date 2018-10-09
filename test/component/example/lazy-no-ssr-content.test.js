import { shallowMount } from '@vue/test-utils';
import LazyNoSSRContent from '../../../src/components/example/item/lazy-no-ssr-content';

describe('lazy-no-ssr-content.vue', () => {
  it('renders the correct initial html while the ssr content is loading', () => {
    expect(shallowMount(LazyNoSSRContent).html()).toBe('<div class="lazy-container"><!----> <nossr-stub placeholdertag="div"><div class="lazy-no-ssr-content flex-container align-spaced align-middle flex-dir-column"><loading-stub></loading-stub></div></nossr-stub></div>');
  });

  it('renders lazy-loaded content when its ready', () => {
    jest.useFakeTimers();
    const wrapper = shallowMount(LazyNoSSRContent);
    jest.runAllTimers();
    expect(wrapper.html()).toContain('<h3>Lazy-loaded content <b>without</b> SEO relevance</h3>');
  });
});
