import { sdenv } from '../globalVarible';

export function addUtil(func, name) {
  sdenv.utils[name || func.name] = func;
  return func;
}

export function getUtil(name) {
  return sdenv.utils[name];
}
