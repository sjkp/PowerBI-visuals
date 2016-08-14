/// <reference path="./_references.ts"/>

window.jsCommon = window.jsCommon || {};
window.powerbi = window.powerbi || {};
window.powerbitests = window.powerbitests || {};
window.debug = window.debug || {};
window.InJs = window.InJs || {};
window.Microsoft = window.Microsoft || {};

// Extra libraries used in tests
require("script!../../../node_modules/jasmine-jquery/lib/jasmine-jquery.js");
require("script!../../../src/Clients/Externals/ThirdPartyIP/QuillJS/quill.min.js");
require("script!../../../src/Clients/Externals/ThirdPartyIP/noUiSlider/nouislider.min.js");

require("./typedefs/typedefs.ts");

require("./common.ts");
require("./mocks.ts");
require("./helpers/helpers.ts");
require("./helpers/forecastTestHelpers.ts");
require("./helpers/performanceTestsHelpers.ts");
require("./helpers/slicerHelper.ts");
require("./helpers/tableDataViewHelper.ts");
require("./helpers/tablixHelper.ts");
require("./helpers/kpiHelper.ts");
require("./helpers/referenceLineHelper.ts");
require("./helpers/trendLineHelper.ts");
require("./jasmineMatchers/toEqualDeep.ts");
require("./jasmineMatchers/toEqualSQExpr.ts");

require("./sqFieldDef.ts");

require("./customVisuals/helpers/dataViewHelpers.ts");
require("./customVisuals/helpers/visualTestHelpers.ts");
require("./customVisuals/VisualBuilderBase.ts");
require("./extensibility/extensibilityMocks.ts");
require("./extensibility/extensibilityHelpers.ts");
require("./customVisuals/sampleDataViews/DataViewBuilder.ts");
require("./customVisuals/sampleDataViews/SalesByCountryData.ts");
require("./customVisuals/sampleDataViews/SankeyDiagramData.ts");
require("./customVisuals/sampleDataViews/MekkoChartData.ts");
require("./customVisuals/sampleDataViews/BulletChartData.ts");
require("./customVisuals/sampleDataViews/CarLogosData.ts");
require("./customVisuals/sampleDataViews/CountriesData.ts");
require("./customVisuals/sampleDataViews/ChordChartData.ts");
require("./customVisuals/sampleDataViews/SalesByDayOfWeekData.ts");
require("./customVisuals/sampleDataViews/EnhancedScatterChartData.ts");
require("./customVisuals/sampleDataViews/forceGraphData.ts");
require("./customVisuals/sampleDataViews/GanttData.ts");
require("./customVisuals/sampleDataViews/AsterPlotData.ts");
require("./customVisuals/sampleDataViews/TimelineData.ts");
require("./customVisuals/sampleDataViews/valueByAgeData.ts");
require("./customVisuals/sampleDataViews/ProductSalesByDateData.ts");
require("./customVisuals/sampleDataViews/PulseChartData.ts");
require("./customVisuals/sampleDataViews/LineDotChartData.ts");
require("./customVisuals/sampleDataViews/ValueByNameData.ts");
require("./customVisuals/sampleDataViews/ValueByNameGroupData.ts");