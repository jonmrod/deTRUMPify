
    // also include ngRoute for all our routing needs
    var trump = angular.module('trump', ['ngRoute', 'ngSanitize']);

    // configure our routes
    trump.config(function($routeProvider) {
      $routeProvider

            // route for the home page
            .when('/', {
              templateUrl : 'pages/home.html',
              controller  : 'mainController'
            }) 
       });

    // create the controller and inject Angular's $scope
    trump.controller('mainController', function(TwitterAPI, $scope) {
        $scope.twitterHandle = '';
        $scope.error = '';
        $scope.boxClass = false;
        $scope.sentimentTweets = [];
        // create a message to display in our view
        $scope.checkTweets = function () {
          TwitterAPI.embedTweet('nostvlgiv', 121212);
          TwitterAPI.getTweets($scope.twitterHandle).then(function(res) {
            if(res.data == 0) {
              $scope.error = "There is nothing bad in your twitter handle :)";
            }
            else {
            $scope.twitterHandle = '';
            $scope.error = '';
            $scope.boxClass = true;
            angular.forEach(res.data, function(value, key) {
              // console.log(value);
              TwitterAPI.embedTweet(value.id_str).then(function(res) {
                $scope.sentimentTweets.push(res.data);
                $('.twitter-tweet').delegate("a", "click", function(){
                  window.open($(this).attr('href'));
                  return false;
                });
              });
            });
            console.log($scope.sentimentTweets);
            }
          });
        }
      });


    trump.service('TwitterAPI', function($http) {
      var API = 'http://localhost:8080';
      var self = this;

      self.getTweets = function(username) {
        return $http.get(API + '/tweets/' + username);
      }
      self.embedTweet = function(id) {
        return $http.get(API + '/embed/' + id);
      }
    })