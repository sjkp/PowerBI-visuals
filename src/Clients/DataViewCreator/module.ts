/// <reference path="./_references.ts"/>

window.jsCommon = window.jsCommon || {};
window.powerbi = window.powerbi || {};
window.powerbitests = window.powerbitests || {};
window.debug = window.debug || {};

// Typedefs
require("./typedefs/typedefs.ts");

// Externals
require("script!../Externals/ThirdPartyIP/LoDash/lodash.min.js");
require("script!../Externals/ThirdPartyIP/D3/d3.min.js");

// VisualsCommon
require("../VisualsCommon/debug.ts");
require("../VisualsCommon/Errors.ts");
require("../VisualsCommon/Lazy.ts");
require("../VisualsCommon/Prototype.ts");
require("../VisualsCommon/Utility/Utility.ts");
require("../VisualsCommon/tracing/traceItem.ts");
require("../VisualsCommon/Utility/StandaloneUtility.ts");

// VisualsData
require("../VisualsData/semanticQuery/sqExprVisitor.ts");
require("../VisualsData/types/valueType.ts");
require("../VisualsData/contracts/query.ts");
require("../VisualsData/dataView/dataViewTransform.ts");
require("../VisualsData/dataView/dataViewScopeIdentity.ts");
require("../VisualsData/semanticQuery/primitiveValueEncoding.ts");
require("../VisualsData/semanticQuery/sqExprRewriter.ts");
require("../VisualsData/semanticQuery/sqExpr.ts");
require("../VisualsData/dataView/dataViewBuilder.ts");
require("../VisualsData/services/serialization/sqExprShortSerializer.ts");

// PowerBIVisualsTests
require("../PowerBIVisualsTests/customVisuals/sampleDataViews/DataViewBuilder.ts");

// DataViewCreator
require("./CustomVisualsData.ts");
