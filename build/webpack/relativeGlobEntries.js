var glob = require('glob'),
    path = require('path');

module.exports = function (globPath, root, prefix) {
    var files = glob.sync(globPath);
    var entries = {};
    var relativePath;

    for (var i = 0; i < files.length; i++) {
        var entry = files[i];
        // make entry name to be file path relative to root folder specified
        relativePath = path.relative(root, entry);
        // remove extension
        relativePath = relativePath.replace(/\.[^/.]+$/, "");
        relativePath = prefix ? path.join(prefix, relativePath) : relativePath;

        entries[relativePath] = entry;
    }

    return entries;
}
