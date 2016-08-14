
var loaderUtils = require("loader-utils");

module.exports = function(content) {

    this.cacheable && this.cacheable();
    
    var query = loaderUtils.parseQuery(this.query);
    
    var name = loaderUtils.interpolateName(this, "[name].[ext]", {
        context: query.context,
        content: content,
        regExp: query.regExp
    });

    this.emitFile(name, content);

    return "/* Removed by FileToAssetLoader */";
};

module.exports.raw = true;