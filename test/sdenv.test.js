const sdenvExtend = require('../sdenv-extend');

test('sdenv', () => {
  const sdenv = sdenvExtend();
  expect(sdenv === sdenvExtend()).toBe(true);
  expect(eval('!new function(){eval("this.a=1")}().a')).toBe(false)
});
