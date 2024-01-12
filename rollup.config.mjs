import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default () => {
  const fileName = 'sdenv-extend';
  return {
    input: 'src/index.js',
    output: [
      {
        file: `build/${fileName}-cjs.js`,
        strict: false,
        format: 'cjs',
        plugins: [terser()]
        // name: 'sdenv',
        // format: 'iife',
      },
      {
        file: `build/${fileName}-iife.js`,
        format: 'iife',
        name: 'sdenv',
        strict: false,
        plugins: [terser()]
      }
    ],
    plugins: [
      resolve({ moduleDirectories: ['node_modules'] }),
      commonjs(),
    ]
  }
}
