export function requestHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.sdWindow;
  const { log, cb } = config;
  win.XMLHttpRequest = new win.Proxy(win.XMLHttpRequest, {
    construct(target, args, newTarget) {
      return new win.Proxy(win.Reflect.construct(target, args, newTarget), {
        set(target, prop, value, receiver) {
          if (typeof value === 'function') {
            return win.Reflect.set(target, prop, new win.Proxy(value, {
              apply(fn, thisArg, params) {
                if (thisArg.readyState === 4) {
                  if (log) win.console.log(`【REQUEST ${prop} APPLY】链接：${xhr.responseURL}，状态码：${xhr.status}，返回数据；${xhr.responseText}`);
                  if (cb) cb({
                    name: prop,
                    url: thisArg.responseURL,
                    status: thisArg.status,
                    response: thisArg.responseText
                  })
                }
                return win.Reflect.apply(fn, thisArg, params);
              }
            }), receiver);
          }
          return win.Reflect.set(target, prop, value, receiver);
        }
      });
    }
  });
}
