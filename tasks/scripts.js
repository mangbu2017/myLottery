import gulp from 'gulp';
import gulpif from 'gulp-if';
// 语句判断
// import concat from 'gulp-concat';
// 这个插件用于将多个文件按照指定顺序合并成一个大文件。
// 文件拼接
// import webpack from 'webpack';   
import gulpWebpack from 'webpack-stream';
// 因为gulp是基于流操作
import named from 'vinyl-named';
// 文件命名
import livereload from 'gulp-livereload';
// 热起
// 当监听文件发生变化时，浏览器自动刷新页面
import plumber from 'gulp-plumber';
// 处理文件流
// 这个插件的作用简单来说就是一旦pipe中的某一steam报错了，
// 保证下面的steam还继续执行。因为pipe默认的onerror函数会把剩下的
// stream给unpipe掉，这个插件阻止了这种行为。那它一般用于哪种场景呢？
// 比如，代码每次build之前要跑一遍jshint和jscs来确保所有代码都符合规范，
// 但一旦某些代码不符合规范，整个build流程就会停止，这个时候就需要
// gulp-plumber出场了
import rename from 'gulp-rename';
// 重命名
import uglify from 'gulp-uglify';
// css js 文件压缩 可以定位错误信息

import {log, colors} from 'gulp-util';
// gulp-util带有很多方便的函数，其中最常用的应该就是log了。
// $.util.log()支持传入多个参数，打印结果会将多个参数用空格
// 连接起来。它与console.log的区别就是所有$.util.log
// 的结果会自动带上时间前缀。
// 另外，它还支持颜色，如$.util.log($.util.colors.magenta('123'));
// 打印出来的123是品红色的。其实$.util.colors就是一个chalk的实例，
// 而chalk是专门用来处理命令行打印着色的一个工具。
import args from './util/args';
import sourcemaps from 'gulp-sourcemaps';
// 生成sourcemaps文件
gulp.task('scripts', () => {
    // 打开文件
    return gulp.src(['app/js/index.js'])
        // .pipe(concat('all.js'))
        .pipe(plumber({
            errorHandle(err) {
                console.log(err);
            }
        }))
        .pipe(named())
        // 改变原有的抛出错误的模式
        .pipe(gulpWebpack({
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                }]
            }
        }), null, (err, stats) => {
            log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
                chunks: false
            }))
        })
        .pipe(gulp.dest('server/public/js'))
        .pipe(rename({
            basename: 'cp',
            extname: '.min.js'
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify({
            compress: {properties: false},
            output: {
                quote_keys: true
            }
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('server/public/js'))
        // 如果watch监测到变化 刷新页面
        .pipe(gulpif(args.watch, livereload()));
})