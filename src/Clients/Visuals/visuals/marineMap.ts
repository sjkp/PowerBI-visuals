/// <reference path="../_references.ts"/>

interface JQueryStatic {
    signalR: SignalR;
    connection: SignalR;

}

interface SignalR {
    locationHub: any;
    hub: any;
}



module powerbi.visuals {
    declare var OpenLayers: any;

    export interface MarineMapCategoryData {
        id: string;
        rows: MarineMapDataRow[];
    }

    export interface MarineMapDataRow {
        values: any[];
    }

    export enum MarineMapColumnType {
        data,
        latitude,
        longitude,
        heading,
        link,
        time,
        category,
        status
    }

    export interface MarineMapColumnInfo {
        displayName: string;
        queryName: string;
        format: string;
        colIndex: number;
        type: MarineMapColumnType;
    }

    export interface MarineMapDataModel {
        columns: MarineMapColumnInfo[];
        data: MarineMapCategoryData[];
    };

    export class PopupBuilder {
        constructor(private formatter, private id : string, private columnInfos: MarineMapColumnInfo[], private data: MarineMapCategoryData) {
        }

        public buildHtml(): string {
            var html = this.buildHeader(this.data.id);
            var lastDataPoint = this.data.rows[this.data.rows.length - 1];
            html += '<ul>';
            var footerHtml = "";
            var link = "";
            $.each(this.columnInfos, (i, column) => {
                if (column.type == MarineMapColumnType.data) {
                    html += this.buildRow(column.displayName, lastDataPoint.values[column.colIndex]);
                }
                if (column.type == MarineMapColumnType.time)
                {
                    var date = new Date(lastDataPoint.values[column.colIndex]);
                    var dateFormat = valueFormatter.create({format: "dd/MM/yyyy HH:mm:ss", value: date});
                    footerHtml += dateFormat.format(date);
                }
                if (column.type == MarineMapColumnType.link)
                {
                    link = lastDataPoint.values[column.colIndex];
                }
            });
            html += '</ul>';
            if (link != "")
                html += this.buildMoreInfo(link);
            html += this.buildFooter(footerHtml);
            return html;
        }

        private buildHeader(title: string) {
            return '<div class="popup-title">' + title + '<span id="' + this.id + 'close" class="popup-close">x</span></div>';
        }

        private buildRow(label: string, value: any) {
            return '<li><span>' + label + '</span><span>' + this.formatter.format(value) + '</span ></li>';
        }

        private buildFooter(value: string) {
            return '<div class="popup-footer">'+value+'</div>'
        }

        private buildMoreInfo(link : string) {
            return '<div class="popup-moreinfo"><a href="'+link+'">More info</a></div>';
        }
    }


  export class OpenlayerMap {
        constructor(elementId: string) {
            this.drawmap(elementId);
            this.baseUrl = 'https://localhost:44300';
        }

        private baseUrl;

        private map;
        private layer_mapnik;
        private layer_seamark;
        private layer_transport;
        private layer_cycle;
        private hybrid;
        private markerLayer;
        private vectorLayer;
        private layer_weather_wind1;
        private layer_weather_pressure1;
        private layer_weather_air_temperature1;
        private layer_weather_precipitation1;
        private layer_weather_significant_wave_height1;

        // Position and zoomlevel of the map
        private lon = 0;
        private lat = 0;
        private zoom = 2;

        private language = 'en';

        private polylines = {};
        private ships = {};

        private lineStyle = {
            strokeColor: '#0000ff',
            strokeOpacity: 0.5,
            strokeWidth: 5
        };


        private jumpTo(lon, lat, zoom) {
            //var x = Lon2Merc(lon);
            //var y = Lat2Merc(lat);
            this.map.setCenter(this.NewLatLong(lat, lon), zoom);
            return false;
        }

