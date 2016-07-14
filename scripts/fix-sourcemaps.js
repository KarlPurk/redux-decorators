// parser.js
const path = require('path');
const {Transform} = require('stream');
const fs = require('fs');

const parseLine = (line) => {
    const find = `${path.sep}src${path.sep}`;
    const regex = new RegExp(`${path.sep}src${path.sep}`, 'g');
    const replace = `${path.sep}redux-decorators${find}`;
    return line.replace(regex, replace);
}

var parser = new Transform();
parser._transform = function(data, encoding, done) {
  this.push(parseLine(data.toString()));
  done();
};

process.stdin.pipe(parser).pipe(process.stdout);
process.stdout.on('error', process.exit);
