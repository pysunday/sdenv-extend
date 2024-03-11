import { sdenv } from '../globalVarible';

let cache = undefined;

export function intervalHandle(config) {
  if (typeof config !== 'object') config = {};
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.setInterval;
  }
  const { log, cb, time, filter = () => true } = config;
  win.setInterval = sdenv.tools.setNativeFuncName(new Proxy(cache, {
    apply: function (target, thisArg, params) {
      if (!filter || !filter(...params)) return;
      const [func, timeout] = params;
      const funcStr = func.param ? JSON.stringify(func.param) : sdenv.tools.compressText(func.toString());
      if (log) win.console.log(`【INTERVAL APPLY】增加setInterval事件，时间：${timeout}, 方法:${funcStr}`);
      if (time !== undefined) {
        if (typeof time !== 'number') throw new Error(`time配置如果存在值则必须是数字`);
        return Reflect.apply(target, thisArg, [
          () => {
            if (log) win.console.log(`【INTERVAL RUN】setInterval执行，时间：${timeout}，方法：${funcStr}`);
            func()
            if (log) win.console.log(`【INTERVAL RUNED】setInterval执行，时间：${timeout}，方法：${funcStr}`);
          },
          time || timeout,
        ]);
      }
      return sdenv.tools.addInterval(func, timeout);
    },
  }), 'setInterval');
}

export default intervalHandle;

export const getInterval = () => cache;
