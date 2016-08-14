var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var path = require("path");
var gutils = require("gulp-util");
var SpritesmithPlugin = require('webpack-spritesmith');
var globEntries = require('../../../build/webpack/relativeGlobEntries');
var progressHandler = require('../../../build/webpack/progressHandler');

var options = require('../../../build/options');

// generate separate entry for every test file
var buildEntries = globEntries('./**/*Tests.ts', __dirname);

// add externals, helpers and utils
buildEntries["testsInfra"] = path.join(__dirname, './testsInfra.ts');

var DEBUG = false;

var plugins = [];

if (!options.noProgress) {
    plugins.push(new webpack.ProgressPlugin(progressHandler));
}

module.exports = {
    debug: DEBUG,
    devtool: 'source-map-inline',
    cache: true,
    entry: buildEntries,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../../../lib/tests'),
        sourceMapFilename: '[file].map'
    },
    //  externals: [{ externals: "./lib/powerbi-visuals-externals.min.js"}],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.svg']
    },
    module: {
        // enable tslinting 
        // TODO: add config to switch on/off linting
        preLoaders: [
            { test: /\.ts$/, loader: "tslint" }
        ],
        loaders: [
            {
                test: /\.ts$/, loader: 'imports', exclude: /node_modules/,
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
                test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/
            }
        ]
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
    tslint: {
        emitErrors: true,
        configuration: require("../../../build/tsLint/tslint.json"),
        rulesDirectory: path.join(__dirname, "../../../build/tsLint/custom_rules")
    },
    ts: {
        configFileName: 'tsconfig_.json', // wrong name in order to do not load tsconfig files at all
        compilerOptions: {
            target: "ES5",
            module: "commonjs",
            sourceMap: true, // this option enables inlining .ts sources into .map files
            experimentalDecorators: true // PowerBIVisualsTests/extensibility/decorators/VisualPluginTests.ts uses decorator 

        },
        silent: true
    },
    plugins: plugins
};
