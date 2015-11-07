module.exports = function (grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-jpm");
    grunt.loadNpmTasks("grunt-crx");

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
        },
        jpm: {
            options: {
                src: "build/firefox",
                xpi: "build"
            }
        },
        crx: {
            crx: {
                "src": "build/chromium/**/*",
                "dest": "build",
                "options": {
                    "privateKey": "../openseadragonizer.pem"
                }
            }
        },
        compress: {
            chromium: {
                options: {
                    archive: "build/chromium.zip"
                },
                files: [{
                        expand: true,
                        cwd: "build/chromium",
                        src: ["**/*"],
                        dest: ""
                    }
                ]
            }
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
        grunt.file.recurse("common", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/chromium/" + subdir + filename);
        });
        grunt.file.recurse("chromium", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/chromium/" + subdir + filename);
        });
        grunt.task.run("compress:chromium");
    });

    // ----------
    // Firefox build task.
    grunt.registerTask("build:firefox", function () {
        grunt.file.recurse("common", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/firefox/data/" + subdir + filename);
        });
        grunt.file.recurse("firefox", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/firefox/" + subdir + filename);
        });
        grunt.file.copy("build/firefox/data/logo48.png", "build/firefox/icon.png");
        grunt.task.run("jpm:xpi");
    });

    // ----------
    // Full build task.
    grunt.registerTask("build", ["clean", "build:chromium", "build:firefox"]);

    // ----------
    // Default task.
    // Does a normal build.
    grunt.registerTask("default", ["build"]);
};
