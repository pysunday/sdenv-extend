function DateAndRandom(sdenv, { datas }) {
  this.sdenv = sdenv;
  if (datas && Array.isArray(datas._newdate) && Array.isArray(datas._newdate[0])) {
    datas._newdate = datas._newdate.reduce((ans, [val, num]) => ([...ans, ...new Array(num).fill(val)]), []);
  }
  this.data = datas || {};
  if (this.data?.firstMap && Object.values(this.data.firstMap).some((it) => !it)) {
    throw new Error('日期首位配置错误请检查');
  }
  this.runs = [];
  Object.assign(this, {
    _now: sdenv.memory.Date.now,
    _parse: sdenv.memory.Date.parse,
    _valueOf: sdenv.memory.Date.prototype.valueOf,
    _getTime: sdenv.memory.Date.prototype.getTime,
    _toString: sdenv.memory.Date.prototype.toString,
    _random: sdenv.memory.Math.random,
  });
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
  return this.sdenv.getTools('setNativeFuncName')(function() {
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
  const name = `_${className}`;
  if (!Array.isArray(this.data[name])) this.data[name] = [];
  const self = this;
  return this.sdenv.getTools('setNativeFuncName')(new Proxy(cla, {
    construct(target, argumentsList, newTarget) {
      if (self.data.firstMap?.[name]) {
        if (!self.data[name].length) {
          throw new Error(`DateAndRandom的${name}数据不够`);
        }
        return new cla(self.shift(name));
      }
      const val = Reflect.construct(target, argumentsList, newTarget);
      self.data[name].push(sdenv.memory.Date.prototype.valueOf.call(val));
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
    if (key === '_newdate') {
      ans[key] = val.map((it) => it - first).reduce((arr, each) => {
        if (arr.length === 0 || arr[arr.length - 1][0] !== each) {
          arr.push([each, 1]);
        } else {
          arr[arr.length - 1][1] += 1;
        }
        return arr;
      }, []);
    } else {
      ans[key] = val.map((it) => it - first);
    }
    return ans;
  }, { firstMap: {} });
  if (copy) {
    copy(JSON.stringify(ret));
    console.log('日期与随机数数据复制成功');
  }
  return ret;
}

export function dateAndRandomHandle(config) {
  if (typeof config !== 'object') config = {};
  const win = this.memory.window;
  const { randomReturn = this.config.randomReturn } = config;
  const dateAndRandom = new DateAndRandom(this, config);
  this.getTools('addUtil')(dateAndRandom.getData.bind(dateAndRandom), 'getDateData');
  win.Date = dateAndRandom.wrapClass('newdate', win.Date);
  win.Date.now = dateAndRandom.wrapFun('now');
  win.Date.parse = dateAndRandom.wrapFun('parse');
  win.Math.random = dateAndRandom.wrapFun('random', randomReturn);
}

export const dateAndRandomInit = ['Date', 'Math'];

export default dateAndRandomHandle;
