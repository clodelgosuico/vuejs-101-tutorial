import exampleModule from '../../../src/components/example/example.module';
import { GET_ITEMS, GET_ITEM } from '../../../src/components/example/types/getters';

describe('example.module getters', () => {
  it(`${GET_ITEMS} should return items sorted by id`, () => {
    const state = {
      items: [
        { id: 2 },
        { id: 1 },
        { id: 3 },
      ],
    };

    expect(exampleModule({}).getters[GET_ITEMS](state)).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it(`${GET_ITEM} should return item from cache`, () => {
    const item = { id: 123 };
    const state = { items: [item] };
    expect(exampleModule({}).getters[GET_ITEM](state)(123)).toEqual({ id: 123 });
  });

  it(`${GET_ITEM} should handle parsing strings for id when doing cache lookup`, () => {
    const item = { id: 123 };
    const state = { items: [item] };
    expect(exampleModule({}).getters[GET_ITEM](state)('123')).toEqual({ id: 123 });
  });

  it(`${GET_ITEM} should throw an error if the string cannot be parsed as an integer`, () => {
    const item = { id: 123 };
    const state = { items: [item] };
    expect(() => exampleModule({}).getters[GET_ITEM](state)('asdf')).toThrow('Item ID is not a valid number');
  });
});
