/// <reference path="./_references.ts"/>

window.jsCommon = window.jsCommon || {};
window.powerbi = window.powerbi || {};
window.debug = window.debug || {};
window.InJs = window.InJs || {};

requireAll(require.context("./", true, /\.less$/));

// Require all files from the `_references.ts`
require("ReferencesLoader!./_references.ts");

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

