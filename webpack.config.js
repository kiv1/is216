const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

const baseConfig = {
    name: 'base',
    mode: 'production',
    entry: {
        bundle: './public/src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
        ],
    },

    output: {
        path: path.resolve(__dirname, 'public', 'dist'),
        publicPath: '/dist/',
        filename: '[name].js',
    },
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'styles', 'assets'),
        },
        extensions: ['.js', '.vue'],
    },
    optimization: {
        minimize: true,
    },
    devtool: false,
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
};

module.exports = [baseConfig];
