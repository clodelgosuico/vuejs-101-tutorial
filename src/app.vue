<template>
  <Slideout
    id="app">
    <template slot="slideout">
      <AppMenu/>
    </template>
    <template slot="slideout-content">
      <AppHeader/>
      <article
        id="content"
        class="grid-container">
        <transition
          name="fade"
          mode="out-in">
          <router-view/>
        </transition>
      </article>
    </template>
  </Slideout>
</template>


<script>
import Slideout from '@component/slideout-vue';
import AppHeader from './components/header';
import AppMenu from './components/menu';

export default {
  name: 'App',
  components: {
    Slideout,
    AppHeader,
    AppMenu,
  },
};
</script>


<style lang="scss">
  // load global / base css variables + mixins
  @import './scss/base';

  // @TODO replace with "macys-base-minimal". should include global styles, flex utilities, typography, buttons, etc
  @include foundation-global-styles;
  @include foundation-typography;
  @include foundation-visibility-classes;
  @include foundation-flex-classes;
  @include foundation-button;

  // project-specific global foundation components
  @include foundation-forms;
  @include foundation-menu;
  @include foundation-xy-grid-classes;

  a.button {
    text-decoration: none;
  }

  #content {
    @include xy-grid-container;
    margin-top: 10px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
