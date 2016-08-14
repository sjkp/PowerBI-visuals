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

var gulp = require('gulp-help')(require('gulp'), getHelpOptions()),
    runSequence = require("run-sequence").use(gulp),
    path = require("path"),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    utils = require("./build/utils.js"),
    options = require("./build/options"),
    karma = require("karma"),
    opn = require("opn"),
    WebpackDevServer = require("webpack-dev-server"),
    uglify = require("gulp-uglify"),
    gulpMinifyCSS = require("gulp-minify-css"),
    cssjanus = require("gulp-cssjanus"),
    merge = require("merge2"),
    clone = require("gulp-clone"),
    Q = require("q"),
    gutil = require("gulp-util"),
    packageBuilder = require("./build/packageBuilder.js"),
    assign = require("object-assign"),
    rename = require("gulp-rename");

var uglifyOptions = require("./build/webpack/uglifyOptions.js").uglifyOptions;
var nonminOptions = require("./build/webpack/uglifyOptions.js").nonminOptions;

require("./build/symlinkToDirectoryLib.js");

var externalsJs = [
    "src/Clients/Externals/ThirdPartyIP/JQuery/2.1.3/jquery.min.js",
    "src/Clients/Externals/ThirdPartyIP/jqueryui/1.11.4/jquery-ui.min.js",
    "src/Clients/Externals/ThirdPartyIP/D3/d3.min.js",
    "src/Clients/Externals/ThirdPartyIP/LoDash/lodash.min.js",
    "src/Clients/Externals/ThirdPartyIP/GlobalizeJS/globalize.min.js",
    "src/Clients/Externals/ThirdPartyIP/GlobalizeJS/globalize.culture.en-US.js"
];

var sandDanceExternalsJs = [
    "src/Clients/Externals/ThirdPartyIP/hammer/hammer-206.js",
    "src/Clients/Externals/ThirdPartyIP/mat4x/mat4x.js",
    "src/Clients/Externals/ThirdPartyIP/vuePlotCore/vuePlotCore.js"
];

var externalsDts = [
    "src/Clients/Typedefs/jquery/jquery.d.ts",
    "src/Clients/Typedefs/microsoftMaps/Microsoft.Maps.d.ts",
    "src/Clients/Typedefs/quill/quill.d.ts",
    "src/Clients/Typedefs/lodash/lodash.d.ts",
    "src/Clients/Typedefs/d3/d3.d.ts"
];

var commonArgs = {
    options: {
        "fast": "disables all time-consuming options (eg. `--uglifyJs`, `--generateMaps`).",
        "uglifyJs": "minify .js assets after build",
        "nonminJs": "produce nonmin artifacts",
        "minifyCss": "minify .css assets after build",
        "generateMaps": "generate .map files",
        "tslintOnBuild": "verify tslint errors during the build",
        "tslintOnChange": "verify tslint errors in watch mode"
    }
};

var testArgs = {
    options: {
        "debug, --d": "opens tests in browser to debug them ",
        "spec": "define specifications that will be run during testing (eg: --spec='Some spec name')",
        "watch": "to run karma in watch mode - tests will be re-run after any detected change",
        "files": "run specific test files using glob pattern `--files='./tests/**/*tests.js'`",
        "trx": "turn on creating TRX report after testing",
        "trx='../some/path/to_report'": "defines the directory to store trx file",
        "trxName": "name of resulting trx report, 'PowerBIVisualsTests.Results.trx' by default",
    }
};

var packageArgs = {
    options: {
        "visual='asterPlot'": "Name of custom visual to proceed",
        "copyToDrop": "Copy packages to lib folder"
    }
};

var tslintArgs = {
    options: {
        "paths='./Visuals/**'": "Paths that will be linted, can be Glob pattern",
        "noLog": "Disable showing files during linting"
    }
};

function getWebPackConfig(watchMode, path) {
    var pathToConf = path || "./webpack.config.js";

    var webpackConfig = require(pathToConf);

    if (!options.generateMaps) {
        webpackConfig.devtool = undefined;
        webpackConfig.ts.compilerOptions.sourceMap = false;
    }

    if (watchMode === true) {
        // enable watcher
        webpackConfig.watch = true;

        if (!options.tslintOnChange) {
            webpackConfig.module.preLoaders = [];
        }
    } else {
        if (!options.tslintOnBuild) {
            webpackConfig.module.preLoaders = [];
        }
    }

    return webpackConfig;
}

