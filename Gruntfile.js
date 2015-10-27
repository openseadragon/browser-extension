module.exports = function (grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // ----------
    // Project configuration.
    grunt.initConfig({
        clean: {
            build: ["build"],
            chromium: ["build/chromium"],
            firefox: ["build/firefox"]
        },
        watch: {
            files: ["Gruntfile.js", "chromium/*", "firefox/*", "common/*"],
            tasks: "watchTask"
        }
    });

    // ----------
    // Watch task.
    // Called from the watch feature; does a full build or a particular browser build,
    // depending on whether you used --browsername on the command line.
    grunt.registerTask("watchTask", function () {
        if (grunt.option('chromium')) {
            grunt.task.run("build:chromium");
        } else if (grunt.option('firefox')) {
            grunt.task.run("build:firefox");
        } else {
            grunt.task.run("build");
        }
    });

    // ----------
    // Chromium build task.
    grunt.registerTask("build:chromium", function () {
        grunt.file.recurse("chromium", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/chromium/" + subdir + filename);
        });
        grunt.file.recurse("common", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/chromium/" + subdir + filename);
        });
    });

    // ----------
    // Firefox build task.
    grunt.registerTask("build:firefox", function () {
        // Nothing for now
    });

    // ----------
    // Full build task.
    grunt.registerTask("build", ["clean", "build:chromium", "build:firefox"]);

    // ----------
    // Default task.
    // Does a normal build.
    grunt.registerTask("default", ["build"]);
};
