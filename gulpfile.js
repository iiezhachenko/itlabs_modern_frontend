var gulp = require('gulp'),
	browserSync = require('browser-sync').create();
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'del', 'merge-stream']
	});

// Define project PATH variables
// Using hoisting rules to avoid constraint 
// that one object field cannot reffer to another object field.
var PATH = {
	src: {
		base: "src",
		bootstrap: {
			less: "bower_components/bootstrap/less/**/*.less",
			js: "bower_components/bootstrap/dist/js/bootstrap.js",
			fonts: "bower_components/bootstrap/dist/fonts/*"
		},
		jquery: "bower_components/jquery/dist/jquery.js"
	},
	build: {
		base: "build"
	},
	watch: {}
}

// Browser sync development server config
var	browserSyncConfig = {
	server: {
		baseDir: "build"
	},
	tunnel: "true",
	host: "localhost",
	port: 9000,
	logPrefix: "Modern_FrontEnd",
	files: PATH.build.base
};

PATH.src.html = PATH.src.base + "/template"; 
PATH.src.img = PATH.src.base + "/img"; 
PATH.src.fonts = PATH.src.base + "/fonts"; 
PATH.src.js = PATH.src.base + "/js";
PATH.src.js_assets = PATH.src.js + "/assets";
PATH.src.less = PATH.src.base + "/less";
PATH.src.less_assets = PATH.src.less + "/assets";
PATH.src.less_assets_bootstrap = PATH.src.less_assets + "/bootstrap";

PATH.build.html = PATH.build.base;
PATH.build.img = PATH.build.base + "/img";
PATH.build.fonts = PATH.build.base + "/fonts";
PATH.build.js = PATH.build.base + "/js";
PATH.build.css = PATH.build.base + "/css";

PATH.watch.html = PATH.src.html + "/**/*.html";
PATH.watch.less = [PATH.src.less + "/**/*.less", "!" + PATH.src.less_assets];
PATH.watch.js = [PATH.src.js + "/**/*.js", "!" + PATH.src.js_assets];
PATH.watch.img = [PATH.src.img + "/**/*"];

gulp.task("gather-deps-less",function(){
	// Copy Boostrap less files into working dir
	return gulp.src([
		PATH.src.bootstrap.less, 
		"!"+PATH.src.bootstrap.less+"/variables.less",
		PATH.src.less+"/variables.less"])
		.pipe(gulp.dest(PATH.src.less_assets_bootstrap));
})

gulp.task("gather-deps-js",function(){
	// Copy JQuery into working dir
	var jquery = gulp.src(PATH.src.jquery).pipe(gulp.dest(PATH.src.js_assets));
	// Copy Bootstrap script into working dir
	var bootstrap = gulp.src(PATH.src.bootstrap.js).pipe(gulp.dest(PATH.src.js_assets));
	return plugins.mergeStream(jquery, bootstrap);
})

gulp.task("cook-html", function() {
	// Cleanup previous build results
	plugins.del.sync(PATH.build.html + "/*.html");
	// Build main HTML file
	return gulp.src(PATH.src.html + "/index.html")
		.pipe(plugins.rigger())
		.pipe(gulp.dest(PATH.build.html));
});

gulp.task("cook-fonts", function() {
	// Cleanup previous build results
	plugins.del.sync(PATH.build.fonts);
	// Build main HTML file
	return gulp.src(PATH.src.bootstrap.fonts)
		.pipe(gulp.dest(PATH.build.fonts));
});

gulp.task("cook-img", function() {
	// Cleanup previous build results
	plugins.del.sync(PATH.build.img);
	// Build main HTML file
	return gulp.src(PATH.src.img + "/*")
		.pipe(gulp.dest(PATH.build.img));
});

gulp.task("css-build", function() {
	// Cleanup previous build results
	plugins.del.sync(PATH.build.css);
	// Complile project main less file
	return gulp.src(PATH.src.less + "/main.less")
		.pipe(plugins.less())
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(PATH.build.css));
});

gulp.task("js-build", function() {
	// Cleanup previous build results
	plugins.del.sync(PATH.build.js);
	// Compose project JS
    return gulp.src(PATH.src.js+"/main.js")
		.pipe(plugins.rigger())
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(PATH.build.js));
});

gulp.task('watch-n-build', function() {
	gulp.watch(PATH.watch.html, ['cook-html']);
	gulp.watch(PATH.watch.less, ['cook-css']);
	gulp.watch(PATH.watch.js, ['cook-js']);
	gulp.watch(PATH.watch.img, ['cook-img']);
})

gulp.task('clean', function(done) {
	plugins.del([
		PATH.build.base,
		PATH.src.less_assets,
		PATH.src.js_assets
	], done);
});

gulp.task('clean-deps-less', function(done) {
	plugins.del([
		PATH.src.less_assets,
	], done);
});

gulp.task('clean-deps-js', function(done) {
	plugins.del([
		PATH.src.js_assets
	], done);
});

// Start static server
gulp.task('browser-sync', ['full-build'], function() {
    browserSync.init(browserSyncConfig);

    plugins.watch(PATH.build.base + "/**/*", {ignoreInitial: false, verbose:true}, function(){
    	setTimeout(function(){
	    	browserSync.reload();
    	}, 2000);
    });
});

gulp.task("cook-js", plugins.sequence('clean-deps-js', 'gather-deps-js', 'js-build'));
gulp.task("cook-css", function(done) {
	plugins.sequence('clean-deps-less', 'gather-deps-less', 'css-build')(done)
});
gulp.task("full-build", plugins.sequence('clean', ['cook-html', 'cook-css', 'cook-js', 'cook-img', 'cook-fonts']));