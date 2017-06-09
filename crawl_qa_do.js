var fs = require('fs');

var args = process.argv;

if (args.length == 2) {
  console.log('how to use: node crawl_qa_do.js ASIN');
  return;
}

fs.stat('./QA_' + args[2] + '.txt', function (err, stats) {
  if (err) {
      if (err.code != 'ENOENT') {
        console.error(err);
        return;
      };

      console.log('file does not exist.');

      doThings()
  } else {
    console.log('file exists.');

    fs.unlink('./QA_' + args[2] + '.txt',function(err){
         if(err) return console.log(err);
         console.log('file deleted.');
         doThings()
    });
  }
});

function doThings() {
  var Crawler = require("crawler");

  var c = new Crawler({
      rateLimit: 1000,
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{
              var $ = res.$;

              var productDesc = 'Product description: ' + $(".askProductDescription a").text().trim();

              var matches = $.html().toString().match(/(question-)(?!id)(\S+)[a-zA-Z0-9]/g);

              if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                  var questionEl = $("#" + matches[i]);
                  var question = 'Question: ' + questionEl[0].children[0].children[3].children[1].children[0].data.trim();

                  var answerEl = questionEl.next();
                  var answerOwner = answerEl[0].children[0].children[3].children[5];

                  if (answerOwner == undefined) {
                    continue;
                  } else {
                    var answer = 'Answer: ' + answerEl[0].children[0].children[3].children[1].children[0].data.trim();

                    answerOwner = 'Answered by: ' + answerEl[0].children[0].children[3].children[5].children[0].data.trim().replace('By ', '');

                    fs.appendFileSync('./QA_' + args[2] + '.txt', productDesc + '\r\n\r\n');
                    fs.appendFileSync('./QA_' + args[2] + '.txt', question + '\r\n\r\n');
                    fs.appendFileSync('./QA_' + args[2] + '.txt', answer + '\r\n\r\n');
                    fs.appendFileSync('./QA_' + args[2] + '.txt', answerOwner + '\r\n\r\n');
                  }
                }
              } else {
                console.log('No Q&A found for this product! ' + productDesc);
              }
          }
          done();
      }
  });

  c.queue('https://www.amazon.com/ask/questions/asin/' + args[2] + '/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE');
}
