import { sdenv } from '../globalVarible';

const delay = (ms) => new Promise(resolve => sdenv.memory.sdWindow.setTimeout(resolve, ms))

let cache = undefined;

export function eventHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.addEventListener;
  }
  const { addLog, runLog, log, addCb, runCb, cb, filter = () => true } = config;
  win.addEventListener = sdenv.tools.setNativeFuncName(new Proxy(cache, {
    apply: function (target, thisArg, params) {
      if (!filter || !filter(...params)) return;
      const [type, callback] = params;
      const funcStr = callback.param ? JSON.stringify(callback.param) : sdenv.tools.compressText(callback.toString());
      if (addLog || log) win.console.log(`【ADD EVENT】事件名：${type}, 方法：${funcStr}`);
      (addCb || cb)?.(...params);
      return Reflect.apply(target, thisArg, [
        type,
        async () => {
          // load事件需要等下一次事件循环时执行: 延时为0的定时任务先执行
          if (type === 'load') await delay(0);
          (runCb || cb)?.(...params);
          if (runLog || log) win.console.log(`【RUN EVENT】事件名：${type}, 方法：${funcStr}`);
          callback();
        },
      ]);
    },
  }), 'addEventListener');
}

export default eventHandle;
