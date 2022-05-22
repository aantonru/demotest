/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const PACKAGE = require('./package.json');
const { DefinePlugin } = require('webpack');

const main = ['./src/index.ts'];

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: {
        main: main,
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].js',
    },
    plugins: [

		new DefinePlugin({
			// use a package version as version
			__VERSION__: JSON.stringify(PACKAGE.version),
			__MODE__: JSON.stringify('prod')
		}),
        new ForkTsCheckerWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
        }),
        new CopyPlugin({
            patterns: [{ from: './public' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
