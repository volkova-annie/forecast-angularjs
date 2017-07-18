'use strict';

angular.module('forecastApp.forecast', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'forecast/forecast.html'
  });
}])

.controller('SuggestionCtrl', ['$http','$scope', '$rootScope', function($http, $scope, $rootScope) {
  $scope.city = '';
  $scope.cities = [];

  $scope.onType = function(event){
    var value = $scope.city;
    if (value.length > 2) {
      $scope.city = value;
      $scope.getSuggestions();
    }
  }

  $scope.suggestionUrl = function() {
    return 'http://gd.geobytes.com/AutoCompleteCity?q='+$scope.city+'&callback=JSON_CALLBACK';
  }

  $scope.onChoose = function(city) {
    $rootScope.$broadcast('selectCity', city);
    $scope.city = city;
    $scope.cities = [];
  }

  $scope.getSuggestions = function(){
    $http.jsonp($scope.suggestionUrl())
    .success(function(data){
        $scope.cities = data;
    });
  }
  $scope.hasCities = function(){
    return (typeof $scope.cities !== 'undefined' && $scope.cities.length > 0);
  }
}])

.controller('ForecastCtrl', ['$http','$scope', '$rootScope', function($http, $scope, $rootScope) {
  $scope.forecast;
  $scope.city;
  $scope.country;
  $scope.description;
  $scope.pressure;
  $scope.humidity;
  $scope.speed;
  $scope.temp;
  $scope.temp_min;
  $scope.temp_max;

  $rootScope.$on('selectCity', function(event, city){
    $scope.city = city;
    $scope.getForecast();
  });

  $scope.KEY='b84d6e69b39e4433a5ec8239e157c1d5';
  $scope.forecastUrl = function() {
    return 'http://api.openweathermap.org/data/2.5/weather?appid='+$scope.KEY+'&q='+$scope.city+'&mode=json';
  }

  $scope.convertTemp = function(temp) {
    return (temp-273.15).toFixed(0).toString();
  }

  $scope.getForecast = function(){

    $http.get($scope.forecastUrl()).success(function(data){
      $scope.forecast = data;
      $scope.city = data.name;
      $scope.country = data.sys.country;
      $scope.description = data.weather[0].main;
      $scope.pressure = data.main.pressure;
      $scope.humidity = data.main.humidity;
      $scope.speed = data.wind.speed;
      $scope.temp = $scope.convertTemp(data.main.temp);
      $scope.temp_min = $scope.convertTemp(data.main.temp_min);
      $scope.temp_max = $scope.convertTemp(data.main.temp_max);
    })
  }

  $scope.hasForecast = function(city) {
    return (typeof $scope.forecast !== 'undefined');
  }
}]);
