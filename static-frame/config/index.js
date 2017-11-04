const path = require('path');

module.exports = {
    // 开发的配置
    dev: {
        // 环境
        env: require('./dev-env'),
        // 资源的根目录
        assetsRoot: path.resolve(__dirname, '../dist'),
        // 根目录下的static的子目录
        assetsSubDirectory: 'static',
        cssSourceMap: true
    },
    // 生成的配置
    prod: {
        // 环境
        env: require('./pro-env'),
        // 生成资源的根目录
        assetsRoot: path.resolve(__dirname, '../dist'),
        // 根目录下的static子目录
        assetsSubDirectory: 'static',
        productionSourceMap: false
    }
}