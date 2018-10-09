import Vue from 'vue';
import exampleModule from '../../../src/components/example/example.module';
import { ADD_ITEM, ADD_ITEMS, ADD_TO_ITEM, SET_ITEMS } from '../../../src/components/example/types/mutations';

fdescribe('example.module mutations', () => {
  describe(`${ADD_ITEM}`, () => {
    it('should throw an error if attempting to add an item that already exists', () => {
      const state = {
        items: [
          { id: 123 },
        ],
      };

      expect(() => exampleModule({}).mutations[ADD_ITEM](state, { id: 123 })).toThrow('Item with ID 123 already exists');
    });

    it('should handle parsing string for id before doing lookup', () => {
      const state = {
        items: [
          { id: 123 },
        ],
      };

      expect(() => exampleModule({}).mutations[ADD_ITEM](state, { id: '123' })).toThrow('Item with ID 123 already exists');
    });

    it('should throw an error if the string cannot be parsed as an integer', () => {
      const state = {
        items: [
          { id: 123 },
        ],
      };

      expect(() => exampleModule({}).mutations[ADD_ITEM](state, { id: 'asdf' })).toThrow('Item ID is not a valid number');
    });

    it('should add the item to state if it does not already exist', () => {
      const state = { items: [] };
      exampleModule(({})).mutations[ADD_ITEM](state, { id: 123 });
      expect(state.items).toEqual([{ id: 123 }]);
    });
  });

  it(`${ADD_ITEMS} should spread items onto existing state, replacing state.items`, () => {
    const items = [{ id: 123 }];
    const state = { items };

    exampleModule(({})).mutations[ADD_ITEMS](state, { items: [{ id: 234 }] });
    expect(state.items).toEqual([{ id: 123 }, { id: 234 }]);
    expect(state.items).not.toBe(items);
  });

  describe(`${ADD_TO_ITEM}`, () => {
    it('should throw an error if attempting to add to an item that doesn not exist', () => {
      const state = { items: [] };
      expect(() => exampleModule({}).mutations[ADD_TO_ITEM](state, { id: 123 })).toThrow('Item with ID 123 does not exist');
    });

    it('should handle parsing string for id before doing lookup', () => {
      const state = { items: [] };
      expect(() => exampleModule({}).mutations[ADD_TO_ITEM](state, { id: '123' })).toThrow('Item with ID 123 does not exist');
    });

    it('should throw an error if the string cannot be parsed as an integer', () => {
      const state = {
        items: [
          { id: 123 },
        ],
      };

      expect(() => exampleModule({}).mutations[ADD_TO_ITEM](state, { id: 'asdf' })).toThrow('Item ID is not a valid number');
    });

    it('should throw an error if data is not provided', () => {
      const state = {
        items: [
          { id: 123 },
        ],
      };

      expect(() => exampleModule({}).mutations[ADD_TO_ITEM](state, { id: 123 })).toThrow('Missing required "data" to add to the item');
    });

    it('should add all the new keys to the item without breaking the binding, using Vue.set to trigger reactivity', () => {
      jest.spyOn(Vue, 'set');
      const item = { id: 123, a: 'foo' };
      const items = [item];
      const state = { items };

      exampleModule({}).mutations[ADD_TO_ITEM](state, {
        id: 123,
        data: {
          a: 'bar',
          b: 'qux',
        },
      });

      expect(Vue.set).toHaveBeenCalledWith(item, 'a', 'bar');
      expect(Vue.set).toHaveBeenCalledWith(item, 'b', 'qux');
      expect(state.items).toEqual([{ id: 123, a: 'bar', b: 'qux' }]);
      expect(state.items).toEqual(items);
      Vue.set.mockRestore();
    });
  });

  it(`${SET_ITEMS} should replace the items in state with what is provided`, () => {
    const prevItemState = [];
    const state = { items: prevItemState };
    const items = [{ id: 123 }];
    exampleModule(({})).mutations[SET_ITEMS](state, { items });
    expect(state.items).toEqual([{ id: 123 }]);
    expect(state.items).not.toEqual(prevItemState);
    expect(state.items).toEqual(items);
  });
});
