/// <reference path="./_references.ts"/>

window.jsCommon = window.jsCommon || {};
window.powerbi = window.powerbi || {};
window.debug = window.debug || {};
window.InJs = window.InJs || {};
window.Microsoft = window.Microsoft || {};

require("../Externals/ThirdPartyIP/jqueryui/1.11.4/jquery-ui.min.css");
require("./styles/visuals.less");

require("file?name=images/[name].[ext]!./images/locationButton.svg");

// Require all files from the `_references.ts`
require("ReferencesLoader!./_references.ts");
