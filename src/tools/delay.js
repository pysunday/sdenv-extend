import _get from 'lodash-es/get';

export function delay(ms) {
  const self = this;
  return new Promise(resolve => _get(self, 'memory.setTimeout', setTimeout)(resolve, ms));
};

