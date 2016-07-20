/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/// <reference path="../../../_references.ts"/>

var THREE: any;
var WebGLHeatmap;
var GlobeMapCanvasLayers: JQuery[];

module powerbi.visuals.samples {
    import TouchRect = controls.TouchUtils.Rectangle;
    import ILocation = powerbi.visuals.services.ILocation;

    interface GlobeMapData {
        dataView: DataView;
        settings: GlobeMapSettings;
        dataPoints: GlobeMapDataPoint[];
        seriesDataPoints: GlobeMapSeriesDataPoint[];
    }

    interface GlobeMapDataPoint {
        location: ILocation;
        place: string;
        locationType: string;
        placeKey: string;
        height: number;
        heightBySeries: number[];
        seriesToolTipData: any[];
        heat: number;
        toolTipData: any;
    }

    interface GlobeMapSeriesDataPoint extends SelectableDataPoint {
        label: string;
        color: string;
        category?: string;
    }

    class VisualLayout {
        private marginValue: IMargin;
        private viewportValue: IViewport;
        private viewportInValue: IViewport;
        private minViewportValue: IViewport;
        private originalViewportValue: IViewport;
        private previousOriginalViewportValue: IViewport;

        public defaultMargin: IMargin;
        public defaultViewport: IViewport;

        constructor(defaultViewport?: IViewport, defaultMargin?: IMargin) {
            this.defaultViewport = defaultViewport || { width: 0, height: 0 };
            this.defaultMargin = defaultMargin || { top: 0, bottom: 0, right: 0, left: 0 };
        }

        public get viewport(): IViewport {
            return this.viewportValue || (this.viewportValue = this.defaultViewport);
        }

        public get viewportCopy(): IViewport {
            return _.clone(this.viewport);
        }

        //Returns viewport minus margin
        public get viewportIn(): IViewport {
            return this.viewportInValue || this.viewport;
        }

        public get minViewport(): IViewport {
            return this.minViewportValue || { width: 0, height: 0 };
        }

        public get margin(): IMargin {
            return this.marginValue || (this.marginValue = this.defaultMargin);
        }

        public set minViewport(value: IViewport) {
            this.setUpdateObject(value, v => this.minViewportValue = v, VisualLayout.restrictToMinMax);
        }

        public set viewport(value: IViewport) {
            this.previousOriginalViewportValue = _.clone(this.originalViewportValue);
            this.originalViewportValue = _.clone(value);
            this.setUpdateObject(value,
                v => this.viewportValue = v,
                o => VisualLayout.restrictToMinMax(o, this.minViewport));
        }

        public set margin(value: IMargin) {
            this.setUpdateObject(value, v => this.marginValue = v, VisualLayout.restrictToMinMax);
        }

        //Returns true if viewport has updated after last change.
        public get viewportChanged(): boolean {
            return !!this.originalViewportValue && (!this.previousOriginalViewportValue
                || this.previousOriginalViewportValue.height !== this.originalViewportValue.height
                || this.previousOriginalViewportValue.width !== this.originalViewportValue.width);
        }

        public get viewportInIsZero(): boolean {
            return this.viewportIn.width === 0 || this.viewportIn.height === 0;
        }

        public resetMargin(): void {
            this.margin = this.defaultMargin;
        }

        private update(): void {
            this.viewportInValue = VisualLayout.restrictToMinMax({
                width: this.viewport.width - (this.margin.left + this.margin.right),
                height: this.viewport.height - (this.margin.top + this.margin.bottom)
            }, this.minViewportValue);
        }

        private setUpdateObject<T>(object: T, setObjectFn: (T) => void, beforeUpdateFn?: (T) => void): void {
            object = _.clone(object);
            setObjectFn(VisualLayout.createNotifyChangedObject(object, o => {
                if(beforeUpdateFn) beforeUpdateFn(object);
                this.update();
            }));

            if(beforeUpdateFn) beforeUpdateFn(object);
            this.update();
        }

        private static createNotifyChangedObject<T>(object: T, objectChanged: (o?: T, key?: string) => void): T {
            var result: T = <any>{};
            _.keys(object).forEach(key => Object.defineProperty(result, key, {
                    get: () => object[key],
                    set: (value) => { object[key] = value; objectChanged(object, key); },
                    enumerable: true,
                    configurable: true
                }));
            return result;
        }

        private static restrictToMinMax<T>(value: T, minValue?: T): T {
            _.keys(value).forEach(x => value[x] = Math.max(minValue && minValue[x] || 0, value[x]));
            return value;
        }
    }

    export class GlobeMapSettings {
        public static get Default() { 
            return new this();
        }

        public static parse(dataView: DataView, capabilities: VisualCapabilities) {
            var settings = new this();
            if(!dataView || !dataView.metadata || !dataView.metadata.objects) {
                return settings;
            }

            var properties = this.getProperties(capabilities);
            for(var objectKey in capabilities.objects) {
                for(var propKey in capabilities.objects[objectKey].properties) {
                    if(!settings[objectKey] || !_.has(settings[objectKey], propKey)) {
                        continue;
                    }

                    var type = capabilities.objects[objectKey].properties[propKey].type;
                    var getValueFn = this.getValueFnByType(type);
                    settings[objectKey][propKey] = getValueFn(
                        dataView.metadata.objects,
                        properties[objectKey][propKey],
                        settings[objectKey][propKey]);
                }
            }

            return settings;
        }

        public static getProperties(capabilities: VisualCapabilities)
            : { [i: string]: { [i: string]: DataViewObjectPropertyIdentifier } } & { 
                general: { formatString: DataViewObjectPropertyIdentifier },
                dataPoint: { fill: DataViewObjectPropertyIdentifier } } {
            var objects  = _.merge({ 
                general: { properties: { formatString: {} } } 
            }, capabilities.objects);
            var properties = <any>{};
            for(var objectKey in objects) {
                properties[objectKey] = {};
                for(var propKey in objects[objectKey].properties) {
                    properties[objectKey][propKey] = <DataViewObjectPropertyIdentifier> {
                        objectName: objectKey,
                        propertyName: propKey
                    };
                }
            }

            return properties;
        }

        public static createEnumTypeFromEnum(type: any): IEnumType {
            var even: any = false;
            return createEnumType(Object.keys(type)
                .filter((key,i) => ((!!(i % 2)) === even && type[key] === key
                    && !void(even = !even)) || (!!(i % 2)) !== even)
                .map(x => <IEnumMember>{ value: x, displayName: x }));
        }

