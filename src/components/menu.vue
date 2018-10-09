<template>
  <nav>
    <ul class="menu vertical align-center">
      <li
        v-for="item in items"
        :key="item.id">
        <router-link
          :to="{ name: item.route }"
          data-cy="menu-item">{{ item.name }}</router-link> <!-- data-cy used by cypress. @see test/e2e -->
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppMenu',
  data: () => ({
    items: Array(20).fill({ route: 'items', name: 'Items' }),
  }),
};
</script>

<style lang="scss" scoped>
  @import '../scss/base';

  ul.menu {
    margin: 10px;

    li {
      border-bottom: 1px dashed $medium-gray;
      padding: 5px;

      &:last-child {
        border: none;
      }
    }
  }
</style>
