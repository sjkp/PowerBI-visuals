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
var gulp = require("gulp"),
    rename = require("gulp-rename"),
	fs = require("fs"),
    runSequence = require("run-sequence"),
    cliParser = require("./cliParser.js"),
    visualsCommon = require("./visualsCommon.js");
    visualsBuild = require("./visualsBuild.js");

gulp.task("package", function (callback) {
    gulp.task("package:minified", function () {
        return buildPackageProjects(true);
    });

    gulp.task("package:unminified", function () {
        return buildPackageProjects(false);
    });

    gulp.task("package:artifacts", function () {
        var visualsBuildMode = visualsBuild.load();
        return visualsCommon.runScriptSequence([
            visualsBuildMode.combineInternalDts,
            visualsBuildMode.combineExternalDts,
			replaceReferences,
            copyPackageSprite
        ]);
    });

    runSequence(
        "package:minified",
        "package:unminified",
        "package:artifacts",
        callback);


    function copyPackageJsMinified() {
        return copyPackageFile("build/scripts/powerbi-visuals.all.js", "powerbi-visuals.min.js");
    }

    function copyPackageJsUnminified() {
        return copyPackageFile("build/scripts/powerbi-visuals.all.js", "powerbi-visuals.js");
    }

    function copyPackageCssMinified() {
        return copyPackageFile("build/styles/visuals.css", "visuals.min.css");
    }

    function copyPackageCssUnminified() {
        return copyPackageFile("build/styles/visuals.css", "visuals.css");
    }

    function copyPackageSprite() {
        return copyPackageFile("src/Clients/Visuals/images/visuals.sprites.png", "images/visuals.sprites.png");
    }
	
	function replaceReferences () {
		replaceInFile("./lib/powerbi-visuals.d.ts", /\/\/\/\s*<reference path.*\/>\s/g);
	}
	
	function replaceInFile(file, find, replace) {
		var UTF8 = "utf8";
		replace = replace || "";
		
		fs.writeFileSync(file, fs.readFileSync(file, UTF8).replace(find, replace), UTF8);
	}

    function buildPackageProjects(isReleaseFlag) {
        var visualsBuildMode = visualsBuild.load({ isRelease: isReleaseFlag });
        return visualsCommon.runScriptSequence([
            visualsBuildMode.buildVisualsCommon,
            visualsBuildMode.buildVisualsData,
            visualsBuildMode.buildVisualsProjectTs,
            visualsBuildMode.buildVisualsProjectSprite,
            visualsBuildMode.buildVisualsProjectLess,
            visualsBuildMode.combineInternalJs,
            visualsBuildMode.combineExternalJs,
            visualsBuildMode.combineVisualJsAll,
            isReleaseFlag ? copyPackageJsMinified : copyPackageJsUnminified,
            isReleaseFlag ? copyPackageCssMinified : copyPackageCssUnminified],
            isReleaseFlag);
    }

    function copyPackageFile(inputFile, outputFile) {
        var src = [];
        src.push(inputFile);

        return gulp.src(src)
            .pipe(rename(outputFile))
            .pipe(gulp.dest("lib"));
    }
});



