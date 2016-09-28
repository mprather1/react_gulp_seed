var gulp = require("gulp");  
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
var react = require("gulp-react");
var htmlreplace = require("gulp-html-replace");
var jshint = require('gulp-jshint');
var cache = require('gulp-cached');

var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

gulp.task('jshint', function() {
  var stream = gulp.src(path.JS)
    .pipe(cache('jshint'))
    .pipe(react())
    .on('error', function(err) {
      console.error('JSX ERROR in ' + err.fileName);
      console.error(err.message);
      this.end();
    })
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

  if (process.env.CI) {
    stream = stream.pipe(jshint.reporter('fail'));
  }

  return stream;
});

gulp.task('transform', function(){
  gulp.src(path.JS)
  .pipe(react())
  .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('copy', function(){
  gulp.src(path.HTML)
  .pipe(gulp.dest(path.DEST));
});

gulp.task('build', function() {
  gulp.src(path.JS)
  .pipe(react())
  .pipe(concat(path.MINIFIED_OUT))
  .pipe(uglify(path.MINIFIED_OUT))
  .pipe(gulp.dest(path.DEST_BUILD))
});


gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function() {
  gulp.watch(path.ALL, ['jshint', 'transform', 'copy'])
});

gulp.task('default', ['watch']);

gulp.task('production', ['replaceHTML', 'build'])