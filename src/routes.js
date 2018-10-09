/**
 * Example using code splitting and componentization. The run-time imports will cause bundle split
 * points for webpack, and as a result, load chunks on-demand (when navigating between routes).
 *
 * @see https://webpack.js.org/guides/code-splitting/#dynamic-imports
 */
import { routes as account } from '@component/account-vue';

export default () => [
  {
    name: 'home',
    path: '/',
    component: () => import('./components/home'), // lazy-load home page by using a dynamic import
  },
  {
    name: 'items',
    path: '/items',
    component: () => import('./components/example/items'), // lazy-load items page by using a dynamic import
  },
  {
    name: 'item',
    path: '/items/:id',
    component: () => import('./components/example/item'), // lazy-load item page by using a dynamic import
    beforeEnter(to, from, next) {
      if (Number.isNaN(Number.parseInt(to.params.id, 10))) {
        next(new Error('Item ID in URL is not a valid number'));
      } else {
        next();
      }
    },
    props: (route) => {
      const props = { ...route.params };
      props.id = +props.id; // cast id to integer
      return props;
    },
  },
  ...account(), // adding account routes
];
