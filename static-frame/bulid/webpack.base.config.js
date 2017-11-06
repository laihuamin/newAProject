const path = require('path');
const { getEntries } = require('./entry');

const ARVGS = process.env.npm_config_argv;
const entries = getEntries(ARVGS);

const conf = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, '../dist/static'),
        publicPath: '/',
        filename: 'static/js/[name].[hash].js',
        chunkFliename: 'static/js/[id].[hash].js'
    },
    //一些公共解析器的配置
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'bebal-loader?cacheDirectory'
                }]
            },
            {
                test: /\.xtpl$/,
                use: [{
                    loader: 'xtpl-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2048
                    }
                }]
            }
        ]
    },
    resolve: {
        // 扩展名是js，vue，less
        extensions: ['.js', '.vue', 'less'],
        mainFields: ['jsnext:main', 'main'],
        //一些别名路径，使用的时候简单点
        alias: {
            libs: path.resolve(__dirname, '../src/units/libs'),
            common: path.resolve(__dirname, '../src/units/common'),
            components: path.resolve(__dirname, '../src/components'),
            src: path.resolve(__dirname, '../src/')
        }
    }
}

module.exports = conf;
