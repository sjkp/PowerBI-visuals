var Concat = require("concat-with-sourcemaps");
var utils = require("../../build/utils.js");

function ConcatDTSPlugin(options) {
    this.options = options || {};
    this.options.newLine = this.options.newLine || undefined;//require("os").EOL;
    this.options.chunks = this.options.chunks || null;
}

ConcatDTSPlugin.prototype.apply = function(compiler) {
    var me = this;
    var dtsPattern = /\.d\.ts/;

    compiler.plugin('emit', function(compilation, callback) {

        // deleting all .d.ts from assets
        for (var filename in compilation.assets) {

            if (dtsPattern.test(filename)) {
                delete compilation.assets[filename];
            }
        }

        var chunks = compilation.chunks;

        if (me.options.chunks !== null) {
            me.options.chunks = [].concat(me.options.chunks);

            chunks = compilation.chunks.filter(function(chunk) {
                return me.options.chunks.some(function(item) {
                    return chunk.name === item;
                });
            });
        }

        chunks.forEach(function(chunk) {

            var concat = new Concat(false/* source maps */, undefined /*filename*/, me.options.newLine);

            chunk.modules.forEach(function(module) {
                for (var asset in module.assets) {
                    if (dtsPattern.test(asset)) {
                        concat.add(null, module.assets[asset]._value, null);
                    }
                }
            });

            // adding combined .d.ts to assets
            var combined = concat.content;

            //apply transformation if exists
            if (me.options.transformation) {
                if (utils.isFunction(me.options.transformation)) {
                    combined = me.options.transformation(combined);
                } else {
                    throw new Error("ConcatDTSPlugin: transformation must be a function.")
                }
            }

            compilation.assets[chunk.name + ".d.ts"] = {
                source: function() {
                    return combined;
                },
                size: function() {
                    return combined.length;
                }
            };

        });

        callback();
    });
};

module.exports = ConcatDTSPlugin;