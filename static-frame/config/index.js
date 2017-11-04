const path = require('path');

module.exports = {
    // 开发的配置
    dev: {
        env: require('./dev-env'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        cssSourceMap: true
    },
    // 生成的配置
    prod: {
        env: require('./pro-env'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        productionSourceMap: false
    }
}