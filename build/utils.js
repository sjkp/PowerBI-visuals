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
    path = require("path"),
    Q = require("q"),
    fs = require("fs"),
    os = require("os"),
    gutil = require("gulp-util"),
    expect = require("gulp-expect-file"),
    consume = require('stream-consume'),
    thr = require("through2"),
    config = require("./options"),
    maps = require("gulp-sourcemaps"),
    concat = require("gulp-concat");


module.exports = {
    getPaths: getPaths,
    getOptionFromCli: getOptionFromCli,
    copy: copy,
    isFunction: isFunction,
    checkDepsArtifacts: checkDepsArtifacts,
    isBuildInsideVS: isBuildInsideVS,
    isBuildInsideVSCode: isBuildInsideVSCode,
    remove: remove,
    replaceInFile: replaceInFile,
    streamToPromise: streamToPromise,
    filterStream: filterStream,
    removeSourceMapProp: removeSourceMapProp,
    isAbsolute: isAbsolute,
    ErrorCache: ErrorCache,
    CallbackHelper: CallbackHelper,
    transform: {
        replace: replaceTransformation,
        rmRefs: removeRefsTransformation
    }
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
 * @param {String | String[]} options.source Source path.
 * @param {String | String[]} options.destination Target path.
 * @param {String} options.join Concat all files given in source into one with name defined in join.
 * @param {Boolean} options.errorIfMissing Emit error if some file in options.source doesn't exist.
 * @param {Function} options.transform Function that is applied to each file before dropping. Signature: function(file, sourcePath, destinationPath)
 * @return {Promise}
 */
function copy(options) {

    var gulpOptions = {},
        srcResult;

    gulpOptions.cwd = options.cwd || process.cwd();
    options.source = normalizePaths([].concat(options.source));
    options.destination = normalizePaths([].concat(options.destination));

    srcResult = gulp
        .src(options.source, gulpOptions)
        .pipe(options.produceMaps ? maps.init({
            loadMaps: true
        }) : gutil.noop())
        //TODO: enable errorIfMissing option
//        .pipe(options.errorIfMissing ? expect("**") : gutil.noop())
        .pipe(options.join ? concat(options.join, {
            newLine: options.newLine || ';'
        }) : gutil.noop())
        .pipe(options.produceMaps ? maps.write("./", {
            includeContent: config.includeContentToMap || false
        }) : gutil.noop());


    //Copy all sourses to each destination folder in parallel.
    return Q.all(options.destination.map(function (destination) {
        return streamToPromise(srcResult
            .pipe(options.transform ? thr.obj(function (file, enc, cb) {

                options.transform(file, file.path, destination);

                cb(null, file);
            }) : gutil.noop())
            .pipe(gulp.dest(destination, gulpOptions)));
    }));

    function normalizePaths(paths) {
        return paths.map(function (sPath) {
            return isAbsolute(sPath) ? sPath : path.join(gulpOptions.cwd, sPath);
        });
    }

    // because path.isAbsolute is miss in node less than v0.12 
    function isAbsolute(dir) {
        return path.resolve(dir) === path.normalize(dir);
    }
}

function streamToPromise(stream) {
    var d = Q.defer();
    stream
        .on("end", d.resolve)
        .on("error", d.reject);

    consume(stream);
    return d.promise;
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

/**
 * Checks wheather given object is function.
 *   
 * @param {Object} obj Object to check.
 * @returns {Boolean} true if `obj` is Function.
 */
function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

/**
 * Checks whether all dependency artifacts for given project are built.
 * 
 * @param {GulpProject} proj Project for checking.
 * @returns {Array} Array of dependencies that are'n containd compiled artifacts
 */
function checkDepsArtifacts(proj) {
    return proj.deps.filter(function (dep) {
        //checks if artifact exists. Note: works only when concatinated artifact is produced (all .js into one)
        //TODO: refactor: to be independent on type of artifact (single or not; css etc)
        if (dep.params.tsc) {
            return !fs.existsSync(path.join(dep.projFolder, "/obj/", dep.params.tsc.outFileName + ".d.ts"));
        } else if (dep.params.less) {
            return !([].concat(dep.params.less).every(function (less) {
                return fs.existsSync(path.join(dep.projFolder, less.destinationPath, less.destinationFileName + ".css"));
            }));
        } else if (dep.params.msbuild) {
            // For msbuild projects it checks only `obj` folder.
            return !fs.existsSync(path.join(dep.projFolder, "/obj/"));
        } else {
            return false;
        }
    });
}

/**
 * Checks whether build is inside VS.
 * 
 * @returns {Boolean} true if it's building inside VS.
 */
function isBuildInsideVS() {
    return !!process.env.VisualStudioVersion;
}

/**
 * Checks whether build is inside VS Code.
 * 
 * @returns {Boolean} true if it's building inside VS Code.
 */
function isBuildInsideVSCode() {
    return !!process.env.VSCODE_PID;
}

function remove(options) {

    var gulpOptions = {};

    gulpOptions.cwd = options.cwd || process.cwd();
    options.source = normalizePaths([].concat(options.source));

    // TODO: replace on stream - use through2
    options.source.forEach(function (src, index) {
        fs.unlinkSync(src);
        if (options.source.length - 1 === index) {
            if (options.callback) {
                options.callback();
            }
        }
    });

    function normalizePaths(paths) {
        return paths.map(function (sPath) {
            return isAbsolute(sPath) ? sPath : path.join(gulpOptions.cwd, sPath);
        });
    }

}

// because path.isAbsolute is miss in node less than v0.12 
function isAbsolute(dir) {
    return path.resolve(dir) === path.normalize(dir);
}

function removeRefsTransformation() {
    return replaceTransformation(/\/\/\/\s*<reference path.*\/>\s/g);
}

function replaceTransformation(find, replace) {
    replace = replace || "";
    return function (file, src, dest) {
        file.contents = new Buffer(file.contents.toString().replace(find, replace));
    };
}

function filterStream(options) {
    
    var extArr = [].concat(options.ext);

    return thr.obj(function (file, enc, cb) {
        if (extArr.some(function (ext) { return path.extname(file.path) === ext; })) {
            return cb(null, file);
        }
        return cb(null);
    });
}

function removeSourceMapProp() {
    return thr.obj(function (file, enc, cb) {
        
        if (!file.isNull() && file.sourceMap) {
            file.sourceMap = undefined;
        }
        
        return cb(null, file);
    });
}

function replaceInFile(file, find, replace) {
    var UTF8 = "utf8";
    replace = replace || "";

    fs.writeFileSync(file, fs.readFileSync(file, UTF8).replace(find, replace), UTF8);
}

function ErrorCache() {

    var self = this;
    var errorCache = [];

    this.catchError = function (error) {
        errorCache.push(error);
    };

    this.throwErrors = function () {
        if (self.hasErrors()) {
            throw self.getErrors();
        }
    };

    this.hasErrors = function () {
        return errorCache.length > 0;
    };

    this.getErrors = function () {
        return os.EOL + errorCache.join(os.EOL);
    };

    this.getErrorsIfExist = function () {
        return self.hasErrors() ? self.getErrors() : undefined;
    };

}

function CallbackHelper(callback) {

    if (!callback) {
        throw new Error("callback have to be provided.");
    }

    var cb = callback,
        called = false;

    this.run = function (err) {
        if (!called) {
            cb(isFunction(err) ? err() : err);
            called = true;
        }
    };

    this.hasCalled = function () {
        return called;
    };
}
