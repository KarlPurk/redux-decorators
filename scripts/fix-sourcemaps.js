var path = require('path');
var Transform = require('stream').Transform;
var fs = require('fs');

var parseLine = function(line) {
    var find = path.sep + 'src' + path.sep;
    var regex = new RegExp(path.sep + 'src' + path.sep, 'g');
    var replace = path.sep + 'redux-decorators' + find;
    return line.replace(regex, replace);
}

var parser = new Transform();
parser._transform = function(data, encoding, done) {
  this.push(parseLine(data.toString()));
  done();
};

process.stdin.pipe(parser).pipe(process.stdout);
process.stdout.on('error', process.exit);
