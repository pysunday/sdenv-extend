/* eslint-disable no-debugger */

export function monitor(tar, name, config = {}) {
  const win = this.memory.window;
  const tools = this.tools;
  const {
    getLog, // 开启get日志
    setLog, // 开启set日志
    log,
    getKeys = [], // 触发get的debugger的键集合
    setKeys = [], // 触发set的debugger的键集合
    keys = [], // 触发debugger的键集合
    getCb, // get的回调，设置的debugger更友好
    setCb, // set的回调，设置的debugger更友好
    cb, // 回调，设置的debugger更友好
    getParse = (key, val) => val,
    setParse = (key, val) => val,
    handles = {},
  } = config;
  if (!this.cache.monitor[name]) this.cache.monitor[name] = [];
  tar.sdMonitorName = name;
  const newTar = new win.Proxy(tar, {
    get(target, property, receiver) {
      if (getLog || log) win.console.log(`${name} Getting ${property}`);
      if (getKeys.includes(property) || keys.includes(property)) debugger;
      (getCb || cb)?.(property, name);
      return getParse(property, target[property], target);
    },
    set(target, property, value, receiver) {
      const show = [
        win,
        win.Math,
        win.navigation
      ].includes(value) && value.toString ? value.toString() : value
      if ((setLog || log ) && !(Array.isArray(target) && property === 'length')) {
        win.console.log(`${name} Setting ${property} to ${tools.compressText(show)}`);
      }
      if (setKeys.includes(property) || keys.includes(property)) debugger;
      (setCb || cb)?.(property, value, name);
      return Reflect.set(target, property, setParse(property, value, target), receiver);
    },
    ...handles,
  });
  this.cache.monitor[name].push(newTar);
  return newTar;
}

export function monitorFunction(tar, name, config = {}) {
  const win = this.memory.window;
  const {
    log, // 开启日志
    isDebugger, // 是否在调用时触发debugger
    cb, // 回调，设置的debugger更友好
  } = config;
  if (!this.cache.monitor[name]) this.cache.monitor[name] = [];
  const newTar = new win.Proxy(tar, {
    apply(target, thisArg, argArray) {
      const result = Reflect.apply(target, thisArg, argArray);
      if (log) win.console.log(`${name} Apply ${argArray}`);
      if (isDebugger) debugger;
      cb?.(argArray, result, name);
      return result;
    }
  });
  this.cache.monitor[name].push(newTar);
  return newTar;
}

export function getMonitor(name) {
  if (name) return this.cache.monitor[name];
  return this.cache.monitor
}
