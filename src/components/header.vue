<template>
  <header class="top-bar top-bar-unstacked">
    <div
      class="menu-icon"
      data-cy="menu-icon"
      @click.stop="toggle" /> <!-- data-cy used by cypress. @see test/e2e -->
    <div class="top-bar-title">
      <router-link :to="{ name: 'home' }">Demo Application</router-link>
    </div>
    <div class="top-bar-right">
      <LogInOutLink/>
    </div>
  </header>
</template>

<script>
import { mapMutations } from 'vuex';
import { LogInOutLink } from '@component/account-vue';
import { TOGGLE } from '@component/slideout-vue';

export default {
  name: 'AppHeader',
  components: { LogInOutLink },
  methods: mapMutations('slideout', { toggle: TOGGLE }),
};
</script>

<style lang="scss" scoped>
  @import '../scss/base';

  // controls the hamburger icon colors
  $titlebar-icon-color: $medium-dark-gray;
  $titlebar-icon-color-hover: $macysRed;

  $topbar-background: $super-light-gray;
  $topbar-unstack-breakpoint: small;

  @include foundation-menu-icon;
  @include foundation-top-bar;

  a {
    text-decoration: none;
  }

  .top-bar-title {
    font-weight: bold;
    margin-left: 10px;
  }
</style>
