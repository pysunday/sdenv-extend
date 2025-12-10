let originToString = Function.toString;
const canToStrigArr = [];
export const toString = function() {
  if (canToStrigArr.includes(this.name)) {
    return `function ${this.name || ''}() { [native code] }`;
  }
  return originToString.call(this);
}

export const setFuncNative = function(func, name, len) {
  // 修改函数的toString方法返回native code标识
  if (!func) return undefined;
  if (typeof name === 'string') Object.defineProperty(func, 'name', { value: name });
  else if (typeof name === 'number') len = name;
  if (typeof len === 'number') Object.defineProperty(func, 'length', { value: len });
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

export const setToString = function(target) {
  // 修改方法的name属性值
  Object.defineProperty(target, 'toString', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: toString
  });
}

export const setNativeFuncName = function(func, name, len) {
  setFuncName(func, name);
  setFuncNative(func, name, len);
  return func;
}
setFuncNative(toString, 'toString');

export const _setFuncInit = function(win) {
  setFuncNative(toString, 'toString');
  win.Function.prototype.toString = toString;
  toString.__proto__ = win.Function.prototype;
}

export const wrapFunc = function(obj, name, callback, isBind = true) {
  const originFunc = obj[name];
  const wrap = function (...params) {
    return callback.call(this, isBind ? originFunc.bind(this) : originFunc, ...params);
  };
  setFuncNative(wrap, name, originFunc.length);
  obj[name] = wrap;
  return wrap;
}
