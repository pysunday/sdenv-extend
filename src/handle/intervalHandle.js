export function intervalHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const { log, cb, time, filter = () => true } = config;
  win.setInterval = this.getTools('setNativeFuncName')(new Proxy(win.setInterval, {
    apply: function (target, thisArg, params) {
      const intervalIdx = self.cache.intervalIdx = self.cache.intervalIdx + 1;
      if (!filter || !filter(...params)) return;
      const [func, timeout] = params;
      const funcStr = func.param ? JSON.stringify(func.param) : self.getTools('compressText')(func.toString());
      if (log) win.console.log(`【INTERVAL APPLY】增加setInterval事件，时间：${timeout}, 方法:${funcStr}`);
      if (time !== undefined) {
        if (typeof time !== 'number') throw new Error(`time配置如果存在值则必须是数字`);
        return Reflect.apply(target, thisArg, [
          () => {
            if (log) win.console.log(`【INTERVAL RUN】setInterval执行，时间：${timeout}，方法：${funcStr}`);
            if (cb) cb('run_before', intervalIdx);
            func()
            if (log) win.console.log(`【INTERVAL RUNED】setInterval执行，时间：${timeout}，方法：${funcStr}`);
            if (cb) cb('run_after', intervalIdx);
          },
          time || timeout,
        ]);
      }
      return self.getTools('addInterval')(func, timeout);
    },
  }), 'setInterval');
}

export const intervalInit = ['setInterval'];

export default intervalHandle;
