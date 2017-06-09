var fs = require('fs');

var content;

fs.readFile('ASINs.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString();
    content = content.split(',');
    processFile();
});

function processFile() {
  if (content.indexOf('\n') > -1) {
    content.splice(content.indexOf('\n'), 1)
  }

  if (content.indexOf('') > -1) {
    content.splice(content.indexOf(''), 1)
  }

  if (content.indexOf(' ') > -1) {
    content.splice(content.indexOf(' '), 1)
  }

  content.forEach(function(id) {
    var util = require('util'),
    exec = require('child_process').exec,
    child;

child = exec('node crawl_reviews_do.js ' + id, // command line argument directly in string
  function (error, stdout, stderr) {      // one easy function to capture data/errors
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
})
  });
}
