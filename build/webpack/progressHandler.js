var gutils = require('gulp-util');
var readline = require('readline');
var utils = require('../../build/utils.js');

var isBuildInsideVS = utils.isBuildInsideVS();
var isBuildInsideVSCode = utils.isBuildInsideVSCode();

var lastValue = -1;
var msgHasShowed = false;

module.exports = function (percentage, msg) {

    if (!isBuildInsideVSCode && percentage > 0) {
        readline.moveCursor(process.stdout, -1, -1)
        readline.clearScreenDown(process.stdout);
    }

    if (percentage === 1) {
        gutils.log("Webpack build: finished");
    } else {

        if (isBuildInsideVS || isBuildInsideVSCode) {

            // Reduce messages amount when it's running within VS
            percentage = percentage.toPrecision(1);
            if (lastValue !== percentage) {
                gutils.log("Webpack build: " + msg);
                // msgHasShowed = true;
                lastValue = percentage;
            }

        } else {
            gutils.log("Webpack build: " + msg);
        }
    }
};

