'use strict';

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const sourcemap = require(`gulp-sourcemaps`);
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const uglify = require(`gulp-uglify-es`).default;
const concat = require(`gulp-concat`);
const server = require(`browser-sync`).create();

gulp.task(`test`, function () {
  return gulp.src(`html/**/*.html`)
    .pipe(plumber())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
});

gulp.task(`css`, function () {
  return gulp.src(`css/style.css`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`css/`))
    .pipe(server.stream());
});

gulp.task(`js`, function () {
  return gulp.src([
    `js/**/*.js`,
    `!js/**/*.min.js`
  ])
    .pipe(sourcemap.init())
    .pipe(concat(`app.min.js`))
    .pipe(uglify())
    .pipe(sourcemap.write())
    .pipe(gulp.dest(`js/`));
});

gulp.task(`server`, function () {
  server.init({
    server: `.`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`html/**/*.html`).on(`change`, server.reload);
  gulp.watch(`img/**/*.{png, jpg, svg, webp}`).on(`change`, server.reload);
  gulp.watch(`css/style.css`, gulp.series(`css`)).on(`change`, server.reload);
  gulp.watch(`js/**/*.js`).on(`change`, gulp.series(`js`, server.reload));
});

gulp.task(`start`, gulp.series(`server`));
gulp.task(`build`, gulp.series(`css`, `js`));
