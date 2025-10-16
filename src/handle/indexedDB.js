export function indexedDBHandle(config) {
  if (typeof config !== 'object') config = {};
  const win = this.memory.sdWindow;
  const { cb, log, ignore, getLog, setLog, getCb, setCb } = config;
  const self = this;
  win.IDBFactory.prototype.open = this.getTools('setFuncNative')(new Proxy(win.IDBFactory.prototype.open, {
    apply(target, thisArg, params) {
      if (log) win.console.log(`【indexedDB.open APPLY】参数：${params.map(it => self.getTools('compressText')(JSON.stringify(it)))}`);
      const name = params[0];
      cb?.({
        name,
        version: params[1],
        params,
      });
      const result = new Proxy(Reflect.apply(target, thisArg, params), {
        set(target, property, value, receiver) {
          if (['onupgradeneeded', 'onsuccess', 'onerror'].includes(property)) {
            if (setLog || log) {
              win.console.log(`indexedDB ${name} Setting ${property} to ${self.tools.compressText(value.toString())}`);
            }
            (setCb || cb)?.(property, value, name);
            if (ignore) value = () => {};
            target[property] = value;
            return true;
          }
          return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
          if (getLog) win.console.log(`indexedDB ${name} Getting ${property}`);
          (getCb || cb)?.(property, name);
          try {
            let value = Reflect.get(target, property);
            if (typeof value === 'function') {
              value = value.bind(target);
            }
            return value;
          } catch (err) {
            win.console.warn(`indexedDB ${name} Getting ${property} failed:`, err);
            return undefined;
          }
        },
      });
      return result;
    },
  }), 'open', 1);
}

export default indexedDBHandle;
