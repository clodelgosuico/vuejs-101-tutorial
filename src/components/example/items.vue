<template>
  <div id="items">
    <h1 data-cy="title">Items</h1> <!-- data-cy used by cypress. @see test/e2e -->
    <div class="grid-x grid-margin-x">
      <div
        v-for="item in items.slice(0, perPage * page)"
        :key="item.id"
        class="item-container cell medium-4 large-2">
        <div
          data-cy="item"
          class="item"> <!-- data-cy used by cypress. @see test/e2e -->
          <router-link :to="{ name: 'item', params: { id: item.id } }">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-image"><img src="https://placehold.it/400x500"></div>
          </router-link>
        </div>
      </div>
      <Observer
        :options="{ rootMargin: '600px' }"
        @intersect="intersected"/>
      <div v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Observer } from '@component/observer-vue';
import { FETCH_ITEMS } from './types/actions';
import { GET_ITEMS } from './types/getters';

export default {
  name: 'Items',
  components: { Observer },

  data: () => ({
    // Defines the initial page count, which determines how many "pages" will be rendered server-side,
    // and thus how many item images will be loaded immediately client-side when the component is loaded
    page: 2,

    // Defines how many images to load per "page". (perPage * page) products will be rendered server-side,
    // and [perPage] additional items will be loaded each time the intersect event is observed.
    // Needs to be a factor of 96 to make the math related to api request pagination possible.
    perPage: 12,

    error: null,
  }),
  async beforeRouteResolve({ store }) {
    await store.dispatch(FETCH_ITEMS, { page: 1 }); // fetch the first set of items before resolving the route

    // To see the effect of the progress bar more clearly, fetch 50,000 items at once
    // await store.dispatch(FETCH_ITEMS);
  },
  computed: mapGetters({
    items: GET_ITEMS,
  }),
  methods: {
    /**
       * Set up lazy rendering of items using the IntersectionObserver API. This not only lazy renders the items, but also enables
       * automatic lazy loading of images since the <img> tags themselves are lazy rendered.
       */
    async intersected() {
      this.page += 1; // causes [perPage] more new items to render

      // the FETCH_ITEMS action grabs 96 at a time, and we render [perpage] (e.g. 12) at a time. This allows for a blend of
      // fewer overall network requests and on-demand rendering of items for maximum overall performance (perceived and actual).
      if (!this.noMorePages && (this.perPage * this.page) % 96 === 0) {
        const page = ((this.perPage * this.page) / 96) + 1;
        try {
          await this.$store.dispatch(FETCH_ITEMS, { page, replace: false }); // fetch the next set of items
        } catch (err) {
          if (err.response && err.response.status === 404) {
            // scrolled past max number of pages
            this.noMorePages = true;
          } else {
            this.error = 'Could not fetch items';
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../scss/base';

  .item-container {
    margin-bottom: 1rem;
    text-align: center;
  }

  .item {
    & > a {
      display: block;
      text-decoration: none;
    }
  }

  .item-title {
    background: $super-light-gray;
    font-size: 1.1rem;
    padding: 0 0.5rem;
    margin-bottom: 0.1rem;
    text-decoration: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .item-image {
    min-height: 220px;
  }
</style>
