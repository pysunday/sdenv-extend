import { sdenv } from '../globalVarible';

let cache = undefined;

export function funcHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.Function;
  }
  const { log, cb } = config;
  win.Function = sdenv.tools.setNativeFuncName(new Proxy(cache, {
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
      if (log) win.console.log(`【FUNCTION APPLY】参数：${params.map(it => sdenv.tools.compressText(JSON.stringify(it)))}`);
      const dynamicCode = {
        type: 'Function',
        params,
        tar_params: new_params,
      }
      cb?.(dynamicCode);
      sdenv.cache.dynamicCode.push({ ...dynamicCode });
      return Reflect.apply(target, thisArg, new_params);
    }
  }), 'Function');
  win.Function.prototype.constructor = win.Function;
  sdenv.tools.setNativeFuncName(win.Function.prototype, '');
}

export default funcHandle;
