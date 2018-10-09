<template>
  <div class="lazy-container">
    <div
      v-if="item.lazy"
      class="lazy-ssr-content flex-container align-jusify flex-dir-column">
      <h3>{{ item.lazy }} <b>with</b> SEO relevance</h3>
      <ul class="flex-container align-spaced flex-dir-column flex-child-grow">
        <li>This component is lazy-loaded when routing to the page client-side, but loads before rendering server-side.</li>
        <li>This is useful when the content is important for SEO but isn't the immediate focus of the customer.</li>
        <li>By delaying the load/render cycle for content that is less important, the priority content loads and renders faster.</li>
        <li>Since the content is needed for SEO, this will block the page request when rendering the route server-side.</li>
      </ul>
    </div>
    <div
      v-if="!item.lazy"
      class="lazy-ssr-content flex-container align-spaced align-middle flex-dir-column">
      <loading/>
    </div>
  </div>
</template>

<script>
import loading from './loading';
import { FETCH_ITEM_EXTRAS } from '../types/actions';
import { GET_ITEM } from '../types/getters';

export default {
  name: 'LazySsrContent',
  components: { loading },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  computed: {
    // by binding to the getter, any changes to the item will trigger DOM updates for item properties bound in the template
    item() {
      return this.$store.getters[GET_ITEM](this.id);
    },
  },

  // beforeMount is only run client-side, and is non-blocking. Content will be lazy-loaded and lazy-rendered.
  // for the initial page load, if already rendered server-side, the data will be cached in the store and resolve immediately.
  beforeMount() {
    this.$store.dispatch(FETCH_ITEM_EXTRAS, this.id);
  },

  // beforeRouteResolveServer is only run server-side and allows for prefetching the data for rendering (SSR)
  async beforeRouteResolveServer({ store, route }) {
    // notice this.id isn't set yet, since routing hasn't happened and therefore component hasn't been initialized with props
    await store.dispatch(FETCH_ITEM_EXTRAS, route.params.id);
  },
};
</script>

<style lang="scss">
  @import '../../../scss/base';

  .lazy-container,
  .lazy-ssr-content {
    height: 100%;
  }

  .lazy-container {
    width: 100%;
  }

  .lazy-ssr-content {
    border: 1px solid $light-gray;
    padding: 1em;
  }
</style>
