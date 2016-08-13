/*
 * Copyright (C) 2015 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * - Neither the name of OpenSeadragon nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
module.exports = function (grunt) {

    // ----------
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");

    var releaseRoot = "../openseadragon.github.com/openseadragonizer/";

    // ----------
    // Project configuration.
    grunt.initConfig({
        clean: {
            build: ["build"],
            webextension: ["build/webextension"],
            release: {
                src: [releaseRoot],
                options: {
                    force: true
                }
            }
        },
        watch: {
            files: ["Gruntfile.js", "webextension/*", "common/*"],
            tasks: "watchTask"
        },
        compress: {
            webextension: {
                options: {
                    archive: "build/webextension.zip"
                },
                files: [{
                        expand: true,
                        cwd: "build/webextension",
                        src: ["**/*"],
                        dest: ""
                    }
                ]
            }
        }
    });

    // ----------
    // Watch task.
    grunt.registerTask("watchTask", function () {
            grunt.task.run("build");
    });

    function copyCommonDir(destination) {
        grunt.file.recurse("common", function (abspath, rootdir, subdir, filename) {
            // Only copy the minified version of OSD + the images dir.
            if (subdir === "openseadragon" && filename !== "openseadragon.min.js") {
                return;
            }
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, destination + subdir + filename);
        });
    }

    // ----------
    // WebExtension build task.
    grunt.registerTask("build:webextension", function () {
        copyCommonDir("build/webextension/");
        grunt.file.recurse("webextension", function (abspath, rootdir, subdir, filename) {
            subdir = subdir ? subdir + "/" : "";
            grunt.file.copy(abspath, "build/webextension/" + subdir + filename);
        });
        grunt.task.run("compress:webextension");
    });

    // ----------
    // Copy release task.
    grunt.registerTask("copy:release", function () {
        copyCommonDir(releaseRoot);
    });

    // ----------
    // Full build task.
    grunt.registerTask("build", ["clean", "build:webextension"]);

    // ----------
    // Publish task.
    // Copies the content of common to ../openseadragon.github.com/openseadragonizer.
    grunt.registerTask("publish", ["clean:release", "build", "copy:release"]);

    // ----------
    // Default task.
    // Does a normal build.
    grunt.registerTask("default", ["build"]);
};
