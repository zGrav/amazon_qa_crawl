var fs = require('fs');

fs.readFile('ASINs.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString();
    content = content.split(', ');
    processFile();
});

var content;

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
    doThings(id);
  });
}

var jsonObj = {};

function doThings(id) {
  fs.stat('QA.json', function (err, stats) {
    if (err) {
        if (err.code != 'ENOENT') {
          console.error(err);
          return;
        };

        console.log('file does not exist.');
    } else {
      console.log('file exists.');

      fs.unlink('QA.json',function(err){
           if(err) return console.log(err);
           console.log('file deleted.');
      });
    }
  });

  fs.stat('As.txt', function (err, stats) {
    if (err) {
        if (err.code != 'ENOENT') {
          console.error(err);
          return;
        };

        console.log('file does not exist.');
    } else {
      console.log('file exists.');

      fs.unlink('As.txt',function(err){
           if(err) return console.log(err);
           console.log('file deleted.');
      });
    }
  });

  fs.stat('Qs.txt', function (err, stats) {
    if (err) {
        if (err.code != 'ENOENT') {
          console.error(err);
          return;
        };

        console.log('file does not exist.');
    } else {
      console.log('file exists.');

      fs.unlink('Qs.txt',function(err){
           if(err) return console.log(err);
           console.log('file deleted.');
      });
    }
  });

  var Crawler = require("crawler");

  var c = new Crawler({
      rateLimit: 1000,
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{
              var $ = res.$;

              var productDesc = /*'Product description: ' +*/ $(".askProductDescription a").text().trim();

              if (Object.keys(jsonObj).length === 0 && jsonObj.constructor === Object) {
                jsonObj.products = [{ title: productDesc, url: 'http://amazon.com/gp/product/' + id, qa: [] }];
              } else {
                jsonObj.products.push({ title: productDesc, url: 'http://amazon.com/gp/product/' + id, qa: [] });
              }

              var matches = $.html().toString().match(/(question-)(?!id)(\S+)[a-zA-Z0-9]/g);

              if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                  var questionEl = $("#" + matches[i]);
                  var question = /*'Question: ' +*/ questionEl[0].children[0].children[3].children[1].children[0].data.trim();

                  var answerEl = questionEl.next();
                  var answerOwner = answerEl[0].children[0].children[3].children[5];

                  if (answerOwner == undefined) {
                    continue;
                  } else {
                    var answer = /*'Answer: ' +*/ answerEl[0].children[0].children[3].children[1].children[0].data.trim();

                    if (answer == 'Answer: ' || answer.length == 0 || answer == null || answer == undefined) {
                      continue;
                    }

                    answerOwner = /*'Answered by: ' +*/ answerEl[0].children[0].children[3].children[5].children[0].data.trim().replace('By ', '');

                    jsonObj.products[Object.keys(jsonObj.products).length - 1].qa.push({ question: question, answer: answer });

                    fs.appendFileSync('Qs.txt', question + '\r\n');
                    fs.appendFileSync('As.txt', answer + '\r\n');
                  }
                }

                for (var i = 0; i < jsonObj.products.length; i++) {
                  if (jsonObj.products[i].qa.length == 0) {
                    jsonObj.products.splice(i, 1);
                  }
                }

                fs.writeFileSync('QA.json', JSON.stringify(jsonObj, null, 2));
              } else {
                console.log('No Q&A found for this product! ' + productDesc);
              }
          }
          done();
      }
  });

  c.queue('https://www.amazon.com/ask/questions/asin/' + id + '/1/ref=ask_ql_psf_ql_hza?sort=SUBMIT_DATE');
}