        private NewGeoPoint(lat, lon) {
            return new OpenLayers.Geometry.Point(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
        }

        private NewLatLong(lat, lon) {
            return new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
        }

        private addMarker(layer, ll, popupContentHTML) {
            var self = this;
            var feature = new OpenLayers.Feature(layer, ll);
            feature.closeBox = false;
            feature.popupClass = OpenLayers.Class(OpenLayers.Popup.Anchored, { minSize: new OpenLayers.Size(200, 100) });
            feature.data.popupContentHTML = 


            feature.data.overflow = "hidden";

            var marker = new OpenLayers.Marker(ll);
            marker.feature = feature;

            var markerClick = function (evt) {
                var feature = this.feature;
                var marker = this;
        
                feature.data.popupContentHTML = new PopupBuilder(valueFormatter.create({ value: 0 }), feature.id, marker.columns, marker.shipdata).buildHtml();

                if (feature.popup == null) {
                    feature.popup = feature.createPopup(feature.closeBox);
                    feature.popup.setSize(new OpenLayers.Size(300, 200));
                    self.map.addPopup(feature.popup);
                    feature.popup.show();
                    $('#' + feature.id + 'close').click(function () {
                        feature.popup.toggle();
                    });
                } else {
                    feature.popup.toggle();
                }

                feature.popup.moveTo(self.map.getLayerPxFromLonLat(marker.lonlat));
                OpenLayers.Event.stop(evt);
            };
            marker.events.register("mousedown", marker, markerClick);
            
            layer.addMarker(marker);                   

            return marker;
        }
        
        private setMarkerUrl(marker: any)
        {
            var statusColumn  : MarineMapColumnInfo = null;
            $.each(marker.columns, (i, column: MarineMapColumnInfo) => {
                if (column.type == MarineMapColumnType.status)
                {
                    statusColumn = column;
                    return;
                }
            });
            if (statusColumn != null)
            {                
                var data : MarineMapCategoryData = marker.shipdata;
                var status : number = data.rows[data.rows.length-1][statusColumn.colIndex];
                    
                if (status == 1)
                {
                    marker.setUrl(this.baseUrl + '/resources/redpointer.png');
                    return;
                }
                if (status == 2)
                {
                    marker.setUrl(this.baseUrl + '/resources/yellowpointer.png');
                    return;
                }
                if (status == 3)
                {
                    marker.setUrl(this.baseUrl + '/resources/greenpointer.png');
                    return;
                }
            } 
            marker.setUrl(this.baseUrl + '/resources/graypointer.png');         
        }

        private getTileURL = function (bounds) {
            var res = this.map.getResolution();
            var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
            var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
            var z = this.map.getZoom();
            var limit = Math.pow(2, z);
            if (y < 0 || y >= limit) {
                return null;
            } else {
                x = ((x % limit) + limit) % limit;
                var url = this.url;
                var path = z + "/" + x + "/" + y + "." + this.type;
                if (url instanceof Array) {
                    url = this.selectUrl(path, url);
                }
                return url + path;
            }
        }

        public resize() {
            this.map.updateSize();
        }

        public plotdata(model: MarineMapDataModel) {
            var latIndex = -1;
            var longIndex = -1;
            var headingIndex = -1;
            $.each(model.columns, (i, column) => {
                if (column.type == MarineMapColumnType.latitude) {
                    latIndex = column.colIndex;
                }
                if (column.type == MarineMapColumnType.longitude) {
                    longIndex = column.colIndex;
                }
                if (column.type == MarineMapColumnType.heading) {
                    headingIndex = column.colIndex;
                }
            });

            if (longIndex == -1 || latIndex == -1) {
                return;
            }
            $.each(model.data, (i, ship: MarineMapCategoryData) => {
                var dataFiltered = ship.rows.filter((row) => {
                    if (row.values[latIndex] != 0.0 && row.values[longIndex] != 0.0)
                    {
                        return true;
                    }
                    return false;
                }).slice(-10);
                var locations = dataFiltered.map((data, i) => {
                    return this.NewLatLong(data.values[latIndex], data.values[longIndex]);
                });
                var points = dataFiltered.map((data, i) => {
                    return this.NewGeoPoint(data.values[latIndex], data.values[longIndex]);
                });


                if (typeof (this.ships[ship.id]) == 'undefined') {
                    var marker = this.addMarker(this.markerLayer, locations[locations.length - 1], ship.id);
                    this.ships[ship.id] = marker;
                    marker.shipdata = ship;
                    marker.columns = model.columns;

                   this.rotateMarker(marker, ship.rows[ship.rows.length - 1].values[headingIndex]);
                   this.setMarkerUrl(marker);     
                }
                else {
                    var marker = this.ships[ship.id];
                    marker.shipdata = ship;
                    marker.columns = model.columns;
                    //marker.KPI = ship.KPI;
                    marker.moveTo(this.map.getLayerPxFromLonLat(locations[locations.length - 1]));

                    this.setMarkerUrl(marker);     
                   this.rotateMarker(marker, ship.rows[ship.rows.length - 1].values[headingIndex]);
                    
                    if (typeof (this.polylines[ship.id]) == 'undefined') {
                        var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.LineString(points), null, this.lineStyle
                        );

                        this.polylines[ship.id] = feature;

                        this.vectorLayer.addFeatures(feature);
                    }
                    else {
                        feature = this.polylines[ship.id];
                        this.vectorLayer.destroyFeatures(feature);

                        var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.LineString(points), null, this.lineStyle
                        );

                        this.polylines[ship.id] = feature;

                        this.vectorLayer.addFeatures(feature);
                    }
                }

            });
        }
        
