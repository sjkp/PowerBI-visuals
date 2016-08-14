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

/// <reference path="../../_references.ts"/>

module powerbitests {

    import FilledMapLabelLayout = powerbi.FilledMapLabelLayout;
    import PolygonLabelPosition = powerbi.NewPointLabelPosition;
    import LabelParentPolygon = powerbi.LabelParentPolygon;
    import IRect = powerbi.visuals.IRect;
    import LabelDataPoint = powerbi.LabelDataPoint;
    import Polygon = powerbi.visuals.shapes.Polygon;
    import Rect = powerbi.visuals.shapes.Rect;
    import Transform = powerbi.visuals.Transform;
    import dataLabelsSettings = powerbi.visuals.PointDataLabelsSettings;
    import TextProperties = powerbi.TextProperties;
    import NewDataLabelUtils = powerbi.visuals.NewDataLabelUtils;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import LabelDataPointParentType = powerbi.LabelDataPointParentType;
    import FilledMapLabel = powerbi.FilledMapLabel;
    import IPoint = powerbi.visuals.IPoint;

    let testOutsideFillColor = "#000000";
    let testInsideFillColor = "#FFFFFF";

    describe("filledMapLabelLayoutTests tests", () => {

        let filledMapLabelLayout: FilledMapLabelLayout;
        let viewport = { width: 1248, height: 651 };
        let polygonStringPath = "144879.87206044444 199013.72328370204 151791.03647644442 199012.13279094332 151825.87250133333 198936.56205369835 151877.9809031111 " +
            "198875.08830404375 151929.94366933333 198836.3206857566 152004.85859911112 198803.83800275822 152079.6424568889 198790.52402039967 152158.314784 198793.9000592409 " +
            "152236.8560391111 198816.33521814167 152313.4749048889 198860.45464591653 152423.09478755554 198775.84292374656 152525.4183288889 198771.06267465994 152598.978848 " +
            "198747.0639311674 152643.5724551111 198711.14292120305 152706.00641777777 198704.27258656378 152729.96346666667 198660.63179785977 152719.23012622222 198591.3725313283 " +
            "152730.4731911111 198560.34867049532 152812.75728 198521.525162979 152857.62759466667 198466.12978885724 152901.9153671111 198444.0715154108 " +
            "152949.65470222224 198395.81547600028 153007.80697955555 198358.7505604363 153117.80551466666 198327.4235860436 153129.7185031111 198307.6071730258 " +
            "153156.42806399998 198289.044382894 153176.54033422223 198243.56858580053 153232.44982399998 198255.71988060133 153265.43627733333 198231.28281021243 " +
            "153295.43720177776 198227.35873544624 153321.31663999998 198201.06817606132 153322.103072 198178.14530857146 153300.65095466666 198146.67929859663 153273.88313955555 " +
            "198130.1522892202 153250.34843377778 198073.902692257 153150.8939128889 198011.88535863013 153104.21771733332 197916.3115905186 153074.5371911111 197887.55116436016 " +
            "153043.7643982222 197876.33935404656 153004.76319644443 197839.39269206097 152985.72862933332 197768.56457142188 152966.22802844443 197725.5632664037 152923.19272177777 " +
            "197702.07761146262 152874.27373866667 197713.64884825825 152831.96660977777 197686.16307103666 152814.63597866666 197615.0974658779 152828.07814044444 197560.76721890335 " +
            "152818.20404977776 197450.48546038402 152772.79488355556 197402.06719819363 152748.51743644444 197390.75547055143 152711.58425955556 197386.69067398476 152676.76279822222 " +
            "197408.22112605796 152651.16006755555 197401.66459449564 152636.15960533332 197386.2688480969 152641.37335822222 197359.74855394667 152637.9946133333 197334.27777298898 " +
            "152624.02816355554 197307.57405175242 152643.49963733333 197293.3758429124 152638.25675733332 197261.75039441086 152625.717536 197247.60469098037 152660.20403555554 " +
            "197193.2914057934 152631.07692444444 197183.47838363764 152620.47465599998 197162.00617320024 152652.49991466667 197088.53551166537 152632.18375466668 197057.628335556 " +
            "152633.47991111112 197044.7673651058 152656.27187555554 197029.59783092403 152669.74316444446 196997.38784321552 152721.88069333334 197005.71514362044 152738.3666382222 " +
            "196981.59717581255 152759.23621333332 196973.1144157852 152771.20745599997 196956.24339773264 152773.31917155554 196937.86934326656 152795.95093688887 196907.0026760305 " +
            "152777.6591111111 196881.7495768101 152777.629984 196865.4055402264 152823.0391502222 196862.97974506163 152826.21400533334 196846.883618241 152843.93785244445 " +
            "196826.97244072054 152807.45614577777 196773.07727660515 152802.50453688888 196736.00390115724 152776.87267911108 196714.30210798155 152746.09988622222 " +
            "196659.95430896676 152742.41530666666 196630.38969873544 152721.34184177776 196622.50078493543 152727.2546453333 196587.29368005082 152789.033248 " +
            "196540.53515779035 152814.72336 196534.37788484208 152877.97288177776 196493.95251821983 152899.8182151111 196440.8239960836 152960.09677155555 196404.9289066251 " +
            "152966.19890133332 196389.54771132968 152960.88320355554 196383.2285144171 152940.1155733333 196397.7216187265 152929.58612266666 196395.96321026393 " +
            "152942.8098311111 196362.548820818 153027.49690666667 196304.8791274562 153055.09484444442 196269.5258383946 153062.02709688887 196248.82759922426 153085.03751466665 " +
            "196228.02923543914 153122.30565333334 196145.09204915608 153110.90238933332 196125.26424506764 153121.41727644444 196097.04686932848 153139.05374222223 " +
            "196082.38374508935 153166.97207822223 196011.8142759236 153219.64845866666 195969.45756321467 153217.65325155554 195947.85696081643 153256.94572444443 " +
            "195935.19349077513 153276.67934222223 195899.69798225805 153321.054496 195899.3099981021 153360.84212977777 195877.85261874957 153369.6093902222 195869.23759992985 " +
            "153366.8860053333 195858.17691676927 153343.26391822222 195836.9648608046 153329.7343751111 195808.13947466557 153303.86950044445 195800.25744847112 153294.88378666667 " +
            "195785.22975851013 153304.1753351111 195748.449022523 153297.47609955556 195735.2799214237 153269.25192888887 195750.25529640104 153249.29985777778 195744.58389796494 " +
            "153224.94959288888 195753.77065849234 153215.52697244444 195749.76974144933 153207.3859448889 195721.6820612484 153197.11863822222 195712.18211451865 153164.01567644443 " +
            "195736.79502076068 153124.9270933333 195709.98672847886 153074.4061191111 195720.8078629264 153068.68264177776 195714.61059436435 153077.65379199997 195688.0501967227 " +
            "153053.74043377777 195677.32341673732 153044.44888533332 195647.95612845826 153008.98662755557 195633.51291924535 152978.301216 195646.94535209 152941.25153066666 " +
            "195636.66218543367 152940.34859022222 195587.9369445385 152912.63414399998 195584.94204103196 152914.32351644442 195558.08196209 152882.13805866666 195534.60144164064 " +
            "152881.91960533333 195523.39461163623 152894.5025173333 195513.9964482727 152889.8567431111 195498.83726859116 152808.97075555555 195392.96397636295 152830.07334755556 " +
            "195386.55576123195 152831.67533866665 195371.848743127 152853.56436266666 195370.71886125716 152846.29714844443 195290.54923096654 152831.45688533332 195267.72056014295 " +
            "152843.1951111111 195250.0357210536 152841.3892302222 195235.99526476662 152817.46130844444 195194.6643019697 152822.23815466667 195186.6266859799 152844.98642844445 " +
            "195186.11944050534 152839.9183111111 195109.05281885294 152828.44222933333 195085.35150211386 152809.18920888889 195072.42517138156 152777.32414933335 195077.85361170128 " +
            "152765.2800888889 195066.13725938916 152769.54721066667 195040.35742564185 152782.56702933332 195023.20699055865 152806.18911644444 195018.87017584877 152812.3931911111 " +
            "194988.8013691284 152786.9652231111 194993.6277136385 152752.6534862222 194971.6438684184 152752.6534862222 194933.92036146 152746.72611911112 194926.84349358265 " +
            "152726.94881066665 194928.2510793137 152712.6765262222 194914.44823529435 152680.505632 194917.90886476584 152666.85958044443 194875.29930505482 152658.29620977776 " +
            "194877.82225798623 152647.94152177777 194899.43151335552 152620.59116444443 194880.13003080897 152604.70232533332 194884.54988356365 152592.54175644444 194904.08532574144 " +
            "152565.61374222222 194885.13657793443 152541.32173155554 194894.5037585068 152533.19526755557 194881.3425723391 152542.5159431111 194868.3755912308 152539.41390577776 " +
            "194854.82043097983 152522.7823253333 194846.01759158354 152520.14632177778 194827.960049461 152528.50580266665 194808.25615700232 152515.29665777777 194778.62598413276 " +
            "152511.27711644443 194744.6228642636 152496.85919644445 194737.4373700444 152489.41721955553 194713.92009528104 152479.00427733333 194716.6617209905 152478.1595911111 " +
            "194726.8052125441 152454.78508444442 194715.2909156634 152440.1487111111 194687.94999614742 152419.48302577776 194678.23430146716 152426.13857066666 194656.2340756726 " +
            "152421.02676266665 194639.01124489633 152394.9871253333 194626.39141549094 145983.03226666665 194627.4692458285 145982.85750399999 193641.67142074497 145720.49505066665 " +
            "193746.27912016035 145519.22671288886 193850.30539250904 144878.98368355556 193982.41676200583 144879.87206044444 199013.72328370204";

        let polygonPath = convertStringToFloatArray(polygonStringPath);

        let transform = getTransform();
        beforeEach(() => {
            filledMapLabelLayout = new FilledMapLabelLayout();
        });

        it("Label is correctly laid out", () => {

            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];

            let labels = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            expect(labels.length).toBe(1);
            expect(labels[0].boundingBox.left).toBeCloseTo(603.4723273724817,3);
            expect(labels[0].boundingBox.top).toBeCloseTo(319.6871085538696,3);
            expect(labels[0].boundingBox.width).toBe(40);
            expect(labels[0].boundingBox.height).toBe(10);
            expect(labels[0].isVisible).toBe(true);
        });

        it("Label has correct text", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];
            let labels = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            expect(labels[0].text).toBe("text");
        });

        it("Label uses inside fill color", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];
            let labels = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            expect(labels[0].fill).toBe(testInsideFillColor);
        });

        it("Polygon has the correct centroid", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];
            filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);

            let centroid: any = {
                x: 148781.8289518388,
                y: 196749.2354017094,
            };
            expect((<LabelParentPolygon>labelDataPoints[0].parentShape).polygon.absoluteCentroid()).toEqual(centroid);
        });

        it("check if polygon has label", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];
            let labels = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            expect(labels.length).toBe(1);
        });

        it("check if polygon contains the label", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];

            filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);

            let rect: IRect = {
                height: 12,
                left: 588.6197862146846,
                top: 315.62123733746876,
                width: 50.953125,
            };
            let inverseTransorm = transform.getInverse();
            let absoluteLabelRect = inverseTransorm.applyToRect(rect);
            let isFit = (<LabelParentPolygon>labelDataPoints[0].parentShape).polygon.contains(absoluteLabelRect);

            expect(isFit).toBe(true);
        });

        it("Polygon has the correct absoluteBoundingRect", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];

            filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);

            let absoluteBoundingRect: any = {
                left: 144878.98368355556,
                top: 193641.67142074497,
                width: 8490.625706666644,
                height: 5372.051862957072,
            };

            expect((<LabelParentPolygon>labelDataPoints[0].parentShape).polygon.absoluteBoundingRect()).toEqual(absoluteBoundingRect);
        });

        it("check if label is is in a conflict with polygon", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];

            filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);

            let polygon = (<LabelParentPolygon>labelDataPoints[0].parentShape).polygon;
            let rect: IRect = {
                height: polygon.absoluteCentroid().y + 10,
                left: polygon.absoluteCentroid().x + 20,
                top: polygon.absoluteCentroid().y + 10,
                width: polygon.absoluteCentroid().x + 20,
            };
            let isInConflict = polygon.conflicts(rect);

            expect(isInConflict).toBe(true);
        });

        xit("check boundingbox size by label", () => {

            let labelSettings: dataLabelsSettings = dataLabelUtils.getDefaultMapLabelSettings();;

            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let labelDataPoints = [
                createLabelDataPoint("text", parentShape)
            ];

            labelDataPoints[0].text = "text";
            let firstRowProperties: TextProperties = {
                text: labelDataPoints[0].text,
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            };
            let FirstTextwidth = TextMeasurementService.measureSvgTextWidth(firstRowProperties);
            let FirstTextHeight = TextMeasurementService.estimateSvgTextHeight(firstRowProperties);
            labelDataPoints[0].textSize.width = FirstTextwidth;
            labelDataPoints[0].textSize.height = FirstTextHeight;

            let label = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            let firstRect: IRect = {
                left: 614.4723273724817,
                top: 317.1871085538696,
                width: 18,
                height: 15,
            };
            expect(label[0].boundingBox).toEqual(firstRect);
            
            //second round
            labelDataPoints[0].secondRowText = "catagory text";
            let secondRowProperties = {
                text: labelDataPoints[0].secondRowText,
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            };
            let SecondTextwidth = TextMeasurementService.measureSvgTextWidth(secondRowProperties);

            labelDataPoints[0].text = "text";
            firstRowProperties = {
                text: labelDataPoints[0].text,
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            };
            FirstTextwidth = TextMeasurementService.measureSvgTextWidth(firstRowProperties);
            FirstTextHeight = TextMeasurementService.estimateSvgTextHeight(firstRowProperties);

            labelDataPoints[0].textSize.width = Math.max(FirstTextwidth, SecondTextwidth);
            labelDataPoints[0].textSize.height = FirstTextHeight * 2;

            labelSettings.show = true;
            labelSettings.showCategory = true;

            label = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            let secondRect: IRect = {
                left: 589.9723273724817,
                top: 309.6871085538696,
                width: 67,
                height: 30,
            };
            expect(label[0].boundingBox).toEqual(secondRect);
        });

        describe("DataLabelPointPositioner tests", () => {
            let offset = 5;
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center],
            };

            let pointLabelDataPoint = createLabelDataPoint("text", parentShape);
            let polygon = (<LabelParentPolygon>pointLabelDataPoint.parentShape).polygon;

            it("Above positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.Above];
                expect(filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.Above, polygon.absoluteCentroid(), offset)).toEqual(createRect(148761.8289518388, 196734.2354017094, 40, 10));
            });

            it("Below positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.Below];
                expect(filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.Below, polygon.absoluteCentroid(), offset)).toEqual(createRect(148761.8289518388, 196754.2354017094, 40, 10));
            });

            it("Left positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.Left];
                expect(filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.Left, polygon.absoluteCentroid(), offset)).toEqual(createRect(148736.8289518388, 196744.2354017094, 40, 10));
            });

            it("Right positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.Right];
                expect(filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.Right, polygon.absoluteCentroid(), offset)).toEqual(createRect(148786.8289518388, 196744.2354017094, 40, 10));
            });

            it("Center positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.Center];
                expect(filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.Center, polygon.absoluteCentroid(), offset)).toEqual(createRect(148761.8289518388, 196744.2354017094, 40, 10));
            });

            it("Above Left positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.AboveLeft];
                let labelRect = filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.AboveLeft, polygon.absoluteCentroid(), offset);
                expect(labelRect.left).toBe(148737.57443421613);
                expect(labelRect.top).toBe(196736.6087917653);
                expect(labelRect.width).toBe(40);
                expect(labelRect.height).toBe(10);
            });

            it("Below Left positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.BelowLeft];
                let labelRect = filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.BelowLeft, polygon.absoluteCentroid(), offset);
                expect(labelRect.left).toBe(148737.57443421613);
                expect(labelRect.top).toBe(196751.8620116535);
                expect(labelRect.width).toBe(40);
                expect(labelRect.height).toBe(10);
            });

            it("Above Right positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.AboveRight];
                let labelRect = filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.AboveRight, polygon.absoluteCentroid(), offset);
                expect(labelRect.left).toBe(148786.08346946148);
                expect(labelRect.top).toBe(196736.6087917653);
                expect(labelRect.width).toBe(40);
                expect(labelRect.height).toBe(10);
            });

            it("Below Right positioning", () => {
                parentShape.validPositions = [PolygonLabelPosition.BelowRight];
                let labelRect = filledMapLabelLayout.getLabelPolygon(pointLabelDataPoint, PolygonLabelPosition.BelowRight, polygon.absoluteCentroid(), offset);
                expect(labelRect.left).toBe(148786.08346946148);
                expect(labelRect.top).toBe(196751.8620116535);
                expect(labelRect.width).toBe(40);
                expect(labelRect.height).toBe(10);
            });
        });

        it("Labels do not redraw during pan or zoom but do move", () => {
            let parentShape: LabelParentPolygon = {
                polygon: new Polygon(polygonPath),
                validPositions: [PolygonLabelPosition.Center, PolygonLabelPosition.Above, PolygonLabelPosition.Below,
                    PolygonLabelPosition.Left, PolygonLabelPosition.Right, PolygonLabelPosition.AboveLeft,
                    PolygonLabelPosition.AboveRight, PolygonLabelPosition.BelowLeft, PolygonLabelPosition.BelowRight],
            };

            let labelDataPoints = [
                createLabelDataPoint("text to enusure label doesn't fit", parentShape)
            ];

            let prelabels = filledMapLabelLayout.layout(labelDataPoints, viewport, transform, true);
            let prelabelsAbsoluteBoundingBoxCenter: IPoint = {
                x: (<FilledMapLabel>prelabels[0]).absoluteBoundingBoxCenter.x,
                y: (<FilledMapLabel>prelabels[0]).absoluteBoundingBoxCenter.y
            };
            let prelabelsBoundingBox: IRect = Rect.clone((<FilledMapLabel>prelabels[0]).boundingBox);

            let alternateTransform = getAlternateTransform();
            let postlabels = filledMapLabelLayout.layout(labelDataPoints, viewport, alternateTransform, false);

            expect(prelabelsAbsoluteBoundingBoxCenter).toEqual((<FilledMapLabel>postlabels[0]).absoluteBoundingBoxCenter);
            expect(prelabelsBoundingBox).not.toEqual((<FilledMapLabel>postlabels[0]).boundingBox);
        });
    });

    function convertStringToFloatArray(path: string): Float64Array {
        let stringArray = path.split(" ");
        let f64s = new Float64Array(stringArray.length);

        for (let i: number = 0; i < stringArray.length; i++) {
            f64s[i] = parseFloat(stringArray[i]);
        }
        return f64s;
    }

    function createLabelDataPoint(text: string, parentShape: LabelParentPolygon): LabelDataPoint {
        return {
            text: text,
            secondRowText: "category" + text,
            textSize: { width: text.length * 10, height: 10 },
            isPreferred: true,
            insideFill: testInsideFillColor,
            outsideFill: testOutsideFillColor,
            parentShape: parentShape,
            parentType: LabelDataPointParentType.Polygon,
            identity: undefined,
        };
    }

    function getTransform(): Transform {
        let base: any = {
            height: 109890.95309252565,
            left: 174763.16666666666,
            top: 152253.54690747435,
            width: 87381.33333333334,
        };
        let current: any = {
            height: 1717.0461420707134,
            left: 1029.4307291666669,
            top: -370.55802416855295,
            width: 1365.333333333333,
        };

        let transform = new Transform();
        transform.translate(current.left, current.top);
        transform.scale((current.width / base.width), (current.height / base.height));
        transform.translate(-base.left, -base.top);
        return transform;
    }

    function getAlternateTransform(): Transform {
        let base: any = {
            height: 109890.95309252565,
            left: 174763.16666666666,
            top: 152253.54690747435,
            width: 87381.33333333334,
        };
        let current: any = {
            height: 1717.0461420707134,
            left: 1050.4307291666669,
            top: -370.55802416855295,
            width: 1365.333333333333,
        };

        let transform = new Transform();
        transform.translate(current.left, current.top);
        transform.scale((current.width / base.width), (current.height / base.height));
        transform.translate(-base.left, -base.top);
        return transform;
    }

    function createRect(left: number, top: number, width: number, height: number): IRect {
        return {
            left: left,
            top: top,
            width: width,
            height: height,
        };
    }
}
