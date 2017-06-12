var fs = require('fs');

var QAFile = require('./QA.json');

var countQA = 0;

for (var i = 0; i < QAFile.products.length; i++) {
  QAFile.products[i].qa.forEach(function (qa) {
    countQA++;
  })
};

console.log('There are ' + countQA + " lines of QA, " + Math.round(countQA / 2) + " being questions and " + Math.round(countQA / 2) + " being answers.");
