<template>
  <div id="home">
    <h1 data-cy="title">Welcome {{ name }}</h1> <!-- data-cy used by cypress. @see test/e2e -->
    <p>
      This is a demo application showing common patterns for building a <a
        href="https://vuejs.org/"
        target="_blank">Vue.js</a> application using the
        polaris ecosystem.
    </p>
    <ul>
      <li>Fully-universal (isomorphic) app that runs and renders both server-side (node) and in the browser</li>
      <li>Single-file components (SFC) with the HTML, JS, & CSS together & encapsulated</li>
      <li>Composes components for modularity/portability and cleaner/smaller SFCs</li>
      <li>Manages universal state using a flux model called <a
        href="https://vuex.vuejs.org/"
        target="_blank">Vuex</a></li>
      <li>Enables client-side and server-side application routing using <a
        href="https://router.vuejs.org/"
        target="_blank">Vue Router</a></li>
      <li>Fetches data from a backend service (i.e. xAPI) using a common interface:
        <ul>
          <li>Uses AJAX (<a
            href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest"
            target="_blank">XMLHttpRequests</a>) when the
            component is used in the browser
          </li>
          <li>Uses <a
            href="https://nodejs.org/api/http.html"
            target="_blank">http</a> requests when the component is used on the node server</li>
        </ul>
      </li><li>Combines local routes/state with routes & state controlled by child components</li>
      <li>Manages user session and authentication through a shared account component</li>
      <li>Uses preload/prefetch to cache priority network assets before they are needed</li>
      <li>Integrates with Macy's Coded Style Guide (CSG), built on fully-responsive <a
        href="https://foundation.zurb.com/"
        target="_blank">Foundation
        6</a></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  async beforeRouteResolve({ store }) {
    await store.dispatch('account/fetchUser');
  },
  computed: mapState('account', ['name']),
};
</script>
