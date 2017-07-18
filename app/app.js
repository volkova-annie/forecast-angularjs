'use strict';

angular.module('forecastApp', [
  'ngRoute',
  'forecastApp.forecast'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
