/**
 * Since routing by definition has to do with the overall structure of the application
 * and involves multiple components, it is best tested via integration or end-to-end tests.
 *
 * However there is value in testing the routes exist since they are used by internal
 * components. It is also useful to unit test any route guards or prop formatting
 * so that end-to-end tests don't have to consider every edge case.
 *
 * https://vue-test-utils.vuejs.org/guides/#common-tips
 */
import routes from '../../src/routes';

jest.mock(
  '../../src/components/home',
  () => ({ name: 'home' }),
);

jest.mock(
  '../../src/components/example/items',
  () => ({ name: 'items' }),
);

jest.mock(
  '../../src/components/example/item',
  () => ({ name: 'item' }),
);

jest.mock(
  '@component/account-vue',
  () => ({
    routes: () => ([
      { foo: 'bar' },
    ]),
  }),
);

fdescribe('routes.js', () => {
  afterAll(() => {
    jest.resetModules();
  });

  describe('home route', () => {
    let homeRoute;

    beforeEach(() => {
      homeRoute = routes().find(route => route.name === 'home');
    });

    it('should attach a route with the correct configuration', () => {
      expect(homeRoute).toEqual({
        name: 'home',
        path: '/',
        component: expect.any(Function), // actual routing should be tested via e2e tests
      });
    });

    it('should lazy load the home component', async () => {
      expect(await homeRoute.component()).toEqual({ name: 'home' });
    });
  });

  describe('items route', () => {
    let itemsRoute;

    beforeEach(() => {
      itemsRoute = routes().find(route => route.name === 'items');
    });

    it('should attach a route with the correct configuration', () => {
      expect(itemsRoute).toEqual({
        name: 'items',
        path: '/items',
        component: expect.any(Function), // actual routing should be tested via e2e tests
      });
    });

    it('should lazy load the items component', async () => {
      expect(await itemsRoute.component()).toEqual({ name: 'items' });
    });
  });

  describe('item route', () => {
    let itemRoute;

    beforeEach(() => {
      itemRoute = routes().find(route => route.name === 'item');
    });

    it('should attach a route with the correct configuration', () => {
      expect(itemRoute).toEqual({
        name: 'item',
        path: '/items/:id',
        component: expect.any(Function), // actual routing will be tested via e2e tests
        beforeEnter: expect.any(Function), // tested separately
        props: expect.any(Function), // tested separately
      });
    });

    it('should lazy load the item component', async () => {
      expect(await itemRoute.component()).toEqual({ name: 'item' });
    });

    it('should pass beforeEnter guard if the id is a parseable number', () => {
      const { beforeEnter } = itemRoute;
      const next = jest.fn();
      beforeEnter({
        params: {
          id: '123',
        },
      }, null, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should fail beforeEnter guard if the id is not a parseable number', () => {
      const { beforeEnter } = itemRoute;
      const next = jest.fn();
      beforeEnter({
        params: {
          id: 'foo',
        },
      }, null, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should cast item ID to integer in props, and pass others as-is', () => {
      const { props } = itemRoute;
      expect(props({
        params: {
          id: '123',
          foo: 'bar',
        },
      })).toEqual({
        id: 123,
        foo: 'bar',
      });
    });
  });

  it('should attach routes from account-vue', () => {
    expect(routes()).toEqual(expect.arrayContaining([{ foo: 'bar' }]));
  });
});