        private static getValueFnByType(type: powerbi.data.DataViewObjectPropertyTypeDescriptor) {
            switch(_.keys(type)[0]) {
                case "fill": 
                    return DataViewObjects.getFillColor;
                default:
                    return DataViewObjects.getValue;
            }
        }

        public static enumerateObjectInstances(
            settings = new this(),
            options: EnumerateVisualObjectInstancesOptions,
            capabilities: VisualCapabilities): ObjectEnumerationBuilder {

            var enumeration = new ObjectEnumerationBuilder();
            var object = settings && settings[options.objectName];
            if(!object) {
                return enumeration;
            }

            var instance = <VisualObjectInstance>{
                objectName: options.objectName,
                selector: null,
                properties: {}
            };

            for(var key in object) {
                if(_.has(object,key)) {
                    instance.properties[key] = object[key];
                }
            }

            enumeration.pushInstance(instance);
            return enumeration;
        }

        public originalSettings: GlobeMapSettings;
        public createOriginalSettings(): void {
            this.originalSettings = _.cloneDeep(this);
        }

        //Default Settings
        public dataPoint = {

        };
    }

    export class GlobeMapColumns<T> {
        public static Roles = Object.freeze(
            _.mapValues(new GlobeMapColumns<string>(), (x, i) => i));

        public static getColumnSources(dataView: DataView) {
            return this.getColumnSourcesT<DataViewMetadataColumn>(dataView);
        }

        public static getTableValues(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && _.mapValues(
                columns, (n: DataViewMetadataColumn, i) => n && table.rows.map(row => row[n.index]));
        }

        public static getTableRows(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && table.rows.map(row =>
                _.mapValues(columns, (n: DataViewMetadataColumn, i) => n && row[n.index]));
        }

        public static getCategoricalValues(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            var series: string[] = categorical && values.source && this.getSeriesValues(dataView);
            return categorical && _.mapValues(new this<any[]>(), (n, i) =>
                (<DataViewCategoricalColumn[]>_.toArray(categories)).concat(_.toArray(values))
                    .filter(x => x.source.roles && x.source.roles[i]).map(x => x.values)[0]
                || values.source && values.source.roles && values.source.roles[i] && series);
        }

        public static getSeriesValues(dataView: DataView) {
            return dataView && dataView.categorical && dataView.categorical.values
                && dataView.categorical.values.map(x => converterHelper.getSeriesName(x.source));
        }

        public static getCategoricalColumns(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            return categorical && _.mapValues(
                new this<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>(),
                (n, i) => categories.filter(x => x.source.roles && x.source.roles[i])[0]
                    || values.source && values.source.roles && values.source.roles[i] && values
                    || values.filter(x => x.source.roles && x.source.roles[i]));
        }

        public static getGroupedValueColumns(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var values = categorical && categorical.values;
            var grouped = values && values.grouped();
            return grouped && grouped.map(g => _.mapValues(
                new this<DataViewValueColumn>(),
                (n,i) => g.values.filter(v => v.source.roles[i])[0]));
        }

        private static getColumnSourcesT<T>(dataView: DataView) {
            var columns = dataView && dataView.metadata && dataView.metadata.columns;
            return columns && _.mapValues(
                new this<T>(), (n, i) => columns.filter(x => x.roles && x.roles[i])[0]);
        }

        //Data Roles
        public Category: T = null;
        public Series: T = null;
        public X: T = null;
        public Y: T = null;
        public Height: T = null;
        public Heat: T = null;

    }

    export class GlobeMap implements IVisual {
        public static MercartorSphere: any;
        private static GlobeSettings = {
            autoRotate: false,
            earthRadius: 30,
            cameraRadius: 100,
            earthSegments: 100,
            heatmapSize: 1000,
            heatPointSize: 7,
            heatIntensity: 10,
            heatmapScaleOnZoom: 0.95,
            barWidth: 0.3,
            barHeight: 5,
            rotateSpeed: 0.5,
            zoomSpeed: 0.8,
            cameraAnimDuration: 1000, //ms
            clickInterval: 200 //ms
        };

