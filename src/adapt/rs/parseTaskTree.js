// 修改任务树增加任务名称等信息
import { sdenv } from '../../globalVarible';

function parse(val, keyMap = {}, deep = 0, deeps = [0]) {
  // 任务列表、主要子树、次要子树、监控值变化的配置
  if (keyMap._count === undefined) keyMap._count = 0;
  const { taskKey, oneKey, twoKey, monitor = {} } = keyMap;
  const str = val[taskKey];
  val.str = str;
  val.val = {};
  if (!str) {
    val.arr = [];
    val[taskKey] = [];
  } else {
    val.arr = str.split('').map((it) => it.charCodeAt())
    if (keyMap._count > 0) val[taskKey] = [...val.arr]; // 最外层让瑞数自己处理
  }
  val.idx = `${deeps.join('>')}-${keyMap._count++}`;
  val[oneKey] = val[oneKey].map((it, idx) => {
    if (it) {
      parse(it, keyMap, deep + 1, [...deeps, 'one', idx]);
      return sdenv.tools.monitor(it, it.idx, { setLog: false, ...monitor });
    }
    return it;
  });
  val[twoKey] = val[twoKey].map((it, idx) => {
    if (it) {
      parse(it, keyMap, deep + 1, [...deeps, 'two', idx]);
      return sdenv.tools.monitor(it, it.idx, { setLog: false, ...monitor });
    }
    return it;
  })
  return val;
}

export const parseTaskTree = function(...params) {
  sdenv.cache.runsObj = parse(...params); // 任务树
  sdenv.cache.runsArr = []; // 任务运行时队列
}
