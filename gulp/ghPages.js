/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var runSequence = require("run-sequence");
var gulp = require('gulp');
var fs = require("fs");
var git = require('gulp-git');
var exec = require('child_process').exec;
var del = require('del');
var typedoc = require("gulp-typedoc");
var visualsBuild = require("./visualsBuild.js").load();

gulp.task('update:visualsGhPages', function (cb) {
    /** ------------------------------- Type DOC. ------------------------------------- */
    gulp.task("createdocs:visualsGhPages", function () {
        return gulp
            .src([
                "src/Clients/Visuals/**/*.ts",
                "!src/Clients/Visuals*/obj/*.*"
            ])
            .pipe(typedoc({
                // Output options (see typedoc docs)
                target: "ES5",
                //includeDeclarations: true,
                mode: "file",
                // TypeDoc options (see typedoc docs)
                out: "docs",
                json: "docs/to/file.json",
                // TypeDoc options (see typedoc docs)
                name: "PowerBI-Visuals",
                ignoreCompilerErrors: true,
                version: true,
            }));
    });

    /** ------------------------------ Git tasks. ---------------------------------- */
    gulp.task('pullRebase:visualsGhPages', function () {
        return git.pull('origin', 'master', { args: '--rebase' }, function (err) {
            if (err)
                throw err;
        });
    });
    // Command line option:
    //  --fatal=[warning|error|off]
    var fatalLevel = require('yargs').argv.fatal;
    var ERROR_LEVELS = ['error', 'warning'];
    // Return true if the given level is equal to or more severe than
    // the configured fatality error level.
    // If the fatalLevel is 'off', then this will always return false.
    // Defaults the fatalLevel to 'error'.
    function isFatal(level) {
        return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
    }
    // Handle an error based on its severity level.
    // Log all levels, and exit the process for fatal levels.
    function handleError(level, error) {
        gutil.log('I\'ve got error: ' + error.message + ' Now thinking, what to do with it...');
        if (isFatal(level))
            process.exit(1);
    }

    // Convenience handler for error-level errors.
    function onError(error) {
        handleError.call(this, 'error', error);
    }

    gulp.task('checkout:visualsGhPages', function () {
        fs.exists('.docs', function (exists) {
            if (!exists) {
                console.log('cloning the repo/gh-pages into .docs');
            } else {
                return console.log('gh-pages repo exists in .docs folder.');
            }
        });
    });

    gulp.task('pull:visualsGhPages', function () {
        exec('git -C .docs pull', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    });
    gulp.task('copyDocs:visualsGhPages', function () {
        return gulp.src(['docs/**/*']).pipe(gulp.dest('.docs'));
    });
    gulp.task('addAll:visualsGhPages', function (cb) {
        exec('git -C .docs add --all', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });

    var doCommit = false;
    gulp.task('commit:visualsGhPages', function (callback) {

        exec('git -C .docs status > node_modules/statuscheck.txt', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });

        setTimeout(function () {

            fs.readFile("node_modules/statuscheck.txt", "utf-8", function (err, _data) {
                doCommit = _data.indexOf('nothing to commit') < 0;
                del(['node_modules/statuscheck.txt'], function (err, paths) {
                });
                //console.log('Original git message: \n '+_data+ '\n end of original git message');
                if (err)
                    console.log('Command exec ERROR: \n ' + err);

                if (doCommit) {
                    console.log('Commiting changes');
                    exec('git -C .docs commit -m \'automatic-documentation-update\'', function (err, stdout, stderr) {
                        console.log(stdout);
                        console.log(stderr);
                        callback(err);
                    });
                } else {
                    console.log('Nothing to commit');
                    return true;
                }
            });
        }, 10000);
    });
    gulp.task('push:visualsGhPages', function (cb) {
        exec('git -C .docs push', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });

    gulp.task("combine:visuals:internalDts", function () {
        return visualsBuild.combineInternalDts();
    });

    runSequence(
        "pullRebase:visualsGhPages",
        "build:visuals:projects",
        "combine:visuals:internalDts",
        "checkout:visualsGhPages",
        "pull:visualsGhPages",
        "createdocs:visualsGhPages",
        "copyDocs:visualsGhPages",
        "addAll:visualsGhPages",
        "commit:visualsGhPages",
        "push:visualsGhPages",
        cb);
});

