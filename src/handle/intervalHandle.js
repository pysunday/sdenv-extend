export function intervalHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.sdWindow;
  const { log, cb, time, filter = () => true } = config;
  win.setInterval = this.getTools('setNativeFuncName')(new Proxy(win.setInterval, {
    apply: function (target, thisArg, params) {
      if (!filter || !filter(...params)) return;
      const [func, timeout] = params;
      const funcStr = func.param ? JSON.stringify(func.param) : self.getTools('compressText')(func.toString());
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
      return self.getTools('addInterval')(func, timeout);
    },
  }), 'setInterval');
}

export default intervalHandle;
