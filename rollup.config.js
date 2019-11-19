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
        input: 'src/index.js',
        output: {
            name: 'GgEzVp',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        external: [],
        plugins: [
            builtins(),
            resolve({ preferBuiltins: false }),
            babel({ runtimeHelpers: true }),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            copy({
                targets: [
                    { src: 'src/styles.css', dest: 'dist/', rename: 'gg-ez-vp.css' },
                    { src: 'src/icons/*', dest: 'dist/icons' },
                    { src: 'src/images/*', dest: 'dist/images' }
                ]
            })
        ]
    },
    // Node and ES module version
    {
        input: 'src/index.js',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        external: ['events'],
        plugins: [
            builtins(),
            resolve({ preferBuiltins: true }),
            babel({ runtimeHelpers: true }),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            copy({
                targets: [
                    { src: 'src/styles.css', dest: 'dist/', rename: 'gg-ez-vp.css' },
                    { src: 'src/icons/*', dest: 'dist/icons' },
                    { src: 'src/images/*', dest: 'dist/images' }
                ]
            })
        ]
    }
];
