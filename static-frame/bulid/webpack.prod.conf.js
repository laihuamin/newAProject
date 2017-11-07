// os模块的话提供了一些基础的操作系统函数
const os = require('os')
//该模块用于合并webpack的配置项
const merge = require('webpack-merge')
const webpack = require('webpack')
//引入webpack的公共base配置
const baseWebpackConfig = require('./webpack.base.config.js')
//webpack打包前用于清理文件夹的插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
//打包html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//将css单独打包的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//分析包体依赖，并提供可视化的界面，可以提醒你引入某个功能的时候，只需要引入某一个模块
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//webpack会调用内部的cssnano模块对css进行压缩
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const WebpackMd5Hash = require('webpack-md5-hash')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
// 将文件名作为 chunkID 以支持多页面打包下的缓存机制
const chunkIdPlugin = require('./plugin/specfic-chunk-id-by-filepath')

const config = require('../config/index.js')
const { getChunksObject } = require('./chunks.js')
const path = require('path')

class AppendParam {
    constructor () {

    }

    apply (compiler) {
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('html-webpack-plugin-after-html-processing', function (htmlPluginData, callback) {
                let htmlPath = htmlPluginData.plugin.childCompilationOutputName
                if (htmlPath.indexOf('html/party/') > -1 || htmlPath.indexOf('html/wx-login') > -1) {
                    htmlPluginData.html = htmlPluginData.html.replace(/<script src="(.+?)"><\/script>/g, function (match, p1) {
                        let and = '&'
                        if (p1.indexOf('?') === -1) {
                            and = '?'
                        }
                        return `<script src="${p1 + and}from_edu=true"></script>`
                    }).replace(/href="\/static\/(.+?)\.css(.*?)"/g, function (match, p1, p2) {
                        let and = '&'
                        if (p2.indexOf('?') === -1) {
                            and = '?'
                        }
                        return `href="/static/${p1}.css${p2 + and}from_edu=true"`
                    })
                }
                callback(null, htmlPluginData)
            })
        })
    }
}

var buildConfig = merge(baseWebpackConfig, {
    devtool: false,
    bail: true,
    cache: true,
    performance: {
        hints: false
    },
    output: {
        path: config.prod.assetsRoot,
        filename: 'static/js/[name]-[chunkhash:16].js',
        chunkFilename: 'static/js/[id]-[chunkhash:16].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
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
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['vue-style-loader', 'css-loader?minimize', 'postcss-loader']
                }),
                exclude: /node_modules/
            },
            {
                test: /\.less$/, // ['css-loader?minimize&-autoprefixer!postcss-loader', 'less-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'postcss-loader', 'less-loader']
                })
            }
        ]
    },
    plugins: [
        // 配置 Node 环境变量，设置合适的环境变量，更有利于webpack去压缩代码
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: config.prod.env
            }
        }),
        // 清理目录
        new CleanWebpackPlugin(['static', 'assets/static'], {
            root: path.resolve('./dist')
        }),
        // 抽取公共库
        new webpack.DllReferencePlugin({
            name: 'vendor',
            manifest: require('../dist/assets/vendor-manifest.json')
        }),
        new chunkIdPlugin(),
        // 通过范围提升，webpack可以根据你正在使用什么样的模块和一些其他条件来回退到正常的捆绑
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),
        //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new ExtractTextPlugin({
            filename: 'static/css/[name]-[contenthash:16].css',
            allChunks: true
        }),
        // 压缩js
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            uglifyJS: {
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                comments: false,
                mangle: true
            }
        }),
        // 压缩css：去重并去掉注释
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: false,
                autoprefixer: false,
                discardComments: { removeAll: true }
            }
        }),
        new webpack.NamedModulesPlugin(),
        // 根据模块打包前的代码内容生成hash，而不是像Webpack那样根据打包后的内容生成hash
        //new WebpackMd5Hash(),
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['commons'], // 这公共代码的chunk名为'commons'
            filename: 'assets/static/js/[name].bundle.[chunkhash:16].js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
            minChunks: 4
        }),
        // new BundleAnalyzerPlugin(),
        // 插入自定义文件插入到html中
        new AddAssetHtmlPlugin([
            {
                filepath: 'dist/assets/dll/*.js',
                publicPath: '/assets/dll/',
                outputPath: '/assets/dll',
                // files: config.libraryEntry.map(entry => entry + '.html'),
                includeSourcemap: false
            }
        ]),
        new AppendParam()
    ]
})
// 全都是为了打包html

let entries = baseWebpackConfig.entry
let chunksObject = getChunksObject(entries)

chunksObject.forEach(item => {
    let conf = {
        filename: './html/' + item.pathname + '.html', // 生成的html存放路径，相对于publicPath
        template: item.templatePath, // html模板路径,
        inject: false, //js插入的位置，true/'head'/'body'/false
        minify: {
            //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //删除空白符与换行符
            minifyJS: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        },
        chunksSortMode: 'dependency'
    }
    if (item.pathname in entries) {
        conf.inject = 'body'
        conf.chunks = ['manifest', 'dll', 'commons', item.pathname]
    }

    buildConfig.plugins.push(new HtmlWebpackPlugin(conf))
})

module.exports = buildConfig
