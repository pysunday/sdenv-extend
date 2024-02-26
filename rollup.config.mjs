import glob from 'glob';
import path from 'path';
import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const watcher = (globs) => ({
  buildStart () {
    for (const item of globs) {
      glob.sync(path.resolve(item)).forEach((filename) => { this.addWatchFile(filename) })
    }
  }
})

const updateVersion = () => ({
  renderStart (outputOptions, inputOptions) {
    outputOptions.footer = () => `sdenv.version = 'V${JSON.parse(fs.readFileSync('package.json', 'utf8')).version}'`
  }
})

export default () => {
  const fileName = 'sdenv-extend';
  return {
    input: 'src/index.js',
    output: [
      {
        file: `build/${fileName}-cjs.js`,
        strict: false,
        format: 'cjs',
        // plugins: [terser(), updateVersion()]
        // name: 'sdenv',
        // format: 'iife',
      },
      {
        file: `build/${fileName}-iife.js`,
        format: 'iife',
        name: 'sdenv',
        strict: false,
        // plugins: [terser(), updateVersion()]
      }
    ],
    plugins: [
      resolve({ moduleDirectories: ['node_modules'] }),
      commonjs(),
      watcher(['package.json']),
    ]
  }
}
