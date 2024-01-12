import { sdenv } from '../globalVarible';

export function funcHandle() {
  const win = sdenv.memory.sdWindow;
  win.Function = sdenv.tools.setNativeFuncName(new Proxy(sdenv.memory.sdFunction, {
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
      sdenv.cache.dynamicCode.push({
        type: 'Function',
        params: new_params,
      });
      const retFun = Reflect.apply(target, thisArg, new_params);
      // eslint-disable-next-line
      return (function() {
        return function() {
          return retFun();
        }
      })(params);
    }
  }), 'Function');
  win.Function.prototype.constructor = win.Function;
  sdenv.tools.setNativeFuncName(win.Function.prototype, '');
}

export default funcHandle;
