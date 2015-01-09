'use strict';

// App definition + dependencies
var myApp = angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'mgcrea.ngStrap'
    ]);

// Route definition 
myApp.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        
        //$locationProvider.html5Mode(true);
        
        var test;
        
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