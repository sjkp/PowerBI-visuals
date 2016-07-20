var options = require("../../../build/options");
var path = require("path");

var trxReportName = options.trxName || "PowerBIVisualsTests.Results.trx",
    trxReporter = options.trx ? {
        outputFile: typeof options.trx === "string" ? path.join(options.trx, trxReportName) : trxReportName,
    } : {};

module.exports = function (config) {
    config.set({
        basePath: "../../../lib/",
        browsers: ["PhantomJS2"], // Chrome
        plugins: ["karma-*"],
        frameworks: ["jasmine"],
        reporters: options.trx ? ["progress", "trx"] : ["progress"],
        trxReporter: trxReporter,
        middleware: [],
        files: [
            { pattern: "images/*", included: false, served: true },
            { pattern: "**/*.map", included: false, served: true },

            // common css
            "Visuals.css",
            "CustomVisuals.css",

            // target js libraries
            "powerbi-visuals-externals.min.js",
            "powerbi-visuals.js",
            "CustomVisuals.js",

            // combined extrenals js and helpers
            "./tests/testsInfra.js",

            // test files to run
            options.files || "./tests/**/*Tests.js" 
        ],

        logLevel: config.LOG_INFO,
        singleRun: true,
        client: {},
        browserDisconnectTimeout: 10 * 60 * 1000,    // defaults to 2000 ms
        browserDisconnectTolerance: 1,   // defaults to 0 (i.e. no reconnects allowed)
        browserNoActivityTimeout: 10 * 60 * 1000,   // defaults to 10000 ms
        proxies: {
            "/images/": "/base/images/"
        }
    });
};