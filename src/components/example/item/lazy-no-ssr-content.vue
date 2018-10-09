<template>
  <div class="lazy-container">
    <div
      v-if="lazy"
      class="lazy-no-ssr-content">
      <h3>{{ lazy }} <b>without</b> SEO relevance</h3>
      <ul>
        <li>This component is lazy-loaded when routing to the page client-side, and not loaded at all when rendering server-side.</li>
        <li>This is useful when the content is not important for SEO and also isn't the immediate focus of the customer.</li>
        <li>By delaying the load/render cycle for content that is less important, the priority content loads and renders faster.</li>
        <li>Since the content isn't needed for SEO, this will not block the page request when rendering the route server-side.</li>
      </ul>
    </div>

    <NoSSR>
      <div
        v-if="!lazy"
        class="lazy-no-ssr-content flex-container align-spaced align-middle flex-dir-column">
        <loading/>
      </div>
    </NoSSR>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import loading from './loading';

export default {
  name: 'LazyNoSsrContent',
  components: { loading, NoSSR },
  data: () => ({
    lazy: '',
  }),

  // beforeMount is only run client-side, and is non-blocking. Content will be lazy-loaded and lazy-rendered
  beforeMount() {
    // arbitrary delay to simulate async operation. could be store.dispatch()
    return new Promise((resolve) => {
      setTimeout(() => {
        this.lazy = 'Lazy-loaded content';
        resolve();
      }, 800);
    });
  },
};
</script>

<style lang="scss">
  @import '../../../scss/base';

  .lazy-container {
    width: 100%;
  }

  .lazy-no-ssr-content {
    border: 1px solid $light-gray;
    padding: 1em;
  }

  .lazy-no-ssr-content.loading {
    height: 175px;
  }
</style>
