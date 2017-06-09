var fs = require('fs');

var args = process.argv;

if (args.length == 2) {
  console.log('how to use: node crawl_reviews_do.js ASIN');
  return;
}

fs.stat('./reviews_' + args[2] + '.txt', function (err, stats) {
  if (err) {
      if (err.code != 'ENOENT') {
        console.error(err);
        return;
      };

      console.log('file does not exist.');
  } else {
    console.log('file exists.');

    fs.unlink('./reviews_' + args[2] + '.txt',function(err){
         if(err) return console.log(err);
         console.log('file deleted.');
    });
  }
});

var reviewCrawlr = require('./main/reviews.js');

reviewCrawlr.getReviewsForProductId(args[2]).then(function(val) {
  console.log("got reviews ready for shipping");
  fs.appendFileSync('reviews_' + args[2] + '.txt', JSON.stringify(val, null, 2));
}).catch(function(reason) {
  console.error(reason);
});
