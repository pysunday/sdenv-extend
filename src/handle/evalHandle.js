import { sdenv } from '../globalVarible';

let cache = undefined;

const evalmap = {
  '!new function(){eval("this.a=1")}().a': 'false',
}

export function evalHandle(config = {}) {
  if (!config) return
  const win = sdenv.memory.sdWindow;
  if (!cache) {
    cache = win.eval;
  }
  const { cb, log } = config;
  win.eval = sdenv.tools.setNativeFuncName(new Proxy(cache, {
    apply(target, thisArg, params) {
      if (log) win.console.log(`【EVAL APPLY】参数：${params.map(it => sdenv.tools.compressText(JSON.stringify(it)))}`);
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
      sdenv.cache.dynamicCode.push({ ...dynamicCode });
      return Reflect.apply(target, thisArg, new_params);
    },
  }), 'eval');
}

export default evalHandle;
