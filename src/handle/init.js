import { sdenv } from '../globalVarible';
import evalHandle from './evalHandle';
import funcHandle from './funcHandle';
import eventHandle from './eventHandle';
import cookieHandle from './cookieHandle';
import batteryHandle from './batteryHandle';
import connectionHandle from './connectionHandle';
import dateAndRandomHandle from './dateAndRandomHandle';

const config = [{
  key: 'isEvalHandle',
  handle: evalHandle,
}, {
  key: 'isFuncHandle',
  handle: funcHandle,
}, {
  key: 'isEventHandle',
  handle: eventHandle,
}, {
  key: 'isCookieHandle',
  handle: cookieHandle,
}, {
  key: 'isBatteryHandle',
  handle: batteryHandle,
}, {
  key: 'isConnectionHandle',
  handle: connectionHandle,
}, {
  key: 'isDateAndRandomHandle',
  handle: dateAndRandomHandle,
}];

export default function() {
  config.forEach((it) => {
    it.handle(sdenv.config[it.key]);
  })
}
