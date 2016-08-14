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

"use strict";

var gulp = require("gulp"),
    gulpTsLint = require("gulp-tslint"),
    thr = require("through2"),
    config = require("../options"),
    gutils = require("gulp-util"),
    path = require("path");

/**
 * Runs TypeScript linter for given paths.
 * 
 * @param {String} projectPath Path of project which will be linted. Used as CWD.
 * @param {String | Array} paths Paths where linter will be searching .ts files.
 * @param {Object} options  
 * @param {Object} options.noLog - to disable logging  
 */
function tslint(projectPath, paths, options) {
    var options = options || {};

    options.noLog = options.noLog === undefined ? config.noLog : options.noLog;

    return gulp.src(paths, { cwd: projectPath })
        .pipe(thr.obj(function (file, enc, cb) {

            // filtering files to pass only ts 
            if (path.extname(file.path) === ".ts") {

                if (!options.noLog) {
                    gutils.log(path.relative("src/Clients/", file.path));
                }
                
                cb(null, file);
            } else {
                cb();
            }
        }))
        .pipe(gulpTsLint({
            rulesDirectory: path.join(__dirname, "./custom_rules"),
            configuration: require("./tslint.json"),
        }))
        .pipe(gulpTsLint.report("full", {
            emitError: true,
        }));
}

module.exports = tslint;