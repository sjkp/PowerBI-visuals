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
var gulp = require("gulp"),
    express = require("express"),
    open = require("gulp-open"),
    consume = require('stream-consume'),
    Q = require('q');

module.exports = {
    runHttpServer: runHttpServer,
    runScriptSequence: runScriptSequence
};

function runHttpServer(settings, callback) {
    var expressServer = express(); 
    
    var server = null,
        path = settings.path,
        port = settings.port || 3000,
        host = settings.host || "localhost",
        index = settings.index || "index.html";
    
    expressServer.use(express.static(
        path, {
            index: index
        }));

    server = expressServer.listen(port, host, function () {
        var uri =
            "http://" +
            server.address().address +
            ":" +
            server.address().port;
        
        console.log("Server started on %s", uri);
        
        gulp.src(path).pipe(open({
            uri: uri
        }));
    });
    
    process.on("SIGINT", function () {
        if (server && server.close) {
            server.close();
        }
        if (callback) {			
			callback();
		}
        
        process.exit();
    });
}

function consumeStream(stream) {
    var deferred = Q.defer();
    stream
        .on('end', deferred.resolve)
        .on('error', deferred.reject);
    // Ensure that the stream completes
    consume(stream);

    return deferred.promise;
}


function runScript(script, context) {
    var scriptResult = script();
    if (scriptResult && typeof scriptResult.pipe === 'function') {
        return consumeStream(scriptResult);
    }
    return scriptResult;
}

function runScriptSequence(scripts, context) {
    return scripts.reduce(function(prevScriptPromise, nextScript) {
        return prevScriptPromise.then(function() {
            return runScript(nextScript, context);
        });
    }, Q());
}

