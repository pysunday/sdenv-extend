const originToString = Function.toString;
const canToStrigArr = [];
const toString = function() {
  if (canToStrigArr.includes(this.name)) {
    return `function ${this.name || ''}() { [native code] }`;
  }
  return originToString.apply(this);
}

export const setFuncNative = function(func, name) {
  // 修改函数的toString方法返回native code标识
  if (!func) return undefined;
  func.name = name || func.name || '';
  canToStrigArr.push(func.name);
  Object.defineProperty(func, 'toString', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: toString,
  });
  return func;
};

export const setFuncName = function(func, name) {
  // 修改方法的name属性值
  Object.defineProperty(func, 'name', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: name
  });
  return func;
}

export const setNativeFuncName = function(func, name) {
  setFuncName(func, name);
  setFuncNative(func, name);
  return func;
}
setNativeFuncName(toString, 'toString');
