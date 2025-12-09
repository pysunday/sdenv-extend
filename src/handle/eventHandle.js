export function eventHandle(config) {
  const self = this;
  const win = this.memory.window;
  if (typeof config !== 'object') config = {};
  const { addLog, runLog, log, addCb, runCb, cb, filter = () => true, parse = (type, ...p) => p } = config;
  win.addEventListener = win.document.addEventListener = this.getTools('setFuncNative')(new Proxy(win.addEventListener, {
    apply: function (target, thisArg, params) {
      if (!filter || !filter(...params)) return;
      const [type, callback] = params;
      const funcStr = callback.param ? JSON.stringify(callback.param) : self.getTools('compressText')(callback.toString());
      if (addLog || log) win.console.log(`【ADD EVENT】事件名：${type}, 方法：${funcStr}`);
      (addCb || cb)?.(...params);
      return Reflect.apply(target, thisArg, [
        type,
        (...p) => {
          (runCb || cb)?.(...params);
          if (runLog || log) win.console.log(`【RUN EVENT】事件名：${type}, 方法：${funcStr}`);
          callback(...parse(type, p));
        },
      ]);
    },
  }), 'addEventListener', 2);
}

export const eventInit = ['addEventListener'];

export default eventHandle;
