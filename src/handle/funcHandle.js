export function funcHandle(config) {
  const self = this;
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const { log, cb } = config;
  win.Function = this.getTools('setNativeFuncName')(new Proxy(win.Function, {
    apply(target, thisArg, params) {
      const new_params = params.map((param) => {
        if (param.includes('debugger')) {
          param = param.replace(/debugger/g, '')
        }
        if (param.includes('sdDebugger')) {
          param = param.replace(/sdDebugger/g, 'debugger');
        }
        return param
      });
      if (log) win.console.log(`【FUNCTION APPLY】参数：${params.map(it => self.getTools('compressText')(JSON.stringify(it)))}`);
      const dynamicCode = {
        type: 'Function',
        params,
        tar_params: new_params,
      }
      cb?.(dynamicCode);
      self.cache.dynamicCode.push({ ...dynamicCode });
      return Reflect.apply(target, thisArg, new_params);
    }
  }), 'Function');
  win.Function.prototype.constructor = win.Function;
  this.getTools('setNativeFuncName')(win.Function.prototype, '');
}

export const funcInit = ['Function'];

export default funcHandle;
