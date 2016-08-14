/// <reference path="./_references.ts"/>

window.jsCommon = window.jsCommon || {};
window.powerbi = window.powerbi || {};
window.debug = window.debug || {};
window.InJs = window.InJs || {};

// Require all files from the `_references.ts`
require("ReferencesLoader!./_references.ts");

require("./common/DragDrop.d.ts");
require("./common/IStringResourceProvider.d.ts");
require("./common/promise.d.ts");
require("./common/rect.d.ts");
require("./common/selectionId.d.ts");
require("./common/point.d.ts");
require("./telemetry/iTelemetryService.d.ts");
require("./telemetry/events.d.ts");
require("./data/compiledDataViewMapping.d.ts");
require("./data/sortDirection.d.ts");
require("./data/dataView.d.ts");
require("./data/dataViewMapping.d.ts");
require("./data/dataViewObject.d.ts");
require("./data/dataViewObjectDescriptor.d.ts");
require("./data/dataViewRoleWildcard.d.ts");
require("./data/dataViewScopeIdentity.d.ts");
require("./data/dataViewScopeWildcard.d.ts");
require("./data/displayNameGetter.d.ts");
require("./data/scriptQuery.d.ts");
require("./data/selector.d.ts");
require("./data/semanticQuery.d.ts");
require("./data/visualData.d.ts");
require("./data/visualDataRole.d.ts");
require("./location/geolocation.d.ts");
require("./types/defaultValue.d.ts");
require("./types/enumType.d.ts");
require("./types/fill.d.ts");
require("./types/fillRule.d.ts");
require("./types/filter.d.ts");
require("./types/image.d.ts");
require("./types/paragraphs.d.ts");
require("./types/structuralType.d.ts");
require("./types/valueType.d.ts");
require("./visual/iVisualStyle.d.ts");
require("./visual/iVisual.d.ts");
require("./visual/VisualObjectInstance.d.ts");
require("./visual/VisualObjectRepetition.d.ts");
require("./visual/iVisualPlugin.d.ts");
require("./extensibility/VisualCapabilities.d.ts");
require("./extensibility/iVisual.d.ts");
require("./extensibility/Versioning.d.ts");
require("./extensibility/versions/v1.0.0.d.ts");
require("./extensibility/versions/v1.1.0.d.ts");
require("./extensibility/components/iSelectionManager.d.ts");
require("./extensibility/components/iSelectionIdBuilder.d.ts");
