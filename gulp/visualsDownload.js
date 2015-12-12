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
    fs = require("fs"),
    download = require("gulp-download"),
    os = require("os"),
    exec = require("child_process").execSync,
    unzip = require("gulp-unzip"),
    visualsCommon = require("./visualsCommon.js");

module.exports = {
    installJasmine: installJasmine,
    installPhantomjs: installPhantomjs,
};
    
/** --------------------------Download "JASMINE-jquery.js" --------------------------------*/
function installJasmine() {
    var result = null;
    var exists = fs.existsSync("src/Clients/Externals/ThirdPartyIP/JasmineJQuery/jasmine-jquery.js");
    if (!exists) {
        console.log("Jasmine test dependency missing. Downloading dependency.");
        result = download("https://raw.github.com/velesin/jasmine-jquery/master/lib/jasmine-jquery.js")
            .pipe(gulp.dest("src/Clients/Externals/ThirdPartyIP/JasmineJQuery"));
    } else {
        console.log("Jasmine test dependency exists.");
    }
    return result;
}

/** ------------------------------ Download PHANTOM --------------------------------------- */
function installPhantomjs() {
    var zipUrl = "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.0.0-windows.zip";
    var phantomExe = "phantomjs.exe";
    var jasmineBrowserDir = "./node_modules/gulp-jasmine-browser/lib/";

    // Download phantomjs only for Windows OS.
    var version = getPhantomJsVersion(jasmineBrowserDir);
    if (os.type().search("Windows") !== -1) {
        if (!version) {
            console.log("Phantomjs missing. Downloading dependency.");
            return download(zipUrl)
                .pipe(unzip({
                    filter: function (entry) {
                        if (entry.path.search(phantomExe) !== -1) {
                            entry.path = phantomExe;
                            return true;
                        }
                    }}))
                .pipe(gulp.dest(jasmineBrowserDir));
        } else {
            logIfExists(version);
        }
    } else {        
        if (version) {
            logIfExists(version);
        } else {
            console.log("Automatic installation does not allowed for current OS [" + os.type() + "]. Please install Phantomjs manually. (https://bitbucket.org/ariya/phantomjs)");
        }
    }

    function logIfExists(version) {
        console.log("Phantomjs has already exist. [Version: " + version + "]");
    }

    function getPhantomJsVersion(path) {
        try {
            var stdout = exec("phantomjs -v", { cwd: path }).toString();
            return stdout.substring(0, 5);
        }
        catch (e) {
            return null;
        }
    }
}

// we need this task to install phantom JS manually
gulp.task("install:phantomjs", function () {
    return visualsCommon.runScriptSequence([
        installPhantomjs
    ]);
});

