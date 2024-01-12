import { sdenv } from '../globalVarible';

export const isAlive = () => {
  // 窗口是否还活跃
  return !sdenv.memory.runinfo.isDied;
}

export const isDied = () => {
  // 窗口是否还活跃
  return sdenv.memory.runinfo.isDied;
}

export const setDied = () => {
  // 设置窗口为死亡状态
  sdenv.memory.runinfo.isDied = true;
}
