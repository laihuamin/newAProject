// 该模块用于获取所有文件路口
// author  laihuamin

const glob = require('glob');
const path = require('path');

const FILE_PATH = './src/pages/**/index.js';
const CUT_PATH = './src/pages'

exports.getEntries = function (argv) {
    // 获取文件路径
    const paths = glob.sync(FILE_PATH),
    // 创建入口对象变量
        entries = {},
    // 定义单文件编译的变量  使用npm run dev --keyword1,keyword2支持单文件编译
        keywords = [];
    try {
        
        argv = JSON.parse(argv).remain;
        //去掉--获得keywords字符串，并转化成数组
        keywords = (argv.length ? argv[0].slice(2) : '').split(',');
    } catch(e) {
        keywords = [];
    }
    //如果是单文件编译过滤
    paths = paths.filter((value) => {
        keywords.forEach((item) => {
            if(value.indexOf(item) !== -1) {
                return true;
            }
        })
        return false;
    })
    // 循环遍历
    paths.forEach((item) => {
        let pathName = path.dirname(item).replace(new RegExp('^' + CUT_PATH), '');
        entries[pathName] = item;
    })
    return entries;
}