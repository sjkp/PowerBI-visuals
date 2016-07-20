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

module powerbi.visuals.samples {
    import PixelConverter = jsCommon.PixelConverter;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import IEnumType = powerbi.IEnumType;
    import createEnumType = powerbi.createEnumType;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IVisual = powerbi.IVisual;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import IViewport = powerbi.IViewport;
    import TextProperties = powerbi.TextProperties;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import DataView = powerbi.DataView;
    import DataViewObjects = powerbi.DataViewObjects;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import SelectionId = powerbi.visuals.SelectionId;
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;

    export interface BarData {
        scale: any;
        barIndex: number;
        categoryLabel: string;
        axis: any;
        x: number;
        y: number;
        key: string;
    }

    export interface BarRect extends SelectableDataPoint {
        barIndex: number;
        start: number;
        end: number;
        fill: string;
        tooltipInfo?: TooltipDataItem[];
        key: string;
        highlight?: boolean;
    }

    export interface TargetValue {
        barIndex: number;
        value: number;
        value2: number;
        fill: string;
        key: string;
    }

    export interface ScaledValues {
        firstScale: number;
        secondScale: number;
        thirdScale: number;
        fourthScale: number;
        fifthScale: number;
    }

    export interface BarValueRect extends BarRect { }

    export interface BulletChartValues {
        targetValue: number;
        minimumPercent: number;
        needsImprovementPercent: number;
        satisfactoryPercent: number;
        goodPercent: number;
        veryGoodPercent: number;
        maximumPercent: number;
        targetValue2: number;
        secondTargetVisibility: boolean;
    }

    export interface BulletChartOrientation {
        orientation: string;
        reverse: boolean;
        vertical: boolean;
    }

    export interface BulletChartColors {
        badColor: string;
        needsImprovementColor: string;
        satisfactoryColor: string;
        goodColor: string;
        veryGoodColor: string;
        bulletColor: string;
    }

    export interface BulletChartAxis {
        axis: boolean;
        axisColor: string;
        measureUnits: string;
        unitsColor: string;
    }

    export interface BulletChartSettings {
        values: BulletChartValues;
        orientation: BulletChartOrientation;
        colors: BulletChartColors;
        axis: BulletChartAxis;
        labelSettings: VisualDataLabelsSettings;
    }

    //Model
    export interface BulletChartModel {
        bars: BarData[];
        bulletChartSettings: BulletChartSettings;
        bulletValueFormatString: string;
        barRects: BarRect[];
        valueRects: BarValueRect[];
        targetValues: TargetValue[];
        hasHighlights: boolean;
        viewportLength: number;
        labelHeight: number;
        labelHeightTop: number;
        spaceRequiredForBarHorizontally: number;
    }

    export let bulletChartRoleNames = {
        value: 'Value',
        targetValue: 'TargetValue',
        minValue: 'Minimum',
        needsImprovementValue: 'NeedsImprovement',
        satisfactoryValue: 'Satisfactory',
        goodValue: 'Good',
        veryGoodValue: 'VeryGood',
        maxValue: 'Maximum',
        targetValue2: 'TargetValue2',
    };

    module Orientation {
        export const HORIZONTALLEFT: string = 'Horizontal Left';
        export const HORIZONTALRIGHT: string = 'Horizontal Right';
        export const VERTICALTOP: string = 'Vertical Top';
        export const VERTICALBOTTOM: string = 'Vertical Bottom';

        export var type: IEnumType = createEnumType([
            { value: HORIZONTALLEFT, displayName: HORIZONTALLEFT },
            { value: HORIZONTALRIGHT, displayName: HORIZONTALRIGHT },
            { value: VERTICALTOP, displayName: VERTICALTOP },
            { value: VERTICALBOTTOM, displayName: VERTICALBOTTOM }
        ]);
    }

