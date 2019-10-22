import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';

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
            builtins(),
            babel({ runtimeHelpers: true }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            commonjs(),
            copy({
                targets: [
                    { src: 'src/styles.css', dest: 'dist/', rename: 'gg-ez-vp.css' },
                    { src: 'src/img/*', dest: 'dist/img' }
                ]
            })
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
            commonjs(),
            copy({
                targets: [
                    { src: 'src/styles.css', dest: 'dist/', rename: 'gg-ez-vp.css' },
                    { src: 'src/img/*', dest: 'dist/img' }
                ]
            })
        ]
    }
];
