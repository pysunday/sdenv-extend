import _merge from 'lodash-es/merge';
import { sdenv } from './globalVarible';
import { loopRunInit, dateAndRandomInit } from './utils/index';
import * as tools from './tools/index';
import * as adapt from './adapt/index'
import { funcHandle, evalHandle } from './handle/index';

function setWindow(win) {
  if (!win) return;
  Object.assign(sdenv.memory, {
    sdWindow: win,
    sdEval: win.eval,
    sdFunction: win.Function,
  });
}

export default function(vm, win = undefined) {
  // win为指定的window变量，在补环境框架使用时需要传入
  if (sdenv.config.isInited) return sdenv;
  _merge(sdenv, vm);
  Object.prototype.sdenv = sdenv;
  sdenv.config.isInited = true;
  setWindow(win);

  loopRunInit();
  dateAndRandomInit();
  _merge(sdenv.tools, tools);
  _merge(sdenv.adapt, adapt); // 会用到前面的，因此放到最后
  if (sdenv.config.isFuncProxy) funcHandle();
  if (sdenv.config.isEvalProxy) evalHandle();
  return sdenv;
}