    export interface BulletChartProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }

    export interface BulletChartProperties {
        [propertyName: string]: BulletChartProperty;
    }

    export let bulletChartProps: BulletChartProperties = {
        values: {
            targetValue: { objectName: 'values', propertyName: 'targetValue' },
            minimumPercent: { objectName: 'values', propertyName: 'minimumPercent' },
            needsImprovementPercent: { objectName: 'values', propertyName: 'needsImprovementPercent' },
            satisfactoryPercent: { objectName: 'values', propertyName: 'satisfactoryPercent' },
            goodPercent: { objectName: 'values', propertyName: 'goodPercent' },
            veryGoodPercent: { objectName: 'values', propertyName: 'veryGoodPercent' },
            maximumPercent: { objectName: 'values', propertyName: 'maximumPercent' },
            targetValue2: { objectName: 'values', propertyName: 'targetValue2' },
            secondTargetVisibility: { objectName: 'values', propertyName: 'secondTargetVisibility' },
        },
        orientation: {
            orientation: { objectName: 'orientation', propertyName: 'orientation' },
        },
        colors: {
            badColor: { objectName: 'colors', propertyName: 'badColor' },
            needsImprovementColor: { objectName: 'colors', propertyName: 'needsImprovementColor' },
            satisfactoryColor: { objectName: 'colors', propertyName: 'satisfactoryColor' },
            goodColor: { objectName: 'colors', propertyName: 'goodColor' },
            veryGoodColor: { objectName: 'colors', propertyName: 'veryGoodColor' },
            bulletColor: { objectName: 'colors', propertyName: 'bulletColor' },
        },
        axis: {
            axis: { objectName: 'axis', propertyName: 'axis' },
            axisColor: { objectName: 'axis', propertyName: 'axisColor' },
            measureUnits: { objectName: 'axis', propertyName: 'measureUnits' },
            unitsColor: { objectName: 'axis', propertyName: 'unitsColor' },
        },
        general: {
            formatString: { objectName: 'general', propertyName: 'formatString' },
        },
        labels: {
            fontSize: { objectName: 'labels', propertyName: 'fontSize' },
            show: { objectName: 'labels', propertyName: 'show' },
            labelColor: { objectName: 'labels', propertyName: 'labelColor' }
        }
    };

    export class BulletChart implements IVisual {
        private static ScrollBarSize = 22;
        private static SpaceRequiredForBarVertically = 100;
        private static XMarginHorizontal = 20;
        private static YMarginHorizontal = 30;
        private static XMarginVertical = 50;
        private static YMarginVertical = 10;
        private static BulletSize = 25;
        private static DefaultSubtitleFontSizeInPt = 9;
        private static BarMargin = 10;
        private static MaxLabelWidth = 80;
        private static MaxMeasureUnitWidth = BulletChart.MaxLabelWidth - 20;
        private static SubtitleMargin = 10;
        private static AxisFontSizeInPt = 8;
        private static SecondTargetLineSize = 7;

        private static MarkerMarginHorizontal = BulletChart.BulletSize / 3;
        private static MarkerMarginVertical = BulletChart.BulletSize / 4;

        private static FontFamily: string = "Segoe UI";
        private baselineDelta: number = 0;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'Category',
                }, {
                    name: 'Value',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Value',
                }, {
                    name: 'TargetValue',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Target Value',
                }, {
                    name: 'Minimum',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Minimum',
                }, {
                    name: 'NeedsImprovement',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Needs Improvement',
                }, {
                    name: 'Satisfactory',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Satisfactory',
                }, {
                    name: 'Good',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Good',
                }, {
                    name: 'VeryGood',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Very Good',
                }, {
                    name: 'Maximum',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Maximum',
                }, {
                    name: 'TargetValue2',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Target Value 2'
                }
            ],
            objects: {
                general: {
                    displayName: createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                values: {
                    displayName: 'Data values',
                    properties: {
                        targetValue: {
                            displayName: 'Target Value',
                            type: { numeric: true }
                        },
                        targetValue2: {
                            displayName: 'Target Value 2',
                            type: { numeric: true },
                        },
                        secondTargetVisibility: {
                            displayName: 'Second Target Visibility',
                            type: { bool: true },
                        },
                        minimumPercent: {
                            displayName: 'Minimum %',
                            type: { numeric: true }
                        },
                        needsImprovementPercent: {
                            displayName: 'Needs Improvement %',
                            type: { numeric: true },
                        },
                        satisfactoryPercent: {
                            displayName: 'Satisfactory %',
                            type: { numeric: true }
                        },
                        goodPercent: {
                            displayName: 'Good %',
                            type: { numeric: true }
                        },
                        veryGoodPercent: {
                            displayName: 'Very Good %',
                            type: { numeric: true },
                        },
                        maximumPercent: {
                            displayName: 'Maximum %',
                            type: { numeric: true }
                        },
                    }
                },
                labels: {
                    displayName: 'Category labels',
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter('Visual_Show'),
                            type: { bool: true },
                        },
                        labelColor: {
                            displayName: createDisplayNameGetter('Visual_LabelsFill'),
                            description: createDisplayNameGetter('Visual_LabelsFillDescription'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } },
                        },
                    },
                },
                orientation: {
                    displayName: 'Orientation',
                    properties: {
                        orientation: {
                            displayName: 'Orientation',
                            type: { enumeration: Orientation.type }
                        }
                    }
                },
                colors: {
                    displayName: 'Colors',
                    properties: {
                        badColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Bad Color'
                        },
                        needsImprovementColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Needs Improvement Color',
                        },
                        satisfactoryColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Satisfactory Color'
                        },
                        goodColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Good Color'
                        },
                        veryGoodColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Very Good Color',
                        },
                        bulletColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Bullet Color'
                        }
                    },
                },
                axis: {
                    displayName: 'Axis',
                    properties: {
                        axis: {
                            displayName: 'Axis',
                            type: { bool: true }
                        },
                        axisColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Axis Color'
                        },
                        measureUnits: {
                            type: { text: true },
                            displayName: 'Measure Units '
                        },
                        unitsColor: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Units Color'
                        },
                    }
                }
            },
            dataViewMappings: [{
                conditions: [
                    {
                        'Category': { max: 1 }, 'Value': { max: 1 }, 'TargetValue': { max: 1 }, 'Minimum': { max: 1 }, 'NeedsImprovement': { max: 1 },
                        'Satisfactory': { max: 1 }, 'Good': { max: 1 }, 'VeryGood': { max: 1 }, 'Maximum': { max: 1 }, 'TargetValue2': { max: 1 },
                    },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [
                            { bind: { to: 'Value' } },
                            { bind: { to: 'TargetValue' } },
                            { bind: { to: 'TargetValue2' } },
                            { bind: { to: 'Minimum' } },
                            { bind: { to: 'NeedsImprovement' } },
                            { bind: { to: 'Satisfactory' } },
                            { bind: { to: 'Good' } },
                            { bind: { to: 'VeryGood' } },
                            { bind: { to: 'Maximum' } },
                        ]
                    },
                },
            }],
            supportsHighlight: true,
            sorting: {
                default: {},
            },
            drilldown: {
                roles: ['Category']
            }
        };

        //Variables
        private clearCatcher: D3.Selection;
        private bulletBody: D3.Selection;
        private scrollContainer: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private bulletGraphicsContext: D3.Selection;
        private model: BulletChartModel;
        private behavior: BulletWebBehavior;
        private interactivityService: IInteractivityService;
        private hostService: IVisualHostServices;

        private get reverse(): boolean {
            return this.model.bulletChartSettings.orientation.reverse;
        }

        private get vertical(): boolean {
            return this.model.bulletChartSettings.orientation.vertical;
        }

        public static DefaultStyleProperties(): BulletChartSettings {
            return {
                values: {
                    targetValue: 0,
                    targetValue2: 0,
                    minimumPercent: 0,
                    needsImprovementPercent: 25,
                    satisfactoryPercent: 50,
                    goodPercent: 100,
                    veryGoodPercent: 125,
                    maximumPercent: 200,
                    secondTargetVisibility: false,
                },
                orientation: {
                    orientation: Orientation.HORIZONTALLEFT,
                    reverse: false,
                    vertical: false
                },
                colors: {
                    badColor: 'Darkred',
                    needsImprovementColor: 'Red',
                    satisfactoryColor: 'Yellow',
                    goodColor: 'Green',
                    veryGoodColor: 'Darkgreen',
                    bulletColor: 'Black'
                },
                axis: {
                    axis: true,
                    axisColor: 'Grey',
                    measureUnits: '',
                    unitsColor: 'Grey',
                },
                labelSettings: {
                    fontSize: 11,
                    show: true,
                    labelColor: 'Black',
                },
            };
        }

        private viewport: IViewport;

        private get viewportIn(): IViewport {
            return <IViewport>{
                width: this.viewport.width,
                height: this.viewport.height
            };
        }

        private get viewportScroll(): IViewport {
            let viewportIn = this.viewportIn;
            return <IViewport>{
                width: viewportIn.width - BulletChart.ScrollBarSize,
                height: viewportIn.height - BulletChart.ScrollBarSize
            };
        }

        private static getTextProperties(text: string, fontSize: number): TextProperties {
            return <TextProperties>{
                fontFamily: BulletChart.FontFamily,
                fontSize: PixelConverter.fromPoint(fontSize),
                text: text,
            };
        }

        // Convert a DataView into a view model
        public static converter(dataView: DataView, options: VisualUpdateOptions): BulletChartModel {
            let defaultSettings = BulletChart.DefaultStyleProperties();
            let bulletModel: BulletChartModel = <BulletChartModel>{
                bulletValueFormatString: null,
                bulletChartSettings: defaultSettings,
                bars: [],
                barRects: [],
                valueRects: [],
                targetValues: [],
                viewportLength: 0
            };

            if (!dataView || !dataView.categorical || !dataView.categorical.values || dataView.categorical.values.length === 0
                || !dataView.metadata || !dataView.metadata.columns || dataView.metadata.columns.length === 0) {
                return bulletModel;
            }

            let objects = dataView.metadata.objects;
            let settings = bulletModel.bulletChartSettings;

            if (objects) {
                settings.values.targetValue = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["targetValue"], defaultSettings.values.targetValue);
                settings.values.targetValue2 = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["targetValue2"], defaultSettings.values.targetValue2);
                settings.values.secondTargetVisibility = DataViewObjects.getValue<boolean>(objects, bulletChartProps["values"]["secondTargetVisibility"], defaultSettings.values.secondTargetVisibility);
                settings.values.minimumPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["minimumPercent"], defaultSettings.values.minimumPercent);
                settings.values.needsImprovementPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["needsImprovementPercent"], defaultSettings.values.needsImprovementPercent);
                settings.values.satisfactoryPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["satisfactoryPercent"], defaultSettings.values.satisfactoryPercent);
                settings.values.goodPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["goodPercent"], defaultSettings.values.goodPercent);
                settings.values.veryGoodPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["veryGoodPercent"], defaultSettings.values.veryGoodPercent);
                settings.values.maximumPercent = DataViewObjects.getValue<number>(objects, bulletChartProps["values"]["maximumPercent"], defaultSettings.values.maximumPercent);

                settings.orientation.orientation = DataViewObjects.getValue<string>(objects, bulletChartProps["orientation"]["orientation"], defaultSettings.orientation.orientation);

                settings.colors.badColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["badColor"], defaultSettings.colors.badColor);
                settings.colors.needsImprovementColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["needsImprovementColor"], defaultSettings.colors.needsImprovementColor);
                settings.colors.satisfactoryColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["satisfactoryColor"], defaultSettings.colors.satisfactoryColor);
                settings.colors.goodColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["goodColor"], defaultSettings.colors.goodColor);
                settings.colors.veryGoodColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["veryGoodColor"], defaultSettings.colors.veryGoodColor);
                settings.colors.bulletColor = DataViewObjects.getFillColor(objects, bulletChartProps["colors"]["bulletColor"], defaultSettings.colors.bulletColor);

                settings.axis.axis = DataViewObjects.getValue<boolean>(objects, bulletChartProps["axis"]["axis"], defaultSettings.axis.axis);
                settings.axis.axisColor = DataViewObjects.getFillColor(objects, bulletChartProps["axis"]["axisColor"], defaultSettings.axis.axisColor);
                settings.axis.measureUnits = TextMeasurementService.getTailoredTextOrDefault(BulletChart.getTextProperties(
                    DataViewObjects.getValue<string>(objects, bulletChartProps["axis"]["measureUnits"], defaultSettings.axis.measureUnits), BulletChart.DefaultSubtitleFontSizeInPt), BulletChart.MaxLabelWidth);
                settings.axis.unitsColor = DataViewObjects.getFillColor(objects, bulletChartProps["axis"]["unitsColor"], defaultSettings.axis.unitsColor);

                settings.labelSettings.fontSize = DataViewObjects.getValue<number>(objects, bulletChartProps["labels"]["fontSize"], defaultSettings.labelSettings.fontSize);
                settings.labelSettings.show = DataViewObjects.getValue<boolean>(objects, bulletChartProps["labels"]["show"], defaultSettings.labelSettings.show);
                settings.labelSettings.labelColor = DataViewObjects.getFillColor(objects, bulletChartProps["labels"]["labelColor"], defaultSettings.labelSettings.labelColor);
            }
            if (settings.orientation.orientation === Orientation.HORIZONTALRIGHT || settings.orientation.orientation === Orientation.VERTICALBOTTOM)
                settings.orientation.reverse = true;

            if (settings.orientation.orientation === Orientation.VERTICALTOP || settings.orientation.orientation === Orientation.VERTICALBOTTOM)
                settings.orientation.vertical = true;

            let categories: DataViewCategoryColumn,
                categoryValues: any[],
                categoryValuesLen: number = 1,
                categoryFormatString: string;

            if (dataView.categorical.categories) {
                categories = dataView.categorical.categories[0];
                categoryValues = categories.values;
                categoryValuesLen = categoryValues.length;
                categoryFormatString = valueFormatter.getFormatString(categories.source, bulletChartProps["general"]["formatString"]);
            }

            bulletModel.labelHeight = (settings.labelSettings.show || 0) && parseFloat(PixelConverter.fromPoint(settings.labelSettings.fontSize));
            bulletModel.labelHeightTop = (settings.labelSettings.show || 0) && parseFloat(PixelConverter.fromPoint(settings.labelSettings.fontSize)) / 1.4;
            bulletModel.spaceRequiredForBarHorizontally = Math.max(60, bulletModel.labelHeight + 20);
            bulletModel.bulletValueFormatString = valueFormatter.getFormatString(dataView.categorical.values[0].source, bulletChartProps["general"]["formatString"]);
            bulletModel.viewportLength = (settings.orientation.vertical
                ? (options.viewport.height - bulletModel.labelHeightTop - BulletChart.SubtitleMargin - 20 - BulletChart.YMarginVertical * 2)
                : (options.viewport.width - BulletChart.MaxLabelWidth - BulletChart.XMarginHorizontal * 3)) - BulletChart.ScrollBarSize;

            for (let idx = 0; idx < categoryValuesLen; idx++) {
                let toolTipItems = [];
                let category: string, value: number, targetValue: number, targetValue2: number, minimum: number, satisfactory: number,
                    good: number, maximum: number, needsImprovement: number, veryGood: number;
                let highlight: boolean = false,
                    categoryIdentity: DataViewScopeIdentity;

                if (categoryValues) {
                    let categoryValue = categoryValues[idx];

                    category = valueFormatter.format(categoryValue, categoryFormatString);
                    categoryIdentity = categories.identity ? categories.identity[idx] : null;

                    let textProperties = BulletChart.getTextProperties(category, settings.labelSettings.fontSize);
                    category = TextMeasurementService.getTailoredTextOrDefault(textProperties, BulletChart.MaxLabelWidth);
                }

                let values = dataView.categorical.values;
                targetValue = settings.values.targetValue;
                targetValue2 = settings.values.targetValue2;

                bulletModel.hasHighlights = !!(values.length > 0 && values[0].highlights);

                for (let i = 0; i < values.length; i++) {
                    let col = values[i].source;
                    let currentVal = values[i].values[idx] || 0;

                    if (col && col.roles) {
                        if (col.roles[bulletChartRoleNames.value]) {
                            if (values[i].highlights)
                                highlight = values[i].highlights[idx] !== null;
                            toolTipItems.push({ value: currentVal, metadata: values[i] });
                            value = currentVal;
                        } else if (col.roles[bulletChartRoleNames.targetValue]) {
                            toolTipItems.push({ value: currentVal, metadata: values[i] });
                            targetValue = currentVal;
                        } else if (col.roles[bulletChartRoleNames.targetValue2]) {
                            toolTipItems.push({ value: currentVal, metadata: values[i] });
                            targetValue2 = currentVal;
                        } else if (col.roles[bulletChartRoleNames.minValue])
                            minimum = currentVal;
                        else if (col.roles[bulletChartRoleNames.needsImprovementValue])
                            needsImprovement = currentVal;
                        else if (col.roles[bulletChartRoleNames.satisfactoryValue])
                            satisfactory = currentVal;
                        else if (col.roles[bulletChartRoleNames.goodValue])
                            good = currentVal;
                        else if (col.roles[bulletChartRoleNames.veryGoodValue])
                            veryGood = currentVal;
                        else if (col.roles[bulletChartRoleNames.maxValue])
                            maximum = currentVal;
                    }
                }

                if (!minimum)
                    minimum = settings.values.minimumPercent * targetValue / 100;
                if (!needsImprovement)
                    needsImprovement = settings.values.needsImprovementPercent * targetValue / 100;
                if (!satisfactory)
                    satisfactory = settings.values.satisfactoryPercent * targetValue / 100;
                if (!good)
                    good = settings.values.goodPercent * targetValue / 100;
                if (!veryGood)
                    veryGood = settings.values.veryGoodPercent * targetValue / 100;
                if (!maximum)
                    maximum = settings.values.maximumPercent * targetValue / 100;

                let sortedRanges = [minimum, needsImprovement, satisfactory, good, veryGood, maximum].sort(d3.descending);
                let scale = (d3.scale.linear()
                    .clamp(true)
                    .domain([minimum, Math.max(sortedRanges[0], targetValue, value)])
                    .range(settings.orientation.vertical ? [bulletModel.viewportLength, 0] : [0, bulletModel.viewportLength]));

                // Scalles without
                let firstScale = scale(minimum);
                let secondScale = scale(needsImprovement);
                let thirdScale = scale(satisfactory);
                let fourthScale = scale(good);
                let fifthScale = scale(veryGood);
                let lastScale = scale(maximum);
                let valueScale = scale(value);

                let firstColor = settings.colors.badColor, secondColor = settings.colors.needsImprovementColor,
                    thirdColor = settings.colors.satisfactoryColor, fourthColor = settings.colors.goodColor, lastColor = settings.colors.veryGoodColor;

                BulletChart.addItemToBarArray(bulletModel.barRects, idx, firstScale, secondScale, firstColor, toolTipItems, categoryIdentity, highlight);
                BulletChart.addItemToBarArray(bulletModel.barRects, idx, secondScale, thirdScale, secondColor, toolTipItems, categoryIdentity, highlight);
                BulletChart.addItemToBarArray(bulletModel.barRects, idx, thirdScale, fourthScale, thirdColor, toolTipItems, categoryIdentity, highlight);
                BulletChart.addItemToBarArray(bulletModel.barRects, idx, fourthScale, fifthScale, fourthColor, toolTipItems, categoryIdentity, highlight);
                BulletChart.addItemToBarArray(bulletModel.barRects, idx, fifthScale, lastScale, lastColor, toolTipItems, categoryIdentity, highlight);
                BulletChart.addItemToBarArray(bulletModel.valueRects, idx, firstScale, valueScale, settings.colors.bulletColor, toolTipItems, categoryIdentity, highlight);

                // markerValue
                bulletModel.targetValues.push({
                    barIndex: idx,
                    value: scale(targetValue),
                    fill: settings.colors.bulletColor,
                    key: SelectionId.createWithIdAndMeasure(categoryIdentity, scale(targetValue).toString()).getKey(),
                    value2: scale(targetValue2),
                });

                let xAxis = null;
                if (settings.axis.axis) {
                    xAxis = d3.svg.axis();
                    xAxis.orient(settings.orientation.vertical ? "left" : "bottom");
                    let minTickSize = Math.round(Math.max(3, bulletModel.viewportLength / 100));
                    let axisValues = [value, targetValue, good, satisfactory, maximum, minimum, needsImprovement, veryGood]
                        .filter(x => !isNaN(x));
                    xAxis.tickFormat(valueFormatter.create({
                        format: bulletModel.bulletValueFormatString,
                        value: axisValues.length ? Math.max.apply(null, axisValues) : 0
                    }).format);
                    xAxis.ticks(minTickSize);
                    xAxis.scale(scale);
                }

                let bar: BarData = {
                    scale: scale,
                    barIndex: idx,
                    categoryLabel: category,
                    x: (settings.orientation.vertical) ? BulletChart.XMarginVertical + BulletChart.SpaceRequiredForBarVertically * idx : BulletChart.XMarginHorizontal,
                    y: (settings.orientation.vertical) ? BulletChart.YMarginVertical : BulletChart.YMarginHorizontal + bulletModel.spaceRequiredForBarHorizontally * idx,
                    axis: xAxis,
                    key: SelectionId.createWithIdAndMeasure(categoryIdentity, idx.toString()).getKey(),
                };

                bulletModel.bars.push(bar);
            }

            return bulletModel;
        }

        private static addItemToBarArray(collection: BarRect[], barIndex: number, start: number, end: number, fill: string, tooltipInfo?: any[], categoryIdentity?: any, highlight?: boolean): void {
            if (!isNaN(start) && !isNaN(end))
                collection.push({
                    barIndex: barIndex,
                    start: start,
                    end: end,
                    fill: fill,
                    tooltipInfo: TooltipBuilder.createTooltipInfo(bulletChartProps["general"]["formatString"], null, null, null, null, tooltipInfo),
                    selected: false,
                    identity: SelectionId.createWithId(categoryIdentity),
                    key: SelectionId.createWithIdAndMeasure(categoryIdentity, start + " " + end).getKey(),
                    highlight: highlight,
                });
        }

        /* One time setup*/
        public init(options: VisualInitOptions): void {
            let body = d3.select(options.element.get(0));
            this.hostService = options.host;

            this.bulletBody = body
                .append('div')
                .classed('bulletChart', true)
                .attr("drag-resize-disabled", true);

            this.scrollContainer = this.bulletBody.append('svg')
                .classed('bullet-scroll-region', true);
            this.clearCatcher = appendClearCatcher(this.scrollContainer);

            this.labelGraphicsContext = this.scrollContainer.append('g');
            this.bulletGraphicsContext = this.scrollContainer.append('g');

            this.behavior = new BulletWebBehavior();

            this.interactivityService = createInteractivityService(options.host);
        }

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            let dataView = options.dataViews[0];
            this.viewport = options.viewport;
            this.model = BulletChart.converter(dataView, options);

            //TODO: Calculating the baseline delta of the text. needs to be removed once the TExtMeasurementService.estimateSVGTextBaselineDelta is available.
            this.baselineDelta = TextMeasurementHelper.estimateSvgTextBaselineDelta(BulletChart.getTextProperties("1", this.model.bulletChartSettings.labelSettings.fontSize));

            this.ClearViewport();
            if (!this.model) {
                return;
            }

            if (this.interactivityService) {
                this.interactivityService.applySelectionStateToData(this.model.barRects);
            }

            this.bulletBody.style({
                'height': this.viewportIn.height + 'px',
                'width': this.viewportIn.width + 'px',
            });
            if (this.vertical) {
                this.scrollContainer.attr({
                    width: (this.model.bars.length * BulletChart.SpaceRequiredForBarVertically + BulletChart.XMarginVertical) + 'px',
                    height: this.viewportScroll.height + 'px'
                });
            }
            else {
                this.scrollContainer.attr({
                    height: (this.model.bars.length * this.model.spaceRequiredForBarHorizontally) + 'px',
                    width: this.viewportScroll.width + 'px'
                });
            }

            if (this.vertical)
                this.setUpBulletsVertically(this.bulletBody, this.model, this.reverse);
            else
                this.setUpBulletsHorizontally(this.bulletBody, this.model, this.reverse);
        }

        private ClearViewport() {
            this.labelGraphicsContext.selectAll("text").remove();
            this.bulletGraphicsContext.selectAll("rect").remove();
            this.bulletGraphicsContext.selectAll("text").remove();
            this.bulletGraphicsContext.selectAll('axis').remove();
            this.bulletGraphicsContext.selectAll('path').remove();
            this.bulletGraphicsContext.selectAll('line').remove();
            this.bulletGraphicsContext.selectAll('tick').remove();
            this.bulletGraphicsContext.selectAll('g').remove();
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        private calculateLabelWidth(barData: BarData, bar?: BarRect, reversed?: boolean) {
            return (reversed ? 0 : barData.x + BulletChart.MaxLabelWidth) + BulletChart.XMarginHorizontal + (bar ? bar.start : 0);
        }

        private calculateLabelHeight(barData: BarData, bar?: BarRect, reversed?: boolean) {
            return BulletChart.YMarginVertical + (reversed ? 5 :
                barData.y + this.model.labelHeightTop + BulletChart.BarMargin + BulletChart.SubtitleMargin)
                + (bar ? bar.end : 0);
        }

        private setUpBulletsHorizontally(bulletBody: D3.Selection, model: BulletChartModel, reveresed: boolean) {
            let bars = model.bars;
            let rects = model.barRects;
            let valueRects = model.valueRects;
            let targetValues = model.targetValues;
            let barSelection = this.labelGraphicsContext.selectAll('text').data(bars, (d: BarData) => d.key);
            let rectSelection = this.bulletGraphicsContext.selectAll('rect.range').data(rects, (d: BarRect) => d.key);

            let hasSelection: boolean = this.interactivityService && this.interactivityService.hasSelection();
            let hasHighlights: boolean = model.hasHighlights;

            // Draw bullets
            let bullets = rectSelection.enter().append('rect').attr({
                'x': ((d: BarRect) => { return this.calculateLabelWidth(bars[d.barIndex], d, reveresed); }),
                'y': ((d: BarRect) => bars[d.barIndex].y - BulletChart.BulletSize / 2),
                'width': ((d: BarRect) => d.end - d.start),
                'height': BulletChart.BulletSize,
            }).classed('range', true).style({
                'fill': (d: BarRect) => d.fill,
                'opacity': (d: BarRect) => bulletChartUtils.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights),
            });

            rectSelection.exit();

            // Draw value rects
            let valueSelection = this.bulletGraphicsContext.selectAll('rect').data(valueRects, (d: BarValueRect) => d.key);
            valueSelection.enter().append('rect').attr({
                'x': ((d: BarValueRect) => { return this.calculateLabelWidth(bars[d.barIndex], d, reveresed); }),
                'y': ((d: BarValueRect) => bars[d.barIndex].y - BulletChart.BulletSize / 8),
                'width': ((d: BarValueRect) => d.end - d.start),
                'height': BulletChart.BulletSize * 1 / 4,
            }).classed('value', true).style({
                'fill': (d: BarValueRect) => d.fill,
                'opacity': (d: BarRect) => bulletChartUtils.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights),
            });

            valueSelection.exit();
            // Draw markers
            let markerSelection = this.bulletGraphicsContext.selectAll('values').data(targetValues, (d: TargetValue) => {
                if (!isNaN(d.value) && !isNaN(d.value2))
                    return d.key;
            });
            markerSelection.enter().append('line').attr({
                'x1': ((d: TargetValue) => { return this.calculateLabelWidth(bars[d.barIndex], null, reveresed) + d.value; }),
                'x2': ((d: TargetValue) => { return this.calculateLabelWidth(bars[d.barIndex], null, reveresed) + d.value; }),
                'y1': ((d: TargetValue) => bars[d.barIndex].y - BulletChart.MarkerMarginHorizontal),
                'y2': ((d: TargetValue) => bars[d.barIndex].y + BulletChart.MarkerMarginHorizontal),
            }).style({
                'stroke': ((d: TargetValue) => d.fill),
                'stroke-width': 2,
            });

            if (model.bulletChartSettings.values.secondTargetVisibility) {
                this.drawSecondTarget(
                    markerSelection.enter(),
                    (d: TargetValue) => this.calculateLabelWidth(bars[d.barIndex], null, reveresed) + d.value2,
                    (d: TargetValue) => bars[d.barIndex].y);
            }

            markerSelection.exit();

            // Draw axes
            if (model.bulletChartSettings.axis.axis) {
                // Using var instead of let since you can't pass let parameters to functions inside loops.
                // needs to be changed to let when typescript 1.8 comes out.
                for (var idx = 0; idx < bars.length; idx++) {
                    var bar = bars[idx];
                    this.bulletGraphicsContext.append("g").attr({
                        'transform': () => {
                            let xLocation = this.calculateLabelWidth(bar, null, reveresed);
                            let yLocation = bar.y + BulletChart.BulletSize / 2;

                            return 'translate(' + xLocation + ',' + yLocation + ')';
                        },
                    }).classed("axis", true).call(bar.axis.scale(bar.scale)).style({
                        'fill': model.bulletChartSettings.axis.axisColor,
                        'font-size': PixelConverter.fromPoint(BulletChart.AxisFontSizeInPt)
                    }).selectAll('line').style({
                        'stroke': model.bulletChartSettings.axis.axisColor,
                    });
                }
            }

            // Draw Labels
            if (model.bulletChartSettings.labelSettings.show) {
                barSelection.enter().append('text').classed("title", true).attr({
                    'x': ((d: BarData) => {
                        if (reveresed)
                            return BulletChart.XMarginHorizontal * 2 + model.viewportLength;
                        return d.x;
                    }),
                    'y': ((d: BarData) => d.y + this.baselineDelta),
                    'fill': model.bulletChartSettings.labelSettings.labelColor,
                    'font-size': PixelConverter.fromPoint(model.bulletChartSettings.labelSettings.fontSize),
                }).text((d: BarData) => d.categoryLabel);
            }

            let measureUnitsText = TextMeasurementService.getTailoredTextOrDefault(
                BulletChart.getTextProperties(model.bulletChartSettings.axis.measureUnits, BulletChart.DefaultSubtitleFontSizeInPt),
                BulletChart.MaxMeasureUnitWidth);

            // Draw measure label
            if (model.bulletChartSettings.axis.measureUnits) {
                barSelection.enter().append('text').attr({
                    'x': ((d: BarData) => {
                        if (reveresed)
                            return BulletChart.XMarginHorizontal * 2 + model.viewportLength + BulletChart.SubtitleMargin;
                        return d.x - BulletChart.SubtitleMargin;
                    }),
                    'y': ((d: BarData) => d.y + this.model.labelHeight / 2 + 12),
                    'fill': model.bulletChartSettings.axis.unitsColor,
                    'font-size': PixelConverter.fromPoint(BulletChart.DefaultSubtitleFontSizeInPt)
                }).text(measureUnitsText);
            }

            if (this.interactivityService) {
                let behaviorOptions: BulletBehaviorOptions = {
                    rects: bullets,
                    valueRects: valueSelection,
                    clearCatcher: this.clearCatcher,
                    interactivityService: this.interactivityService,
                    bulletChartSettings: this.model.bulletChartSettings,
                    hasHighlights: false,
                };

                let targetCollection = this.model.barRects.concat(this.model.valueRects);
                this.interactivityService.bind(targetCollection, this.behavior, behaviorOptions);
            }

            barSelection.exit();
            TooltipManager.addTooltip(valueSelection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
            TooltipManager.addTooltip(rectSelection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
        }

        private setUpBulletsVertically(bulletBody: D3.Selection, model: BulletChartModel, reveresed: boolean) {
            let bars = model.bars;
            let rects = model.barRects;
            let valueRects = model.valueRects;
            let targetValues = model.targetValues;
            let barSelection = this.labelGraphicsContext.selectAll('text').data(bars, (d: BarData) => d.key);
            let rectSelection = this.bulletGraphicsContext.selectAll('rect.range').data(rects, (d: BarRect) => d.key);

            let hasSelection: boolean = this.interactivityService && this.interactivityService.hasSelection();
            let hasHighlights: boolean = model.hasHighlights;

            // Draw bullets
            let bullets = rectSelection.enter().append('rect').attr({
                'x': ((d: BarRect) => bars[d.barIndex].x),
                'y': ((d: BarRect) => { return this.calculateLabelHeight(bars[d.barIndex], d, reveresed); }),
                'height': ((d: BarRect) => d.start - d.end),
                'width': BulletChart.BulletSize,
            }).classed('range', true).style({
                'fill': (d: BarRect) => d.fill,
                'opacity': (d: BarRect) => bulletChartUtils.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights),
            });

            rectSelection.exit();

            // Draw value rects
            let valueSelection = this.bulletGraphicsContext.selectAll('rect').data(valueRects, (d: BarValueRect) => d.key);
            valueSelection.enter().append('rect').attr({
                'x': ((d: BarValueRect) => bars[d.barIndex].x + BulletChart.BulletSize / 3),
                'y': ((d: BarValueRect) => { return this.calculateLabelHeight(bars[d.barIndex], d, reveresed); }),
                'height': ((d: BarValueRect) => d.start - d.end),
                'width': BulletChart.BulletSize * 1 / 4,
            }).classed('value', true).style({
                'fill': (d: BarValueRect) => d.fill,
                'opacity': (d: BarRect) => bulletChartUtils.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights),
            });

            valueSelection.exit();

            // Draw markers
            let markerSelection = this.bulletGraphicsContext.selectAll('values').data(targetValues, (d: TargetValue) => {
                if (!isNaN(d.value) && !isNaN(d.value2))
                    return d.key;
            });
            markerSelection.enter().append('line').attr({
                'x2': ((d: TargetValue) => bars[d.barIndex].x + (BulletChart.MarkerMarginVertical * 3)),
                'x1': ((d: TargetValue) => bars[d.barIndex].x + BulletChart.MarkerMarginVertical),
                'y2': ((d: TargetValue) => { return this.calculateLabelHeight(bars[d.barIndex], null, reveresed) + d.value; }),
                'y1': ((d: TargetValue) => { return this.calculateLabelHeight(bars[d.barIndex], null, reveresed) + d.value; }),
            }).style({
                'stroke': ((d: TargetValue) => d.fill),
                'stroke-width': 2,
            });

            if (model.bulletChartSettings.values.secondTargetVisibility) {
                this.drawSecondTarget(markerSelection.enter(),
                    (d: TargetValue) => bars[d.barIndex].x + BulletChart.BulletSize / 3 + BulletChart.BulletSize / 8,
                    (d: TargetValue) => this.calculateLabelHeight(bars[d.barIndex], null, reveresed) + d.value2);
            }

            markerSelection.exit();

            // // Draw axes
            if (model.bulletChartSettings.axis.axis) {

                // Using var instead of let since you can't pass let parameters to functions inside loops.
                // needs to be changed to let when typescript 1.8 comes out.
                for (var idx = 0; idx < bars.length; idx++) {
                    var bar = bars[idx];
                    this.bulletGraphicsContext.append("g").attr({
                        'transform': () => {
                            let xLocation = bar.x;
                            let yLocation = this.calculateLabelHeight(bar, null, reveresed);
                            // let yLocation = bar.y + BulletChart.BulletSize / 2;
                            return 'translate(' + xLocation + ',' + yLocation + ')';
                        },
                    }).classed("axis", true).call(bar.axis.scale(bar.scale)).style({
                        'fill': model.bulletChartSettings.axis.axisColor,
                        'font-size': PixelConverter.fromPoint(BulletChart.AxisFontSizeInPt),
                    }).selectAll('line').style({
                        'stroke': model.bulletChartSettings.axis.axisColor,
                    });
                }
            }

            let labelsStartPos = BulletChart.YMarginVertical + (reveresed ? model.viewportLength + 15 : 0) + this.model.labelHeightTop;

            // Draw Labels
            if (model.bulletChartSettings.labelSettings.show) {
                barSelection.enter().append('text').classed("title", true).attr({
                    'x': ((d: BarData) => d.x),
                    'y': ((d: BarData) => {
                        return labelsStartPos;
                    }),
                    'fill': model.bulletChartSettings.labelSettings.labelColor,
                    'font-size': PixelConverter.fromPoint(model.bulletChartSettings.labelSettings.fontSize),
                }).text((d: BarData) => d.categoryLabel);
            }

            let measureUnitsText = TextMeasurementService.getTailoredTextOrDefault(
                BulletChart.getTextProperties(model.bulletChartSettings.axis.measureUnits, BulletChart.DefaultSubtitleFontSizeInPt),
                BulletChart.MaxMeasureUnitWidth);

            // Draw measure label
            if (model.bulletChartSettings.axis.measureUnits) {
                barSelection.enter().append('text').attr({
                    'x': ((d: BarData) => d.x + BulletChart.BulletSize),
                    'y': ((d: BarData) => {
                        return labelsStartPos + BulletChart.SubtitleMargin + 12;
                    }),
                    'fill': model.bulletChartSettings.axis.unitsColor,
                    'font-size': PixelConverter.fromPoint(BulletChart.DefaultSubtitleFontSizeInPt)
                }).text(measureUnitsText);
            }

            if (this.interactivityService) {
                let behaviorOptions: BulletBehaviorOptions = {
                    rects: bullets,
                    valueRects: valueSelection,
                    clearCatcher: this.clearCatcher,
                    interactivityService: this.interactivityService,
                    bulletChartSettings: this.model.bulletChartSettings,
                    hasHighlights: false,
                };

                let targetCollection = this.model.barRects.concat(this.model.valueRects);
                this.interactivityService.bind(targetCollection, this.behavior, behaviorOptions);
            }

            barSelection.exit();
            TooltipManager.addTooltip(valueSelection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
            TooltipManager.addTooltip(rectSelection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);
        }

        private drawSecondTarget(
            selection: D3.EnterSelection,
            getX: (d: TargetValue) => number,
            getY: (d: TargetValue) => number): void {

            let targetStyle = {
                'stroke': ((d: TargetValue) => d.fill),
                'stroke-width': 2
            };

            selection.append('line').attr({
                'x1': ((d: TargetValue) => getX(d) - BulletChart.SecondTargetLineSize),
                'y1': ((d: TargetValue) => getY(d) - BulletChart.SecondTargetLineSize),
                'x2': ((d: TargetValue) => getX(d) + BulletChart.SecondTargetLineSize),
                'y2': ((d: TargetValue) => getY(d) + BulletChart.SecondTargetLineSize),
            }).style(targetStyle);

            selection.append('line').attr({
                'x1': ((d: TargetValue) => getX(d) + BulletChart.SecondTargetLineSize),
                'y1': ((d: TargetValue) => getY(d) - BulletChart.SecondTargetLineSize),
                'x2': ((d: TargetValue) => getX(d) - BulletChart.SecondTargetLineSize),
                'y2': ((d: TargetValue) => getY(d) + BulletChart.SecondTargetLineSize),
            }).style(targetStyle);
        }

        /*About to remove your visual, do clean up here */
        public destroy() { }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let data = this.model;
            if (!data) {
                return;
            }

            let objectName = options.objectName;
            switch (objectName) {
                case 'labels':
                    return this.enumerateLabels(data);
                case 'values':
                    return this.enumerateValues(data);
                case 'orientation':
                    return this.enumerateOrientation(data);
                case 'axis':
                    return this.enumerateAxis(data);
                case 'colors':
                    return this.enumerateColors(data);
            }
        }

        private enumerateLabels(data: BulletChartModel): VisualObjectInstance[] {
            return [{
                selector: null,
                objectName: 'labels',
                properties: {
                    show: this.model.bulletChartSettings.labelSettings.show,
                    labelColor: this.model.bulletChartSettings.labelSettings.labelColor,
                    fontSize: this.model.bulletChartSettings.labelSettings.fontSize,
                }
            }];
        }

        private enumerateValues(data: BulletChartModel): VisualObjectInstance[] {
            return [{
                selector: null,
                objectName: 'values',
                properties: {
                    targetValue: this.model.bulletChartSettings.values.targetValue,
                    targetValue2: this.model.bulletChartSettings.values.targetValue2,
                    secondTargetVisibility: this.model.bulletChartSettings.values.secondTargetVisibility,
                    minimumPercent: this.model.bulletChartSettings.values.minimumPercent,
                    needsImprovementPercent: this.model.bulletChartSettings.values.needsImprovementPercent,
                    satisfactoryPercent: this.model.bulletChartSettings.values.satisfactoryPercent,
                    goodPercent: this.model.bulletChartSettings.values.goodPercent,
                    veryGoodPercent: this.model.bulletChartSettings.values.veryGoodPercent,
                    maximumPercent: this.model.bulletChartSettings.values.maximumPercent,
                }
            }];
        }

        private enumerateOrientation(data: BulletChartModel): VisualObjectInstance[] {
            return [{
                selector: null,
                objectName: 'orientation',
                properties: {
                    orientation: this.model.bulletChartSettings.orientation.orientation
                }
            }];
        }

        private enumerateAxis(data: BulletChartModel): VisualObjectInstance[] {
            return [{
                selector: null,
                objectName: 'axis',
                properties: {
                    axis: this.model.bulletChartSettings.axis.axis,
                    axisColor: this.model.bulletChartSettings.axis.axisColor,
                    measureUnits: this.model.bulletChartSettings.axis.measureUnits,
                    unitsColor: this.model.bulletChartSettings.axis.unitsColor,
                }
            }];
        }

        private enumerateColors(data: BulletChartModel): VisualObjectInstance[] {
            return [{
                selector: null,
                objectName: 'colors',
                properties: {
                    badColor: this.model.bulletChartSettings.colors.badColor,
                    needsImprovementColor: this.model.bulletChartSettings.colors.needsImprovementColor,
                    satisfactoryColor: this.model.bulletChartSettings.colors.satisfactoryColor,
                    goodColor: this.model.bulletChartSettings.colors.goodColor,
                    veryGoodColor: this.model.bulletChartSettings.colors.veryGoodColor,
                    bulletColor: this.model.bulletChartSettings.colors.bulletColor,
                }
            }];
        }
    }

    //TODO: This module should be removed once TextMeasruementService exports the "estimateSvgTextBaselineDelta" function.
    export module TextMeasurementHelper {

        interface CanvasContext {
            font: string;
            measureText(text: string): { width: number };
        }

        interface CanvasElement extends HTMLElement {
            getContext(name: string);
        }

        let spanElement: JQuery;
        let svgTextElement: D3.Selection;
        let canvasCtx: CanvasContext;

        export function estimateSvgTextBaselineDelta(textProperties: TextProperties): number {
            let rect = estimateSvgTextRect(textProperties);
            return rect.y + rect.height;
        }

        function ensureDOM(): void {
            if (spanElement)
                return;

            spanElement = $('<span/>');
            $('body').append(spanElement);
            //The style hides the svg element from the canvas, preventing canvas from scrolling down to show svg black square.
            svgTextElement = d3.select($('body').get(0))
                .append('svg')
                .style({
                    'height': '0px',
                    'width': '0px',
                    'position': 'absolute'
                })
                .append('text');
            canvasCtx = (<CanvasElement>$('<canvas/>').get(0)).getContext("2d");
        }

        function measureSvgTextRect(textProperties: TextProperties): SVGRect {
            debug.assertValue(textProperties, 'textProperties');

            ensureDOM();

            svgTextElement.style(null);
            svgTextElement
                .text(textProperties.text)
                .attr({
                    'visibility': 'hidden',
                    'font-family': textProperties.fontFamily,
                    'font-size': textProperties.fontSize,
                    'font-weight': textProperties.fontWeight,
                    'font-style': textProperties.fontStyle,
                    'white-space': textProperties.whiteSpace || 'nowrap'
                });

            // We're expecting the browser to give a synchronous measurement here
            // We're using SVGTextElement because it works across all browsers 
            return svgTextElement.node<SVGTextElement>().getBBox();
        }

        function estimateSvgTextRect(textProperties: TextProperties): SVGRect {
            debug.assertValue(textProperties, 'textProperties');

            let estimatedTextProperties: TextProperties = {
                fontFamily: textProperties.fontFamily,
                fontSize: textProperties.fontSize,
                text: "M",
            };

            let rect = measureSvgTextRect(estimatedTextProperties);

            return rect;
        }
    }

    export interface BulletBehaviorOptions {
        rects: D3.Selection;
        valueRects: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
        bulletChartSettings: BulletChartSettings;
        hasHighlights: boolean;
    }

    export class BulletWebBehavior implements IInteractiveBehavior {
        private options: BulletBehaviorOptions;

        public bindEvents(options: BulletBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.options = options;
            let clearCatcher = options.clearCatcher;

            options.valueRects.on('click', (d: BarValueRect, i: number) => {
                d3.event.stopPropagation();
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            });

            options.rects.on('click', (d: BarRect, i: number) => {
                d3.event.stopPropagation();
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            });

            clearCatcher.on('click', () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            let options = this.options;
            let hasHighlights = options.hasHighlights;

            options.valueRects.style("opacity", (d: BarValueRect) =>
                bulletChartUtils.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights));

            options.rects.style("opacity", (d: BarRect) =>
                bulletChartUtils.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights));
        }
    }

    export module bulletChartUtils {
        export var DimmedOpacity: number = 0.4;
        export var DefaultOpacity: number = 1.0;

        export function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number {
            if ((hasPartialHighlights && !highlight) || (hasSelection && !selected))
                return DimmedOpacity;
            return DefaultOpacity;
        }
    }
}