var buildCopyTaskInfo = gutil.colors.green("Produces and copies external libs for Visuals projects to `./lib` folder");

gulp.task("build:copy-externals", buildCopyTaskInfo, function () {

    var dest = "./lib";

    return Q.all([
        utils.copy({
            cwd: __dirname,
            source: externalsJs,
            destination: dest,
            join: "powerbi-visuals-externals.min.js"
        }),
        utils.copy({
            cwd: __dirname,
            source: externalsDts,
            destination: dest,
            join: "powerbi-externals.d.ts",
            newLine: "\n"
        }),
        utils.copy({
            cwd: __dirname,
            source: sandDanceExternalsJs,
            destination: dest,
            join: "powerbi-customVisuals-externals.min.js"
        })
    ]);
});

var buildProjectsTaskInfo = gutil.colors.green("Build Visuals projects without tests. It also produces all related assets.");

gulp.task("build:projects", buildProjectsTaskInfo, ["build:copy-externals"], function () {

    // build only Visuals projects
    return runBuild(true).then(function () {
        // run post build task
        return Q.nfcall(runSequence, "postBuild");
    });
}, commonArgs);

var buildTaskInfo = gutil.colors.green("Common task to build all projects and tests that also produces all related assets - min.js, nonmin.js, min.css, rtl.css.");

gulp.task("build", buildTaskInfo, ["build:copy-externals"], function () {

    // build Visuals projects and tests together
    return runBuild().then(function () {
        // run post build task
        return Q.nfcall(runSequence, "postBuild");
    });
}, commonArgs);

var buildDataViewCreator = gutil.colors.green("Build DataViewCreator project without other project.");

gulp.task("build:dataViewCreator", buildDataViewCreator, [], function () {
    var entry = {
        "DataViewCreator": ["./src/Clients/DataViewCreator/module.ts"]
    };

    // build DataViewCreator project
    return runBuild(true, entry);
}, commonArgs);

function runBuild(withoutTests, entry) {

    var deferred = Q.defer(),
        webPackConfig = getWebPackConfig();

    if (entry) {
        webPackConfig.entry = entry;
    }

    // disable building tests during gulp build task.
    // TODO: consider using other way to disable build of tests
    options.buildWithoutTests = withoutTests !== undefined ? !!withoutTests : options.buildWithoutTests;

    webpack(webPackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);

        traceBuildStats(stats, false /* isWatch*/);

        if (stats.compilation.errors.length) {
            deferred.reject("Build task failure [err count: " + stats.compilation.errors.length + "]");
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

var postBuildTaskInfo = gutil.colors.green("Task that performs minification, non-minification and rtl.css producing after completing the build");

gulp.task("postBuild", postBuildTaskInfo, function (cb) {

    var uglifyTask = "postBuild:uglify",
        nonminTask = "postBuild:nonmin",
        cssMinTask = "postBuild:css-min",
        createSymlinkTask = "postBuild:create-symlink";

    var tasks = [uglifyTask, cssMinTask, createSymlinkTask];

    if (options.nonminJs) {
        tasks.push(nonminTask);
        gulp.task(nonminTask, getMinTask(nonminOptions, ".nonmin.js", options.uglifyJs));
    }

    gulp.task(uglifyTask, getMinTask(uglifyOptions, ".min.js", options.uglifyJs));

    gulp.task(cssMinTask, processCss);

    return runSequence(tasks, cb);

    function getMinTask(options, ext, enabled) {

        return function () {
            // TODO: consider using `changed` module
            return gulp.src(["./lib/*.js", "!./lib/*.min.js", "!./lib/*.nonmin.js"])
                .pipe(enabled ? uglify(options) : gutil.noop())
                .pipe(rename({ extname: ext }))
                .pipe(gulp.dest("./lib/"));
        }
    }
});

/**
 * Produce rtl css and minify all css files in lib folder;
 */
function processCss() {

    var dest = "./lib/";

    // pick up all css files except min and rtl
    var cssStream = gulp.src(["./lib/*.css", "!./lib/*.rtl.css", "!./lib/*.min.css"])
        // workaround to produce pausable stream (new mode)
        .pipe(gutil.noop());

    // produce rtl files from plain css
    var cssjanusResult = cssStream
        .pipe(clone())
        .pipe(cssjanus({ swapLtrRtlInUrl: true }))
        .pipe(rename({ extname: ".rtl.css" }))
        .pipe(gulp.dest(dest));

    // TODO: consider using `changed` module
    // minify and save all css
    return merge([cssStream, cssjanusResult])
        .pipe(options.minifyCss ? gulpMinifyCSS() : gutil.noop())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest));
}

