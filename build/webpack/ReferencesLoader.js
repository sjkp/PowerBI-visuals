

module.exports = function (content) {
    this.cacheable && this.cacheable();

    // RegExp to match all references tags except `_references.ts` and `.d.ts` files 
    var refsRegExp = /\/\/\/\s*<reference.*="(((?!(_references)|(\.d)).)*\.ts)"\/>/g;

    // Replace all references tags by require defenition
    return content.toString().replace(refsRegExp, 'require("$1");');
};

module.exports.raw = true;