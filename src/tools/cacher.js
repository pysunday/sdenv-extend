import _get from 'lodash-es/get';

export function addRuntimeData(name, key, val) {
  // 添加运行时数据
  if (!this.cache.runtime[name]) this.cache.runtime[name] = {};
  const runtimeData = this.cache.runtime[name];
  if (!runtimeData[key]) runtimeData[key] = [];
  runtimeData[key].push(val);
  return val;
}

export function getRuntimeData(name, key) {
  return _get(this, ['cache.runtime', name, key]
    .filter((it) => it !== undefined)
    .join('.'));
}
