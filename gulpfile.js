const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');

const path = {
	html: {
		src: 'index.html',
		dest: 'dist'
	},
	styles: {
		src: 'public/css/*.css',
		dest: 'dist/assets/css'
	},
	images: {
		src: 'public/images/*.{jpg,jpeg,png,svg}',
		dest: 'dist/assets/images'
	},
	scripts: {
		src: 'public/scripts/**/*.js',
		dest: 'dist/assets/js'
	}
}

gulp.task('html', async () => {
	return gulp.src(path.html.src)
		.pipe(gulp.dest(path.html.dest));
});

gulp.task('styles', async () => {
	return gulp.src(path.styles.src)
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest(path.styles.dest));
});

gulp.task('scripts', async () => {
	return gulp.src(path.scripts.src)
		.pipe(gulp.dest(path.scripts.dest))
})

gulp.task('sw', async () => {
	return gulp.src(path.sw.src)
		.pipe(gulp.dest(path.sw.dest))
})

gulp.task('images', async () => {
	return gulp.src(path.images.src)
		.pipe(gulp.dest(path.images.dest));
});

gulp.task('watch', gulp.parallel(() => {
	gulp.watch(path.html.src, gulp.parallel('html'));
	gulp.watch(path.styles.src, gulp.parallel('styles'));
	gulp.watch(path.images.src, gulp.parallel('images'));
	gulp.watch(path.scripts.src, gulp.parallel('scripts'));
	gulp.watch(path.sw.src, gulp.parallel('sw'));
}));

gulp.task('default', gulp.parallel('html', 'styles', 'sw', 'images', 'scripts', 'watch'));
