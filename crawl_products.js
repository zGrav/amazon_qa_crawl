var amazon = require('./main/client.js');

var client = amazon.createClient({
  awsId: "awsId",
  awsSecret: "awsSecret",
  awsTag: "crawlr"
});

var ignoreProductType =
[
  'DOWNLOADABLE_MUSIC_TRACK', 'ABIS_DVD', 'DOWNLOADABLE_MOVIE', 'ABIS_MUSIC', 'BOOKS_1973_AND_LATER', 'SOFTWARE_GAMES',
  'MOBILE_APPLICATION', 'CONSOLE_VIDEO_GAMES', 'ABIS_VIDEO_GAMES', 'ABIS_BOOK', 'ABIS_EBOOKS', 'ART_AND_CRAFT_SUPPLY',
  'ENTERTAINMENT_MEMORABILIA', 'DOWNLOADABLE_TV_EPISODE', 'MAGAZINES', 'TOYS_AND_GAMES', 'SKILL_APPLICATION'
]; // should be enough for now...

var args = process.argv;

if (args.length == 2) {
  console.log('how to use: node crawl_products.js "keyword_of_product"');
  console.log('e.g node crawl_products.js "ovens"');
  return;
}

var fs = require('fs');

fs.stat('./ASINs.txt', function (err, stats) {
  if (err) {
      if (err.code != 'ENOENT') {
        console.error(err);
        return;
      };

      console.log('file does not exist.');
  } else {
    console.log('file exists.');

    fs.unlink('./ASINs.txt',function(err){
         if(err) return console.log(err);
         console.log('file deleted.');
    });
  }
});

console.log('Going to try to crawl!');

let count = 0;

for (var page = 1; page <= 5; page++) {
  client.itemSearch({
    keywords: args[2],
    itemPage: page,
  }, function(err, results, response) {
    if (err) {
      console.log('itemSearch error!');
      console.log(JSON.stringify(err, null, 2));

      // unfortunately we need to sleep for 1sec or we get throttled :(
      sleep(1000);
    } else {
      results.forEach(function (res, idx) {
        if (!ignoreProductType.includes(res.ItemAttributes[0].ProductTypeName.toString())) {
          console.log('Exporting res.ASIN ' + res.ASIN + ' to ASINs.txt file.');

          fs.appendFileSync('ASINs.txt', res.ASIN + ', ');

          console.log(res.ASIN);
          console.log(res.ItemAttributes[0].Title);
          console.log(res.DetailPageURL);

          count++;

          console.log(count);

          // unfortunately we need to sleep for 1sec or we get throttled :(
          sleep(1000);
        } else {
          //not a physical product, let's ignore.

          // unfortunately we still need to sleep for 1sec or we get throttled :(
          sleep(1000);
        }
      });
    }
  });
};

function sleep(milliseconds) {
  var start = new Date().getTime();

  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
