const sdenvExtend = require('../');

test('sdenv', () => {
  const sdenv = new sdenvExtend();
  expect(sdenv === sdenvExtend()).toBe(true);
  expect(eval('!new function(){eval("this.a=1")}().a')).toBe(false)
});
