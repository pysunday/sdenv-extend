const sdenv = require('../sdenv-extend')({
  config: {
    randomReturn: 0.123,
    randomFixed: true
  },
  datas: {
    dateAndRandom: {
      firstMap: { _getTime: 1704778312614, _newdate: 1704778312614 },
      _getTime: [0, 100],
      _newdate: [0, 100]
    }
  }
});

test('looprun test', () => {
  const { runloop } = sdenv.cache;
  const {
    addLoop,
    curLoop,
    current,
    loopobj
  } = sdenv.utils.initLoop('casekey', 0, 'funcname', [1, 2, 3, 4, 5]);
  expect(curLoop()).toBe(0);
  addLoop(0, 10, 'casekey');
  expect(curLoop()).toBe(1);
  addLoop(1, 8, 'casekey');
  expect(curLoop()).toBe(2);
  expect(runloop.current).toBe(2);
  expect(current).toBe(1);
  expect(loopobj.data).toEqual([10, 8]);
  expect(loopobj.idxs).toEqual([0, 1]);
});

test('dateAndRandom test', () => {
  expect(Math.random()).toBe(0.123);
  expect(new Date().getTime()).toBe(1704778312614);
  expect(new Date().getTime()).toBe(1704778312714);
});
