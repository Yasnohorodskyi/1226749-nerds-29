'use strict';

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const sourcemap = require(`gulp-sourcemaps`);
const postcss = require(`gulp-postcss`);
const rename = require(`gulp-rename`);
const terser = require(`gulp-terser`);
const concat = require(`gulp-concat`);
const server = require(`browser-sync`).create();

gulp.task(`test`, function () {
  return gulp.src(`*.html`)
    .pipe(plumber())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
});

gulp.task(`styles`, function () {
  return gulp.src(`css/style.css`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(postcss([
      require(`autoprefixer`),
      require(`postcss-csso`)
    ]))
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`css/`))
    .pipe(server.stream());
});

gulp.task(`scripts`, function () {
  return gulp.src(`js/modules/**/*.js`)
    .pipe(sourcemap.init())
    .pipe(concat(`app.min.js`))
    .pipe(terser())
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

  gulp.watch(`*.html`).on(`change`, server.reload);
  gulp.watch(`img/**/*.{png, jpg, svg, webp}`).on(`change`, server.reload);
  gulp.watch(`css/style.css`, gulp.series(`styles`)).on(`change`, server.reload);
  gulp.watch(`js/**/*.js`).on(`change`, gulp.series(`scripts`, server.reload));
});

gulp.task(`build`, gulp.series(`styles`, `scripts`));
gulp.task(`start`, gulp.series(`build`, `server`));
