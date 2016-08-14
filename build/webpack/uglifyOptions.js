
/**
 * Options for uglify module.
 * 
 * @param {Boolean} isDebug defines if debug mode is enabled/disabled
 * @returns {Object} options.
 */
function getJsUglifyOptions(isDebug) {
    return {
        compress: {
            drop_console: true,
            pure_funcs: [
                "debug.assertValue",
                "debug.assertFail",
                "debug.assert",
                "debug.assertAnyValue",
                "debug.assertNonEmpty",
            ],
            warnings: false,
            dead_code: true,
            sequences: true,
            properties: true,
            conditionals: true,
            comparisons: true,
            booleans: true,
            cascade: true,
            unused: true,
            loops: true,
            if_return: true,
            join_vars: true,
            global_defs: {
                "DEBUG": isDebug
            }
        }
    };
}

/**
 * Options for .nonmin uglify module.
 * 
 * @param {Boolean} isDebug defines if debug mode is enabled/disabled
 * @returns {Object} options.
 */
function getNonminJsUglifyOptions() {
    var options = getJsUglifyOptions(false);

    options.mangle = false;
    options.output = {
        beautify: true
    };

    return options;
}

module.exports = {
    uglifyOptions: getJsUglifyOptions(),
    nonminOptions: getNonminJsUglifyOptions(),
};