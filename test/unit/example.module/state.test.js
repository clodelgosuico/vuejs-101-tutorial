import exampleModule from '../../../src/components/example/example.module';

describe('example.module state', () => {
  it('sets default empty items state', () => {
    expect(exampleModule({}).state()).toEqual({
      items: [],
    });
  });
});
