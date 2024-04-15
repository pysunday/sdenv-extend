export function isAlive() {
  // 窗口是否还活跃
  return !this.memory.runinfo.isDied;
}

export function isDied() {
  // 窗口是否还活跃
  return this.memory.runinfo.isDied;
}

export function setDied() {
  // 设置窗口为死亡状态
  this.memory.runinfo.isDied = true;
}
