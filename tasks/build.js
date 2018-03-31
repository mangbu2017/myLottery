import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
// 脚本执行顺序

gulp.task('build', gulpSequence('clean', 'css', 'pages', 'scripts', ['browser', 'serve']));
                                                                    // 这两个一定在最后 serve在二者之间又是最后都

