var fs = require('fs');

fs.stat('./QAs.txt', function (err, stats) {
  if (err) {
      if (err.code != 'ENOENT') {
        console.error(err);
        return;
      };

      console.log('file does not exist.');
  } else {
    console.log('file exists.');

    fs.unlink('./QAs.txt',function(err){
         if(err) return console.log(err);
         console.log('file deleted.');
    });
  }
});

var array = fs.readFileSync('ASINs.txt').toString().split(", ");

if (array.indexOf('\n') > -1) {
  array.splice(array.indexOf('\n'), 1)
}

if (array.indexOf('') > -1) {
  array.splice(array.indexOf(''), 1)
}

var Crawler = require("crawler");

var c = new Crawler({
    rateLimit: 1000,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;

            var productDesc = $(".askProductDescription a").text().trim();

            console.log("Product description: " + productDesc);

            console.log();

            var matches = $.html().toString().match(/(question-)(?!id)(\S+)[a-zA-Z0-9]/g);

            for (let i = 0; i < matches.length; i++) {
              var questionEl = $("#" + matches[i]);
              var question = questionEl[0].children[0].children[3].children[1].children[0].data.trim();

              var answerEl = questionEl.next();
              var answerOwner = answerEl[0].children[0].children[3].children[5];

              if (answerOwner == undefined) {
                continue;
              } else {
                console.log('Question: ' + question);

                var answer = answerEl[0].children[0].children[3].children[1].children[0].data.trim();
                console.log('Answer: ' + answer);

                answerOwner = answerEl[0].children[0].children[3].children[5].children[0].data.trim().replace('By ', '');
                console.log('Answered by: ' + answerOwner);

                console.log();
              }
            }
        }
        done();
    }
});

for (let i = 0; i < array.length; i++) {
  c.queue('https://www.amazon.com/ask/questions/asin/' + array[i] + '/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE');
}
