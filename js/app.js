'use strict';

// Grab the eligibility flow from a static JSON file stored at the root of the project
var ELIGIBILITY_FLOW;

var req = new XMLHttpRequest();
req.open("GET", "eligibility-flow.json", true);
req.addEventListener("load", function() {
    ELIGIBILITY_FLOW = JSON.parse(req.responseText);
});
req.send(null);

// holds the eligibility result when known
var eligibilityResult = "unknown";
// holds history of questions and answers
var questionHistory = [];

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
                controller: 'ResultsController as resultsCtrl'
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

    // reset global variables for question history and eligibility result
    questionHistory = []; 
    eligibilityResult = "unknown";

    // an object representing the current question and answer choices
    // initialize this to be the first question using 'start' property on ELIGIBILITY_FLOW
    self.currentQuestion = ELIGIBILITY_FLOW[ELIGIBILITY_FLOW.start];

    // boolean indicating whether final state is known
    self.eligibilityKnown = false;

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
        questionHistory.push(record);


        var next = self.currentQuestion.answers[answerIndex].next;

        // check if this answer leads to an eligibility state
        if (ELIGIBILITY_FLOW.endStates.indexOf(next) != -1) {
            // set global variable eligibilityResult to this eligiblity 
            eligibilityResult = next;
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
myApp.controller('ResultsController', function($location) {
    // if user got to results page without doing the wizard somehow, send them to the quiz
    if (questionHistory.length === 0 || eligibilityResult === "unknown")
        $location.path('/eligibility-check');

    var self = this; // self is equivalent to $scope
    console.log(questionHistory);
    // copy history and eligibilty result from global variables
    self.questionHistory = questionHistory;
    self.eligibilityResult = eligibilityResult;
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
