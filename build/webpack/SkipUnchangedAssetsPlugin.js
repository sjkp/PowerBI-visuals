var utils = require("../../build/utils.js");
var fs = require("fs");
var path = require("path");
var crypto = require('crypto');

function SkipUnchangedAssetsPlugin(options) {
    this.options = options || {};
    this.onlyWatch = this.options.onlyWatch || false;
}

SkipUnchangedAssetsPlugin.prototype.apply = function (compiler) {
    var me = this;

    compiler.plugin('emit', function (compilation, callback) {

        for (var filename in compilation.assets) {

            var realPath = path.join(this.outputPath, filename);

            if (fileExists(realPath)) {

                var asset = compilation.assets[filename];
                var source = asset.source ? asset.source() : asset._value;

                if (source) {
                    var assetHash = sha1(source.toString());
                    var fileHash = sha1(fs.readFileSync(realPath).toString());

                    if (assetHash === fileHash) {
                        delete compilation.assets[filename];
                    }
                }
            }
        }

        callback();
    });
};


function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function fileExists(pathToFile) {
    try {
        var fileStat = fs.statSync(pathToFile);

        return fileStat && fileStat.isFile();
    } catch (e) {
        return false;
    }
}

module.exports = SkipUnchangedAssetsPlugin;