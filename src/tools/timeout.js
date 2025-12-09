const currentTask = function () {
  this.cache = null;
  this.add = (item) => {
    if (!this.cache) return false;
    if (this.cache.task.includes(item)) return
    this.cache.task.push(item);
  }
  this.set = (task) => this.cache = task;
  this.get = () => this.cache;
  this.getTime = () => {
    if (!this.cache) return false;
    return this.cache.time;
  }
  this.getTask = (idx) => {
    if (!this.cache) return false;
    if (typeof idx === 'number') return this.cache.task[idx]
    return this.cache.task;
  }
  this.clear = () => this.cache = null;
}

class Timeout {
  constructor(sdenv) {
    this.sdenv = sdenv;
    this.index = [];
    this.timeouts = {};
    this.lastOp = sdenv.memory.runinfo.start;
    this.isLock = false;
    this.id = 0;
    this.currentTask = new currentTask();
  }

  addTimeout(func, time, type = 'timeout', idx = this.index.length) {
    const { sdenv } = this;
    let timekey = new sdenv.memory.Date().getTime() - sdenv.memory.runinfo.start + time;
    const obj = {
      func, // 方法
      type, // 类型: timeout interval
      flag: 0, // 执行状态: -1（取消执行）0（未执行）1（执行中）2（已执行）
      time, // 延时时间
      expect_time: timekey, // 预期执行时间
      real_time: null, // 实际执行时间
      index: idx, // 编号
      id: this.id++,
    }
    if (this.index[idx]) {
      this.index[idx] = obj;
    } else {
      this.index.push(obj);
    }
    if (time === 0 && this.currentTask.get()) {
      timekey = this.currentTask.getTime();
      this.timeouts[timekey].push(obj);
      this.currentTask.add(obj);
    } else {
      if (this.timeouts[timekey] === undefined) this.timeouts[timekey] = [];
      this.timeouts[timekey].push(obj);
      if (this.sdenv.tools.isAlive()) this.exec();
    }
    // const win = sdenv.memory.window;
    // win.console.log(`程序时间${timekey}处${type}回调添加成功`);
    return idx;
  }

  addInterval(func, time, idx = undefined) {
    const self = this;
    const newFunc = function() {
      try {
        func();
      } catch (err) {
        console.error(err);
      } finally {
        if (self.index[idx].flag !== -1) self.addInterval(func, time, idx);
      }
    }
    idx = this.addTimeout(newFunc, time, 'interval', idx);
    return idx;
  }

  remove(idx) {
    if (typeof idx !== 'number' || !this.index[idx]) return false;
    if (this.index[idx].flag === 0) {
      this.index[idx].flag = -1;
    } else if ([-1, 2].includes(this.index[idx].flag)) {
      return undefined;
    } else if (this.index[idx].flag === 1) {
      return false;
    }
    return undefined
  }

  exec() {
    if (this.isLock) return;
    this.isLock = true;
    this.sdenv.memory.setTimeout(() => {
      this.isLock = false;
      this.run();
    }, 0);
  }

  run() {
    const { sdenv } = this;
    const win = sdenv.memory.window;
    const times = Object.keys(this.timeouts).filter((key) => {
      if (Number(key) + sdenv.memory.runinfo.start <= this.lastOp) return false;
      return true;
    });
    if (times.length === 0) return false;
    this.lastOp = Number(times[0]) + sdenv.memory.runinfo.start;
    this.currentTask.set({
      task: this.timeouts[times[0]],
      time: times[0],
    });
    for(let i = 0; this.currentTask.getTask(i); i++) {
      const cfg = this.currentTask.getTask(i);
      if (this.sdenv.tools.isDied() || cfg.flag === -1) return;
      const funcStr = cfg.func.param ? JSON.stringify(cfg.func.param) : sdenv.tools.compressText(cfg.func.toString());
      win.console.log(`【TIMEOUT RUN】执行程序时间${times[0]}处${cfg.type}回调，延时：${cfg.time}，编号：${cfg.id}，方法：${funcStr}`);
      cfg.flag = 1;
      cfg.real_time = new sdenv.memory.Date().getTime() - sdenv.memory.runinfo.start;
      try {
        cfg.func();
        win.console.log(`【TIMEOUT RUNED】执行程序时间${times[0]}处${cfg.type}回调，延时：${cfg.time}，编号：${cfg.id}，方法：${funcStr}`);
      } catch (e) {
        console.error(e);
      }
      cfg.flag = 2
    }
    this.currentTask.clear();
    if (this.sdenv.tools.isDied()) return undefined;
    if (times.length > 1) {
      this.run();
    } else {
      this.exec();
    }
    return undefined;
  }
}

function check() {
  if (!this.memory.timeout) {
    this.memory.timeout = new Timeout(this);
  }
}

export const addTimeout = function(func, time) {
  check.call(this);
  return this.memory.timeout.addTimeout(func, Number(time || 0), 'timeout')
}

export const addInterval = function(func, time) {
  check.call(this);
  return this.memory.timeout.addInterval(func, time);
}

export const removeTimeout = function(idx) {
  check.call(this);
  return this.memory.timeout.remove(idx);
}

export const removeInterval = function(idx) {
  check.call(this);
  return this.memory.timeout.remove(idx);
}
