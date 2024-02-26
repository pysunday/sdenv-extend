export const setObjNative = function(obj, name) {
  // 修改函数的toString方法返回native code标识
  Object.defineProperty(obj, 'toString', {
    enumerable: false,
    configurable: true,
    writable: true,
    value() {
      return `[object ${name}]`;
    }
  });
  return obj;
};

export const setObjName = function(obj, name) {
  /*
    修改toString的显示，如：
      window.navigator.webkitPersistentStorage.toString() === '[object DeprecatedStorageQuota]'
  */
  Object.defineProperty(obj, Symbol.toStringTag, {
    configurable: true,
    enumerable: false,
    writable: false,
    value: name
  });
  return obj;
};

export const setNativeObjName = function(obj, name) {
  setObjName(obj, name);
  setObjNative(obj, name);
  return obj;
}
