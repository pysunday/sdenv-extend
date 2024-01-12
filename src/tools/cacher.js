import _get from 'lodash-es/get';
import { sdenv } from '../globalVarible';

export function addRuntimeData(name, key, val) {
  // 添加运行时数据
  if (!sdenv.cache.runtime[name]) sdenv.cache.runtime[name] = {};
  const runtimeData = sdenv.cache.runtime[name];
  if (!runtimeData[key]) runtimeData[key] = [];
  runtimeData[key].push(val);
  return val;
}

export function getRuntimeData(name, key) {
  return _get(sdenv, ['cache.runtime', name, key]
    .filter((it) => it !== undefined)
    .join('.'));
}
