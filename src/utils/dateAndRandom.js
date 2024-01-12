import { sdenv } from '../globalVarible';
import { setNativeFuncName, getUtil, addUtil } from '../tools/index';

function DateAndRandom() {
  const win = sdenv.memory.sdWindow;
  // 无感代理时间生成方法和随机数生成方法
  if (sdenv.config.randomFixed) {
    this.data = sdenv.datas.dateAndRandom;
  } else {
    this.data = {};
  }
  if (this.data?.firstMap && Object.values(this.data.firstMap).some((it) => !it)) {
    throw new Error('日期首位配置错误请检查');
  }
  this.runs = [];
  this._now = win.Date.now;
  this._parse = win.Date.parse;
  this._valueOf = win.Date.prototype.valueOf;
  this._getTime = win.Date.prototype.getTime;
  this._toString = win.Date.prototype.toString;
  this._random = Math.random;
}
DateAndRandom.prototype.shift = function (name) {
  const { firstMap } = this.data;
  let val = this.data[name].shift();
  if (typeof firstMap[name] === 'number') {
    val += firstMap[name];
  }
  this.runs.push(val);
  return val;
}
DateAndRandom.prototype.wrapFun = function (funcName, def) {
  const name = `_${funcName}`;
  if (!this[name]) return undefined;
  if (def === undefined && !Array.isArray(this.data[name])) this.data[name] = [];
  const self = this;
  return setNativeFuncName(function() {
    if (def !== undefined) return def;
    if (self.data.firstMap?.[name]) {
      if (!self.data[name].length) {
        throw new Error(`DateAndRandom的${name}数据不够`);
      }
      return self.shift(name);
    }
    const val = self[name].call(this);
    self.data[name].push(val);
    return val
  }, funcName);
}
DateAndRandom.prototype.wrapClass = function (className, cla) {
  const win = sdenv.memory.sdWindow;
  const name = `_${className}`;
  if (!Array.isArray(this.data[name])) this.data[name] = [];
  const self = this;
  return setNativeFuncName(new Proxy(cla, {
    construct(target, argumentsList, newTarget) {
      if (self.data.firstMap?.[name]) {
        if (!self.data[name].length) {
          throw new Error(`DateAndRandom的${name}数据不够`);
        }
        return new cla(self.shift(name));
      }
      const val = Reflect.construct(target, argumentsList, newTarget);
      self.data[name].push(win.Date.prototype.valueOf.call(val));
      return val;
    },
    apply(target, argumentsList, newTarget) {
      const val = Reflect.apply(target, argumentsList, newTarget);
      return val;
    }
  }), cla.name || className);
}
DateAndRandom.prototype.getData = function (copy) {
  const ret = Object.entries(this.data).reduce((ans, [key, val]) => {
    if (key === 'firstMap' || !val.length) return ans;
    if (key === '_random') {
      ans[key] = val;
      ans.firstMap[key] = true;
      return ans;
    }
    const first = val[0];
    ans.firstMap[key] = first;
    ans[key] = val.map((it) => it - first);
    return ans;
  }, { firstMap: {} });
  if (copy) {
    copy(JSON.stringify(ret));
    console.log('日期与随机数数据复制成功');
  }
  return ret;
}

export function dateAndRandomInit() {
  const win = sdenv.memory.sdWindow;
  if (!getUtil('dateAndRandom')) {
    const dateAndRandom = new DateAndRandom();
    addUtil(dateAndRandom, 'dateAndRandom');
    win.Date.now = dateAndRandom.wrapFun('now');
    win.Date.parse = dateAndRandom.wrapFun('parse');
    // win.Date.prototype.valueOf = dateAndRandom.wrapFun('valueOf');
    win.Date.prototype.getTime = dateAndRandom.wrapFun('getTime');
    // win.Date.prototype.toString = dateAndRandom.wrapFun('toString');
    win.Math.random = dateAndRandom.wrapFun('random', sdenv.config.randomReturn);
    win.Date = dateAndRandom.wrapClass('newdate', win.Date);
  }
}
