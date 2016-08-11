
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var path = require("path");
var gutils = require("gulp-util");
var ConcatDtsPlugin = require("./build/webpack/ConcatDtsPlugin.js");
var SkipUnchangedAssetsPlugin = require("./build/webpack/SkipUnchangedAssetsPlugin.js");
var globEntries = require('./build/webpack/relativeGlobEntries');
var progressHandler = require("./build/webpack/progressHandler.js");
var SpritesmithPlugin = require('webpack-spritesmith');

var options = require('./build/options');

var DEBUG = true;
var optionalPlugins = [];
var buildEntries = {};

var testFolder = "tests";

//TODO: join this logic with the same one in Tests/webpack.config.js
if (!options.buildWithoutTests) {
    // generate separate entry for every test file
    buildEntries = globEntries('./**/*Tests.ts', path.join(__dirname, "./src/Clients/PowerBIVisualsTests"), testFolder);

    // add externals, helpers and utils
    buildEntries[path.join(testFolder, "testsInfra")] = path.join(__dirname, './src/Clients/PowerBIVisualsTests/testsInfra.ts');
}

buildEntries["DataViewCreator"] = ["./src/Clients/DataViewCreator/module.ts"];
buildEntries["CustomVisuals"] = ['./src/Clients/CustomVisuals/module.ts'];
buildEntries["VisualsCommon"] = ['./src/Clients/VisualsCommon/module.ts'];
buildEntries["VisualsData"] = ['./src/Clients/VisualsData/module.ts'];
buildEntries["VisualsExtensibility"] = ['./src/Clients/VisualsExtensibility/module.ts'];
buildEntries["Visuals"] = ['./src/Clients/Visuals/module.ts'];
buildEntries["PowerBIVisualsPlayground"] = ['./src/Clients/PowerBIVisualsPlayground/module.ts'];
buildEntries["VisualsContracts"] = ['./src/Clients/VisualsContracts/module.ts'];
buildEntries["powerbi-visuals"] = [
    './src/Clients/VisualsContracts/module.ts',
    './src/Clients/VisualsCommon/module.ts',
    './src/Clients/VisualsData/module.ts',
    './src/Clients/VisualsExtensibility/module.ts',
    './src/Clients/Visuals/module.ts',
];

if (!DEBUG) {
    optionalPlugins.push(new webpack.optimize.UglifyJsPlugin({
        // include: /\.min\.js$/,
        minimize: true,
        compress: {
            warnings: false
        },
        sourceMap: true
    }));
}

if (!options.noProgress) {
    optionalPlugins.push(new webpack.ProgressPlugin(progressHandler));
}

var TSFilesPattern = /.*(([^d])|([^\.]d))\.ts$/i;

module.exports = {
    debug: DEBUG,
    devtool: '#cheap-module-source-map', // map producing: http://webpack.github.io/docs/configuration.html#devtool
    cache: true,
    entry: buildEntries,
    output: {
        filename: DEBUG ? '[name].js' : '[name].min.js',
        // filename: '[name].js',
        path: path.resolve(__dirname, "lib"),
        sourceMapFilename: "[file].map",
        chunkFilename: "[id].[chunkhash].chunk.js",
        // publicPath: "/assets/"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.svg']
    },
    resolveLoader: {
        modulesDirectories: ["./build/webpack/", "node_modules"]
    },
    module: {
        // enable tslinting 
        preLoaders: [
            { test: TSFilesPattern, loader: "tslint", exclude: /node_modules/ }
        ],        
        loaders: [
            {
                test: TSFilesPattern, loader: 'imports', exclude: /node_modules/,
                query: {
                    jsCommon: ">window.jsCommon",
                    powerbi: ">window.powerbi",
                    powerbitests: ">window.powerbitests",
                    InJs: ">window.InJs",
                    debug: ">window.debug",
                    jasmine: ">window.jasmine",
                    Microsoft: ">window.Microsoft"
                }
            },
            {
                test: TSFilesPattern, loader: 'ts-loader', exclude: /node_modules/,
            },
            {
                test: /.*\.d\.ts$/i, loader: "FileToAssetLoader", exclude: /node_modules/,
            },
            {
                test: /(\.less$)|(\.css$)/,
                loader: ExtractTextPlugin.extract("css-loader?-url&sourceMap!less-loader?relativeUrls&noIeCompat")
            },
            // { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file?name=generated/[name].[ext]' },
        ],
    },
    tslint: {
        emitErrors: true,
        configuration: require("./build/tsLint/tslint.json"),
        rulesDirectory: path.join(__dirname, "build/tsLint/custom_rules"),
    },
    ts: {
        configFileName: 'tsconfig_.json', // wrong name in order to do not load tsconfig files at all
        compilerOptions: {
            target: "ES5",
            module: "commonjs",
            sourceMap: true, // this option enables inlining .ts sources into .map files
            declaration: true,
            experimentalDecorators: true // PowerBIVisualsTests/extensibility/decorators/VisualPluginTests.ts uses decorator 
        },
        silent: true
    },
    stats: {
        // see supported StatsOptions: https://github.com/shama/webpack-stream/blob/d2276e9b14bdb719a5085041bfadc189dc72ce3a/index.js#L10
        colors: true,
        // produced assets info is useful in watch mode only
        assets: false,
        assetsByChunkName: false,
        cached: false,
        cachedAssets: false,
        hash: false,
        timings: false,
        version: false,
        children: false,
        chunkModules: false,
        modules: false,
        chunks: false,
    },
    plugins: [
        new ConcatDtsPlugin(
            {
                chunks: [
                    "DataViewCreator",
                    "CustomVisuals",
                    "VisualsCommon",
                    "VisualsData",
                    "VisualsExtensibility",
                    "Visuals",
                    "VisualsContracts",
                    "powerbi-visuals",
                ],
                // remove reference tags 
                // TODO: remove copyrights
                transformation: function (dtsFileBuffer) {
                    return new Buffer(dtsFileBuffer.toString().replace(/\/\/\/\s*<reference path.*\/>\s/g, ""), "utf8");
                }
            }
        ),
        new ExtractTextPlugin("[name].css"),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/Clients/Visuals/images'),
                glob: './sprite-src/*.png'
            },
            target: {
                // image: path.resolve(__dirname, 'src/Clients/Visuals/images/visuals.sprites.png'),
                image: path.resolve(__dirname, 'lib/images/visuals.sprites.png'),
                css: path.resolve(__dirname, 'src/Clients/Visuals/styles/sprites.less')
            },
            apiOptions: {
                cssImageRef: "../images/visuals.sprites.png"
            }
        }),
        new SkipUnchangedAssetsPlugin()
    ].concat(optionalPlugins)
}