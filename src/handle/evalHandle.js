import { sdenv } from '../globalVarible';

const evalmap = {
  '!new function(){eval("this.a=1")}().a': 'false',
}

export function evalHandle() {
  const win = sdenv.memory.sdWindow;
  win.eval = new Proxy(win.eval, {
    apply(target, thisArg, params) {
      const new_params = params.map((param) => {
        if (typeof evalmap[param] === 'string') return evalmap[param];
        if (param.includes('debugger')) {
          param = param.replace(/debugger/g, '')
        }
        if (param.includes('eval')) {
          param = param.replace(/eval/g, 'Object.sdenv.memory.sdEval');
        }
        if (param.includes('sdDebugger')) {
          param = param.replace(/sdDebugger/g, 'debugger');
        }
        return param
      });
      sdenv.cache.dynamicCode.push({
        type: 'eval',
        params: new_params,
      });
      return Reflect.apply(target, thisArg, new_params);
    },
  });
}

export default evalHandle;
