const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const entries = baseConfig.entry;
const htmlWebpackPlugin = require('html-webpack-plugin');
const vConsoleplugin = require('vconsole-webpack-plugin');
const config = require('../config/index');


const devConf = webpackMerge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    cache: true,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['android >= 4.0', 'ios_saf >= 7.0'],
                            remove: false
                        })
                    ]
                }
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    plugins: []
})
