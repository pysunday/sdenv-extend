const evalmap = {
  '!new function(){eval("this.a=1")}().a': 'false',
}

export function evalHandle(config) {
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const { cb, log } = config;
  const self = this;
  win.eval = this.getTools('setNativeFuncName')(new Proxy(win.eval, {
    apply(target, thisArg, params) {
      if (log) win.console.log(`【EVAL APPLY】参数：${params.map(it => self.getTools('compressText')(JSON.stringify(it)))}`);
      const new_params = params.map((param) => {
        if (typeof evalmap[param] === 'string') return evalmap[param];
        if (param.includes('debugger')) {
          param = param.replace(/debugger/g, '')
        }
        if (param.includes('sdDebugger')) {
          param = param.replace(/sdDebugger/g, 'debugger');
        }
        return param
      });
      const dynamicCode = {
        type: 'eval',
        params,
        tar_params: new_params,
      }
      cb?.(dynamicCode);
      self.cache.dynamicCode.push({ ...dynamicCode });
      return Reflect.apply(target, thisArg, new_params);
    },
  }), 'eval');
}

export const evalInit = ['eval'];

export default evalHandle;
