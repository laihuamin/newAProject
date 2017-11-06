const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const os = require('os');
const baseConfig = require('./webpack.base.config');
const config = require('../config/index');
//html打包的
const HtmlWebpackPlugin = require('html-webpack-plugin');
//css打包的
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// 将文件名作为 chunkID 以支持多页面打包下的缓存机制
const chunkIdPlugin = require('./plugin/specfic-chunk-id-by-filepath');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { getChunksObject } = require('./chunk.js');

const bulidconfig = merge(baseConfig, {
    devtool: false,
    bail: true,
    cache: true,
    performance: {
        hints: false
    },
    output: {
        path: config.prod.assetsRoot,
        publicPath: '/',
        filename: 'static/js/[name]-[chunkhas:16].js',
        chunkFilename: 'static.js/[id]-[chunkhas:16].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                use: 'css-loader!postcss-loader',
                                fallback: 'vue-style-loader'
                            }),
                            less: ExtractTextPlugin.extract({
                                use: 'css-loader!postcss-loader!less-loader',
                                fallback: 'vue-style-loader'
                            })
                        }
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['vue-style-loader', 'css-loader?minimize', 'postcss-loader'],
                    fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'postcss-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            }
        ]
    },
    plugins: [
        //配置node环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: config.prod.env
            }
        }),
        //清理目录
        new CleanWebpackPlugin(['static', 'assets/static'], {
            root: path.resolve('./dist')
        })
        //抽取公共库
        new webpack.
        //
    ]
})