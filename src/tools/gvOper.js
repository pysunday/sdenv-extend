export function addUtil(func, name) {
  if (!func) debugger;
  this.utils[name || func.name] = func.bind(this);
  return func;
}

export function getUtil(name) {
  return this.utils[name];
}