        private rotateMarker(marker: any, rotation: number)
        {
            $(marker.icon.imageDiv).css('transform-origin', '10px bottom');
            $(marker.icon.imageDiv).css('transform', 'rotate(' + rotation + 'deg)');
        }

        private drawmap(mapElementId: string) {
            this.map = new OpenLayers.Map(mapElementId, {
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                eventListeners: {
                    //"moveend": mapEventMove,
                    //"zoomend": mapEventZoom
                },
                controls: [
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.ScaleLine({ topOutUnits: "nmi", bottomOutUnits: "km", topInUnits: 'nmi', bottomInUnits: 'km', maxWidth: '40' }),
                    new OpenLayers.Control.LayerSwitcher(),
                    new OpenLayers.Control.MousePosition(),
                    new OpenLayers.Control.PanZoomBar()],
                maxExtent:
                new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
                numZoomLevels: 18,
                maxResolution: 156543,
                units: 'meters'
            });

            // Add Layers to map-------------------------------------------------------------------------------------------------------
            // Mapnik
            this.layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik", // Official OSM tileset as protocol-independent URLs
                [
                    '//a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//c.tile.openstreetmap.org/${z}/${x}/${y}.png'
                ],
                null);
            this.layer_transport = new OpenLayers.Layer.OSM.TransportMap("Transport");
            this.layer_cycle = new OpenLayers.Layer.OSM.CycleMap("Cycle");
            //Weather layers
            //Wind 
            this.layer_weather_wind1 = new OpenLayers.Layer.TMS("Wind", "http://www.openportguide.org/tiles/actual/wind_vector/5/",
                { type: 'png', getURL: this.getTileURL, isBaseLayer: false, visibility: false, displayOutsideMaxExtent: true });

            //Preasure
            this.layer_weather_pressure1 = new OpenLayers.Layer.TMS("Pressure", "http://www.openportguide.org/tiles/actual/surface_pressure/5/",
                { type: 'png', getURL: this.getTileURL, isBaseLayer: false, visibility: false, displayOutsideMaxExtent: true });


            this.layer_weather_air_temperature1 = new OpenLayers.Layer.TMS("Air temperature", "http://www.openportguide.org/tiles/actual/air_temperature/5/",
                { type: 'png', getURL: this.getTileURL, isBaseLayer: false, visibility: false, displayOutsideMaxExtent: true });

