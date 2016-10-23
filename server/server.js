// Set up
var express  = require('express');
var Twitter = require('twitter');
var request = require('request');
var sentiment = require('sentiment');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

var client = new Twitter({
  consumer_key: 'Xt9AvoPn96HnsdH55cpZeq6iR',
  consumer_secret: 'fMNHwvXGK4pUDEUzlOzxY4JhSWd8djRG95GZQW14KJ9AWD4cdK',
  access_token_key: '96027197-trS74mfDl8g2FWT8UklH1VLRRgXZEOkXk3kxC9HQL',
  access_token_secret: 'TFHwQKESnExx3YVqvftMe4rtweFPgAFlEGx1MN9rCiTid'
});
//get all tweets from user
app.get('/tweets/:username', function(req, res) {
  client.get('statuses/user_timeline', {screen_name: req.params.username, count: 3200, include_rts: false},  function(error, tweet, response) {
    if(error) {
      res.send(error);
    }
    else {
      res.json(checkSentiment(tweet));
    }
  });
})
//get embed tweet for each tweet
app.get('/embed/:id', function(req, res) {
  // http.request("http://api.twitter.com/1.1/statuses/oembed.json?id=" + req.body.id, function(error, response, body) {
  //   res.json(response);
  //   console.log(response);
  // });
  request("https://api.twitter.com/1.1/statuses/oembed.json?id=" + req.params.id, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    res.json(JSON.parse(response.body));
    // res.json(response.body); // Show the HTML for the Google homepage. 
  }
  })
  // client.get('statuses/oembed', {id: req.body.id}, function(error, tweet, response) {
  //   if(error) {
  //     res.send(error);
  //   }
  //   else {
  //     // console.log(tweet);
  //     res.json(tweet);
  //   }
  // })
})
function checkSentiment(tweets) {
  badTweets = [];
  for (var i = 0, len = tweets.length; i < len; i++) {
    var sentimentTweet = sentiment(tweets[i].text);
    if (sentimentTweet.score < -3) {
      badTweets = badTweets.concat(tweets[i]);
    }
  }
  return badTweets;
}

// var r1 = sentiment('Obama is, without question, the WORST EVER president. I predict he will now do something really bad and totally stupid to show manhood!');
// console.dir(r1);


app.listen(8080);
console.log("App listening on port 8080");