var watchTaskInfo = gutil.colors.green("Start watchers for Visuals and Tests together.");

gulp.task("watch", watchTaskInfo, ["build:copy-externals"], function (callback) {
    webpack(getWebPackConfig(true), webPackWatcherCallback);
}, commonArgs);

var watchProjectsTaskInfo = gutil.colors.green("Build Visuals projects and run watchers");

gulp.task("watch:projects", watchProjectsTaskInfo, ["build:copy-externals"], function (callback) {

    //disable watching tests during gulp watch task.
    options.buildWithoutTests = true;

    webpack(getWebPackConfig(true), webPackWatcherCallback);
}, commonArgs);

var testsTaskInfo = gutil.colors.green("Builds visuals and test project and then run tests");

gulp.task("test", testsTaskInfo, function (done) {
    runSequence("build", "run:tests", done);
}, { options: assign({}, testArgs.options, commonArgs.options) });

var runTestsTaskInfo = gutil.colors.green("Run tests without full build, useful in conjunction with watchers (visuals or/and tests).");

gulp.task("run:tests", runTestsTaskInfo, function (done) {

    var spec = options.spec;
    var watch = options.watch;

    var karmaConfig = {
        configFile: path.join(__dirname, "./src/Clients/PowerBIVisualsTests/karma.conf.js")
    };

    if (options.debug) {
        // run in browser
        karmaConfig.browsers = ["Chrome"];
        // don"t close browser at the end so that you can do F12
        karmaConfig.singleRun = false;
    }

    if (spec) {
        karmaConfig.client = {
            args: ["--grep", spec],
        }
    }

    if (watch) {
        karmaConfig.autoWatch = true;
        karmaConfig.singleRun = false;
        karmaConfig.autoWatchBatchDelay = 1000; // delay to batch multiple changes into a single run
    }

    new karma.Server(karmaConfig, function (karmaExitCode) {
        console.log("Karma exited with code ", karmaExitCode);
        done(karmaExitCode ? new Error("Karma exited with code " + karmaExitCode) : null);

        //https://github.com/karma-runner/karma/issues/1035
        process.exit(karmaExitCode);
    }).start();
}, testArgs);

var buildTestsTaskInfo = gutil.colors.green("Build test project without running them.");

gulp.task("build:tests", buildTestsTaskInfo, function (callback) {
    var webpackConfig = getWebPackConfig(false, "./src/Clients/PowerBIVisualsTests/webpack.config.js");

    webpack(webpackConfig, function (err, stats) {

        if (err) throw new gutil.PluginError("webpack", err);

        traceBuildStats(stats, false /* isWatch*/);

        callback(stats.compilation.errors.length ? "Failure in 'build:tests' task." : undefined);
    });
}, commonArgs);

var watchTestsTaskInfo = gutil.colors.green("Build tests and run watchers");

gulp.task("watch:tests", watchTestsTaskInfo, function (callback) {
    webpack(getWebPackConfig(true, "./src/Clients/PowerBIVisualsTests/webpack.config.js"), webPackWatcherCallback);
}, commonArgs);

var playgroundTaskInfo = gutil.colors.green("Run playground with webpack dev server (live reload feature). After running it watches on sources and reflect all changes on opened playground page");