        private layout: VisualLayout;
        private container: JQuery;
        private domElement: HTMLElement;
        private camera: any;
        private renderer: any;
        private scene: any;
        private orbitControls: any;
        private earth: any;
        private data: GlobeMapData;
        private get settings(): GlobeMapSettings {
            return this.data && this.data.settings;
        }
        private heatmap: any;
        private heatTexture: any;
        private mapTextures: any[];
        private barsGroup: any;
        private readyToRender: boolean;
        private deferredRenderTimerId: any;
        private globeMapLocationCache: { [i: string]: ILocation };
        private locationsToLoad: number = 0;
        private locationsLoaded: number = 0;
        private renderLoopEnabled = true;
        private needsRender = false;
        private mousePosNormalized: any;
        private mousePos: any;
        private rayCaster: any;
        private selectedBar: any;
        private hoveredBar: any;
        private averageBarVector: any;
        private zoomControl: any;
        private colors: IDataColorPalette;
        private style: IVisualStyle;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Location'),
                    preferredTypes: [
                        { geography: { address: true } },
                        { geography: { city: true } },
                        { geography: { continent: true } },
                        { geography: { country: true } },
                        { geography: { county: true } },
                        { geography: { place: true } },
                        { geography: { postalCode: true } },
                        { geography: { region: true } },
                        { geography: { stateOrProvince: true } },
                    ],
                },
                {
                    name: 'Series',
                    kind: powerbi.VisualDataRoleKind.Grouping,
                    displayName: "Legend",
                },
                {
                    name: 'X',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Longitude',
                    description: 'Use to override the longitude of locations',
                    preferredTypes: [{ geography: { longitude: true } }],
                },
                {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Latitude',
                    description: 'Use to override the latitude of locations',
                    preferredTypes: [{ geography: { latitude: true } }],
                },
                {
                    name: 'Height',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Bar Height',
                },
                {
                    name: 'Heat',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Heat Intensity',
                }
            ],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                dataPoint: {
                    displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                    properties: {
                        defaultColor: {
                            displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: data.createDisplayNameGetter('Visual_DataPoint_Show_All'),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fillRule: {
                            displayName: data.createDisplayNameGetter('Visual_Gradient'),
                            type: { fillRule: {} },
                            rule: {
                                inputRole: 'Gradient',
                                output: {
                                    property: 'fill',
                                    selector: ['Category'],
                                },
                            },
                        }
                    }
                },
            },
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 1 }, 'Height': { max: 1 }, 'Heat': { max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [
                                { bind: { to: 'Height' } },
                                { bind: { to: 'Heat' } },
                                { bind: { to: 'X' } },
                                { bind: { to: 'Y' } },
                            ],
                            dataReductionAlgorithm: { top: {} }
                        }
                    },
                    rowCount: { preferred: { min: 2 } }
                },
            }],
            sorting: {
                custom: {},
            }
        };

        private static converter(dataView: DataView, globeMapLocationCache: { [i: string]: ILocation }, colors: IDataColorPalette): GlobeMapData {
            var categorical = GlobeMapColumns.getCategoricalColumns(dataView);
            if(!categorical || !categorical.Category || _.isEmpty(categorical.Category.values)
                || (_.isEmpty(categorical.Height) && _.isEmpty(categorical.Heat))) {
                return null;
            }

            var properties = GlobeMapSettings.getProperties(GlobeMap.capabilities);
            var settings = GlobeMap.parseSettings(dataView);
            var groupedColumns = GlobeMapColumns.getGroupedValueColumns(dataView);

            var dataPoints = [];
            var seriesDataPoints = [];
            var locations = [];

            var colorHelper = new ColorHelper(colors, properties.dataPoint.fill);

            var locationType, heights, heightsBySeries, toolTipDataBySeries, heats;

            if (categorical.Category && categorical.Category.values) {
                locations = categorical.Category.values;
                var type = <any>categorical.Category.source.type;
                locationType = type.category ? (<string>type.category).toLowerCase() : "";
            } else {
                locations = [];
            }

            if (!_.isEmpty(categorical.Height)) {
                if (groupedColumns.length > 1) {
                    heights = new Array(locations.length);
                    heightsBySeries = new Array(locations.length);
                    toolTipDataBySeries = new Array(locations.length);
                    seriesDataPoints = new Array(groupedColumns.length);
                    //creating a matrix for drawing values by series later.
                    for (var i = 0; i < groupedColumns.length; i++) {
                        var values = groupedColumns[i].Height.values;
                        seriesDataPoints[i] = GlobeMap.createDataPointForEnumeration(
                            dataView, groupedColumns[i].Height.source, i, null, colorHelper, colors);
                        for (var j = 0; j < values.length; j++) {
                            if (!heights[j]) heights[j] = 0;
                            heights[j] += values[j] ? values[j] : 0;
                            if (!heightsBySeries[j]) heightsBySeries[j] = [];
                            heightsBySeries[j][i] = values[j];
                            if (!toolTipDataBySeries[j]) toolTipDataBySeries[j] = [];
                            toolTipDataBySeries[j][i] = { 
                                displayName: categorical.Series && categorical.Series.source.displayName,
                                value: dataView.categorical.values.grouped()[i].name,
                                dataPointValue: values[j]
                            };
                        }
                    }
                    for (var i = 0; i < groupedColumns.length; i++) {
                        var values = groupedColumns[i].Height.values;
                        for (var j = 0; j < values.length; j++) { 
                            //calculating relative size of series
                            heightsBySeries[j][i] = values[j] / heights[j];
                        }
                    }
                } else {
                    heights = categorical.Height[0].values;
                    heightsBySeries = new Array(groupedColumns.length);
                    seriesDataPoints[0] = GlobeMap.createDataPointForEnumeration(
                        dataView, groupedColumns[0].Height.source, 0, dataView.metadata, colorHelper, colors);
                }

            } else {
                heightsBySeries = new Array(locations.length);
                heights = new Array(locations.length);
            }

            if (!_.isEmpty(categorical.Heat)) {
                if (groupedColumns.length > 1) {
                    heats = new Array(locations.length);
                    for (var i = 0; i < groupedColumns.length; i++) {
                        var values = groupedColumns[i].Heat.values;
                        for (var j = 0; j < values.length; j++) {
                            if (!heats[j]) heats[j] = 0;
                            heats[j] += values[j] ? values[j] : 0;
                        }
                    }
                } else {
                    heats = categorical.Heat[0].values;
                }

            } else {
                heats = new Array(locations.length);
            }

            var maxHeight = Math.max.apply(null, heights) || 1;
            var maxHeat = Math.max.apply(null, heats) || 1;
            var heatFormatter = valueFormatter.create({ 
                format: !_.isEmpty(categorical.Heat) && categorical.Heat[0].source.format,
                value: heats[0],
                value2: heats[1]
            });
            var heightFormatter = valueFormatter.create({ 
                format: !_.isEmpty(categorical.Height) && categorical.Height[0].source.format,
                value: heights[0],
                value2: heights[1]
            });

            for (var i = 0, len = locations.length; i < len; ++i) {
                if (typeof (locations[i]) === "string") {
                    var place = locations[i].toLowerCase();
                    var placeKey = place + "/" + locationType;
                    var location: ILocation = (_.isEmpty(categorical.X) || _.isEmpty(categorical.Y))
                        ? globeMapLocationCache[placeKey]
                        : { longitude: categorical.X[0].values[i] || 0, latitude: categorical.Y[0].values[i] || 0 };

                    var height = heights[i] / maxHeight;
                    var heat = heats[i] / maxHeat;

                    var renderDatum = <GlobeMapDataPoint>{
                        location: location,
                        placeKey: placeKey,
                        place: place,
                        locationType: locationType,
                        height: height ? height || 0.01 : undefined,
                        heightBySeries: heightsBySeries[i],
                        seriesToolTipData: toolTipDataBySeries ? toolTipDataBySeries[i] : undefined,
                        heat: heat || 0,
                        toolTipData: {
                            location: { displayName: categorical.Category && categorical.Category.source.displayName, value: locations[i] },
                            height: { displayName: !_.isEmpty(categorical.Height) && categorical.Height[0].source.displayName, value: heightFormatter.format(heights[i]) },
                            heat: { displayName: !_.isEmpty(categorical.Heat) && categorical.Heat[0].source.displayName, value: heatFormatter.format(heats[i]) }
                        } 
                    };

                    dataPoints.push(renderDatum);
                }
            }

            return {
                dataView: dataView,
                dataPoints: dataPoints,
                seriesDataPoints: seriesDataPoints,
                settings: settings
            };
        }

        private static parseSettings(dataView: DataView): GlobeMapSettings {
            var settings = GlobeMapSettings.parse(dataView, GlobeMap.capabilities);
            settings.createOriginalSettings();
            return settings;
        }

        private static createDataPointForEnumeration(
            dataView: DataView,
            source: DataViewMetadataColumn,
            seriesIndex,
            metaData,
            colorHelper: ColorHelper,
            colors: IDataColorPalette): GlobeMapSeriesDataPoint {

            let columns = dataView.categorical.values.grouped()[seriesIndex];
            let label = converterHelper.getFormattedLegendLabel(source, <DataViewValueColumns>columns.values, null);
            let identity = SelectionId.createWithId(columns.identity);
            let category = converterHelper.getSeriesName(source);
            let objects = <any>columns.objects;
            let color = objects && objects.dataPoint ? objects.dataPoint.fill.solid.color : metaData && metaData.objects
                ? colorHelper.getColorForMeasure(metaData.objects,"")
                : colors.getColorByIndex(seriesIndex).value;

            return {
                label: label,
                identity: identity,
                category: category,
                color: color,
                selected: null
            };
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var instances = GlobeMapSettings.enumerateObjectInstances(
                this.settings && this.settings.originalSettings,
                options,
                GlobeMap.capabilities);

            switch (options.objectName) {
                case 'dataPoint': if(this.data && this.data.seriesDataPoints) {
                        for (var i = 0; i < this.data.seriesDataPoints.length; i++) {
                            var dataPoint = this.data.seriesDataPoints[i];
                            instances.pushInstance({
                                objectName: 'dataPoint',
                                displayName: dataPoint.label,
                                selector: ColorHelper.normalizeSelector(dataPoint.identity.getSelector()),
                                properties: {
                                    fill: { solid: { color: dataPoint.color } }
                                }
                            });
                        }
                    }

                    break;
            }

            return instances.complete();
        }

        public init(options: VisualInitOptions): void {
            this.container = options.element;
            this.layout = new VisualLayout(options.viewport);
            this.readyToRender = false;

            if (!this.globeMapLocationCache) {
                this.globeMapLocationCache = {};
            }

            this.style = options.style;
            this.colors = this.style.colorPalette.dataColors;

            if (!THREE) {
                loadGlobeMapLibs();
            }

            if (THREE) {
                this.setup();
            }
        }

        private setup() {
            this.initTextures();
            this.initMercartorSphere();
            this.initZoomControl();
            this.initScene();
            this.initHeatmap();
            this.readyToRender = true;
            this.initRayCaster();
        }

        private initScene() {
            var clock = new THREE.Clock();
            var renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
            this.container.append(renderer.domElement);
            this.domElement = renderer.domElement;
            this.camera = new THREE.PerspectiveCamera(35, this.layout.viewportIn.width / this.layout.viewportIn.height, 0.1, 10000);
            var orbitControls = this.orbitControls = new THREE.OrbitControls(this.camera, this.domElement);
            this.scene = new THREE.Scene();

            renderer.setSize(this.layout.viewportIn.width, this.layout.viewportIn.height);
            renderer.setClearColor(0xbac4d2, 1);
            this.camera.position.z = GlobeMap.GlobeSettings.cameraRadius;

            orbitControls.maxDistance = GlobeMap.GlobeSettings.cameraRadius;
            orbitControls.minDistance = GlobeMap.GlobeSettings.earthRadius + 1;
            orbitControls.rotateSpeed = GlobeMap.GlobeSettings.rotateSpeed;
            orbitControls.zoomSpeed = GlobeMap.GlobeSettings.zoomSpeed;
            orbitControls.autoRotate = GlobeMap.GlobeSettings.autoRotate;

            var ambientLight = new THREE.AmbientLight(0x000000);
            var light1 = new THREE.DirectionalLight(0xffffff, 0.4);
            var light2 = new THREE.DirectionalLight(0xffffff, 0.4);
            var earth = this.earth = this.createEarth();

            this.scene.add(ambientLight);
            this.scene.add(light1);
            this.scene.add(light2);
            this.scene.add(earth);

            light1.position.set(20, 20, 20);
            light2.position.set(0, 0, -20);

            var _zis = this;

            var render = () => {
                try {
                    if (_zis.renderLoopEnabled) requestAnimationFrame(render);
                    if (!_zis.shouldRender()) return;
                    orbitControls.update(clock.getDelta());
                    _zis.setEarthTexture();
                    _zis.intersectBars();
                    if (_zis.heatmap &&_zis.heatmap.display) {
                        _zis.heatmap.display(); // Needed for IE/Edge to behave nicely
                    }
                    renderer.render(this.scene, this.camera);
                    _zis.needsRender = false;
                    //console.log("render");
                } catch (e) {
                    console.error(e);
                }
            };

            requestAnimationFrame(render);
        }

        private shouldRender(): boolean {
            return this.readyToRender && this.needsRender;
        }

        private createEarth() {
            var geometry = new GlobeMap.MercartorSphere(
                GlobeMap.GlobeSettings.earthRadius,
                GlobeMap.GlobeSettings.earthSegments,
                GlobeMap.GlobeSettings.earthSegments);
            var material = new THREE.MeshPhongMaterial({
                map: this.mapTextures[0],
                side: THREE.DoubleSide,
                shininess: 1,
                emissive: 0xaaaaaa,
                //wireframe: true
            });
            return new THREE.Mesh(geometry, material);
        }

        public zoomClicked(zoomDirection: any) {
            if (this.orbitControls.enabled === false || this.orbitControls.enableZoom === false)
                return;

            if (zoomDirection === -1)
                this.orbitControls.constraint.dollyOut(Math.pow(0.95, GlobeMap.GlobeSettings.zoomSpeed));
            else if (zoomDirection === 1)
                this.orbitControls.constraint.dollyIn(Math.pow(0.95, GlobeMap.GlobeSettings.zoomSpeed));

            this.orbitControls.update();
            this.animateCamera(this.camera.position);
        }

        public rotateCam(deltaX: number, deltaY: number) {
            if (this.orbitControls.enabled === false || this.orbitControls.enableRotate === false)
                return;

            this.orbitControls.constraint.rotateLeft(2 * Math.PI * deltaX / this.domElement.offsetHeight * GlobeMap.GlobeSettings.rotateSpeed);
            this.orbitControls.constraint.rotateUp(2 * Math.PI * deltaY / this.domElement.offsetHeight * GlobeMap.GlobeSettings.rotateSpeed);
            this.orbitControls.update();
            this.animateCamera(this.camera.position);
        }

        private initTextures() {
            if (!GlobeMapCanvasLayers) {
                // Initialize once, since this is a CPU + Network heavy operation.
                GlobeMapCanvasLayers = [];

                for (var level = 2; level <= 5; ++level) {
                    var canvas = this.getBingMapCanvas(level);
                    GlobeMapCanvasLayers.push(canvas);
                }
            }

            // Can't execute in for loop because variable assignement gets overwritten
            var createTexture = (canvas: JQuery) => {
                var texture = new THREE.Texture(canvas.get(0));
                texture.needsUpdate = true;
                canvas.on("ready", (e, resolution) => {
                    //console.log("level ready", resolution, texture)
                    texture.needsUpdate = true;
                    this.needsRender = true;
                });
                return texture;

            };

            this.mapTextures = [];
            for (var i = 0; i < GlobeMapCanvasLayers.length; ++i) {
                this.mapTextures.push(createTexture(GlobeMapCanvasLayers[i]));
            }
        }

        private initHeatmap() {
            //console.log("initHeatmap");
            try {
                var heatmap = this.heatmap = new WebGLHeatmap({ width: GlobeMap.GlobeSettings.heatmapSize, height: GlobeMap.GlobeSettings.heatmapSize, intensityToAlpha: true });
            } catch (e) {
                // IE & Edge will throw an error about texImage2D, we need to ignore it
                console.error(e);
            }

            // canvas contents will be used for a texture
            var texture = this.heatTexture = new THREE.Texture(heatmap.canvas);
            texture.needsUpdate = true;

            var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            var geometry = new THREE.SphereGeometry(GlobeMap.GlobeSettings.earthRadius + 0.01, GlobeMap.GlobeSettings.earthSegments, GlobeMap.GlobeSettings.earthSegments);
            var mesh = new THREE.Mesh(geometry, material);

            window["heatmap"] = heatmap;
            window["heatmapTexture"] = texture;

            this.scene.add(mesh);
        }

        private setEarthTexture() {
            //get distance as arbitrary value from 0-1
            if (!this.camera) return;
            var maxDistance = GlobeMap.GlobeSettings.cameraRadius - GlobeMap.GlobeSettings.earthRadius;
            var distance = (this.camera.position.length() - GlobeMap.GlobeSettings.earthRadius) / maxDistance;

            var texture;
            if (distance <= 1 / 5) {
                texture = this.mapTextures[3];
            } else if (distance <= 2 / 5) {
                texture = this.mapTextures[2];
            } else if (distance <= 3 / 5) {
                texture = this.mapTextures[1];
            } else {
                texture = this.mapTextures[0];
            }

            if (this.earth.material.map !== texture) {
                this.earth.material.map = texture;
            }

            if (this.selectedBar) {
                this.orbitControls.rotateSpeed = GlobeMap.GlobeSettings.rotateSpeed;
            } else {
                this.orbitControls.rotateSpeed = GlobeMap.GlobeSettings.rotateSpeed * distance;
            }

            //console.log(distance, this.orbitControls.rotateSpeed);
        }

        public update(options: VisualUpdateOptions) {
            this.needsRender = true;
            this.layout.viewport = options.viewport;

            if(this.layout.viewportChanged) {
                if (this.camera && this.renderer) {
                    this.camera.aspect = this.layout.viewportIn.width / this.layout.viewportIn.height;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(this.layout.viewportIn.width, this.layout.viewportIn.height);
                }
            }

            if(options.type === VisualUpdateType.Data) {
                this.cleanHeatAndBar();
                var data = GlobeMap.converter(options.dataViews[0], this.globeMapLocationCache, this.colors);
                if(data) {
                    this.data = data;
                    this.renderMagic();
                }
            }
        }

        public cleanHeatAndBar() {
            this.heatmap.clear();
            this.heatTexture.needsUpdate = true;
            if (this.barsGroup) {
                this.scene.remove(this.barsGroup);
            }
        }

        private renderMagic() {
            if(!this.data) {
                return;
            }

            this.data.dataPoints.forEach(d => this.geocodeRenderDatum(d));

            if (!this.readyToRender) {
                //console.log("not ready to render");
                this.defferedRender();
                return;
            }

            this.heatmap.clear();

            if (this.barsGroup) {
                this.scene.remove(this.barsGroup);
            }

            this.barsGroup = new THREE.Object3D();
            this.scene.add(this.barsGroup);

            this.averageBarVector = new THREE.Vector3();

            for (var i = 0, len = this.data.dataPoints.length; i < len; ++i) {
                var renderDatum = this.data.dataPoints[i];

                if (!renderDatum.location || renderDatum.location.longitude === undefined || renderDatum.location.latitude === undefined) {
                    continue;
                }

                if (renderDatum.heat > 0.001) {
                    if (renderDatum.heat < 0.1) renderDatum.heat = 0.1;
                    var x = (180 + renderDatum.location.longitude) / 360 * GlobeMap.GlobeSettings.heatmapSize;
                    var y = (1 - ((90 + renderDatum.location.latitude) / 180)) * GlobeMap.GlobeSettings.heatmapSize;
                    this.heatmap.addPoint(x, y, GlobeMap.GlobeSettings.heatPointSize, renderDatum.heat * GlobeMap.GlobeSettings.heatIntensity);
                }

                if (renderDatum.height >= 0) {
                    if (renderDatum.height < 0.01) renderDatum.height = 0.01;
                    var latRadians = renderDatum.location.latitude / 180 * Math.PI; //radians
                    var lngRadians = renderDatum.location.longitude / 180 * Math.PI;

                    var x = Math.cos(lngRadians) * Math.cos(latRadians);
                    var z = -Math.sin(lngRadians) * Math.cos(latRadians);
                    var y = Math.sin(latRadians);
                    var v = new THREE.Vector3(x, y, z);

                    this.averageBarVector.add(v);

                    var barHeight = GlobeMap.GlobeSettings.barHeight * renderDatum.height;
                    //this array holds the relative series values to the actual measure for example [0.2,0.3,0.5]
                    //this is how we draw the vectors relativly to the complete value one on top of another. 
                    var measuresBySeries = [];
                    //this array holds the original values of the series for the tool tips
                    var dataPointToolTip = [];
                    if (renderDatum.heightBySeries) {
                        for (var c = 0; c < renderDatum.heightBySeries.length; c++) {
                            if (renderDatum.heightBySeries[c]) {
                                measuresBySeries.push(renderDatum.heightBySeries[c]);
                            }
                            dataPointToolTip.push(renderDatum.seriesToolTipData[c]);
                        }
                    } else {
                        //no category series so we'll just draw one value
                        measuresBySeries.push(1);
                    }

                    var previousMeasureValue = 0;
                    for (var j = 0; j < measuresBySeries.length; j++) {
                        previousMeasureValue += measuresBySeries[j];
                        var geometry = new THREE.CubeGeometry(GlobeMap.GlobeSettings.barWidth, GlobeMap.GlobeSettings.barWidth, barHeight * measuresBySeries[j]);
                        var bar = new THREE.Mesh(geometry, this.getBarMaterialByIndex(j));
                        bar.position = v.clone().multiplyScalar(GlobeMap.GlobeSettings.earthRadius + ((barHeight / 2) * previousMeasureValue));
                        bar.lookAt(v);
                        bar.toolTipData = dataPointToolTip.length === 0 ? renderDatum.toolTipData : this.getToolTipDataForSeries(renderDatum.toolTipData, dataPointToolTip[j]);
                        this.barsGroup.add(bar);
                        previousMeasureValue += measuresBySeries[j];
                    }
                }
            }

            if (this.barsGroup.children.length > 0 && this.camera) {
                this.averageBarVector.multiplyScalar(1 / this.barsGroup.children.length);
                if (this.locationsLoaded === this.locationsToLoad) {
                    this.animateCamera(this.averageBarVector);
                }
            }

            this.heatmap.update();
            this.heatmap.blur();
            this.heatTexture.needsUpdate = true;
            this.needsRender = true;

            //console.log("renderMagic done! locations:", this.barsGroup.children.length, "toload/loaded", this.locationsToLoad, this.locationsLoaded)
        }

        private getBarMaterialByIndex(index): any {
            return new THREE.MeshPhongMaterial({ color: this.data.seriesDataPoints[index].color });
        }

        private getToolTipDataForSeries(toolTipData, dataPointToolTip): any {
            var result = jQuery.extend(true, {
                series: { displayName: dataPointToolTip.displayName, value: dataPointToolTip.value }
            }, toolTipData);
            result.height.value = dataPointToolTip.dataPointValue;
            return result;
        }

        private geocodeRenderDatum(renderDatum: GlobeMapDataPoint) {
            if(renderDatum.location) {
                return;
            }

            this.globeMapLocationCache[renderDatum.placeKey] = <any>{}; //store empty object so we don't send AJAX request again
            this.locationsToLoad++;

            try {
                var geocoder = powerbi.visuals["BI"].Services.GeocodingManager.geocode;
            } catch (e) {
                geocoder = services.geocode;
            }

            if (geocoder) {
                geocoder(renderDatum.place, renderDatum.locationType).always((location: ILocation) => {
                    // we use always because we want to cache unknown values. 
                    // No point asking bing again and again when it tells us it doesn't know about a location
                    this.globeMapLocationCache[renderDatum.placeKey] = location;
                    this.locationsLoaded++;
                    //console.log(place, latlng);

                    renderDatum.location = location;
                    this.defferedRender();
                });
            }
        }

        private defferedRender() {
            if (!this.deferredRenderTimerId) {
                this.deferredRenderTimerId = setTimeout(() => {
                    this.deferredRenderTimerId = null;
                    this.renderMagic();
                }, 500);
            }
        }

        private initRayCaster() {
            this.rayCaster = new THREE.Raycaster();
            var mousePosNormalized = this.mousePosNormalized = new THREE.Vector2();
            var mousePos = this.mousePos = new THREE.Vector2();
            var element = this.container.get(0);
            var mouseDownTime;

            $(this.domElement).on("mousemove", (event) => {
                // get coordinates in -1 to +1 space
                var rect = element.getBoundingClientRect();
                mousePos.x = event.clientX;
                mousePos.y = event.clientY;
                mousePosNormalized.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mousePosNormalized.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                this.needsRender = true;
            }).on("mousedown", (event) => {
                mouseDownTime = Date.now();
            }).on("mouseup", (event) => {
                // Debounce slow clicks
                if ((Date.now() - mouseDownTime) > GlobeMap.GlobeSettings.clickInterval) return;
                if (this.hoveredBar && event.shiftKey) {
                    this.selectedBar = this.hoveredBar;
                    this.animateCamera(this.selectedBar.position, () => {
                        if (!this.selectedBar) return;
                        this.orbitControls.center.copy(this.selectedBar.position.clone().normalize().multiplyScalar(GlobeMap.GlobeSettings.earthRadius));
                        this.orbitControls.minDistance = 1;
                    });
                } else {
                    if (this.selectedBar) {
                        this.animateCamera(this.selectedBar.position, () => {
                            this.orbitControls.center.set(0, 0, 0);
                            this.orbitControls.minDistance = GlobeMap.GlobeSettings.earthRadius + 1;
                        });
                        this.selectedBar = null;
                    }
                }
            }).on("mousewheel DOMMouseScroll", (e: any) => {
                this.needsRender = true;
                if (this.orbitControls.enabled && this.orbitControls.enableZoom) {
                    this.heatTexture.needsUpdate = true;
                    e = e.originalEvent;
                    var delta = e.wheelDelta > 0 || e.detail < 0 ? 1 : -1;
                    var scale = delta > 0 ? GlobeMap.GlobeSettings.heatmapScaleOnZoom : (1 / GlobeMap.GlobeSettings.heatmapScaleOnZoom);
                    this.heatmap.multiply(scale);
                    this.heatmap.update();
                }
            });
        }

        private intersectBars() {
            if (!this.rayCaster || !this.barsGroup) return;
            var rayCaster = this.rayCaster;
            rayCaster.setFromCamera(this.mousePosNormalized, this.camera);
            var intersects = rayCaster.intersectObjects(this.barsGroup.children);

            if (intersects && intersects.length > 0) {
                //console.log(intersects[0], this.mousePos.x, this.mousePos.y);
                var object = intersects[0].object;
                if (!object || !object.toolTipData) return;
                var toolTipData = object.toolTipData;
                var toolTipItems: TooltipDataItem[] = [];
                if (toolTipData.location.displayName) toolTipItems.push(toolTipData.location);
                if (toolTipData.series) toolTipItems.push(toolTipData.series);
                if (toolTipData.height.displayName) toolTipItems.push(toolTipData.height);
                if (toolTipData.heat.displayName) toolTipItems.push(toolTipData.heat);
                this.hoveredBar = object;
                TooltipManager.ToolTipInstance.show(toolTipItems, <TouchRect>{ x: this.mousePos.x, y: this.mousePos.y, width: 0, height: 0 });
            } else {
                this.hoveredBar = null;
                TooltipManager.ToolTipInstance.hide();
            }
        }

        private animateCamera(to: any, done?: Function) {
            if (!this.camera) return;
            var startTime = Date.now();
            var duration = GlobeMap.GlobeSettings.cameraAnimDuration;
            var endTime = startTime + duration;
            var startPos = this.camera.position.clone().normalize();
            var endPos = to.clone().normalize();
            var length = this.camera.position.length();

            var easeInOut = (t) => {
                t *= 2;
                if (t < 1) return (t * t * t) / 2;
                t -= 2;
                return (t * t * t + 2) / 2;
            };

            var onUpdate = () => {
                var now = Date.now();
                var t = (now - startTime) / duration;
                if (t > 1) t = 1;
                t = easeInOut(t);

                var pos = new THREE.Vector3()
                    .add(startPos.clone().multiplyScalar(1 - t))
                    .add(endPos.clone().multiplyScalar(t))
                    .normalize()
                    .multiplyScalar(length);

                this.camera.position = pos;

                if (now < endTime) {
                    requestAnimationFrame(onUpdate);
                } else if (done) {
                    done();
                }

                this.needsRender = true;
            };
            requestAnimationFrame(onUpdate);
        }

        public destroy() {
            clearTimeout(this.deferredRenderTimerId);
            this.renderLoopEnabled = false;
            this.scene = null;
            this.heatmap = null;
            this.heatTexture = null;
            this.camera = null;
            if (this.renderer) {
                if (this.renderer.context) {
                    var extension = this.renderer.context.getExtension('WEBGL_lose_context');
                    if (extension)
                        extension.loseContext();
                    this.renderer.context = null;
                }
                this.renderer.domElement = null;
            }
            this.renderer = null;
            this.data = null;
            this.barsGroup = null;
            if (this.orbitControls) this.orbitControls.dispose();
            this.orbitControls = null;
            if (this.domElement) $(this.domElement)
                .off("mousemove mouseup mousedown mousewheel DOMMouseScroll");
            this.domElement = null;
            if (this.container) this.container.empty();
        }

        private initZoomControl() {
            var radius = 17;
            var zoomControlWidth = radius * 8.5;
            var zoomControlHeight = radius * 8.5;
            var startX = radius * 3;
            var startY = radius + 3;
            var gap = radius * 2;

            var zoomCss = {
                'position': 'absolute',
                'left': 'calc(100% - ' + zoomControlWidth + 'px)',
                'top': 'calc(100% - ' + zoomControlHeight + 'px)',
                'zIndex': '1000',
            };

            var zoomContainer = d3.select(this.container[0])
                .append('div')
                .style(zoomCss);

            this.zoomControl = zoomContainer.append("svg").attr({ "width": zoomControlWidth, "height": zoomControlHeight });

            var bottom = this.zoomControl.append("g").on("click", () => this.rotateCam(0, -5));
            bottom.append("circle").attr({ cx: startX + gap, cy: startY + (2 * gap), r: radius, fill: "white", opacity: 0.5, stroke: 'gray' });
            bottom.append("path").attr({ d: "M" + (startX + (2 * radius)) + " " + (startY + (radius * 4.7)) + " l12 -20 a40,70 0 0,1 -24,0z", fill: "gray" });

            var left = this.zoomControl.append("g").on("click", () => this.rotateCam(5, 0));
            left.append("circle").attr({ cx: startX, cy: startY + gap, r: radius, fill: "white", stroke: "gray", opacity: 0.5 });
            left.append("path").attr({ d: "M" + (startX - radius / 1.5) + " " + (startY + (radius * 2)) + " l20 -12 a70,40 0 0,0 0,24z", fill: "gray" });

            var top = this.zoomControl.append("g").on("click", () => this.rotateCam(0, 5));
            top.append("circle").attr({ cx: startX + gap, cy: startY, r: radius, fill: "white", stroke: "gray", opacity: 0.5 });
            top.append("path").attr({ d: "M" + (startX + (2 * radius)) + " " + (startY - (radius / 1.5)) + " l12 20 a40,70 0 0,0 -24,0z", fill: "gray" });

            var right = this.zoomControl.append("g").on("click", () => this.rotateCam(-5, 0));
            right.append("circle").attr({ cx: startX + (2 * gap), cy: startY + gap, r: radius, fill: "white", stroke: "gray", opacity: 0.5 });
            right.append("path").attr({ d: "M" + (startX + (4.7 * radius)) + " " + (startY + (radius * 2)) + " l-20 -12 a70,40 0 0,1 0,24z", fill: "gray" });

            var zoomIn = this.zoomControl.append("g").on("click", () => this.zoomClicked(-1));
            zoomIn.append("circle").attr({ cx: startX + 4 * radius, cy: startY + 6 * radius, r: radius, fill: "white", stroke: "gray", opacity: 0.5 });
            zoomIn.append("rect").attr({ x: startX + 3.5 * radius, y: startY + 5.9 * radius, width: radius, height: radius / 3, fill: "gray" });
            zoomIn.append("rect").attr({ x: startX + (4 * radius) - radius / 6, y: startY + 5.55 * radius, width: radius / 3, height: radius, fill: "gray" });

            var zoomOut = this.zoomControl.append("g").on("click", () => this.zoomClicked(1));
            zoomOut.append("circle").attr({ cx: startX, cy: startY + 6 * radius, r: radius, fill: "white", stroke: "gray", opacity: "0.50" });
            zoomOut.append("rect").attr({ x: startX - (radius / 2), y: startY + 5.9 * radius, width: radius, height: radius / 3, fill: "gray" });
        }

        private initMercartorSphere() {
            if (GlobeMap.MercartorSphere) return;

            var MercartorSphere = function (radius, widthSegments, heightSegments) {
                THREE.Geometry.call(this);

                this.radius = radius;
                this.widthSegments = widthSegments;
                this.heightSegments = heightSegments;

                this.t = 0;

                var x, y, vertices = [], uvs = [];

                function interplolate(a, b, t) {
                    return (1 - t) * a + t * b;
                }

                // interpolates between sphere and plane
                function interpolateVertex(u, v, t) {
                    var maxLng = Math.PI * 2;
                    var maxLat = Math.PI;
                    var radius = this.radius;

                    var sphereX = - radius * Math.cos(u * maxLng) * Math.sin(v * maxLat);
                    var sphereY = - radius * Math.cos(v * maxLat);
                    var sphereZ = radius * Math.sin(u * maxLng) * Math.sin(v * maxLat);

                    var planeX = u * radius * 2 - radius;
                    var planeY = v * radius * 2 - radius;
                    var planeZ = 0;

                    var x = interplolate(sphereX, planeX, t);
                    var y = interplolate(sphereY, planeY, t);
                    var z = interplolate(sphereZ, planeZ, t);

                    return new THREE.Vector3(x, y, z);
                }

                // http://mathworld.wolfram.com/MercatorProjection.html
                // Mercator projection goes form +85.05 to -85.05 degrees
                function interpolateUV(u, v, t) {
                    var lat = (v - 0.5) * 90 * 2 / 180 * Math.PI; //turn from 0-1 into lat in radians
                    var sin = Math.sin(lat);
                    var normalizedV = 0.5 + 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
                    return new THREE.Vector2(u, normalizedV);//interplolate(normalizedV1, v, t))
                }

                for (y = 0; y <= heightSegments; y++) {

                    var verticesRow = [];
                    var uvsRow = [];

                    for (x = 0; x <= widthSegments; x++) {

                        var u = x / widthSegments;
                        var v = y / heightSegments;

                        this.vertices.push(interpolateVertex.call(this, u, v, this.t));
                        uvsRow.push(interpolateUV.call(this, u, v, this.t));
                        verticesRow.push(this.vertices.length - 1);
                    }

                    vertices.push(verticesRow);
                    uvs.push(uvsRow);

                }

                //console.log(vertices, uvs);

                for (y = 0; y < this.heightSegments; y++) {

                    for (x = 0; x < this.widthSegments; x++) {

                        var v1 = vertices[y][x + 1];
                        var v2 = vertices[y][x];
                        var v3 = vertices[y + 1][x];
                        var v4 = vertices[y + 1][x + 1];

                        var n1 = this.vertices[v1].clone().normalize();
                        var n2 = this.vertices[v2].clone().normalize();
                        var n3 = this.vertices[v3].clone().normalize();
                        var n4 = this.vertices[v4].clone().normalize();

                        var uv1 = uvs[y][x + 1].clone();
                        var uv2 = uvs[y][x].clone();
                        var uv3 = uvs[y + 1][x].clone();
                        var uv4 = uvs[y + 1][x + 1].clone();

                        var normals = [n1, n2, n3, n4];

                        this.faces.push(new THREE.Face4(v1, v2, v3, v4, normals));
                        this.faceVertexUvs[0].push([uv1, uv2, uv3, uv4]);
                    }

                }

                this.computeCentroids();
                this.computeFaceNormals();

                this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
            };

            MercartorSphere.prototype = Object.create(THREE.Geometry.prototype);
            GlobeMap.MercartorSphere = MercartorSphere;
        }

        private getBingMapCanvas(resolution): JQuery {
            var tileSize = 256;
            var numSegments = Math.pow(2, resolution);
            var numTiles = numSegments * numSegments;
            var tilesLoaded = 0;
            var canvasSize = tileSize * numSegments;
            var canvas: JQuery = $('<canvas/>').attr({ width: canvasSize, height: canvasSize });
            var canvasElem: any = canvas.get(0);
            var canvasContext = canvasElem.getContext("2d");

            function generateQuads(res, quad) {
                if (res <= resolution) {
                    if (res === resolution) {
                        loadTile(quad);
                        //console.log(res, maxResolution, quad);
                    }

                    generateQuads(res + 1, quad + "0");
                    generateQuads(res + 1, quad + "1");
                    generateQuads(res + 1, quad + "2");
                    generateQuads(res + 1, quad + "3");
                }
            }

            function loadTile(quad) {
                var template: any = "https://t{server}.tiles.virtualearth.net/tiles/r{quad}.jpeg?g=0&mkt={language}";
                var numServers = 7;
                var server = Math.round(Math.random() * numServers);
                var language = (navigator["languages"] && navigator["languages"].length) ? navigator["languages"][0] : navigator.language;
                var url = template.replace("{server}", server)
                    .replace("{quad}", quad)
                    .replace("{language}", language);
                var coords = getCoords(quad);
                //console.log(quad, coords.x, coords.y)

                var tile = new Image();
                tile.onload = function () {
                    tilesLoaded++;
                    canvasContext.drawImage(tile, coords.x * tileSize, coords.y * tileSize, tileSize, tileSize);
                    if (tilesLoaded === numTiles) {
                        canvas.trigger("ready", resolution);
                    }
                };

                // So the canvas doesn't get tainted
                tile.crossOrigin = '';
                tile.src = url;
            }

            function getCoords(quad) {
                var x = 0;
                var y = 0;
                var last = quad.length - 1;

                for (var i = last; i >= 0; i--) {
                    var chr = quad.charAt(i);
                    var pow = Math.pow(2, last - i);

                    if (chr === "1") {
                        x += pow;
                    } else if (chr === "2") {
                        y += pow;
                    } else if (chr === "3") {
                        x += pow;
                        y += pow;
                    }
                }

                return { x: x, y: y };
            }

            generateQuads(0, "");
            return canvas;
        }
    }
}

function loadGlobeMapLibs() {
    // include GlobeMapLibs.js
}