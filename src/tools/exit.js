export function exit(params) {
  const win = this.memory.window;
  this.getTools('setDied')()
  if (params.eventId) {
    win.dispatchEvent(new win.CustomEvent(`sdenv:${params.eventId}`, { detail: params }));
  }
  win.dispatchEvent(new win.CustomEvent('sdenv:exit', { detail: params }));
  if (params.url) win.onbeforeunload?.(params.url);
}
