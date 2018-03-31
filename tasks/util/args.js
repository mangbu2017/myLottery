// 严格的说，yargs不是专门用于gulp的，它是Node中处理命令行参数的通用解决方案。
// 只要一句代码var args = require('yargs').argv;
// 就可以让命令行的参数都放在变量args上，非常方便。
// 它可以处理的参数类型也是多种多样的：
// 单字符的简单参数，如传入-m=5或-m 5，则可得到args.m = 5。
// 多字符参数（必须使用双连字符），如传入--test=5或--test 5，则可得到args.test = 5。
// 不带值的参数，如传入--mock，则会被认为是布尔类型的参数，
// 可得到args.mock = true。
import yargs from 'yargs';

const args = yargs

    .option('production', {
        boolean: true,
        default: false,
        describe: 'min all scripts'
    })

    .option('watch', {
        boolean: true,
        default: false,
        describe: 'watch all file'
    })
    
    .option('verbose', {
        boolean: true,
        default: false,
        describle: 'log'
    })

    .option('sourcemaps', {
        describe: 'force the creation of sroucemaps'
    })

    .option('port', {
        string: true,
        default: 8080,
        describe: 'server port'
    })
    
    .argv
    // 字符串解析

export default args;