"use strict";

var minimist = require("minimist"),
    configJson = require("./config.json"),
    cliOptions = {
        boolean: [
            "debug",
            "fast",
            "noProgress",
            "uglifyJs",
            "nonminJs",
            "minifyCss",
            "generateMaps",
            "tslintOnBuild",
            "tslintOnChange",
            "buildWithoutTests", //disable build/watch tests during gulp build/watch tasks.
            "watch" // to run karma in autoWatch mode - triggers tests run on change
        ],
        alias: {
            msbuildVersion: "msbv",
            debug: "d"
        },
        default: configJson,
    }

/**
 * Get config and apply CLI arguments.
 * Note:  CLI arguments have more priority.
 * 
 * Use this method instead of require("./config.json")
 * 
 * @returns {Object} Json object with settings.
 */
module.exports = function () {

    var options = minimist(process.argv.slice(2), cliOptions) || {};

    /**
     * --fast flag - disables some of the build process for faster build
     * it is added to the defaults so they can be individual overridden 
     */
    if (options.fast) {
        configJson.uglifyJs = false;
        configJson.minifyCss = false;
        configJson.generateMaps = false;
        configJson.tslintOnBuild = false;
        configJson.tslintOnChange = false;
        
        options = minimist(process.argv.slice(2), cliOptions) || {};
    }

    return options;
} ();
