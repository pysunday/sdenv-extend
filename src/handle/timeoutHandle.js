export function timeoutHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const { log, cb, time, filter = () => true } = config;
  win.setTimeout = this.getTools('setNativeFuncName')(new Proxy(win.setTimeout, {
    apply: function (target, thisArg, params) {
      const timeoutIdx = self.cache.timeoutIdx = self.cache.timeoutIdx + 1;
      if (!filter || !filter(...params)) return;
      const [func, timeout] = params;
      const funcStr = func.param ? JSON.stringify(func.param) : self.getTools('compressText')(func.toString());
      if (log) win.console.log(`【TIMEOUT APPLY】增加setTimeout事件，时间：${timeout}, 方法: ${funcStr}`);
      if (time !== undefined) {
        if (typeof time !== 'number') throw new Error(`time配置如果存在值则必须是数字`);
        return Reflect.apply(target, thisArg, [
          () => {
            if (log) win.console.log(`【TIMEOUT RUN】setTimeout执行，时间：${timeout}，方法：${funcStr}`);
            if (cb) cb('run_before', timeoutIdx);
            func()
            if (log) win.console.log(`【TIMEOUT RUNEND】setTimeout执行，时间：${timeout}，方法：${funcStr}`);
            if (cb) cb('run_after', timeoutIdx);
          },
          time || timeout,
        ]);
      }
      return self.getTools('addTimeout')(func, timeout);
    },
  }), 'setTimeout');
}

export const timeoutInit = ['setTimeout'];

export default timeoutHandle;
