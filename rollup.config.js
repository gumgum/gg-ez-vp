import path from 'path';
import builtins from '@joseph184/rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
// TODO: optimize build, currently running postcss three times
import postcss from 'rollup-plugin-postcss';

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
            postcss({
                extract: path.join(__dirname, 'dist', 'gg-ez-vp.css'),
                minimize: true
            }),
            terser(),
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
            copy({
                targets: [
                    { src: 'src/icons/*', dest: 'dist/icons' },
                    { src: 'images/*', dest: 'dist/images' }
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
            postcss({
                extract: path.join(__dirname, 'dist', 'gg-ez-vp.css'),
                minimize: true
            }),
            terser(),
            license({
                banner: {
                    content: {
                        file: path.join(__dirname, 'LICENSE')
                    }
                },
                thirdParty: {
                    output: path.join(__dirname, 'dist', 'dependencies.txt')
                }
            })
        ]
    }
];
