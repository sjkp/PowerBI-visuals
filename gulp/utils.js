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

var gulp = require("gulp");

module.exports = {
    getPaths: getPaths,
    getOptionFromCli: getOptionFromCli,
    copy: copy
};

/**
 * Returns paths.
 *
 * @param {String[]} includePaths
 * @param {String[]} excludePaths
 * @returns {String[]}
 */
function getPaths(includePaths, excludePaths) {
    var paths = [];

    if (includePaths && !(includePaths instanceof Array)) {
        includePaths = [includePaths];
    }

    if (excludePaths && !(excludePaths instanceof Array)) {
        excludePaths = [excludePaths];
    }

    if (includePaths && includePaths instanceof Array) {
        paths = paths.concat(includePaths.map(function (path) {
            return "./" + path;
        }));
    }

    if (excludePaths && excludePaths instanceof Array) {
        paths = paths.concat(excludePaths.map(function (path) {
            return "!./" + path;
        }));
    }

    paths.push("!./obj/**");

    return paths;
}

/**
 * @param {Object} options Options to copy.
 * @param {String} options.source Source path.
 * @param {String} options.destination Target path.
 */
function copy(options) {
    var gulpOptions = {
        cwd: options.cwd || process.cwd()
    },
    srcResult;

    options.source = options.source || [];
    options.destination = options.destination || [];

    if (!(options.source instanceof Array)) {
        options.source = [options.source];
    }

    if (!(options.destination instanceof Array)) {
        options.destination = [options.destination];
    }

    srcResult = gulp.src(options.source.join(","), gulpOptions);

    options.destination.map(function (destination) {
        srcResult = srcResult
            .pipe(gulp.dest(destination));
    });

    return srcResult;
}

/**
 * Returns cli options
 * @argument {String} cliArg Arguments separated by "," or ";"
 */
function getOptionFromCli(cliArg) {
    if (cliArg && cliArg.length > 0) {
        return cliArg.split(/[,;]/);
    }

    return [];
}