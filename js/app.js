'use strict';

// Grab the eligibility flow from a static JSON file stored at the root of the project
var ELIGIBILITY_FLOW;

var req = new XMLHttpRequest();
req.open("GET", "eligibility-flow.json", true);
req.addEventListener("load", function() {
    ELIGIBILITY_FLOW = JSON.parse(req.responseText);
});
req.send(null);

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
            // The wizard!
            .when('/eligibility-check', {
                templateUrl: 'views/eligibility-checker.html',
                controller: 'EligibilityWizardController as eligibilityCtrl'
            })
             // Display results of eligibility check
            .when('/eligibility-results', {
                templateUrl: 'views/eligibility-results.html',
                controller: 'ResultsController'
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

// Eligibility Checker Controller --AKA The Wizard
myApp.controller('EligibilityWizardController', function($http, $location) {

    var self = this; // self is equivalent to $scope

    // an object representing the current question and answer choices
    // initialize this to be the first question using 'start' property on ELIGIBILITY_FLOW
    self.currentQuestion = ELIGIBILITY_FLOW[ELIGIBILITY_FLOW.start];

    // boolean indicating whether final state is known
    self.eligibilityKnown = false;

    // once eligibility is known, this will hold the final eligibility state
    self.eligibility = null;

    // history holds the user's answers to previous questions to be returned when eligibility is known
    self.history = [];

    // Grab the ineligible misdemeanors from a static JSON file stored at the root of the project
    $http.get('ineligible-misdemeanors.json')
    .success(function(data, status, headers, config) {
        // if the app successfully gets misdemeanor data from the JSON file, assign it to self.ineligibleMisdemeanors for use in the wizard
        self.ineligibleMisdemeanors = data;
    });

    self.submitAnswer = function(answerIndex) {
        // record this question and answer in record and add to history
        var record = {};
        record.question = self.currentQuestion.questionText;
        record.answer = self.currentQuestion.answers[answerIndex].answerText;
        self.history.push(record);

        var next = self.currentQuestion.answers[answerIndex].next;

        // check if this answer leads to an eligibility state
        if (ELIGIBILITY_FLOW.endStates.indexOf(next) != -1) {
            self.eligibility = next;
            self.eligibilityKnown = true;
            $location.path('/eligibility-results');
            return;
        }

        // update currentQuestion if eligibitliy still not known and next question is valid
        if (next in ELIGIBILITY_FLOW) {
            self.currentQuestion = ELIGIBILITY_FLOW[next];
            return;
        }

        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question \'" + next + "\' in ELIGIBILITY_FLOW.");
    };
});

// Results Controller
myApp.controller('ResultsController', function() {

});

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
