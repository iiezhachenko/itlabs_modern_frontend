var gulp = require('gulp'),
    webpack = require('webpack'),
	webpackConfig = require('./webpack.config.js'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*', 'del']
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

gulp.task("default", ["webpack"]);

gulp.task("cook-html", function() {
	// Cleanup previous build results
	cleanUp(PATH.build.html + "/*.html");
	// Build main HTML file
	return gulp.src(PATH.src.html + "/index.html")
		.pipe(plugins.rigger())
		.pipe(gulp.dest(PATH.build.html));
});

gulp.task("cook-img", function() {
    // Cleanup previous build results
    cleanUp(PATH.build.img);
    // Build main HTML file
    return gulp.src(PATH.src.img + "/*")
        .pipe(gulp.dest(PATH.build.img));
});

gulp.task('clean', function() {
	cleanUp(PATH.build.base);
});

gulp.task("webpack", ['clean', 'cook-html', 'cook-img'], function() {
	// run webpack
    console.log(webpackConfig.context);
	webpack(webpackConfig, function(err, stats) {
		if(err) throw console.log("webpack", err);
        console.log("[webpack] " + stats.toString({}));
	});
});