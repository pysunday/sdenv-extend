export function cookieInit(memory) {
  if (memory.cookieGet) return;
  const win = memory.window;
  memory.cookieGet = (...params) => Object.getOwnPropertyDescriptor(win.Document.prototype, 'cookie').get.call(win.document, ...params);
  memory.cookieSet = (...params) => Object.getOwnPropertyDescriptor(win.Document.prototype, 'cookie').set.call(win.document, ...params);
}

export function cookieHandle(config) {
  if (typeof config !== 'object') config = {};
  const self = this;
  const win = this.memory.window;
  const {
    getLog, // 开启get日志
    setLog, // 开启set日志
    log,
    getCb, // get的回调，设置的debugger更友好
    setCb, // set的回调，设置的debugger更友好
    cb, // 回调，设置的debugger更友好
    parse = (val) => val,
  } = config;
  const timeMap = {};
  Object.defineProperty(win.document, 'cookie', {
    configurable: false,
    enumerable: false,
    get() {
      const cookie = self.memory.cookieGet();
      if (getLog || log) win.console.log(`【GET COOKIE】长：${cookie.length} 值：${cookie}`);
      (getCb || cb)?.(cookie);
      return cookie;
    },
    set(val) {
      const key = val.split('=')[0];
      timeMap[key] === undefined ? timeMap[key] = 1 : timeMap[key] ++;
      if (setLog || log) win.console.log(`【SET COOKIE】次数：${timeMap[key]} 长：${val.length} 值：${val}`);
      (setCb || cb)?.(val, key, timeMap[key]);
      self.memory.cookieSet(parse(val));
    }
  })
}

export default cookieHandle;
