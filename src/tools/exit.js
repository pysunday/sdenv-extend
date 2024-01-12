import { sdenv } from '../globalVarible';
import { setDied } from './runtime'

export const exit = (params) => {
  const win = sdenv.memory.sdWindow;
  setDied();
  if (params.url) win.onbeforeunload?.(params.url);
}
