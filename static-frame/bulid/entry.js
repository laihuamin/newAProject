// 该模块用于获取所有文件路口
// author  laihuamin

const glob = require('glob');
const path = require('path');

const FILE_PATH = './src/pages/**/index.js';
const 

exports.getentries = function (argv) {
    // 获取文件路径
    const paths = glob.sync(FILE_PATH),
    // 创建入口对象变量
        entries = {},
    // 定义单文件编译的变量  使用npm run dev --keyword1,keyword2支持单文件编译
        keywords = [];
    try {
        
        argv = JSON.parse(argv).remain;
        keywords = (argv.length ? argv[0].slice(2) : '').split(',')
    } catch(e) {
        keywords = []
    }
    paths = paths.filter((value) => {
        
    })
}