import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import license from 'rollup-plugin-license';
import path from 'path';

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
            license({
                banner: {
                    content: {
                        file: path.join(__dirname, 'LICENSE')
                    }
                },
                thirdParty: {
                    output: path.join(__dirname, 'dist', 'dependencies.txt')
                }
            }),
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
            license({
                banner: {
                    content: {
                        file: path.join(__dirname, 'LICENSE')
                    }
                },
                thirdParty: {
                    output: path.join(__dirname, 'dist', 'dependencies.txt')
                }
            }),
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
