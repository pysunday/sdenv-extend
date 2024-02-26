import { sdenv } from '../globalVarible';
import _get from 'lodash-es/get'

/*
downlink：设备下行速速，单位兆
effectiveType：网络类型，如："slow-2g"、"2g"、"3g"、"4g"
rrt：设备的往返延时，单位毫秒
saveData：是否为节流模式
type：网络连接类型，有些浏览器有有些没有，如："bluetooth"(蓝牙1)、"cellular"(蜂窝网络2)、"ethernet"(以太网3)、"none"(无网络连接)、"wifi"(wifi连接4)、"wimax5"
*/

export function connectionHandle(config) {
  if (!config) return;
  const win = sdenv.memory.sdWindow;
  if (typeof config !== 'object') {
    config = {};
  }
  sdenv.tools.addConstants(win.navigator.connection, {
    downlink: 6.66,
    effectiveType: "4g",
    onchange: null,
    rtt: 0,
    saveData: false,
    ...config,
  });
}

export default connectionHandle
