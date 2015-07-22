var gulp = require('gulp'),
	browserSync = require('browser-sync').create();
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'del', 'merge-stream']
	});

// Define project PATH variables
// Using hoisting rules to avoid constraint 
// that one object field cannot refer to another object field.
var PATH = {
	src: {
		base: "src",
		bootstrap: {
			less: ["bower_components/bootstrap/less/**/*.less", "!bower_components/bootstrap/less/variables.less"],
			js: "bower_components/bootstrap/dist/js/bootstrap.js",
			fonts: "bower_components/bootstrap/dist/fonts/*"
		},
		jquery: "bower_components/jquery/dist/jquery.js"
	},
	build: {
		base: "build"
	},
	watch: {}
};

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

function cleanUp(path){
    var deleted = plugins.del.sync(path);
    if (deleted.length > 0){
        console.log("Deleted files/folders:\n", deleted.join("/n"));
    }
}

PATH.src.html = PATH.src.base + "/template";
PATH.src.img = PATH.src.base + "/img"; 
PATH.src.fonts = PATH.src.base + "/fonts"; 
PATH.src.js = PATH.src.base + "/js";
PATH.src.less = PATH.src.base + "/less";

PATH.build.html = PATH.build.base;
PATH.build.img = PATH.build.base + "/img";
PATH.build.fonts = PATH.build.base + "/fonts";
PATH.build.js = PATH.build.base + "/js";
PATH.build.css = PATH.build.base + "/css";

PATH.watch.html = PATH.src.html + "/**/*.html";
PATH.watch.less = [PATH.src.less + "/**/*.less"];
PATH.watch.js = [PATH.src.js + "/**/*.js"];
PATH.watch.img = [PATH.src.img + "/**/*"];

gulp.task("cook-html", function() {
	// Cleanup previous build results
	cleanUp(PATH.build.html + "/*.html");
	// Build main HTML file
	return gulp.src(PATH.src.html + "/index.html")
		.pipe(plugins.rigger())
		.pipe(gulp.dest(PATH.build.html));
});

gulp.task("cook-fonts", function() {
	// Cleanup previous build results
	cleanUp(PATH.build.fonts);
	// Build main HTML file
	return gulp.src(PATH.src.bootstrap.fonts)
		.pipe(gulp.dest(PATH.build.fonts));
});

gulp.task("cook-img", function() {
	// Cleanup previous build results
	cleanUp(PATH.build.img);
	// Build main HTML file
	return gulp.src(PATH.src.img + "/*")
		.pipe(gulp.dest(PATH.build.img));
});

gulp.task("cook-css", function(){
    cleanUp(PATH.build.css);
	gulp.src(PATH.src.less + "/main.less")
        .pipe(plugins.rigger())
        .pipe(plugins.debug())
        .pipe(plugins.less())
        .pipe(gulp.dest(PATH.build.css));
});

gulp.task("cook-js", function(){
    cleanUp(PATH.build.js);
    gulp.src(PATH.src.js + "/main.js")
        .pipe(plugins.rigger())
        .pipe(gulp.dest(PATH.build.js));
});

gulp.task('watch-n-build', function() {
	gulp.watch(PATH.watch.html, ['cook-html']);
	gulp.watch(PATH.watch.less, ['cook-css']);
	gulp.watch(PATH.watch.js, ['cook-js']);
	gulp.watch(PATH.watch.img, ['cook-img']);
});

gulp.task('clean', function() {
	cleanUp(PATH.build.base);
});

gulp.task("full-build", ["clean", "cook-img", "cook-fonts", "cook-html", "cook-css", "cook-js"]);
// Start static server
gulp.task('browser-sync', ["cook-img", "cook-fonts", "cook-html", "cook-css", "cook-js"], function() {
    browserSync.init(browserSyncConfig);

    plugins.watch(PATH.build.base + "/**/*", {ignoreInitial: false}, function(){
    	setTimeout(function(){
	    	browserSync.reload();
    	}, 2000);
    });
});