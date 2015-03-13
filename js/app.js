'use strict';

// App definition + dependencies
var myApp = angular.module('myApp', [
    // necessary for matching the URL to an available resource
    'ngRoute',
    // Material Design by Google
    'ngMaterial'
    ]);

// Route definition 
myApp.config(['$routeProvider',
    function ($routeProvider) {
        
        $routeProvider
            // Homepage includes Expunge D.C. overview and link to the wizard
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeController'
            })
            // Information on an misdemeanor or felony being ineligible for expungement, either temporarily or permanently 
            .when('/eligibility-check/ineligible/:reason?', {
                templateUrl: 'views/eligibility-check-ineligible.html',
                controller: 'eligibilityIneligibleController'
            })
            // Information on an misdemeanor or felony being eligible for expungement, including next steps
            .when('/eligibility-check/eligible', {
                templateUrl: 'views/eligibility-check-eligible.html',
                controller: 'eligibilityEligibleController'
            })
            // The wizard!
            .when('/eligibility-check', {
                templateUrl: 'views/eligibility-check.html',
                controller: 'eligibilityController'
            })
            // FAQs
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'questionsController'
            })
            // FAQs
            .when('/legal-aid', {
                templateUrl: 'views/legal-aid.html',
                controller: 'legalAidController'
            })
            // If the user attempts to visit a route that doesn't match any of the patterns above, re-direct them to the homepage
            .otherwise({
                redirectTo: '/'
            });
}]);


// Homepage controller
myApp.controller('homeController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// FAQs controller
myApp.controller('questionsController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// Legal Aid controller
myApp.controller('legalAidController',
    ['$scope', 
        function ($scope) {
            

        }
]);


// Eligibility Checker Controller -- AKA The Wizard
myApp.controller('eligibilityController',
    ['$scope', '$http', '$location',
        function ($scope, $http, $location) {
        
        // step_in_process controls which question the user sees
        // default to the first step, 0
        $scope.step_in_process = 0;

        // Grab the ineligible misdemeanors from a static JSON file stored at the root of the project
        $http.get('ineligible-misdemeanors.json')
        .success(function(data, status, headers, config) {
            // if the app successfully gets misdemeanor data from the JSON file, assign it to $scope.ineligibleMisdemeanors for use in the wizard
            $scope.ineligibleMisdemeanors  = data;
        });
        
        // This function is used to advance the user through the wizard
        $scope.getToStep = function (step) {
          $scope.step_in_process = step;
        }
         
        // This function redirects the user to the ineligible page
        $scope.ineligible = function(reason) {
          $location.path('eligibility-check/ineligible/reason');
        };
        
        // This function redirects the user to the eligible page
        $scope.eligible = function() {
          $location.path('eligibility-check/eligible');
        }
           
        }
]);

// This controller controls the ineligible page. 
// There is currently just static content on this page
myApp.controller('eligibilityIneligibleController',
    ['$scope', 
        function ($scope) {
        
           
        }
]);

// This controller controls the eligible page. 
// There is currently just static content on this page
myApp.controller('eligibilityEligibleController',
    ['$scope', 
        function ($scope) {
        
           
        }
]);


// Partial 
myApp.controller('titlebarController',
    ['$scope', '$mdSidenav',
        function ($scope, $mdSidenav) {
            $scope.openLeftMenu = function() {
                $mdSidenav('left').toggle();
            };
            
            $scope.close = function() {
              $mdSidenav('left').toggle();
            }
           
        }
]);
