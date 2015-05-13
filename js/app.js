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
            // The wizard!
            .when('/eligibility-check', {
                redirectTo: function(routeParams, path, search) {
                    return '/eligibility-check/q/0'
                }
            })
            .when('/eligibility-check/q/:questionNumber', {
                templateUrl: 'views/eligibility-checker.html',
                controller: 'EligibilityWizardController as eligibilityCtrl'
            })
            // FAQs
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'questionsController'
            })
            // Legal Aid Page
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

//Keep userInput outside controller scope so that it isn't reset when $location changes
var userInput = [];
var answeredQuestions = [];
// refactored version of Eligibility Checker Controller --AKA The Wizard
myApp.controller('EligibilityWizardController', function($http, $routeParams, $location) {
    var self = this; // self is equivalent to $scope
    self.eligibilityKnown = false;

    // once eligibility is known, this will hold the final eligibility state
    self.eligibility = null;

    // boolean indicating whether final state is known
    var executeController = function(data) {
        //Set self.eligibilityFlow to the data returned by the http request
        self.eligibilityFlow = data;
        //Get the length of the eligibilityFlow object (if it were an array this would be easier)
        self.eligibilityFlowLength = Object.keys(self.eligibilityFlow.questions).length;
        //Get the URL q parameter (the question number) from $routeParams
        self.params = $routeParams;
        self.questionNumber = self.params.questionNumber;
        if(Number(self.questionNumber) > self.eligibilityFlowLength) {
            // if a step outside of the list is entered in the url, default to 0
            $location.path('/eligibility-check/q/0');
            self.currentQuestion = self.eligibilityFlow.questions[eligibilityFlow.start];
        //If the url parameter does not contain a number, it may be an end state
        } else if (isNaN(self.questionNumber)) {
            //check to see if the param matches an eligibility state
            switch(self.questionNumber) {
                case 'eligible':
                    $location.path('/eligibility-check/q/' + self.params.questionNumber);
                    self.currentQuestion = self.params.questionNumber;
                    self.eligibilityKnown = true;
                    self.eligibilityStatus = self.params.questionNumber;
                    self.userInput = userInput;
                    break;
                case 'ineligible':
                    self.currentQuestion = self.params.questionNumber;
                    self.eligibilityKnown = true;
                    self.eligibilityStatus = self.params.questionNumber;
                    self.userInput = userInput;
                    break;
                case 'ineligible-at-this-time':
                    self.currentQuestion = self.params.questionNumber;
                    self.eligibilityKnown = true;
                    //Convert url-friendly currrentQuestion into readable string
                    self.eligibilityStatus = 'ineligible at this time';
                    self.userInput = userInput;
                    break;
                default:
                    //If a URL parameter that's a string is entered but doesn't match an elegibility state, return to beginning
                    $location.path('/eligibility-check/q/0');
                    self.currentQuestion = self.eligibilityFlow.questions[0];
                    self.eligibilityKnown = false;
                    break;
            }
        } else {
            // set currentQuestion to questionNumber parameter in url
            self.currentQuestion = self.eligibilityFlow.questions[self.questionNumber];
        }
        // Grab the ineligible misdemeanors from a static JSON file stored at the root of the project
        $http.get('ineligible-misdemeanors.json')
        .success(function(data, status, headers, config) {
            // if the app successfully gets misdemeanor data from the JSON file, assign it to self.ineligibleMisdemeanors for use in the wizard
            self.ineligibleMisdemeanors = data;
        });

        self.submitAnswer = function(answerIndex) {

            // if this question was already answered, cleanup userInput before adding this answer to history
            if (answeredQuestions.indexOf(self.questionNumber) > -1) {
                var startDuplication = answeredQuestions.indexOf(self.questionNumber);
                userInput.splice(startDuplication, userInput.length - startDuplication);
                answeredQuestions.splice(startDuplication, answeredQuestions.length - startDuplication);
            }

            // record this question and answer in record and add to userInput
            var record = {};
            record.question = self.currentQuestion.questionText;
            record.answer = self.currentQuestion.answers[answerIndex].answerText;
            userInput.push(record);
            answeredQuestions.push(self.questionNumber);

            var next = self.currentQuestion.answers[answerIndex].next;

            // check if this answer leads to an eligibility state
            if (self.eligibilityFlow.endStates.indexOf(next) != -1) {
                self.eligibility = next;
                self.eligibilityKnown = true;
                return;
            }

            // update currentQuestion if eligibitliy still not known and next question is valid
            if (next in self.eligibilityFlow.questions) {
                self.currentQuestion = self.eligibilityFlow.questions[next];
                return;
            }

            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question \'" + next + "\' in self.eligibilityFlow.");
        };

        self.progressBar = function() {
            var progressPercent = '';
            //If the current question isn't a number and is listed in the endStates array, then set the progess bar to 100
            if(isNaN(self.currentQuestion) && self.eligibilityFlow.endStates.indexOf(self.currentQuestion) != -1){
                progressPercent = 100;
            } else {
                //Otherwise, divide the current question number by the total number of question, multiply by 100, and round to get a nice percent
                progressPercent = Math.round((self.questionNumber/self.eligibilityFlowLength) * 100);
            }
            return progressPercent;
        };
    }


    $http.get('eligibility-flow.json')
    .success(function(data, status, headers, config) {
        // Get the eligibility-flow json blob
        executeController(data);
    });

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
