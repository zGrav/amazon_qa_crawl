var fs = require('fs');

var util = require('util'),
exec = require('child_process').exec,
child;

child = exec('node crawl_qa_do.js', // command line argument directly in string
  function (error, stdout, stderr) {      // one easy function to capture data/errors
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
