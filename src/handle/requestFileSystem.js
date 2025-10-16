export function requestFileSystemHandle(config) {
  if (typeof config !== 'object') config = {};
  const win = this.memory.sdWindow;
  const { cb, log, ignore } = config;
  const self = this;
  if (win.webkitRequestFileSystem) {
    // webkit内核浏览器属性
    win.webkitRequestFileSystem = this.getTools('setFuncNative')(new Proxy(win.webkitRequestFileSystem, {
      apply(target, thisArg, params) {
        if (log) win.console.log(`【webkitRequestFileSystem APPLY】参数：${params.map(it => self.getTools('compressText')(JSON.stringify(it)))}`);
        cb?.({
          type: params[0] ? 'window.PERSISTENT' : 'window.TEMPORARY',
          size: params[1],
          params,
        });
        if (ignore) params[2] = params[3] = () => {};
        return Reflect.apply(target, thisArg, params);
      },
    }), 'webkitRequestFileSystem', 3);
  }
}

export default requestFileSystemHandle;