            this.layer_weather_precipitation1 = new OpenLayers.Layer.TMS("Precipitation", "http://www.openportguide.org/tiles/actual/precipitation/5/",
                { type: 'png', getURL: this.getTileURL, isBaseLayer: false, visibility: false, displayOutsideMaxExtent: true });

            this.layer_weather_significant_wave_height1 = new OpenLayers.Layer.TMS("Wave Height", "http://www.openportguide.org/tiles/actual/significant_wave_height/5/",
                { type: 'png', getURL: this.getTileURL, isBaseLayer: false, visibility: false, displayOutsideMaxExtent: true });


            this.hybrid = new OpenLayers.Layer.Bing({
                key: 'Aq04lcZvs3og9ebdM3eJwDj_y0fBIyi9Z4C10hjJfQ7aLX-Nhn6Qde60EhOSN0XS',
                type: "AerialWithLabels",
                name: "Bing Aerial With Labels"
            });
            // Seamark
            this.layer_seamark = new OpenLayers.Layer.TMS("Seamark", "https://sjkpreverse.azurewebsites.net/seamark/", { numZoomLevels: 18, type: 'png', getURL: this.getTileURL, isBaseLayer: false, displayOutsideMaxExtent: true });

            this.markerLayer = new OpenLayers.Layer.Markers("Markers");
            this.vectorLayer = new OpenLayers.Layer.Vector("Trails");

            this.map.addLayers([this.layer_mapnik, this.layer_transport, this.layer_cycle, this.hybrid, this.layer_seamark, this.layer_weather_wind1, this.layer_weather_pressure1, this.layer_weather_air_temperature1, this.layer_weather_precipitation1, this.layer_weather_significant_wave_height1, this.vectorLayer, this.markerLayer]);
            this.map.addControl(new OpenLayers.Control.LayerSwitcher());
            this.jumpTo(this.lon, this.lat, this.zoom);


