const getUid = function(str) {
    const arr = [];
    for (let i = 0; i < str.length; i += 2) {
        arr.push(parseInt(str.substr(i, 2), 16));
    }
    return 'U' + String.fromCharCode(...arr).split('').map(it => it.charCodeAt()).join('');
}

const getKeyname = (val, keyMap = {}) => {
  const keys = Object.keys(val).map(key => ([key, typeof val[key]]));
  const newKeyMap = {};
  const strs = keys.filter(([key, type]) => type === 'string').map(it => it[0]);
  const nums = keys.filter(([key, type]) => type === 'number').map(it => it[0]);
  const arrs = keys.filter(([key, type]) => type === 'object' && Array.isArray(val[key])).map(it => it[0]);
  if (strs.length !== 1 || nums.length !== 2 || arrs.length !== 2) {
    console.error('任务树结构有变化，请手动传入！');
    return keyMap;
  }
  newKeyMap.taskKey = strs[0];
  [newKeyMap.lensKey, newKeyMap.isResetKey] = val[nums[0]] > val[nums[1]] ? nums : nums.reverse();
  [newKeyMap.oneKey, newKeyMap.twoKey] = val[arrs[0]].length > val[arrs[1]].length ? arrs : arrs.reverse();
  Object.assign(keyMap, newKeyMap);
  return keyMap;
}

// 修改任务树增加任务名称等信息
function parse(val, keyMap = {}, deep = 0, deeps = [0], parent = null) {
  // 任务列表、主要子树、次要子树、监控值变化的配置
  if (keyMap._count === undefined) keyMap._count = 0;
  const { taskKey, oneKey, twoKey, monitor = {}, lensKey, isResetKey } = getKeyname(val, keyMap);
  const str = val[taskKey];
  val.parent = parent;
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
  val.uid = getUid([deep, val[lensKey], val[isResetKey], val.arr.length, val[oneKey].length, val[twoKey].length].join('-'));
  val[oneKey] = val[oneKey].map((it, idx) => {
    if (it) {
      parse.call(this, it, keyMap, deep + 1, [...deeps, 'one', idx], val);
      return this.getTools('monitor')(it, it.idx, { setLog: false, ...monitor });
    }
    return it;
  });
  val[twoKey] = val[twoKey].map((it, idx) => {
    if (it) {
      parse.call(this, it, keyMap, deep + 1, [...deeps, 'two', idx], val);
      return this.getTools('monitor')(it, it.idx, { setLog: false, ...monitor });
    }
    return it;
  })
  return val;
}

export const parseTaskTree = function(...params) {
  this.cache.runsObj = parse.call(this, ...params); // 任务树
  this.cache.runsArr = []; // 任务运行时队列
}