gulp.task("playground", playgroundTaskInfo, ["build:copy-externals"], function (callback) {

    //disable building tests
    options.buildWithoutTests = true;

    var webpackConfig = getWebPackConfig();

    webpackConfig.debug = true;
    webpackConfig.stats = false;
    webpackConfig.output.publicPath = "/assets/";

    webpackConfig.entry.CustomVisuals.unshift("webpack-dev-server/client?http://localhost:3333/");
    webpackConfig.entry.Visuals.unshift("webpack-dev-server/client?http://localhost:3333/");
    webpackConfig.entry.PowerBIVisualsPlayground.unshift("webpack-dev-server/client?http://localhost:3333/");

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError("webpack", err);

        var url = "http://localhost:3333/src/Clients/PowerBIVisualsPlayground/";

        // open Playground in default browser
        gutil.log(gutil.colors.green("Open Playground URL: "), gutil.colors.white(url));
        opn(url);
    }), {
            inline: true,
            publicPath: webpackConfig.output.publicPath,
            // hot: true,
            stats: false
        }).listen("3333", "localhost", function (err) {
            if (err) {
                throw new gutil.PluginError("webpack-dev-server", err);
            }
            gutil.log("[webpack-dev-server]", "http://localhost:3333/");
        });
}, commonArgs);

function webPackWatcherCallback(err, stats) {

    if (err) throw new gutil.PluginError("webpack", err);

    traceBuildStats(stats, true /* isWatch */);

    // Check if some css asset is emitted
    var needUpdCss = Object.keys(stats.compilation.assets).some(function (assetkey) {
        return stats.compilation.assets[assetkey].emitted === true && path.extname(assetkey) === ".css";
    });

    // produce css related artifacts - rtl.css, min.css, min.rtl,css
    // TODO: get rid of such logic when main projects will use only one visual asset/bundle.
    if (needUpdCss) {
        processCss();
    }

    gutil.log(gutil.colors.magenta("waiting for changes ..."));
}

function traceBuildStats(stats, isWatch) {

    var traceLine = stats.toString(stats.compilation.options.stats || {});

    // trace could be empty if there is no errors/warnings and assets=false
    if (traceLine) {
        // there is new line sign so as to keep webpack message formatting
        gutil.log("[webpack]\n", traceLine);
    }

    if (isWatch) {
        var jsonStats = stats.toJson();
        var emitted = Object.keys(stats.compilation.assets).filter(function (asset) {
            return stats.compilation.assets[asset].emitted;
        }).length;
        var emittedMsg = emitted ? gutil.colors.white(" Assets emitted: ") + gutil.colors.cyan(emitted) : gutil.colors.white(" No assets emitted");

        gutil.log("Build took " + gutil.colors["cyan"]((parseInt(jsonStats.time) / 1000) + "s") + emittedMsg);
    }
}

var packageTaskInfo = gutil.colors.green("Generate pbviz packages for CustomVisuals");

gulp.task("package:createApprovedVisualsList", function(callback) {
    packageBuilder.createApprovedVisualsList(callback);
});

gulp.task("package", packageTaskInfo, function (callback) {

    gulp.task("package:all", function (callback) {
        packageBuilder.buildAllPackages(false, callback);
    });

    gulp.task("package:all:addToDrop", function (callback) {
        packageBuilder.buildAllPackages(true, callback);
    });

    var packageName = options.visual,
        addToDrop = options.addToDrop;

    if (packageName) {
        var pb = new packageBuilder(packageName);
        pb.build(addToDrop, callback);
    } else if (addToDrop) {
        runSequence("package:all:addToDrop", callback);
    } else {
        runSequence("package:all", callback);
    }
}, packageArgs);

var tslintTaskInfo = gutil.colors.green("Performs linting for all .ts files in PowerBI-visuals folder");

gulp.task("tslint", tslintTaskInfo, function () {
    var tslint = require("./build/tsLint/tslint.js");

    // some paths to exclude from linting
    var exclude = [
        "!./**/*.d.ts",
        "!./CustomVisuals/visuals/*/package/**/*.*"
    ];

    // pick up all ts in src/Clients dir to lint if `paths` argument is not passed
    var pathsToLint = [].concat(options.paths || "./**/*.ts").concat(exclude);

    return tslint(path.join(__dirname, "src/Clients"), pathsToLint);

}, tslintArgs);

function getHelpOptions() {
    return {
        description: false, //modifies the default help message
        //aliases: false, //adds aliases to the default help task
        hideEmpty: true, //hide all tasks with no help message defined. Useful when including 3rd party tasks
        hideDepsMessage: true, //hide all task dependencies
        afterPrintCallback: false //a function to run after the default help task runs
    }
};
