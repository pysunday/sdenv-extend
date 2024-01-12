import { setNativeFuncName } from './setFunc';
import { setNativeObjName } from './setObj';

export function getNativeProto(funcname, objname, attrs = {}) {
  // 自动生成原型函数并返回基于原始数据与该原型函数的实例化对象
  const func = setNativeFuncName(() => {
    throw new TypeError('Illegal constructor');
  }, funcname);
  const obj = setNativeObjName({
    __proto__: func,
    ...attrs,
  }, funcname);
  return [func, obj];
}
