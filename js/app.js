'use strict';

// App definition + dependencies
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'mgcrea.ngStrap'
    ]);

// Route definition 
myApp.config(['$routeProvider',
    function ($routeProvider) {
        
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeController'
            })
            .when('/eligibility-check/ineligible/:reason?', {
                templateUrl: 'views/eligibility-check-ineligible.html',
                controller: 'eligibilityIneligibleController'
            })
            .when('/eligibility-check/eligible', {
                templateUrl: 'views/eligibility-check-eligible.html',
                controller: 'eligibilityEligibleController'
            })
            .when('/eligibility-check', {
                templateUrl: 'views/eligibility-check.html',
                controller: 'eligibilityController'
            })
            .otherwise({
                redirectTo: '/'
			      });
}]);


myApp.controller('homeController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {
            
        }
]);

myApp.controller('eligibilityController',
    ['$scope', '$http', '$routeParams', '$location',
        function ($scope, $http, $routeParams, $location) {
        
        $scope.step_in_process = 0;

        $http.get('/ineligible-misdemeanors.json')
        .success(function(data, status, headers, config) {
            $scope.ineligibleMisdemeanors  = data;
        });
        
        $scope.getToStep = function (step) {
          console.log('Going to step: ', step);
          $scope.step_in_process = step;
        }
         
        $scope.ineligible = function(reason) {
          $location.path('eligibility-check/ineligible/reason');
        };
        
        $scope.eligible = function() {
          $location.path('eligibility-check/eligible');
        }
           
        }
]);

myApp.controller('eligibilityIneligibleController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {
        
           
        }
]);

myApp.controller('eligibilityEligibleController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {
        
           
        }
]);