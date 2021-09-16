const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { EnvironmentPlugin } = require('webpack');

const baseConfig = {
    name: 'base',
    mode: 'development',
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
        path: path.resolve(__dirname, 'public', 'javascripts'),
        publicPath: '/',
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
    plugins: [new VueLoaderPlugin()],
};

module.exports = [baseConfig];
