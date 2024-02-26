import { sdenv } from '../globalVarible';

let cache = undefined;

export function cookieHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = {
      cookieGet: Object.getOwnPropertyDescriptor(win.Document.prototype, 'cookie').get,
      cookieSet: Object.getOwnPropertyDescriptor(win.Document.prototype, 'cookie').set,
    }
  }
  const {
    getLog, // 开启get日志
    setLog, // 开启set日志
    log,
    getCb, // get的回调，设置的debugger更友好
    setCb, // set的回调，设置的debugger更友好
    cb, // 回调，设置的debugger更友好
    parse = (val) => val,
  } = config;
  Object.defineProperty(win.document, 'cookie', {
    configurable: false,
    enumerable: false,
    get() {
      const cookie = cache.cookieGet.call(win.document);
      if (getLog || log) win.console.log(`【GET COOKIE】长：${cookie.length} 值：${cookie}`);
      (getCb || cb)?.(cookie);
      return cookie;
    },
    set(val) {
      if (setLog || log) win.console.log(`【SET COOKIE】长：${val.length} 值：${val}`);
      (setCb || cb)?.(val);
      cache.cookieSet.call(win.document, parse(val));
    }
  })
}

export default cookieHandle;
