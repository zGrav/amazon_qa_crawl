var Promise = require('promise'),
    request = require('request'),
    cheerio = require('cheerio'),

    total_review_count_selector = '.totalReviewCount',
    total_page_number = '.a-last > a',
    review_selector = '.review',
    review_rating_selector = '.review-rating',
    review_author_selector = '.author',
    review_date_selector = '.review-date',
    review_text_selector = '.review-text';

module.exports = {
    getReviewsForProductId: function (productId) {
        urlObject.setProductId(productId);
        urlObject.resetPageNumber();
        return new Promise(function(resolve, reject) {
            var reviews = [];
            retrieveReviews(reviews, function(result) {
                if (result !== 'undefined' && result.length > 0) {
                    resolve(result)
                } else {
                    reject("sorry for breaking the promise :-(");
                }
            });
        });
    }
};

var urlObject = {
    basePath: 'http://www.amazon.com/product-reviews/',
    productId: '',
    requestParams: '/ref=cm_cr_pr_paging_btm_next_3?ie=UTF8&showViewpoints=1&sortBy=byRankDescending&pageNumber=',
    pageNumber: 1,
    getFullURL: function() {
        return this.basePath + this.productId + this.requestParams + this.pageNumber;
    },
    setProductId: function(newProductId) {
        this.productId = newProductId;
    },
    resetPageNumber: function() {
        this.pageNumber = 1;
    },
    alterPageNumber: function() {
        this.pageNumber += 1;
    }
};

function retrieveReviews(arrayOfReviews, callback) {
    request(urlObject.getFullURL(), function(error, response, body){
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(body),
                availableReviews = parseInt($(total_review_count_selector).text().replace('.',''));

            var isLastPage = false;

            if ($(total_page_number).attr('href') == undefined) {
                isLastPage = true;
            }

            console.log("cheerio has found", availableReviews, "reviews");
            console.log();
            console.log("Processing reviews of page: ", urlObject.pageNumber + " for product id: " + urlObject.productId);
            console.log();

            $(review_selector).each(function() {
                arrayOfReviews.push(getReview($(this)));
            });

            if (!isLastPage) {
                console.log("retrieving next page ...");
                console.log();
                urlObject.alterPageNumber();
                retrieveReviews(arrayOfReviews, callback);
            } else {
                console.log("All reviews retrieved");
                console.log();
                callback(arrayOfReviews);
            }
        }
    });
}

function getReview(raw_review) {
        var review = {};

        review.rating = getReviewRating(raw_review);
        review.author = getReviewAuthor(raw_review);
        review.date = getReviewDate(raw_review);
        review.text = getReviewText(raw_review);
        return review;
}

function getReviewRating(review) {
    return review.find(review_rating_selector).text().charAt(0);
}

function getReviewAuthor(review) {
    var authorLink = review.find(review_author_selector).attr('href'),
        authorLinkParts = authorLink.split('/');

    for (i = 0; i < authorLinkParts.length; i++) {
        if(authorLinkParts[i] == 'profile') {
            return authorLinkParts[++i];
        }
    }

}

function getReviewDate(review) {
    var dateString = review.find(review_date_selector).text();

    return dateString;
}

function getReviewText(review) {
    return review.find(review_text_selector).text();
}
