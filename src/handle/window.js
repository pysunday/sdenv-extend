export function windowHandle(config = {}) {
  if (!this.config.isNode) {
    console.error('该方法只在node环境下有效!');
    return;
  }
  const self = this;
  const vm = require("vm");
  if (typeof config !== 'object') config = {};
  let finishFlag = false;
  const realm = {
    win: undefined,
    func: undefined,
    context: undefined,
    ori: undefined,
    proxyRecord: new WeakMap(),
  };
  ['Undefined', 'Error', 'Own', 'Win'].forEach(key => {
    const name = `windowGetter${key}Keys`;
    if (config[name] === undefined) config[name] = [];
    if (!Array.isArray(config[name])) throw new Error(`参数${name}值必须为数组请检查！`);
    config[name].push(...self.config[name])
  });
  self._registerConfig('handle:window', config, () => {
    config.log = (l => {
      if (!l || typeof l === 'function') return l;
      return (type, ...p) => {
        if (Array.isArray(l) && !l.includes(p[0])) return;
        self.memory.window.console.log(`【WINDOW PROXY】${type}: ${p.join(' = ')}`);
      }
    })(config.log);
    config.parse = (p => typeof p === 'function' ? p : (val => val))(config.parse);
  });
  self.getTools('wrapFunc')(vm, 'runInContext', (runInContext, code, context = 'window', setting = {}) => {
    const createContext = Object.create(null);
    if (context === 'window' || String(context) === '[object Window]') {
      if (context !== 'window') realm.ori = context;
      const handler = {
        has(target, prop) {
          finishFlag && config.log && config.log('has', String(prop));
          if (config.windowGetterUndefinedKeys.includes(prop)) return false;
          return config.parse(Reflect.has(realm.ori, prop), 'has');
        },
        deleteProperty(target, prop) {
          finishFlag && config.log && config.log('deleteProperty', String(prop));
          return config.parse(Reflect.deleteProperty(realm.ori, prop), 'deleteProperty');
        },
        ownKeys(target) {
          finishFlag && config.log && config.log("ownKeys");
          return config.parse(Reflect.ownKeys(realm.ori).filter(it => !config.windowGetterUndefinedKeys.includes(it)), 'ownKeys');
        },
        getOwnPropertyDescriptor(target, prop) {
          finishFlag && config.log && config.log('getOwnPropertyDescriptor', String(prop));
          if (config.windowGetterWinKeys.includes(prop)) {
            return Reflect.getOwnPropertyDescriptor(target, prop);
          }
          const descOri = Reflect.getOwnPropertyDescriptor(realm.ori, prop);
          let descTar = Reflect.getOwnPropertyDescriptor(target, prop);
          if (!descTar && descOri?.configurable === false) {
            Object.defineProperty(target, prop, { ...descOri, configurable: true });
            descTar = Reflect.getOwnPropertyDescriptor(target, prop);
          }
          return config.parse(descTar || descOri, 'getOwnPropertyDescriptor');
        },
        defineProperty(target, prop, descriptor) {
          finishFlag && config.log && config.log(`defineProperty: ${String(prop)}`);
          return config.parse(Reflect.defineProperty(realm.ori, prop, descriptor), 'defineProperty');
        },
        preventExtensions(target) {
          finishFlag && config.log && config.log("preventExtensions");
          return config.parse(Reflect.preventExtensions(realm.ori), 'preventExtensions');
        },
        isExtensible(target) {
          finishFlag && config.log && config.log("isExtensible");
          return config.parse(Reflect.isExtensible(realm.ori), 'isExtensible');
        },
        getPrototypeOf(target) {
          finishFlag && config.log && config.log("getPrototypeOf");
          return config.parse(Reflect.getPrototypeOf(realm.ori), 'getPrototypeOf');
        },
        setPrototypeOf(target, proto) {
          finishFlag && config.log && config.log("setPrototypeOf");
          return config.parse(Reflect.setPrototypeOf(realm.ori, proto), 'setPrototypeOf');
        },
        get(target, prop) {
          finishFlag && !['devtoolsFormatters'].includes(prop) && config.log && config.log('get', String(prop));
          if (config.windowGetterWinKeys.includes(prop)) return realm.win;
          if (config.windowGetterUndefinedKeys.includes(prop)) return undefined;
          if (prop === 'eval') {
            return self.tools.setFuncNative((code) => {
              if (!code.includes('window')) return realm.ori.eval(code);
              return runInContext(code, vm.createContext(realm.context), setting);
            }, 'eval', 1)
          }
          if (!Reflect.has(realm.ori, prop) && config.windowGetterErrorKeys.includes(prop)) {
            throw new ReferenceError(`${prop} is not defined`);
          }
          return config.parse(Reflect.get(realm.ori, prop), 'get');
        },
        set(target, prop, value) {
          finishFlag && config.log && config.log('set', String(prop), value);
          if (config.windowGetterWinKeys.includes(prop)) return false;
          return config.parse(Reflect.set(realm.ori, String(prop), value), 'set');
        },
      };
      if (!realm.context) {
        realm.context = new Proxy(createContext, handler);
        config.windowGetterWinKeys.forEach(key => {
          realm.context[key] = realm.context;
        })
        realm.proxyRecord.set(realm.context, true);
        realm.func = runInContext("(function(){ return (function(){}).constructor })()", vm.createContext(realm.context));
        self.getTools('setToString')(realm.func.prototype);
        realm.context.Window.constructor = realm.context.Function = realm.func;
      }
      if (!realm.win) {
        realm.win = new Proxy(createContext, handler);
        config.windowGetterWinKeys.forEach(key => {
          realm.win[key] = realm.win;
        })
        realm.proxyRecord.set(realm.win, true);
        realm.win.Function = realm.func;
      }
      const newContext = vm.createContext(realm.context);
      finishFlag = true;
      return runInContext(config.parse(code, 'code', context), newContext, setting);
    }
    return runInContext(code, context, setting);
  });
}

export default windowHandle;
