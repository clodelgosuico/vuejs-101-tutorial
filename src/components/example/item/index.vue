<template>
  <div id="item">
    <h1 data-cy="title">This is {{ item.title }}</h1> <!-- data-cy used by cypress. @see test/e2e -->
    <div class="item-container flex-container">
      <div class="details-container">
        <p>{{ item.details }}</p>
        <div class="img-row flex-container">
          <div>
            <svg class="placeholder"/>
          </div>
          <div>
            <svg class="placeholder"/>
          </div>
        </div>
        <div class="img-row flex-container">
          <div>
            <svg class="placeholder"/>
          </div>
          <div>
            <svg class="placeholder"/>
          </div>
        </div>
      </div>
      <div class="item-lazy-ssr-container">
        <LazySSRContent :id="item.id"/>
      </div>
    </div>
    <div class="item-lazy-no-ssr-container">
      <LazyNoSSRContent/>
    </div>
    <router-link
      :to="{ name: 'items' }"
      class="button">Back to Items</router-link>
  </div>
</template>

<script>
import LazySSRContent from './lazy-ssr-content';
import LazyNoSSRContent from './lazy-no-ssr-content';
import { FETCH_ITEM } from '../types/actions';
import { GET_ITEM } from '../types/getters';

export default {
  name: 'Item',
  components: { LazySSRContent, LazyNoSSRContent },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  async beforeRouteResolve({ store, route }) {
    await store.dispatch(FETCH_ITEM, route.params.id);
  },
  computed: {
    item() {
      return this.$store.getters[GET_ITEM](this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../../scss/base';

  .details-container {
    padding-right: 1rem;
    width: 60%;
  }

  .item-lazy-ssr-container,
  .item-lazy-no-ssr-container {
    margin-bottom: 1em;
    width: 40%;
  }

  .item-lazy-no-ssr-container {
    width: 100%;
  }

  .img-row > div {
    margin-bottom: 1rem;
    width: 50%;

    &:first-child {
      padding-right: 0.5rem;
    }

    &:last-child {
      padding-left: 0.5rem;
    }
  }

  svg.placeholder {
    display: block;
    margin: 0 auto;
    width: 350px;
    height: auto;
    background: $light-gray;
    max-width: 100%;
  }

  @include breakpoint(small only) {
    .item-container {
      @include flex-direction(column);
    }

    .details-container,
    .item-lazy-ssr-container {
      width: 100%;
    }

    .details-container {
      padding: 0;
    }

    .button {
      width: 100%;
    }
  }
</style>
