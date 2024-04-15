export function exit(params) {
  const win = this.memory.sdWindow;
  this.getTools('setDied')()
  if (params.url) win.onbeforeunload?.(params.url);
}