            $.ajax({
                type: "GET",
                url: 'https://ajax.aspnetcdn.com/ajax/signalr/jquery.signalr-2.2.0.min.js',
                dataType: "script",
                cache: true
            }).done(() => {
                $.ajax({
                    type: "GET",
                    url: this.baseUrl + '/signalr/hubs',
                    dataType: "script",
                    cache: true
                }).done(() => {
                    $.connection.hub.url = this.baseUrl + '/signalr';
                    var locationHub = $.connection.locationHub;

                    locationHub.client.updateLocation = (data) => {
                        $.each(data, (i, ship) => {
                            var locations = ship.Locations.map((data, i) => {
                                return this.NewLatLong(data.Latitude, data.Longitude);
                            });
                            var points = ship.Locations.map((data, i) => {
                                return this.NewGeoPoint(data.Latitude, data.Longitude);
                            });


                            if (typeof (this.ships[ship.Id]) == 'undefined') {
                                var marker = this.addMarker(this.markerLayer, locations[locations.length - 1], ship.Id);
                                this.ships[ship.Id] = marker;


                            }
                            else {
                                var marker = this.ships[ship.Id];
                                //marker.KPI = ship.KPI;
                                var lastLoc = locations[locations.length - 1];
                                marker.moveTo(this.map.getLayerPxFromLonLat(lastLoc));

                                this.rotateMarker(marker, ship.Locations[locations.length - 1].Heading);

                                if (typeof (this.polylines[ship.Id]) == 'undefined') {
                                    var feature = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.LineString(points)
                                    );

                                    this.polylines[ship.Id] = feature;

                                    this.vectorLayer.addFeatures(feature);
                                }
                                else {


                                    feature = this.polylines[ship.Id];
                                    this.vectorLayer.destroyFeatures(feature);

                                    var feature = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.LineString(points), null, this.lineStyle);

                                    this.polylines[ship.Id] = feature;

                                    this.vectorLayer.addFeatures(feature);

                                }
                            }

                        });
                    };


                    $.connection.hub.start().done(function () {
                        console.log('started');
                    });
                });
            });

        }
    }

    export class MarineMap implements IVisual {
		/**
		  * Informs the System what it can do
		  * Fields, Formatting options, data reduction & QnA hints
		  */
        public static capabilities: VisualCapabilities = {
            dataRoles: [{
                name: 'Category',
                kind: powerbi.VisualDataRoleKind.Grouping,
                displayName: data.createDisplayNameGetter("Role_DisplayName_Category")
            },
            {
                name: 'Time',
                kind: powerbi.VisualDataRoleKind.Grouping,
                displayName: "Time"
            },
            {
                name: 'Values',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Values'
            },
            {
                name: 'Latitude',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Latitude'
            },           
            {
                name: 'Longitude',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Longitude'
            },
            {
                name: 'Heading',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Heading'
            },
            {
                name: 'Link',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Link'
            },
            {
                name: 'Status',
                kind: powerbi.VisualDataRoleKind.Measure,
                displayName: 'Status'
            }
            ],
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 
                      'Time': { max: 1 }, 
                      'Latitude': { max: 1 },
                      'Longitude': { max: 1 },
                      'Heading': { max: 1 },
                      'Values': {max: 5},
                      'Link': {max: 1},
                      'Status': {max: 1}
                     },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { bottom: { count: 500} }
                    },
                    values: {
                        select: [
                            { bind: { to: 'Time' } },
                            { bind: { to: 'Values' } },
                            { bind: { to: 'Latitude' } },
                            { bind: { to: 'Longitude' } },
                            { bind: { to: 'Heading' } },
                            { bind: { to: 'Link' } },
                            { bind: { to: 'Status' } }
                            ]
                    },
                }
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: { type: { formatting: { formatString: true } } },
                        fill: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Fill'
                        },
                        size: {
                            type: { numeric: true },
                            displayName: 'Size'
                        }
                    },
                }
            },
        };

        public currentViewport: IViewport;
        private legend: ILegend;
        private element: JQuery;
        private map: JQuery;
        private openlayerMap: OpenlayerMap;
        private colors: IDataColorPalette;
        private dataView: DataView;
        private maxValue = 1;
        private hostServices: IVisualHostServices;

        // Convert a DataView into a view model
        public static converter(dataView: DataView, colors: IDataColorPalette): MarineMapDataModel {
            console.log('converter', dataView);
            var table = dataView.table;
            debug.assertValue(table, 'table');
            debug.assertValue(table.rows, 'table.rows');

            var model: MarineMapDataModel = {
                columns: [],
                data: [],
            };
            var catagoryIndex = -1;
            if (dataView && dataView.metadata) {
                for (var i: number = 0; i < dataView.metadata.columns.length; i++) {
                    var column = dataView.metadata.columns[i];
                    
                    if (!column.roles) {
                        continue;
                    }    
                    var columnInfo = {
                        colIndex: i,
                        format: column.format,
                        displayName: column.displayName,
                        queryName: column.queryName,
                        type: MarineMapColumnType.data
                    };
                     
                    if (column.roles["Category"] === true) {
                        catagoryIndex = i;
                        columnInfo.type = MarineMapColumnType.category;
                    }    
                  
                    if (column.roles["Time"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.time;
                    }
                    
                    if (column.roles["Longitude"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.longitude;                        
                    }
                    
                    if (column.roles["Latitude"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.latitude;
                    }
                    if (column.roles["Heading"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.heading;
                    }
                    if (column.roles["Link"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.link;
                    }
                    if (column.roles["Status"] === true)
                    {
                        columnInfo.type = MarineMapColumnType.status;
                    }
                    model.columns.push(columnInfo);
                }
            }
            if (catagoryIndex == -1)
                return null;

            for (var i: number = 0; i < table.rows.length; i++) {
                var row: MarineMapDataRow = {
                    values: table.rows[i]
                };
                var category = table.rows[i][catagoryIndex];
                var categoryModel: MarineMapCategoryData = null;
                for (var j: number = 0; j < model.data.length; j++) {
                    if (model.data[j].id == category) {
                        categoryModel = model.data[j];
                        break;
                    }
                }
                if (categoryModel == null) {
                    console.log(category);
                    categoryModel = { rows: [], id: category };
                    model.data.push(categoryModel);
                }
                categoryModel.rows.push(row);
            }
            console.log(model);
            return model;

        }               

        /* One time setup*/
        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.colors = options.style.colorPalette.dataColors;            
            this.legend = powerbi.visuals.createLegend(options.element, options.interactivity && options.interactivity.isInteractiveLegend, null);
            this.hostServices = options.host;
            this.initialize(this.element[0]);
        }
        
             

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            this.dataView = options.dataViews[0];
            this.currentViewport = options.viewport;
            // this.onColumnHeaderClick('MW100.UTClogTime', SortDirection.Descending);
            this.redrawCanvas();           
        }

        public redrawCanvas = () => {
            //this.updateCanvasSize();

            var data = MarineMap.converter(this.dataView, this.colors);
            if (this.openlayerMap != null)
                this.openlayerMap.plotdata(data);
        }    

        /*About to remove your visual, do clean up here */
        public destroy() {

        }

        /* Called when the view port resizes */
        public onResizing(viewport: IViewport): void {
            if (this.currentViewport.width !== viewport.width || this.currentViewport.height !== viewport.height) {
                this.currentViewport = viewport;
                this.openlayerMap.resize();
            }
        }

        //Make visual properties available in the property pane in Power BI
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];
            var dataView = this.dataView;
            switch (options.objectName) {
                case 'general':
                    var general: VisualObjectInstance = {
                        objectName: 'general',
                        displayName: 'General',
                        selector: null,
                        properties: {
                            // backgroundUrl: HeatMapChart.getFieldText(dataView, 'general', 'backgroundUrl', ''),
                            // radius: HeatMapChart.getFieldNumber(dataView, 'general', 'radius',5),
                            // blur: HeatMapChart.getFieldNumber(dataView, 'general', 'blur',15),
                            // maxWidth: HeatMapChart.getFieldNumber(dataView, 'general', 'maxWidth', this.canvasWidth),
                            // maxHeight: HeatMapChart.getFieldNumber(dataView, 'general', 'maxHeight', this.canvasHeight),
                            // maxValue: HeatMapChart.getFieldNumber(dataView, 'general', 'maxValue', 1)
                        }
                    };
                    instances.push(general);
                    break;
            }

            return instances;
        }

        public canResizeTo(viewport: IViewport): boolean {
            return true;
        }

        private getViewPort(): IViewport {
            var currentViewport = this.currentViewport;
            var legendMargins = this.legend.getMargins();

            var mapViewport = {
                width: currentViewport.width - legendMargins.width,
                height: currentViewport.height - legendMargins.height,
            };

            return mapViewport;
        }        

        private initialize = (container: HTMLElement): void => {
            this.map = $('<div style="width:100%; height:100%;position: absolute;" id="openlayermap"></div>');
            $(container).append(this.map);
            $.ajax({
                type: "GET",
                url: "https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/OpenLayers.js",
                dataType: "script",
                cache: true
            }).done(() => {
                console.log('openlayers loaded');
                $.ajax({
                    type: "GET",
                    url: "https://www.openstreetmap.org/openlayers/OpenStreetMap.js",
                    dataType: "script",
                    cache: true
                }).done(() => {
                    var omap = new OpenlayerMap('openlayermap');
                    this.openlayerMap = omap;
                    this.redrawCanvas();
                });
            });
        }


        private static getFieldText(dataView: DataView, field: string, property: string = 'text', defaultValue: string = ''): string {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var f = objects[field];
                    if (f) {
                        var text = <string>f[property];
                        if (text)
                            return text;
                    }
                }
            }
            return defaultValue;
        }

        private static getFieldNumber(dataView: DataView, field: string, property: string = 'text', defaultValue: number = 100): number {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var f = objects[field];
                    if (f) {
                        var num = <number>f[property];
                        if (num)
                            return num;
                    }
                }
            }
            return defaultValue;
        }
    }
}
