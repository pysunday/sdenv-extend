import { sdenv } from '../globalVarible';
import { isDied, isAlive } from './runtime';

class Timeout {
  constructor() {
    this.index = [];
    this.timeouts = {};
    this.lastOp = sdenv.memory.runinfo.start;
    this.isLock = false;
    this.id = 0;
  }

  addTimeout(func, time, type = 'timeout', idx = this.index.length) {
    const timekey = new Date().getTime() - this.lastOp + time;
    if (this.timeouts[timekey] === undefined) this.timeouts[timekey] = [];
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
    this.timeouts[timekey].push(obj);
    if (this.index[idx]) {
      this.index[idx] = obj;
    } else {
      this.index.push(obj);
    }
    if (isAlive()) this.exec();
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
    setTimeout(() => {
      this.isLock = false;
      this.run();
    }, 0);
  }

  run() {
    const times = Object.keys(this.timeouts).filter((key) => {
      if (Number(key) + sdenv.memory.runinfo.start <= this.lastOp) return false;
      return true;
    });
    if (times.length === 0) return false;
    this.lastOp = Number(times[0]) + sdenv.memory.runinfo.start;
    this.timeouts[times[0]].forEach((cfg) => {
      if (isDied() || cfg.flag === -1) return;
      // if (cfg.id !== 3) return;
      // debugger;
      console.debug(`执行程序时间${times[0]}处${cfg.type}回调，延时：${cfg.time}，编号：${cfg.id}`);
      cfg.flag = 1
      cfg.real_time = new Date().getTime() - sdenv.memory.runinfo.start;
      try {
        cfg.func();
      } catch (e) {
        console.error(e);
      }
      cfg.flag = 2
    });
    if (isAlive()) this.exec();
    return undefined;
  }
}

sdenv.memory.timeout = new Timeout();

export const addTimeout = function(func, time) {
  return sdenv.memory.timeout.addTimeout(func, Number(time || 0), 'timeout')
}

export const addInterval = function(func, time) {
  return sdenv.memory.timeout.addInterval(func, time);
}

export const removeTimeout = function(idx) {
  return sdenv.memory.timeout.remove(idx);
}

export const removeInterval = function(idx) {
  return sdenv.memory.timeout.remove(idx);
}
