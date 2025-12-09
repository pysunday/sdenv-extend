import _merge from 'lodash-es/merge';
import { gv } from './globalVarible';
import { loopRunInit } from './utils/index';
import * as tools from './tools/index';
import * as adapt from './adapt/index'
import * as handles from './handle/index';

export default class {
  constructor(config, win = undefined) {
    if (!win) {
      if (window) {
        win = window;
      } else if (global) {
        win = global;
      }
    }
    Object.assign(this, _merge({}, gv, config || {}, {
      tools,
      adapt,
    }));
    if (win.sdenv) {
      this.config.envType = win.sdenv.config.envType;
    } else if (this.config.isNode) {
      this.config.envType = 'node';
    }
    this.setWindow(win);
    loopRunInit.call(this);
    this.bindThis();
    win.sdenv = this;
    this.configPools = {}; // 配置池
  }

  bindThis() {
    const that = this;
    function addBind(obj) {
      Object.entries(obj).forEach(([key, fun]) => {
        if (typeof fun !== 'function') {
          addBind(fun)
        } else {
          obj[key] = fun.bind(that);
        }
      })
    }
    ['tools', 'adapt'].forEach(it => {
      addBind(this[it]);
    });
  }

  setWindow(win) {
    const memory = this.memory;
    memory.window = win;
    for (let key of Object.keys(handles).filter(key => key.endsWith('Init'))) {
      if (typeof handles[key] === 'function') {
        handles[key].call(this, memory);
      } else if (Array.isArray(handles[key])) {
        for (let name of handles[key]) {
          if (win[name]) {
            memory[name] = win[name];
          }
        }
      }
    }
    if (this.config.isNode && win.Window) {
      // tools._setFuncInit(win);
      Object.setPrototypeOf(win.window, win.Window.prototype);
    }
  }

  _registerConfig(name, cfg, callback) {
    callback();
    this.configPools[name] = (newCfg) => {
      if (typeof newCfg !== 'object') return;
      callback(_merge(cfg, newCfg));
    }
  }

  getConfig(name) {
    const handleName = `handle:${name}`;
    if (!this.configPools[handleName]) console.warn(`handle:${name} 不存在或未注册请检查！`);
    return this.configPools[handleName];
  }

  getHandle(name) {
    const handleName = `${name}Handle`;
    if (!handles[handleName]) return;
    return (...params) => {
      handles[handleName].call(this, ...params);
      return this;
    }
  }

  getTools(name) {
    if (!tools[name]) return;
    return (...params) => {
      return tools[name].call(this, ...params);
    }
  }

  getUtils(name) {
    if (!utils[name]) return;
    return (...params) => {
      return utils[name].call(this, ...params);
    }
  }
}
