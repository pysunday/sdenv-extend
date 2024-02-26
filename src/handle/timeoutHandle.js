import { sdenv } from '../globalVarible';

let cache = undefined;

export function timeoutHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.setTimeout;
  }
  const { log, cb, time, filter = () => true } = config;
  win.setTimeout = sdenv.tools.setNativeFuncName(new Proxy(cache, {
    apply: function (target, thisArg, params) {
      if (!filter(...params)) return;
      const [func, timeout] = params;
      const funcStr = sdenv.tools.compressText(func.toString());
      if (log) win.console.log(`【TIMEOUT APPLY】增加setTimeout事件，时间：${timeout}, 方法:${funcStr}`);
      if (time !== undefined) {
        if (typeof time !== 'number') throw new Error(`time配置如果存在值则必须是数字`);
        return Reflect.apply(target, thisArg, [
          () => {
            if (log) win.console.log(`【TIMEOUT RUN】setTimeout执行，时间：${timeout}，方法：${funcStr}`);
            func()
            if (log) win.console.log(`【TIMEOUT RUNED】setTimeout执行，时间：${timeout}，方法：${funcStr}`);
          },
          time || timeout,
        ]);
      }
      return sdenv.tools.addTimeout(func, timeout);
    },
  }), 'setTimeout');
  win.document.addEventListener('readystatechange', function() {
    if (log) win.console.log(`【READY STATE】${win.document.readyState}`);
  });
}

export default timeoutHandle;

export const getTimeout = () => cache;
