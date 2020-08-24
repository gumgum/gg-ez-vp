import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import pkg from './package.json';
/* Configs used by rollup plugins */
import {
    babelEsConfig,
    umdBabelConfig,
    replaceConfig,
    browserResolveConfig,
    postcssConfig,
    licenseConfig
} from './rollup-plugin-configs';

export default [
    /*
     * browser-friendly UMD build
     */
    {
        input: 'src/index.js',
        output: {
            name: 'GgEzVp',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(browserResolveConfig),
            commonjs(),
            nodePolyfills(),
            babel(umdBabelConfig),
            replace(replaceConfig),
            postcss(postcssConfig),
            terser(),
            license(licenseConfig),
            copy({
                targets: [
                    { src: 'src/icons/*', dest: 'dist/icons' },
                    { src: 'images/*', dest: 'dist/images' }
                ]
            })
        ]
    },
    /*
     * Node and ES module version
     */
    {
        input: 'src/index.js',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'default' },
            { file: pkg.module, format: 'es', sourcemap: true, exports: 'default' }
        ],
        external: [/@babel\/runtime/, 'events'],
        plugins: [
            resolve(),
            commonjs(),
            babel(babelEsConfig),
            replace(replaceConfig),
            postcss(postcssConfig),
            terser(),
            license(licenseConfig)
        ]
    },
    /*
     * Demo page scripts
     */
    {
        input: './demo.js',
        output: {
            name: 'demo',
            file: 'dist/demo.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(browserResolveConfig),
            commonjs(),
            babel(umdBabelConfig),
            replace(replaceConfig),
            terser()
        ]
    }
];

