import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import watchify from 'watchify';

const bundle = (watching = false) => {
	const browser = browserify({
		entries: ['./src/main.jsx'],
		transform: ['babelify'],
		debug: true,
		plugin: (watching) ? [watchify] : null
	})
	.on('update', () => {
		bundler();
	});

	const bundler = () => {
		return browser.bundle()
			.on('error', (err) => {
				console.log(err.message);
				console.log(err.stack);
			})
			.pipe(source('main.js'))
			.pipe(gulp.dest('./js/'));
	};

	return bundler();
};

gulp.task('build', () => {
	bundle();
});

gulp.task('watch', () => {
	bundle(true);
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: "./",
			index: 'index.html'
		}
	});
});

gulp.task('reload', () => {
	browserSync.reload();
});

gulp.task('default', ['server','watch'], () => {
	gulp.watch('./index.html',  ['reload']);
	gulp.watch('./js/main.js', ['reload']);
	gulp.watch('./css/main.css', ['reload']);
});
