import { sdenv } from '../globalVarible';

const delay = (ms) => new Promise(resolve => sdenv.memory.sdWindow.setTimeout(resolve, ms))

let cache = undefined;

export function ovserverHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.MutationObserver;
  }
  const { newLog, addLog, runLog, log, addCb, runCb, newCb, cb, filter = () => true } = config;
  win.MutationObserver = sdenv.tools.setNativeFuncName(new Proxy(cache, {
    construct: function (target, argArray, newTarget) {
      const [func] = argArray;
      const funcStr = func.param ? JSON.stringify(func.param) : sdenv.tools.compressText(func.toString());
      if (newLog || log) win.console.log(`【NEW OVSERVER】方法：${funcStr}`);
      (newCb || cb)?.(...argArray);
      const result = Reflect.construct(target, [async (...params) => {
        if (!filter || !filter(...argArray)) return;
        if (runLog || log) win.console.log(`【RUN OVSERVER】方法：${funcStr}`);
        (runCb || cb)?.(...params[0]);
        await delay(0);
        func(...params);
      }], newTarget);
      result.observe = new Proxy(result.observe, {
        apply: function (target, thisArg, params) {
          if (addLog || log) win.console.log(`【ADD OVSERVER】方法：${funcStr}`);
          (addCb || cb)?.(...params);
          return Reflect.apply(target, thisArg, params);
        }
      })
      return result;
    },
  }), 'MutationObserver');
}

export default ovserverHandle;
