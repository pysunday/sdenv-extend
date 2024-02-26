import _merge from 'lodash-es/merge';
import { sdenv } from './globalVarible';
import { loopRunInit } from './utils/index';
import * as tools from './tools/index';
import * as adapt from './adapt/index'
import handleInit from './handle/init';
import * as handles from './handle/index';

function setWindow(win) {
  if (!win) return;
  Object.assign(sdenv.memory, {
    sdWindow: win,
    sdEval: win.eval,
    sdFunction: win.Function,
    sdDate: win.Date,
    sdMath: win.Math,
  });
}

let cache = undefined;

export default class {
  constructor(config, win = undefined) {
    const obj = win ? win.Object : Object;
    if (!cache) cache = obj;
    if (!obj.sdenv) {
      _merge(sdenv, config || {});
      obj.prototype.sdenv = () => sdenv;
      setWindow(win);
      _merge(sdenv.tools, tools);
      _merge(sdenv.adapt, adapt); // 会用到前面tools的方法
      loopRunInit();
    }
    Object.assign(this, obj.sdenv());
  }

  static sdenv() {
    if (cache) return cache.sdenv();
    console.error('sdenv还未被初始化!');
  }

  getHandle(name) {
    const handleName = `${name}Handle`;
    if (!handles[handleName]) return;
    return (...params) => {
      handles[handleName](...params);
      return this;
    }
  }

  getTools(name) {
    if (!sdenv.tools[name]) return;
    return (...params) => {
      sdenv.tools[name](...params);
      return this;
    }
  }

  getUtils(name) {
    if (!sdenv.utils[name]) return;
    return (...params) => {
      sdenv.utils[name](...params);
      return this;
    }
  }
}
