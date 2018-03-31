import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import args from './util/args';

gulp.task('browser', (cb) => {
    // 如果监听到watch = false
    if(!args.watch) {
        // 输出undefined 说明watch未被监听到
        console.log(args.watch);
        return cb()
    };
    // 否则 监听js ejs css 文件变化
    gulp.watch('app/**/*.js', ['scripts']);
    // 监听的文件位置
    // 文件变动后执行的task
    gulp.watch('app/**/*.ejs', ['pages']);
    gulp.watch('app/**/*.css', ['css']);
})