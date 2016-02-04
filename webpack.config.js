var webpack = require('webpack');


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

module.exports = {
    entry: './src/redux-decorators.ts',
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    "compilerOptions": {
        "module": "commonjs",
        "sourceMap": true
      },
    output: {
        filename: './dist/redux-decorators.js',
        library: 'ReduxDecorators',
        libraryTarget: 'umd'
    },
    externals: getExternals(),
    plugins: [
        new webpack.ProvidePlugin({
            // 'redux': 'Redux'
        })
    ],
    // Turn on sourcemaps
    devtool: 'source-map'
};
