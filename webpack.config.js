var webpack = require('webpack');
var yargs = require('yargs').argv;
var testing = yargs.env === 'test';

//------------------------------------------------------------------------------
// https://github.com/webpack/webpack/issues/839#issuecomment-177219660
function getExternals() {
    var fs = require('fs');
    var nodeModules = {};

    fs.readdirSync('node_modules').forEach(function (module) {
      if (module !== '.bin') {
        nodeModules[module] = true;
      }
    });

    var nodeModulesTransform = function(context, request, callback) {
      // search for a '/' indicating a nested module
      var slashIndex = request.indexOf("/");
      var rootModuleName;
      if (slashIndex == -1) {
        rootModuleName = request;
      } else {
        rootModuleName = request.substr(0, slashIndex);
      }

      // Match for root modules that are in our node_modules
      if (nodeModules.hasOwnProperty(rootModuleName)) {
        callback(null, "commonjs " + request);
      } else {
        callback();
      }
    };
    return nodeModulesTransform;
}
//------------------------------------------------------------------------------

var config = {
    entry: './src/redux-decorators.ts',
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    compilerOptions: {
        module: 'commonjs',
        sourceMap: true
    },
    output: {
        filename: './dist/redux-decorators.js',
        library: 'ReduxDecorators',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    externals: getExternals()
};

var testingDecorator = function(config) {
    var path = require('path');
    config.entry = path.resolve('./test/all-tests.ts');
    config.target = 'node';
    config.output = {};
    config.output.filename = './dist/redux-decorators.spec.js';
    return config;
};

if (testing) {
    config = testingDecorator(config);
}

module.exports = config;
