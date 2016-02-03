var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder('', './build-tools/config.js');

builder
.bundle('src/redux-decorators.ts', 'dist/redux-decorators.js')
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
