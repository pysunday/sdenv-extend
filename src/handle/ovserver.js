export function ovserverHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const delay = (ms) => new Promise(resolve => win.setTimeout(resolve, ms))
  const { newLog, addLog, runLog, log, addCb, runCb, newCb, cb, filter = () => true } = config;
  win.MutationObserver = this.getTools('setNativeFuncName')(new Proxy(win.MutationObserver, {
    construct: function (target, argArray, newTarget) {
      const [func] = argArray;
      const funcStr = func.param ? JSON.stringify(func.param) : self.getTools('compressText')(func.toString());
      if (newLog || log) win.console.log(`【NEW OVSERVER】方法：${funcStr}`);
      (newCb || cb)?.(...argArray);
      const result = Reflect.construct(target, [async (...params) => {
        if (runLog || log) win.console.log(`【RUN OVSERVER】方法：${funcStr}`);
        (runCb || cb)?.(...params[0]);
        if (!filter || !filter(...argArray)) return;
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

export const ovserverInit = ['MutationObserver'];

export default ovserverHandle;
