const sdenv = require('../sdenv-extend')();

test('has tools', () => {
  expect(Object.keys(sdenv.tools).length > 0).toBe(true);
});
