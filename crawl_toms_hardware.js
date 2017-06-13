var args = process.argv;

if (args.length == 2) {
  console.log('how to use: node crawl_toms_hardware.js "string"');
  console.log('e.g node crawl_toms_hardware.js "need recommendation"');
  return;
}

var Crawler = require("crawler");

var cheerio = require('cheerio');

var fs = require('fs');

var c = new Crawler({
    rotateUA: true,
    userAgent: ['Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36', 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1', 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0'],
    rateLimit: 1000,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = cheerio.load(res.body);

            var results = $('.result-list');

            for (var i = 0; i < results.length; i++) {
              for (var j = 0; j < results[i].children.length; j++) {
                if (results[i].children[j].attribs != undefined || results[i].children[j].attribs != null) {
                  if (results[i].children[j].attribs.class == 'result grouped forum') {
                    for (var k = 0; k < results[i].children[j].children.length; k++) {
                      if (results[i].children[j].children[k].type == 'tag' && results[i].children[j].children[k].name == 'a') {
                        fs.appendFileSync('toms_hardware_hrefs.txt', results[i].children[j].children[k].attribs.href + '\r\n');
                      }
                    }
                  }
                }
              }
            }
        }
        done();
    }
});

c.queue('http://www.tomshardware.com/s/' + args[2]);
