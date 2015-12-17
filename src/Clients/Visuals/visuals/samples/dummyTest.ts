/// <reference path="../../_references.ts"/>


module powerbi.visuals.samples {
    export interface IDummyViewModel {
    
    };

    export class DummyIVisual implements IVisual {
        private dataView: DataView;
        
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
                kind: powerbi.VisualDataRoleKind.GroupingOrMeasure,
                displayName: 'Latitude'
            },           
            {
                name: 'Longitude',
                kind: powerbi.VisualDataRoleKind.GroupingOrMeasure,
                displayName: 'Longitude'
            },
            {
                name: 'Heading',
                kind: powerbi.VisualDataRoleKind.GroupingOrMeasure,
                displayName: 'Heading'
            }
            ],
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 
                      'Time': { max: 1 }, 
                      'Latitude': { max: 1 },
                      'Longitude': { max: 1 },
                      'Heading': { max: 1 },
                      'Values': {max: 5}
                     },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { bottom: {} }
                    },
                    values: {
                        select: [
                            { bind: { to: 'Time' } },
                            { bind: { to: 'Values' } },
                            { bind: { to: 'Latitude' } },
                            { bind: { to: 'Longitude' } },
                            { bind: { to: 'Heading' } }
                            ]
                    },
                }
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
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
        
        public static converter(dataView: DataView): IDummyViewModel {
           
            console.log(dataView);
            return null;
        }
        
        public init() {
            
        }
        
        public update(options: VisualUpdateOptions) {
            if (!options.dataViews && !options.dataViews[0]) return;
            var dataView = this.dataView = options.dataViews[0];
            var viewport = options.viewport;
            var viewModel: IDummyViewModel = DummyIVisual.converter(dataView);
        }
    }
}