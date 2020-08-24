/* Configs used by rollup plugins */
import path from 'path';

/*
 * Babel Common
 */
const babelConfig = {
    babelrc: false,
    sourceMap: true,
    inputSourceMap: true,
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator'
    ]
};

/*
 * Babel UMD
 */
export const umdBabelConfig = {
    ...babelConfig,
    babelHelpers: 'bundled',
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { ie: '10' },
                useBuiltIns: 'usage',
                corejs: { version: '3.6', proposals: true }
            }
        ]
    ],
    exclude: [/\/core-js\//]
};

/*
 * Babel CJS/ESM
 */
export const babelEsConfig = {
    ...babelConfig,
    plugins: ['@babel/plugin-transform-runtime', ...babelConfig.plugins],
    babelHelpers: 'runtime',
    presets: ['@babel/preset-env']
};

/*
 * Replace
 */
export const replaceConfig = {
    'process.env.NODE_ENV': JSON.stringify('production')
};

/*
 * UMD Resolve config
 */
export const browserResolveConfig = { preferBuiltins: false, browser: true };

/*
 * PostCSS config
 */
export const postcssConfig = {
    extract: path.join(__dirname, 'dist', 'gg-ez-vp.css'),
    minimize: true
};

/*
 * License config
 */
export const licenseConfig = {
    banner: {
        content: {
            file: path.join(__dirname, 'LICENSE')
        }
    },
    thirdParty: {
        output: path.join(__dirname, 'dist', 'dependencies.txt')
    }
};
