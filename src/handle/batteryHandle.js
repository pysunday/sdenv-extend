import { sdenv } from '../globalVarible';
import _round from 'lodash-es/round'

/*
charging: 是否正在充电, true表示正在充电
chargingTime: 充满需要多久时间, 0表示已经充满，未充电总是为Infinity
dischargingTime: 可以用多久，正在充电时总为Infinity
level: 电量，1表示100%电量
*/

const level = _round(Math.random(), 2); // 电量
const chargingTime = (1 - level) * 100 * 300; // 充满时间
const dischargingTime = level * 100 * 443; // 可用时间

const charging = {
  charging_success: { // 正在充电，电量100%
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
    level: 1,
  },
  discharging_success: { // 未充电，电量100%
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    level: 1,
  },
  charging_ing: { // 正在充电
    charging: true,
    chargingTime,
    dischargingTime: Infinity,
    level,
  },
  discharging_ing: { // 未充电
    charging: false,
    chargingTime: Infinity,
    dischargingTime: dischargingTime,
    level,
  }
}

export function batteryHandle(config) {
  if (!config) return
  if (typeof config === 'string') {
    config = charging[config] || {};
  } else if (typeof config !== 'object') {
    config = {};
  }
  const win = sdenv.memory.sdWindow;
  win.navigator.getBattery = sdenv.tools.setNativeFuncName(() => {
    return new Promise((resolve, reject) => {
      resolve({
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null,
        ...charging.charging_success,
        ...config,
      })
    });
  }, 'getBattery');
}

export default batteryHandle;
