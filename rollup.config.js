import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

import pkg from './package.json';

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js',
        output: {
            name: 'GgEzVp',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(),
            babel({ runtimeHelpers: true }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            commonjs()
        ]
    },
    // Node and ES module version
    {
        input: 'src/main.js',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        plugins: [
            resolve(),
            babel({ runtimeHelpers: true }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            commonjs()
        ]
    }
];
