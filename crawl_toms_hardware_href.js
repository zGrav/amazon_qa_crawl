var fs = require('fs');

var content;

fs.readFile('toms_hardware_hrefs.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString();
    content = content.split('\r\n');
    console.log(content);
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

  content.forEach(function(href) {
    doThings(href);
  });
}

var jsonObj = {};

function doThings(href) {
  fs.stat('As_tom.txt', function (err, stats) {
    if (err) {
        if (err.code != 'ENOENT') {
          console.error(err);
          return;
        };

        console.log('file does not exist.');
    } else {
      console.log('file exists.');

      fs.unlink('As_tom.txt',function(err){
           if(err) return console.log(err);
           console.log('file deleted.');
      });
    }
  });

  fs.stat('Qs_tom.txt', function (err, stats) {
    if (err) {
        if (err.code != 'ENOENT') {
          console.error(err);
          return;
        };

        console.log('file does not exist.');
    } else {
      console.log('file exists.');

      fs.unlink('Qs_tom.txt',function(err){
           if(err) return console.log(err);
           console.log('file deleted.');
      });
    }
  });

  var Crawler = require("crawler");

  var cheerio = require('cheerio');

  var c = new Crawler({
      rotateUA: true,
      jQuery: false,
      userAgent: ['Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1', 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0'],
      rateLimit: 1000,
      callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = cheerio.load(res.body);

            //var threadTitle = $('.thread__title').text();

            var threadContent = $('.thread__content').text().trim();

            var answers = $('.answer__content').text().trim();

            fs.appendFileSync('Qs_tom.txt', threadContent + '\r\n\r\n');
            fs.appendFileSync('As_tom.txt', answers + '\r\n\r\n');
        }
          done();
      }
  });

  c.queue(href);
}
