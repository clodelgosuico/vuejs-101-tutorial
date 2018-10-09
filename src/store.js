import { store as account } from '@component/account-vue';
import { store as slideout } from '@component/slideout-vue';
import example from './components/example/example.module';

export default ({ router }) => ({
  modules: {
    account: account(), // adding account store as a module
    slideout: slideout(), // adding slideout store as a module
    example: example({ router }), // passing router to example module so it can provide CancelToken for route change
  },
});
